import { supabase } from '@/lib/customSupabaseClient';
import { TIERS, PRICE_MODES } from '@/constants/subscriptionTiers';
import { EventLogger } from '@/services/eventLoggerService';
import { EVENT_TYPES } from '@/constants/eventTypes';

export const stripeService = {
  /**
   * Create a checkout session
   */
  async createCheckoutSession(priceId, mode = null, userId = null, token = null) {
    try {
      console.log(`[stripeService] Starting checkout flow for Price: ${priceId}`);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
          console.warn("[stripeService] User is not logged in or session invalid", sessionError);
          throw new Error('Utilisateur non connecté. Veuillez vous reconnecter.');
      }

      const currentUserId = userId || session.user.id;
      const finalMode = mode || PRICE_MODES[priceId] || 'subscription';

      const requestBody = { 
        price_id: priceId,
        mode: finalMode,
        return_url: window.location.origin,
        user_id: currentUserId 
      };

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: requestBody
      });

      if (error) {
         console.error('[stripeService] Edge Function Error Response:', error);
         
         // Log Payment Failure (Checkout Creation)
         EventLogger.logPayment(
             currentUserId,
             'stripe',
             0,
             'eur',
             priceId,
             'payment_failed',
             `Checkout creation failed: ${error.message}`
         );
         
         throw new Error(`Erreur serveur: ${error.message || 'Erreur inconnue'}`);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout manquante dans la réponse');
      }
    } catch (error) {
      console.error('[stripeService] FATAL Checkout Error:', error);
      throw error;
    }
  },

  /**
   * Fetches latest status from DB
   */
  async getSubscriptionStatus() {
    try {
      // Use getSession instead of getUser to avoid unnecessary network calls that might fail
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_email', session.user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      return null;
    }
  },

  /**
   * Determines the user tier. Checks Profile first (faster/authoritative), then subscriptions fallback.
   */
  async getUserTier() {
    try {
      // Use getSession instead of getUser to avoid unnecessary network calls
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return TIERS.FREE;

      // 1. Check Profile - Using maybeSingle() instead of single() to avoid PGRST116
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile?.subscription_tier) {
        const tier = profile.subscription_tier.toLowerCase();
        if (tier === 'premium_plus' || tier.includes('plus')) return TIERS.PREMIUM_PLUS;
        if (tier === 'premium') return TIERS.PREMIUM;
        return TIERS.FREE;
      }
      
      // 2. Fallback: Check Subscriptions table
      const sub = await this.getSubscriptionStatus();
      if (sub && (sub.status === 'active' || sub.status === 'succeeded')) {
         const planName = sub.plan_name?.toLowerCase() || '';
         if (planName.includes('plus') || planName.includes('premium+')) return TIERS.PREMIUM_PLUS;
         return TIERS.PREMIUM;
      }

      return TIERS.FREE;
    } catch (err) {
      console.error('Error getting tier:', err);
      return TIERS.FREE;
    }
  },

  async verifySubscriptionActive(maxAttempts = 10, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
      const tier = await this.getUserTier();
      if (tier !== TIERS.FREE) {
        return { active: true, tier };
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    return { active: false, tier: TIERS.FREE };
  }
};