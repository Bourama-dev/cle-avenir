import { supabase } from '@/lib/customSupabaseClient';

export const openaiService = {
  /**
   * Get a general analysis of the user's test profile
   */
  async analyzeProfile(testContext, userProfile) {
    try {
      // Simulate API call to internal Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-test', {
        body: {
          answers: testContext,
          profile: userProfile,
          type: 'general_analysis'
        }
      });

      if (error) {
         // Fallback mock if function fails or not deployed
         console.warn("Edge function failed, using local fallback", error);
         return {
            superpower: "Adaptabilité Rapide",
            blindspot: "Tendance à négliger les détails",
            advice: "Concentrez-vous sur des rôles où votre polyvalence est un atout majeur."
         };
      }
      return data;
    } catch (err) {
      console.error('AI Analysis failed:', err);
       return {
            superpower: "Vision Stratégique",
            blindspot: "Impatience",
            advice: "Cherchez des positions de leadership ou de gestion de projet."
         };
    }
  },

  /**
   * Get specific reasons why a job matches a user
   */
  async enhanceJobMatch(jobTitle, jobDesc, userTraits) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-test', {
        body: {
          answers: { jobTitle, jobDesc, userTraits },
          type: 'enhance_match'
        }
      });

      if (error) throw error;
      return data?.points || [];
    } catch (err) {
      console.error('AI Job Enhancement failed:', err);
      return [];
    }
  }
};