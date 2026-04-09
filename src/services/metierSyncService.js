import { supabase } from '@/lib/customSupabaseClient';

export const metierSyncService = {

  async getMetiersCount() {
    const { count, error } = await supabase
      .from('rome_metiers')
      .select('*', { count: 'exact', head: true });
    if (error) return 0;
    return count || 0;
  },

  /**
   * Déclenche le edge function sync-rome-metiers.
   * Les credentials France Travail sont stockés dans les ENV Supabase côté serveur.
   */
  async syncAllMetiers() {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) throw new Error('Vous devez être connecté en tant qu\'admin pour lancer la synchronisation.');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-rome-metiers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Erreur HTTP ${response.status}`);
    }

    return result; // { success: true, count: number }
  },
};
