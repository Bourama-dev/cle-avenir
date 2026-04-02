import { supabase } from '@/lib/customSupabaseClient';

export const stripePortalService = {
  /**
   * Create a customer portal session for managing subscription
   */
  async createPortalSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase.functions.invoke('create-portal-link', {
        body: { 
          return_url: window.location.href
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL du portail manquante');
      }
    } catch (error) {
      console.error('Erreur création session portail:', error);
      throw error;
    }
  }
};