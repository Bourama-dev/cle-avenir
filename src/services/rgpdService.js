import { supabase } from '@/lib/customSupabaseClient';

export const rgpdService = {
  async getUserDataSummary(userId) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, created_at')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: cookiePrefs } = await supabase
        .from('user_cookie_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: activities } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      return {
        profile,
        cookiePrefs: cookiePrefs || { essential: true, analytics: false, marketing: false, social: false },
        recentActivities: activities || []
      };
    } catch (error) {
      console.error('Error fetching user data summary:', error);
      throw error;
    }
  },

  async logDataDownload(userId, dataSize = 0) {
    try {
      await supabase.from('data_download_logs').insert([{
        user_id: userId,
        data_size: dataSize
      }]);
      
      await supabase.from('rgpd_audit_logs').insert([{
        action: 'DATA_EXPORT',
        user_id: userId,
        details: { type: 'full_export', size: dataSize }
      }]);
    } catch (error) {
      console.error('Error logging data download:', error);
    }
  },

  /**
   * Asks the server for the complete export of the signed-in user's data and saves it
   * as a JSON file. The server identifies the user from the session, never from the request.
   */
  async exportMyData() {
    const { data, error } = await supabase.functions.invoke('export-user-data', { body: {} });
    if (error) throw new Error("Le serveur n'a pas pu préparer l'export. Réessayez dans un instant.");

    const payload = typeof data === 'string' ? JSON.parse(data) : data;
    if (!payload || typeof payload !== 'object' || payload.error) {
      throw new Error(payload?.error || "Réponse d'export invalide.");
    }

    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleavenir-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoking immediately can cancel the download on Safari / iOS.
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    return {
      sizeKb: Math.max(1, Math.round(blob.size / 1024)),
      tables: Object.keys(payload.data || {}).length,
    };
  }
};