import { supabase } from '@/lib/customSupabaseClient';
import { withRetry, parseSupabaseError } from '@/utils/supabaseErrorHandler';

export const metierFeedbackService = {
  /**
   * Fetches recent feedback with fallback for user profiles
   * Does a client-side join to avoid PGRST foreign key nesting issues
   */
  async getRecentComments(jobCode, limit = 5) {
    if (!jobCode) throw new Error("Code métier requis");

    try {
      // 1. Fetch feedbacks
      const feedbackResponse = await withRetry(() => 
        supabase
          .from('feedback')
          .select('id, rating, comment, created_at, user_id')
          .eq('job_code', jobCode)
          .not('comment', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit)
      );

      const feedbacks = feedbackResponse.data || [];
      if (feedbacks.length === 0) return [];

      // 2. Extract unique user_ids
      const userIds = [...new Set(feedbacks.map(f => f.user_id).filter(Boolean))];

      if (userIds.length === 0) {
        return feedbacks.map(f => ({
          ...f,
          profiles: { first_name: 'Anonyme' }
        }));
      }

      // 3. Fetch corresponding profiles
      const profilesResponse = await withRetry(() => 
        supabase
          .from('profiles')
          .select('id, first_name')
          .in('id', userIds)
      );

      const profiles = profilesResponse.data || [];
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      // 4. Combine data
      return feedbacks.map(f => ({
        ...f,
        profiles: profileMap[f.user_id] 
          ? { first_name: profileMap[f.user_id].first_name } 
          : { first_name: 'Anonyme' }
      }));

    } catch (error) {
      console.error('[metierFeedbackService.getRecentComments] Error:', error);
      throw new Error(parseSupabaseError(error));
    }
  },

  /**
   * Fetches aggregate stats for a specific metier
   */
  async getFeedbackStats(jobCode) {
    if (!jobCode) throw new Error("Code métier requis");

    try {
      const response = await withRetry(() => 
        supabase
          .from('feedback')
          .select('rating')
          .eq('job_code', jobCode)
      );

      const data = response.data || [];
      const count = data.length;
      const average = count > 0 
        ? (data.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1) 
        : 0;

      return { average: Number(average), count };
    } catch (error) {
      console.error('[metierFeedbackService.getFeedbackStats] Error:', error);
      throw new Error(parseSupabaseError(error));
    }
  },

  /**
   * Fetch a single user's rating for a metier
   */
  async getUserRating(jobCode, userId) {
    if (!jobCode || !userId) return null;

    try {
      const response = await withRetry(() => 
        supabase
          .from('feedback')
          .select('*')
          .eq('job_code', jobCode)
          .eq('user_id', userId)
          .maybeSingle()
      );

      return response.data;
    } catch (error) {
      console.error('[metierFeedbackService.getUserRating] Error:', error);
      throw new Error(parseSupabaseError(error));
    }
  }
};