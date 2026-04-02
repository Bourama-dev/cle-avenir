import { supabase } from '@/lib/customSupabaseClient';

export const TestProgressManager = {
  /**
   * Save progress to Supabase and LocalStorage
   */
  async saveProgress(userId, currentQuestionIndex, history, profileSnapshot) {
    // 1. Local Storage (Sync)
    try {
      localStorage.setItem('adaptive_test_progress', JSON.stringify({
        currentQuestionIndex,
        history,
        profileSnapshot,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn("Local storage full or disabled");
    }

    // 2. Supabase (Async)
    if (userId) {
      try {
        await supabase.from('user_test_progress').upsert({
          user_id: userId,
          current_question_index: currentQuestionIndex,
          answers_history: history,
          profile_snapshot: profileSnapshot,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Failed to save progress to DB", e);
      }
    }
  },

  /**
   * Load progress
   */
  async loadProgress(userId) {
    // Try DB first if user exists
    if (userId) {
      const { data, error } = await supabase
        .from('user_test_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data && !error) {
        return {
          currentQuestionIndex: data.current_question_index,
          history: data.answers_history,
          profileSnapshot: data.profile_snapshot
        };
      }
    }

    // Fallback to LocalStorage
    const local = localStorage.getItem('adaptive_test_progress');
    if (local) {
      return JSON.parse(local);
    }

    return null;
  },

  clearProgress(userId) {
    localStorage.removeItem('adaptive_test_progress');
    if (userId) {
      supabase.from('user_test_progress').delete().eq('user_id', userId).then(() => {});
    }
  }
};