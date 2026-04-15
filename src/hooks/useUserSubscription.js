import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { TIERS, TIER_NAMES } from '@/constants/subscriptionTiers';

const TIER_PRICES = {
  [TIERS.FREE]: 0,
  [TIERS.PREMIUM]: 9.99,
  [TIERS.PREMIUM_PLUS]: 19.99,
};

const TIER_FEATURES = {
  [TIERS.PREMIUM]: [
    'Tests d\'orientation illimités',
    'Résultats détaillés & analyse RIASEC',
    'Plan personnalisé complet',
    'Export PDF de vos résultats',
    'Accès aux fiches métiers complètes',
  ],
  [TIERS.PREMIUM_PLUS]: [
    'Tout inclus dans Premium',
    'Cleo IA — coach illimité',
    'Simulation d\'entretien',
    'Lettres de motivation IA',
    'Suivi mensuel personnalisé',
    'Support prioritaire',
  ],
};

/**
 * Reads subscription state directly from profiles.subscription_tier.
 * Falls back cleanly when the user is on the free plan (returns null = no active paid subscription).
 */
export function useUserSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('subscription_tier, stripe_customer_id, updated_at')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const tier = profile?.subscription_tier || TIERS.FREE;

      if (!tier || tier === TIERS.FREE) {
        // Free plan → no active paid subscription
        setSubscription(null);
        return;
      }

      setSubscription({
        plan_type: TIER_NAMES[tier] || tier,
        tier,
        price: TIER_PRICES[tier] ?? 0,
        features: TIER_FEATURES[tier] || [],
        stripe_customer_id: profile?.stripe_customer_id || null,
        updated_at: profile?.updated_at || null,
      });
    } catch (err) {
      console.error('[useUserSubscription] Error fetching subscription:', err);
      setError(err.message || 'Une erreur est survenue lors de la récupération de votre abonnement.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}
