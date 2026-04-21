import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';

const CACHE_TTL_CAREERS = 30 * 60 * 1000;  // 30 minutes (careers rarely change)
const CACHE_TTL_RIASEC  = 10 * 60 * 1000;  // 10 minutes per RIASEC match

export const realCareerDataService = {
  /**
   * Get all ROME careers with their RIASEC profiles (cached)
   */
  async getAllCareers() {
    const cacheKey = 'careers_all';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('id, code, libelle, description, riasecMajeur, riasecMineur, riasec_profile, salary_range, job_market_demand, growth_rate, domain')
        .eq('status', 'active')
        .order('libelle');

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_CAREERS);
      return result;
    } catch (error) {
      console.error('Error fetching ROME careers:', error);
      return [];
    }
  },

  /**
   * Get advanced career profiles with calculated RIASEC scores (cached)
   */
  async getAdvancedCareers() {
    const cacheKey = 'careers_advanced';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('advanced_metiers')
        .select('id, code, name, description, sector, r_score, i_score, a_score, s_score, e_score, c_score, salary_min, salary_max, demand_level, growth_trend')
        .order('name');

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_CAREERS);
      return result;
    } catch (error) {
      console.error('Error fetching advanced careers:', error);
      return [];
    }
  },

  /**
   * Get careers matching a specific RIASEC profile (cached per profile)
   * @param {object} riasecProfile - { r, i, a, s, e, c } scores
   * @param {number} limit - Number of results to return
   */
  async getCareersByRIASEC(riasecProfile, limit = 15) {
    const cacheKey = CacheService.generateKey('careers_riasec', { ...riasecProfile, limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Fetch advanced_metiers sorted by demand_level for scoring pool
      const { data: advancedCareers, error: advError } = await supabase
        .from('advanced_metiers')
        .select('*')
        .order('demand_level', { ascending: false })
        .limit(200); // Wider pool to find best RIASEC matches

      if (!advError && advancedCareers && advancedCareers.length > 0) {
        const scored = advancedCareers.map(career => ({
          ...career,
          matchScore: this.calculateRIASECMatch(riasecProfile, {
            r: career.r_score,
            i: career.i_score,
            a: career.a_score,
            s: career.s_score,
            e: career.e_score,
            c: career.c_score,
          }),
        }));

        const result = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
        CacheService.set(cacheKey, result, CACHE_TTL_RIASEC);
        return result;
      }

      // Fallback to rome_metiers if advanced_metiers is empty
      const { data: romeCareers, error: romeError } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('status', 'active')
        .order('job_market_demand', { ascending: false })
        .limit(limit);

      if (romeError) throw romeError;

      const result = romeCareers || [];
      CacheService.set(cacheKey, result, CACHE_TTL_RIASEC);
      return result;
    } catch (error) {
      console.error('Error fetching RIASEC-matched careers:', error);
      return [];
    }
  },

  /**
   * Get a specific career by ROME code
   */
  async getCareerByCode(romeCode) {
    const cacheKey = `career_code_${romeCode}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('code', romeCode)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) CacheService.set(cacheKey, data, CACHE_TTL_CAREERS);
      return data || null;
    } catch (error) {
      console.error(`Error fetching career ${romeCode}:`, error);
      return null;
    }
  },

  /**
   * Search careers by name or description
   */
  async searchCareers(query, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('id, code, libelle, description, domain')
        .or(`libelle.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'active')
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching careers:', error);
      return [];
    }
  },

  /**
   * Get careers in a specific sector (cached)
   */
  async getCareersBySector(sector, limit = 20) {
    const cacheKey = CacheService.generateKey('careers_sector', { sector, limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('domain', sector)
        .eq('status', 'active')
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_CAREERS);
      return result;
    } catch (error) {
      console.error(`Error fetching careers in sector ${sector}:`, error);
      return [];
    }
  },

  /**
   * Calculate RIASEC match score (cosine similarity, returns 0-100)
   * @private
   */
  calculateRIASECMatch(userProfile, careerProfile) {
    if (!userProfile || !careerProfile) return 0;

    const u = [
      userProfile.r || 0,
      userProfile.i || 0,
      userProfile.a || 0,
      userProfile.s || 0,
      userProfile.e || 0,
      userProfile.c || 0,
    ];
    const c = [
      careerProfile.r || 0,
      careerProfile.i || 0,
      careerProfile.a || 0,
      careerProfile.s || 0,
      careerProfile.e || 0,
      careerProfile.c || 0,
    ];

    const dot = u.reduce((sum, val, i) => sum + val * c[i], 0);
    const magU = Math.sqrt(u.reduce((sum, val) => sum + val * val, 0));
    const magC = Math.sqrt(c.reduce((sum, val) => sum + val * val, 0));

    if (magU === 0 || magC === 0) return 0;

    const similarity = dot / (magU * magC);
    return Math.round(((similarity + 1) / 2) * 100);
  },

  /**
   * Get job market statistics for a career
   */
  async getCareerMarketStats(romeCode) {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('job_market_demand, growth_rate, salary_range')
        .eq('code', romeCode)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching market stats for ${romeCode}:`, error);
      return null;
    }
  },
};
