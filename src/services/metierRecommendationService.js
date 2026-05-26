import { supabase } from '@/lib/customSupabaseClient';
import { withRetry, parseSupabaseError } from '@/utils/supabaseErrorHandler';
import { normalizeStr } from '@/utils/stringUtils';
import { calculateAdvancedMatching, generateRiasecWeights } from './matchingAlgorithm';
import { userProfileService } from './userProfileService';

// All fields needed for advanced RIASEC + profile scoring
const METIER_FIELDS = [
  'code', 'libelle', 'description', 'salaire', 'debouches', 'niveau_etudes',
  'riasecmajeur', 'riasecmineur', 'riasec_profile', 'adjusted_weights',
  'riasec_vector', 'growth_rate', 'job_market_demand', 'salary_range',
].join(', ');

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
    let score = 50;

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
   * Maps a raw DB rome_metiers record to the format expected by calculateAdvancedMatching.
   * PostgREST returns lowercase column names (riasecmajeur, not riasecMajeur).
   */
  _mapMetierForMatching(metier) {
    // Prefer riasec_profile (full 0-100 per dimension) → adjusted_weights → riasec_vector
    const riasecVector =
      (metier.riasec_profile && Object.keys(metier.riasec_profile).length > 0 ? metier.riasec_profile : null) ||
      (metier.adjusted_weights && Object.keys(metier.adjusted_weights).length > 0 ? metier.adjusted_weights : null) ||
      (metier.riasec_vector && Object.keys(metier.riasec_vector).length > 0 ? metier.riasec_vector : null);

    // Top-2 RIASEC letters for hybrid profile scoring
    const hybridProfile = riasecVector
      ? Object.entries(riasecVector).sort(([, a], [, b]) => b - a).slice(0, 2).map(([k]) => k)
      : [metier.riasecmajeur, metier.riasecmineur].filter(Boolean);

    return {
      code: metier.code,
      name: metier.libelle,       // contextualRecommendationService uses .name
      libelle: metier.libelle,
      description: metier.description,
      riasec: riasecVector || generateRiasecWeights(metier.riasecmajeur, metier.riasecmineur),
      hybridProfile,
      growthTrend: metier.growth_rate || this._debouchesToGrowthTrend(metier.debouches),
      demandLevel: metier.job_market_demand || this._debouchesToDemandLevel(metier.debouches),
      salaryRange: metier.salary_range || metier.salaire,
      educationLevel: metier.niveau_etudes,
      // Keep original fields for display and profile criteria matching
      salaire: metier.salaire,
      niveau_etudes: metier.niveau_etudes,
      debouches: metier.debouches,
      rawMetier: metier,
    };
  },

  _debouchesToGrowthTrend(debouches) {
    if (!debouches) return 'stable';
    const d = debouches.toLowerCase();
    if (d === 'très forte' || d === 'forte') return 'croissant';
    if (d === 'faible') return 'décroissant';
    return 'stable';
  },

  _debouchesToDemandLevel(debouches) {
    if (!debouches) return 'moyenne';
    const d = debouches.toLowerCase();
    if (d === 'très forte') return 'très_élevée';
    if (d === 'forte') return 'élevée';
    if (d === 'faible') return 'faible';
    return 'moyenne';
  },

  /**
   * Scores a list of metiers using calculateAdvancedMatching (RIASEC + Hybrid + Stability + Growth + Demand)
   * then applies user profile criteria (education, salary, status) as a multiplier.
   * Returns the list sorted by matchScore descending.
   */
  _scoreMetiers(metiers, riasecProfile, userCriteria) {
    return metiers
      .map(metier => {
        const mapped = this._mapMetierForMatching(metier);
        const matchResult = calculateAdvancedMatching(riasecProfile, mapped);

        let criteriaMultiplier = 1.0;
        if (userCriteria?.found) {
          const criteriaMatch = userProfileService.matchMetierToCriteria(metier, userCriteria);
          criteriaMultiplier = criteriaMatch.score;
        }

        const rawScore = matchResult?.finalScore ?? 65;
        const matchScore = Math.max(10, Math.min(99, Math.round(rawScore * criteriaMultiplier)));

        return { ...metier, matchScore, matchDetails: matchResult };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Fetches recommended metiers based on user's test results AND profile.
   *
   * Scoring: RIASEC(50%) + Hybrid(20%) + Stability(10%) + Growth(10%) + Demand(10%)
   * then modulated by user profile criteria (education, salary, status).
   *
   * Data paths tried in order:
   *   A. top_3_careers stored in test_results  → full re-score with advanced algorithm
   *   B. RPC get_profile_matched_metiers (profile_result.type)
   *   C. RIASEC letter matching against rome_metiers.riasecmajeur
   *   D. Random sample fallback
   */
  async getRecommendationsForUser(userId) {
    if (!userId) throw new Error("ID Utilisateur requis");

    try {
      // 1. Latest test result
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

      // 2. User profile criteria (education, salary, status) — non-blocking
      const userCriteria = await userProfileService.getUserRecommendationCriteria().catch(() => ({ found: false }));

      const riasecProfile = testResult.riasec_profile;
      const hasRiasec =
        riasecProfile &&
        typeof riasecProfile === 'object' &&
        Object.keys(riasecProfile).length > 0;

      // Path A — stored top_3_careers codes: fetch full data then re-score with advanced algorithm
      if (testResult.top_3_careers?.length > 0 && testResult.top_3_careers[0]?.code) {
        const codes = testResult.top_3_careers.map(c => c.code).filter(Boolean);
        const { data: metiers } = await withRetry(() =>
          supabase.from('rome_metiers').select(METIER_FIELDS).in('code', codes)
        );

        if (metiers?.length > 0) {
          if (hasRiasec) return this._scoreMetiers(metiers, riasecProfile, userCriteria);
          // No riasec data: keep stored scores
          return metiers
            .map(m => {
              const original = testResult.top_3_careers.find(c => c.code === m.code);
              return { ...m, matchScore: original?.match_score || original?.score || 85 };
            })
            .sort((a, b) => b.matchScore - a.matchScore);
        }
      }

      // Path B — RPC by profile type
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
          if (rpcMatches?.length > 0) {
            return hasRiasec
              ? this._scoreMetiers(rpcMatches, riasecProfile, userCriteria)
              : rpcMatches.map(m => ({ ...m, matchScore: m.match_score || 75 }));
          }
        } catch (_) {
          // RPC may not exist — fall through
        }
      }

      // Path C — RIASEC letter matching with advanced scoring
      if (hasRiasec) {
        const topLetters = Object.entries(riasecProfile)
          .filter(([, v]) => typeof v === 'number')
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([letter]) => letter);

        if (topLetters.length > 0) {
          const { data: metiers } = await withRetry(() =>
            supabase
              .from('rome_metiers')
              .select(METIER_FIELDS)
              .in('riasecmajeur', topLetters)
              .limit(15)
          );
          if (metiers?.length > 0) return this._scoreMetiers(metiers, riasecProfile, userCriteria);
        }
      }

      // Path D — fallback random sample
      const { data: fallback } = await withRetry(() =>
        supabase.from('rome_metiers').select(METIER_FIELDS).limit(9)
      );

      return (fallback || []).map(m => ({ ...m, matchScore: 65 }));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error(parseSupabaseError(error));
    }
  },
};
