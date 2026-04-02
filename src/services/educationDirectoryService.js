import { supabase } from '@/lib/customSupabaseClient';

export const EducationDirectoryService = {
  /**
   * Search institutions with filters
   * @param {Object} filters
   * @param {string} filters.query - Search text (name, city)
   * @param {string} filters.type - Type (Lycée, Collège, etc.)
   * @param {string} filters.region - Region
   * @param {string} filters.sector - Public / Privé
   * @param {number} filters.limit
   */
  async searchInstitutions({ query, type, region, sector, limit = 20 }) {
    let dbQuery = supabase
      .from('educational_institutions')
      .select('id, code, name, type, city, postal_code, region, sector')
      .limit(limit);

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`);
    }

    if (type) {
      dbQuery = dbQuery.eq('type', type);
    }
    
    if (region) {
      dbQuery = dbQuery.eq('region', region);
    }

    if (sector) {
      dbQuery = dbQuery.eq('sector', sector);
    }

    const { data, error } = await dbQuery;
    if (error) throw error;
    return data;
  },

  /**
   * Get full details of an institution
   * @param {string} id
   */
  async getInstitutionDetails(id) {
    const { data, error } = await supabase
      .from('educational_institutions')
      .select(`
        *,
        programs:institution_programs(*),
        specialties:institution_specialties(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Save user preference
   */
  async saveUserPreference(userId, institutionId, type = 'interested') {
    const { data, error } = await supabase
      .from('user_institution_preferences')
      .upsert({
        user_id: userId,
        institution_id: institutionId,
        preference_type: type,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove user preference
   */
  async removeUserPreference(userId, institutionId) {
    const { error } = await supabase
      .from('user_institution_preferences')
      .delete()
      .match({ user_id: userId, institution_id: institutionId });

    if (error) throw error;
    return true;
  }
};