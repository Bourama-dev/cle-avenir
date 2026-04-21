import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch REAL career data from ROME tables
 * Replaces hardcoded mock career database
 */
export const realCareerDataService = {
  /**
   * Get all ROME careers with their RIASEC profiles
   * This replaces the hardcoded careerDatabase
   */
  async getAllCareers() {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('id, code, libelle, description, riasecMajeur, riasecMineur, riasec_profile, salary_range, job_market_demand, growth_rate, domain')
        .eq('status', 'active')
        .order('libelle');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching ROME careers:', error);
      return [];
    }
  },

  /**
   * Get advanced career profiles with calculated RIASEC scores
   */
  async getAdvancedCareers() {
    try {
      const { data, error } = await supabase
        .from('advanced_metiers')
        .select('id, code, name, description, sector, r_score, i_score, a_score, s_score, e_score, c_score, salary_min, salary_max, demand_level, growth_trend')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching advanced careers:', error);
      return [];
    }
  },

  /**
   * Get careers matching a specific RIASEC profile
   * @param {object} riasecProfile - { r, i, a, s, e, c } scores
   * @param {number} limit - Number of results to return
   */
  async getCareersByRIASEC(riasecProfile, limit = 15) {
    try {
      // First try advanced_metiers with calculated scores
      const { data: advancedCareers, error: advError } = await supabase
        .from('advanced_metiers')
        .select('*')
        .order('demand_level', { ascending: false })
        .limit(limit);

      if (!advError && advancedCareers && advancedCareers.length > 0) {
        // Score each career based on RIASEC match
        const scored = advancedCareers.map(career => ({
          ...career,
          matchScore: this.calculateRIASECMatch(riasecProfile, {
            r: career.r_score,
            i: career.i_score,
            a: career.a_score,
            s: career.s_score,
            e: career.e_score,
            c: career.c_score
          })
        }));

        return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
      }

      // Fallback to rome_metiers
      const { data: romeCareers, error: romeError } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('status', 'active')
        .order('job_market_demand', { ascending: false })
        .limit(limit);

      if (romeError) throw romeError;

      return romeCareers || [];
    } catch (error) {
      console.error('Error fetching RIASEC-matched careers:', error);
      return [];
    }
  },

  /**
   * Get a specific career by ROME code
   */
  async getCareerByCode(romeCode) {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('code', romeCode)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

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
   * Get careers in a specific sector
   */
  async getCareersBySector(sector, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('*')
        .eq('domain', sector)
        .eq('status', 'active')
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching careers in sector ${sector}:`, error);
      return [];
    }
  },

  /**
   * Calculate RIASEC match score between user profile and career profile
   * @private
   */
  calculateRIASECMatch(userProfile, careerProfile) {
    if (!userProfile || !careerProfile) return 0;

    const userR = userProfile.r || 0;
    const userI = userProfile.i || 0;
    const userA = userProfile.a || 0;
    const userS = userProfile.s || 0;
    const userE = userProfile.e || 0;
    const userC = userProfile.c || 0;

    const careerR = careerProfile.r || 0;
    const careerI = careerProfile.i || 0;
    const careerA = careerProfile.a || 0;
    const careerS = careerProfile.s || 0;
    const careerE = careerProfile.e || 0;
    const careerC = careerProfile.c || 0;

    // Calculate dot product of RIASEC vectors
    const dotProduct = (userR * careerR) + (userI * careerI) + (userA * careerA) +
                      (userS * careerS) + (userE * careerE) + (userC * careerC);

    // Normalize by magnitude
    const userMagnitude = Math.sqrt(userR**2 + userI**2 + userA**2 + userS**2 + userE**2 + userC**2);
    const careerMagnitude = Math.sqrt(careerR**2 + careerI**2 + careerA**2 + careerS**2 + careerE**2 + careerC**2);

    if (userMagnitude === 0 || careerMagnitude === 0) return 0;

    // Cosine similarity: -1 to 1, convert to 0-100
    const similarity = (dotProduct / (userMagnitude * careerMagnitude));
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
  }
};
