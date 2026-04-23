import { supabase } from '@/lib/customSupabaseClient';
import { withRetry, parseSupabaseError } from '@/utils/supabaseErrorHandler';
import { normalizeStr } from '@/utils/stringUtils';
import { getSectorRomeDomains } from '@/utils/sectorToRomeDomains';
import { ROME_DOMAINS } from '@/data/romeMapping';

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
    
    const metierText = normalizeStr(
      `${metier.libelle} ${metier.description} ${JSON.stringify(metier.themes)} ${JSON.stringify(metier.divisionsNaf)}`
    );

    userTraits.forEach(trait => {
      if (metierText.includes(normalizeStr(trait))) score += 10;
    });

    userSectors.forEach(sector => {
      if (metierText.includes(normalizeStr(sector))) score += 15;
    });

    return Math.min(100, score);
  },

  /**
   * Fetches recommended metiers based on user's test results.
   * Tries multiple data paths in order of reliability:
   *   1. top_3_careers stored in test_results
   *   2. RPC get_profile_matched_metiers (profile_result.type)
   *   3. RIASEC scores (riasec_profile) matched against rome_metiers.riasecMajeur/riasecMineur
   *   4. Random sample fallback
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

          if (metiers && metiers.length > 0) {
            return metiers.map(m => {
              const original = testResult.top_3_careers.find(c => c.code === m.code);
              return { ...m, matchScore: original?.match_score || original?.score || 85 };
            }).sort((a, b) => b.matchScore - a.matchScore);
          }
        }
      }

      // 3. Fallback: Query matching algorithm via RPC if profile_result.type exists
      const profileType = testResult.profile_result?.type || testResult.results?.dominantProfile;
      if (profileType) {
        try {
          const { data: rpcMatches } = await withRetry(() =>
            supabase.rpc('get_profile_matched_metiers', {
              p_profile_type: profileType,
              p_sectors: testResult.profile_result?.sectors || [],
              p_competencies: testResult.profile_result?.topTraits || [],
            })
          );

          if (rpcMatches && rpcMatches.length > 0) {
            return rpcMatches.map(m => ({ ...m, matchScore: m.match_score || 75 }));
          }
        } catch (_) {
          // RPC may not exist — fall through
        }
      }

      // 4. RIASEC scores path — works with our riasec_profile column
      // Now also filters by sector preference if available
      const riasecProfile = testResult.riasec_profile;
      if (riasecProfile && typeof riasecProfile === 'object' && Object.keys(riasecProfile).length > 0) {
        // Sort RIASEC letters by score descending
        const sortedLetters = Object.entries(riasecProfile)
          .filter(([, v]) => typeof v === 'number')
          .sort(([, a], [, b]) => b - a)
          .map(([letter]) => letter);

        const topLetters = sortedLetters.slice(0, 3);

        if (topLetters.length > 0) {
          // Get ROME codes for the selected sector (if available)
          const selectedSectorValue = testResult.selected_sector_value;
          const preferredDomains = selectedSectorValue !== undefined ? getSectorRomeDomains(parseInt(selectedSectorValue, 10)) : [];
          const preferredCodes = preferredDomains.length > 0
            ? preferredDomains.flatMap(domain => ROME_DOMAINS[domain]?.codes || [])
            : [];

          // Query metiers whose primary RIASEC letter matches any of the top 3
          const queryBuilder = supabase
            .from('rome_metiers')
            .select('code, libelle, description, salaire, debouches, niveau_etudes, riasecmajeur, riasecmineur')
            .in('riasecmajeur', topLetters);

          // If sector preference exists, filter by preferred ROME codes
          if (preferredCodes.length > 0) {
            queryBuilder.in('code', preferredCodes);
          }

          const { data: metiers } = await withRetry(() => queryBuilder.limit(15));

          if (metiers && metiers.length > 0) {
            return metiers
              .map(m => {
                let score = 50;
                // PostgREST returns lowercase column names
                const major = m.riasecmajeur || m.riasecMajeur;
                const minor = m.riasecmineur || m.riasecMineur;
                const majorIdx = topLetters.indexOf(major);
                if (majorIdx === 0) score += 40;
                else if (majorIdx === 1) score += 28;
                else if (majorIdx === 2) score += 18;
                if (minor && topLetters.includes(minor)) score += 8;
                // Boost score if metier is in preferred sector codes
                if (preferredCodes.includes(m.code)) score += 12;
                return { ...m, riasecMajeur: major, riasecMineur: minor, matchScore: Math.min(98, score) };
              })
              .sort((a, b) => b.matchScore - a.matchScore);
          }
        }
      }

      // 5. Last resort: return a sample of métiers so the page is never empty
      const { data: fallback } = await withRetry(() =>
        supabase
          .from('rome_metiers')
          .select('code, libelle, description, salaire, debouches, niveau_etudes')
          .limit(9)
      );

      return (fallback || []).map(m => ({ ...m, matchScore: 65 }));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error(parseSupabaseError(error));
    }
  }
};