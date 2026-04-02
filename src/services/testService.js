import { supabase } from '@/lib/customSupabaseClient';

export const testService = {
  async saveTestResults(userId, riasecProfile, answers, testScore) {
    try {
      const payload = {
        user_id: userId,
        riasec_profile: riasecProfile,
        answers: answers,
        test_score: testScore,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('test_results')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[testService] Error saving test results:', error);
      return { success: false, error };
    }
  },

  async getTestResults(userId) {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[testService] Error getting test results:', error);
      return { success: false, error };
    }
  },

  async getTestHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[testService] Error getting test history:', error);
      return { success: false, error, data: [] };
    }
  },

  async getTestCount(userId) {
    try {
      const { count, error } = await supabase
        .from('test_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('[testService] Error getting test count:', error);
      return { success: false, error, count: 0 };
    }
  }
};