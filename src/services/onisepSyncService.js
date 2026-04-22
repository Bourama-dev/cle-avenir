import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to sync formations from ONISEP API
 * ONISEP = Office National d'Information Sur les Enseignements et les Professions
 */
export const onisepSyncService = {
  /**
   * Sync formations from ONISEP to the database
   */
  async syncFormationsFromOnisep(params = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        secteur = null,
        domaine = null,
        niveau = null,
        syncToDb = true,
      } = params;

      console.log('🎓 [ONISEP] Starting formations sync...', { limit, offset });

      const { data, error } = await supabase.functions.invoke('sync-onisep-formations', {
        body: {
          limit,
          offset,
          secteur,
          domaine,
          niveau,
          syncToDb,
        },
      });

      if (error) {
        console.error('❌ [ONISEP] Function error:', error);
        throw new Error(error.message || 'Erreur lors de la synchronisation ONISEP');
      }

      console.log('✅ [ONISEP] Sync completed:', data);

      return {
        success: true,
        total: data.total || 0,
        synced: data.sync?.count || 0,
        formations: data.formations || [],
        errors: data.sync?.errors || [],
      };
    } catch (error) {
      console.error('❌ [ONISEP] Sync error:', error);
      return {
        success: false,
        error: error.message,
        total: 0,
        synced: 0,
        formations: [],
      };
    }
  },

  /**
   * Search formations by criteria
   */
  async searchFormations(query = '', filters = {}) {
    try {
      let queryBuilder = supabase.from('formations').select('*');

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (filters.source) {
        queryBuilder = queryBuilder.eq('source', filters.source);
      }

      if (filters.level) {
        queryBuilder = queryBuilder.eq('level', filters.level);
      }

      if (filters.sector) {
        queryBuilder = queryBuilder.eq('sector', filters.sector);
      }

      if (filters.type) {
        queryBuilder = queryBuilder.eq('type', filters.type);
      }

      const { data, error } = await queryBuilder
        .order('popularity', { ascending: false })
        .limit(filters.limit || 20);

      if (error) throw error;

      return {
        success: true,
        formations: data || [],
        total: data?.length || 0,
      };
    } catch (error) {
      console.error('❌ [ONISEP] Search error:', error);
      return {
        success: false,
        error: error.message,
        formations: [],
        total: 0,
      };
    }
  },

  /**
   * Get all available sectors from ONISEP formations
   */
  async getAvailableSectors() {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('sector')
        .eq('source', 'onisep')
        .neq('sector', null);

      if (error) throw error;

      const sectors = [...new Set(data?.map(f => f.sector).filter(Boolean))];
      return {
        success: true,
        sectors: sectors.sort(),
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get sectors error:', error);
      return {
        success: false,
        sectors: [],
      };
    }
  },

  /**
   * Get all available levels from ONISEP formations
   */
  async getAvailableLevels() {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('level')
        .eq('source', 'onisep')
        .neq('level', null);

      if (error) throw error;

      const levels = [...new Set(data?.map(f => f.level).filter(Boolean))];
      return {
        success: true,
        levels: levels.sort(),
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get levels error:', error);
      return {
        success: false,
        levels: [],
      };
    }
  },

  /**
   * Get formations by sector
   */
  async getFormationsBySector(sector, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('source', 'onisep')
        .eq('sector', sector)
        .order('popularity', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        formations: data || [],
        total: data?.length || 0,
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get by sector error:', error);
      return {
        success: false,
        formations: [],
        total: 0,
      };
    }
  },

  /**
   * Get formations by level
   */
  async getFormationsByLevel(level, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('source', 'onisep')
        .eq('level', level)
        .order('popularity', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        formations: data || [],
        total: data?.length || 0,
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get by level error:', error);
      return {
        success: false,
        formations: [],
        total: 0,
      };
    }
  },

  /**
   * Get formation details with metadata
   */
  async getFormationDetails(id) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        success: !!data,
        formation: data || null,
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get details error:', error);
      return {
        success: false,
        formation: null,
      };
    }
  },

  /**
   * Get statistics about ONISEP formations in database
   */
  async getOnisepStats() {
    try {
      // Get total count
      const { count } = await supabase
        .from('formations')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'onisep');

      // Get sectors count
      const { data: sectors } = await supabase
        .from('formations')
        .select('sector')
        .eq('source', 'onisep')
        .neq('sector', null);

      // Get levels count
      const { data: levels } = await supabase
        .from('formations')
        .select('level')
        .eq('source', 'onisep')
        .neq('level', null);

      const uniqueSectors = new Set(sectors?.map(f => f.sector));
      const uniqueLevels = new Set(levels?.map(f => f.level));

      return {
        success: true,
        stats: {
          totalFormations: count || 0,
          uniqueSectors: uniqueSectors.size,
          uniqueLevels: uniqueLevels.size,
          sectors: Array.from(uniqueSectors).sort(),
          levels: Array.from(uniqueLevels).sort(),
        },
      };
    } catch (error) {
      console.error('❌ [ONISEP] Get stats error:', error);
      return {
        success: false,
        stats: null,
      };
    }
  },
};
