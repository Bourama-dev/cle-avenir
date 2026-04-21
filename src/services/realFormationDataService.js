import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch REAL formation/training data
 * Replaces hardcoded mock formation data
 */
export const realFormationDataService = {
  /**
   * Get all available formations/training programs
   */
  async getAllFormations(limit = 100, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('formations')
        .select('*', { count: 'exact' })
        .order('name')
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { formations: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching formations:', error);
      return { formations: [], total: 0 };
    }
  },

  /**
   * Get formations enriched with career relationships
   */
  async getEnrichedFormations(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('formations_enriched')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching enriched formations:', error);
      return [];
    }
  },

  /**
   * Get formations by career/ROME code
   */
  async getFormationsByCareer(romeCode, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('formations_enriched')
        .select('*')
        .eq('rome_code', romeCode)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching formations for career ${romeCode}:`, error);
      return [];
    }
  },

  /**
   * Search formations by name or description
   */
  async searchFormations(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching formations:', error);
      return [];
    }
  },

  /**
   * Get formations from specific educational institution
   */
  async getFormationsByInstitution(institutionId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('institution_programs')
        .select(`
          *,
          formations(*)
        `)
        .eq('institution_id', institutionId)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching formations for institution ${institutionId}:`, error);
      return [];
    }
  },

  /**
   * Get formation statistics
   */
  async getFormationStats(formationId) {
    try {
      const { data, error } = await supabase
        .from('formation_stats')
        .select('*')
        .eq('formation_id', formationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching stats for formation ${formationId}:`, error);
      return null;
    }
  },

  /**
   * Get formations by sector/domain
   */
  async getFormationsByDomain(domain, limit = 30) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .ilike('domain', `%${domain}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching formations in domain ${domain}:`, error);
      return [];
    }
  },

  /**
   * Get top rated formations
   */
  async getTopFormations(limit = 20) {
    try {
      const { data: formations, error: formError } = await supabase
        .from('formations')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

      if (formError) throw formError;

      return formations || [];
    } catch (error) {
      console.error('Error fetching top formations:', error);
      return [];
    }
  },

  /**
   * Get alternance (apprenticeship) programs
   */
  async getAlternancePrograms(limit = 30) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('type', 'alternance')
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching alternance programs:', error);
      return [];
    }
  },

  /**
   * Get a specific formation details
   */
  async getFormationDetails(formationId) {
    try {
      const { data, error } = await supabase
        .from('formations_enriched')
        .select('*')
        .eq('id', formationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching formation ${formationId}:`, error);
      return null;
    }
  }
};
