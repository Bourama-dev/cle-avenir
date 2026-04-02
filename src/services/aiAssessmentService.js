import { supabase } from '@/lib/customSupabaseClient';

export const aiAssessmentService = {
  /**
   * Analyzes user test results using AI
   */
  async analyzeResults(testResults) {
    try {
      // Using Edge Function if available
      const { data, error } = await supabase.functions.invoke('analyze-test', {
        body: { results: testResults }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to local logic or return null
      return null;
    }
  },

  /**
   * Generates career suggestions based on profile
   */
  async getSuggestions(profileData) {
    try {
      // Correct RPC usage pattern
      const { data, error } = await supabase.rpc('match_career_knowledge', {
        query_embedding: profileData.embedding, // Assuming embedding is pre-calculated
        match_threshold: 0.7,
        match_count: 5
      });

      if (error) {
        console.warn('RPC match_career_knowledge failed:', error);
        // Fallback to standard query
        return [];
      }

      return data;
    } catch (error) {
      console.error('Get suggestions failed:', error);
      return [];
    }
  }
};