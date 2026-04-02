import { supabase } from '@/lib/customSupabaseClient';

export const DiplomaService = {
  /**
   * Search diplomas with filters
   */
  async searchDiplomas(query, filters = {}) {
    let dbQuery = supabase
      .from('diplomas')
      .select('id, code, name, level, sector, description')
      .limit(20);

    if (query) {
      // Use ILIKE for case-insensitive partial match
      dbQuery = dbQuery.or(`name.ilike.%${query}%,code.ilike.%${query}%`);
    }

    if (filters.level) {
      dbQuery = dbQuery.eq('level', filters.level);
    }
    
    if (filters.sector) {
      dbQuery = dbQuery.eq('sector', filters.sector);
    }

    const { data, error } = await dbQuery;
    if (error) throw error;
    return data;
  },

  /**
   * Get diploma details by ID
   */
  async getDiplomaById(id) {
    const { data, error } = await supabase
      .from('diplomas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get User's acquired diplomas
   */
  async getUserDiplomas(userId) {
    const { data, error } = await supabase
      .from('user_diplomas')
      .select(`
        *,
        diploma:diplomas (
          id, name, level, sector, code
        )
      `)
      .eq('user_id', userId)
      .order('obtained_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Add a diploma to user profile
   */
  async addUserDiploma(userId, diplomaId, status = 'obtained', obtainedDate = null) {
    const { data, error } = await supabase
      .from('user_diplomas')
      .insert([{
        user_id: userId,
        diploma_id: diplomaId,
        status,
        obtained_date: obtainedDate
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a user diploma
   */
  async deleteUserDiploma(id) {
    const { error } = await supabase
      .from('user_diplomas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /**
   * Get User's goals
   */
  async getUserDiplomaGoals(userId) {
    const { data, error } = await supabase
      .from('user_diploma_goals')
      .select(`
        *,
        diploma:diplomas (
          id, name, level, sector
        )
      `)
      .eq('user_id', userId)
      .order('target_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Add a diploma goal
   */
  async addDiplomaGoal(userId, diplomaId, targetDate, priority = 'medium') {
    const { data, error } = await supabase
      .from('user_diploma_goals')
      .insert([{
        user_id: userId,
        diploma_id: diplomaId,
        target_date: targetDate,
        priority
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove a goal
   */
  async removeDiplomaGoal(id) {
    const { error } = await supabase
      .from('user_diploma_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  /**
   * Simple Recommendation Engine based on Level Progression
   */
  async recommendDiplomas(userProfile, currentDiplomas) {
    // Basic logic: If user has BAC, suggest BTS/Licence. If user has Licence, suggest Master.
    
    // 1. Identify highest current level
    const levels = {
      'CAP': 1, 'BEP': 1,
      'BAC': 2, 'BP': 2,
      'BTS': 3, 'DUT': 3, 'Licence': 3,
      'Master': 4, 'Ingénieur': 4,
      'Doctorat': 5
    };

    let maxLevel = 0;
    let currentSector = null;

    if (currentDiplomas && currentDiplomas.length > 0) {
      currentDiplomas.forEach(d => {
        const lvl = levels[d.diploma?.level] || 0;
        if (lvl > maxLevel) {
          maxLevel = lvl;
          currentSector = d.diploma?.sector;
        }
      });
    }

    // 2. Fetch diplomas one level higher in same sector or general
    // This is a simplified query. In production, utilize 'diploma_career_paths' table.
    
    let query = supabase.from('diplomas').select('*').limit(5);

    // Target specific levels
    if (maxLevel === 0) {
      // Suggest CAP/BAC
      query = query.in('level', ['CAP', 'BAC', 'BEP']);
    } else if (maxLevel === 1) {
      query = query.in('level', ['BAC', 'BP']);
    } else if (maxLevel === 2) {
      query = query.in('level', ['BTS', 'DUT', 'Licence']);
    } else if (maxLevel === 3) {
      query = query.in('level', ['Master', 'Ingénieur']);
    } else {
      // Already high level, suggest specialized Master or MBA
      query = query.eq('level', 'Master Spécialisé');
    }

    // Filter by sector if known
    if (currentSector) {
      query = query.eq('sector', currentSector);
    }

    const { data } = await query;
    return data || [];
  }
};