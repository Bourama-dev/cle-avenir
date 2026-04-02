import { supabase } from '@/lib/customSupabaseClient';
import { withRetry, parseSupabaseError } from '@/utils/supabaseErrorHandler';

export const romeService = {
  /**
   * Search for metiers by text query
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchMetiers(query) {
    if (!query || query.length < 2) return [];
    
    try {
      const { data } = await withRetry(() => 
        supabase
          .from('rome_metiers')
          .select('code, libelle, description')
          .or(`libelle.ilike.%${query}%,code.ilike.%${query}%`)
          .limit(10)
      );

      return data || [];
    } catch (error) {
      console.error('ROME search error:', error);
      return [];
    }
  },

  /**
   * Get full details for a specific metier by Code
   * @param {string} identifier - Code
   * @returns {Promise<Object|null>}
   */
  async getMetierDetails(identifier) {
    try {
      let { data } = await withRetry(() => 
        supabase
          .from('rome_metiers')
          .select('*')
          .eq('code', identifier)
          .maybeSingle()
      );

      if (!data) {
        const { data: slugData } = await withRetry(() => 
          supabase
            .from('rome_metiers')
            .select('*')
            .eq('slug', identifier)
            .maybeSingle()
        );
        data = slugData;
      }

      return data;
    } catch (error) {
      console.error('ROME details error:', error);
      throw new Error(parseSupabaseError(error));
    }
  },

  /**
   * Get formatted competencies for a metier
   * @param {string} romeCode 
   * @returns {Promise<Object>}
   */
  async getCompetences(romeCode) {
    try {
      const { data } = await withRetry(() => 
        supabase
          .from('rome_metiers')
          .select('competencesMobilisees, competencesMobiliseesPrincipales, competencesMobiliseesEmergentes')
          .eq('code', romeCode)
          .single()
      );
      
      return {
        all: data?.competencesMobilisees || [],
        principal: data?.competencesMobiliseesPrincipales || [],
        emerging: data?.competencesMobiliseesEmergentes || []
      };
    } catch (error) {
      console.error('ROME competences error:', error);
      return { all: [], principal: [], emerging: [] };
    }
  }
};