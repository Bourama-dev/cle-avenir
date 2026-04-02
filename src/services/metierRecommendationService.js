import { supabase } from '@/lib/customSupabaseClient';
import { withRetry, parseSupabaseError } from '@/utils/supabaseErrorHandler';

export const metierRecommendationService = {
  /**
   * Fetches full details for a metier by its ROME code
   */
  async getMetierByCode(code) {
    if (!code) throw new Error("Code métier requis");
    try {
      const { data } = await withRetry(() => 
        supabase
          .from('rome_metiers')
          .select('*')
          .eq('code', code)
          .maybeSingle()
      );
      return data;
    } catch (error) {
      console.error('Error fetching metier by code:', error);
      throw new Error(parseSupabaseError(error));
    }
  },

  /**
   * Computes compatibility score between a user profile and a metier
   */
  calculateCompatibility(metier, userTraits = [], userSectors = []) {
    if (!metier) return 0;
    let score = 50; // Base score
    
    const metierText = `${metier.libelle} ${metier.description} ${JSON.stringify(metier.themes)} ${JSON.stringify(metier.divisionsNaf)}`.toLowerCase();

    userTraits.forEach(trait => {
      if (metierText.includes(trait.toLowerCase())) score += 10;
    });

    userSectors.forEach(sector => {
      if (metierText.includes(sector.toLowerCase())) score += 15;
    });

    return Math.min(100, score);
  },

  /**
   * Fetches recommended metiers based on user's test results
   */
  async getRecommendationsForUser(userId) {
    if (!userId) throw new Error("ID Utilisateur requis");

    try {
      // 1. Get latest test result
      const { data: testResult } = await withRetry(() => 
        supabase
          .from('test_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      );

      if (!testResult) return [];

      // 2. If test_results already has computed top_3_careers with full data, return them
      if (testResult.top_3_careers && testResult.top_3_careers.length > 0 && testResult.top_3_careers[0].code) {
         const codes = testResult.top_3_careers.map(c => c.code).filter(Boolean);
         if (codes.length > 0) {
            const { data: metiers } = await withRetry(() => 
              supabase
                .from('rome_metiers')
                .select('code, libelle, description, salaire, debouches, niveau_etudes')
                .in('code', codes)
            );
              
            if (metiers) {
               return metiers.map(m => {
                 const original = testResult.top_3_careers.find(c => c.code === m.code);
                 return { ...m, matchScore: original?.match_score || original?.score || 85 };
               }).sort((a, b) => b.matchScore - a.matchScore);
            }
         }
      }

      // 3. Fallback: Query matching algorithm via RPC if profile classifications exist
      const profileType = testResult.profile_result?.type || testResult.results?.dominantProfile;
      if (profileType) {
         const { data: rpcMatches } = await withRetry(() => 
           supabase.rpc('get_profile_matched_metiers', {
              p_profile_type: profileType,
              p_sectors: testResult.profile_result?.sectors || [],
              p_competencies: testResult.profile_result?.topTraits || []
           })
         );
         
         if (rpcMatches) {
            return rpcMatches.map(m => ({ ...m, matchScore: m.match_score }));
         }
      }

      return [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error(parseSupabaseError(error));
    }
  }
};