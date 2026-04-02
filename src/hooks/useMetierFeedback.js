import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { metierFeedbackService } from '@/services/metierFeedbackService';
import { parseSupabaseError } from '@/utils/supabaseErrorHandler';

export function useMetierFeedback(jobCode) {
  const { user } = useAuth();
  const [feedbackStats, setFeedbackStats] = useState({ average: 0, count: 0 });
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedbackData = useCallback(async () => {
    if (!jobCode) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch aggregate stats
      const stats = await metierFeedbackService.getFeedbackStats(jobCode);
      setFeedbackStats(stats);

      // Fetch user's own rating if logged in
      if (user) {
        const rating = await metierFeedbackService.getUserRating(jobCode, user.id);
        setUserRating(rating);
      }
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
      setError(err.message || 'Impossible de charger les avis.');
    } finally {
      setLoading(false);
    }
  }, [jobCode, user]);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const submitFeedback = async (rating, comment = '') => {
    if (!user) throw new Error('Vous devez être connecté pour donner votre avis.');
    if (!jobCode) throw new Error('Code métier manquant.');
    if (rating < 1 || rating > 5) throw new Error('Note invalide.');

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        user_id: user.id,
        job_code: jobCode,
        rating,
        comment: comment.trim() || null
      };

      let opError;
      if (userRating) {
        // Update existing
        const { error: updateError } = await supabase
          .from('feedback')
          .update({ rating, comment: payload.comment, updated_at: new Date().toISOString() })
          .eq('id', userRating.id);
        opError = updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('feedback')
          .insert(payload);
        opError = insertError;
      }

      if (opError) throw opError;
      
      // Refresh data
      await fetchFeedbackData();
      return { success: true };
    } catch (err) {
      const parsedError = parseSupabaseError(err);
      console.error('Submit feedback error:', err);
      setError(parsedError);
      throw new Error(parsedError);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    feedbackStats,
    userRating,
    loading,
    error,
    submitting,
    submitFeedback,
    refetch: fetchFeedbackData
  };
}