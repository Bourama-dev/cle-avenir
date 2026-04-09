import { supabase } from '@/lib/customSupabaseClient';

export const metierSyncService = {
  /**
   * Sync all ROME métiers from France Travail API to Supabase
   * This fetches ALL métiers without pagination limit
   */
  syncAllMetiers: async (clientId: string, secret: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-rome-metiers', {
        body: { clientId, secret }
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: data.message,
        count: data.count
      };
    } catch (err) {
      console.error('Error syncing metiers:', err);
      throw new Error(err.message || 'Erreur lors de la synchronisation des métiers');
    }
  },

  /**
   * Get total count of metiers in database
   */
  getMetiersCount: async () => {
    try {
      const { count, error } = await supabase
        .from('rome_metiers')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error getting metiers count:', err);
      return 0;
    }
  }
};
