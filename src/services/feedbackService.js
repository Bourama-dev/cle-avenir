import { supabase } from '@/lib/customSupabaseClient';

export const feedbackService = {
  async saveFeedback(userId, testId, metierCode, feedbackData) {
    try {
      const { data, error } = await supabase
        .from('test_metier_feedback')
        .insert({
          user_id: userId,
          test_id: testId || null,
          metier_code: metierCode,
          helpful: feedbackData.helpful,
          accuracy: feedbackData.accuracy,
          chosen: feedbackData.chosen,
          comment: feedbackData.comment
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[feedbackService] Error saving feedback:', error);
      return { success: false, error };
    }
  },

  async getFeedbackByTest(testId) {
    try {
      const { data, error } = await supabase
        .from('test_metier_feedback')
        .select('*')
        .eq('test_id', testId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[feedbackService] Error getting feedback by test:', error);
      return { success: false, error, data: [] };
    }
  },

  async getFeedbackByMetier(metierCode) {
    try {
      const { data, error } = await supabase
        .from('test_metier_feedback')
        .select('*, profiles(first_name, avatar_url)')
        .eq('metier_code', metierCode)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[feedbackService] Error getting feedback by metier:', error);
      return { success: false, error, data: [] };
    }
  },

  async getFeedbackStats(metierCode) {
    try {
      const { data, error } = await supabase
        .from('test_metier_feedback')
        .select('helpful, accuracy, chosen')
        .eq('metier_code', metierCode);

      if (error) throw error;
      
      const total = data.length;
      if (total === 0) return { success: true, stats: { total: 0, avgAccuracy: 0, helpfulPercent: 0, chosenPercent: 0 } };

      const avgAccuracy = data.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / total;
      const helpfulPercent = (data.filter(d => d.helpful).length / total) * 100;
      const chosenPercent = (data.filter(d => d.chosen).length / total) * 100;

      return { 
        success: true, 
        stats: { 
          total, 
          avgAccuracy: Math.round(avgAccuracy * 10) / 10, 
          helpfulPercent: Math.round(helpfulPercent), 
          chosenPercent: Math.round(chosenPercent) 
        } 
      };
    } catch (error) {
      console.error('[feedbackService] Error getting stats:', error);
      return { success: false, error, stats: null };
    }
  },

  async updateFeedback(feedbackId, feedbackData) {
    try {
      const { data, error } = await supabase
        .from('test_metier_feedback')
        .update({
          ...feedbackData,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[feedbackService] Error updating feedback:', error);
      return { success: false, error };
    }
  },

  async deleteFeedback(feedbackId) {
    try {
      const { error } = await supabase
        .from('test_metier_feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[feedbackService] Error deleting feedback:', error);
      return { success: false, error };
    }
  }
};