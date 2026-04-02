import { supabase } from '@/lib/customSupabaseClient';

export const TestHistoryService = {
  /**
   * Save a new test result to the database
   */
  async saveTestResult(userId, answers, results) {
    if (!userId) return null;

    try {
      // Verify session exists before write
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("Cannot save test result: No active session");
        return null;
      }

      const { data, error } = await supabase
        .from('test_results')
        .insert({
          user_id: userId,
          answers: answers,
          results: results, // Storing full calculation snapshot
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving test result:', error);
      return null;
    }
  },

  /**
   * Get all test history for a user (recent 10 automatically handled by DB trigger)
   */
  async getUserHistory(userId) {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching test history:', error);
      return [];
    }
  },

  /**
   * Get a specific test result by ID
   */
  async getTestResultById(id) {
    if (!id) return null;

    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching test result:', error);
      return null;
    }
  }
};