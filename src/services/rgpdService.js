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

  async downloadUserData(userId) {
    try {
      const exportData = {};

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      exportData.profile = profile;

      const { data: testResults } = await supabase.from('test_results').select('*').eq('user_id', userId);
      exportData.testResults = testResults;

      const { data: preferences } = await supabase.from('user_cookie_preferences').select('*').eq('user_id', userId).single();
      exportData.cookiePreferences = preferences;

      const { data: events } = await supabase.from('user_events').select('*').eq('user_id', userId);
      exportData.activityHistory = events;

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataSize = new Blob([dataStr]).size;
      
      await this.logDataDownload(userId, dataSize);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-donnees-${userId}-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error downloading user data:', error);
      throw error;
    }
  }
};