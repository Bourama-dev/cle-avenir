import { supabase } from '@/lib/customSupabaseClient';

// Simple in-memory cache
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const InstitutionSearchService = {
  /**
   * Search institutions with caching and filtering
   * Queries the 'educational_institutions' table (public directory)
   * @param {Object} params
   * @param {string} params.query - Search term
   * @param {string} params.type - Filter by type
   * @param {string} params.sector - Filter by sector
   * @param {string} params.region - Filter by region
   * @param {number} params.limit - Limit results (default 10)
   */
  async search(params) {
    const { query, type, sector, region, limit = 10 } = params;
    const cacheKey = JSON.stringify({ query, type, sector, region, limit });

    // Check cache
    if (searchCache.has(cacheKey)) {
      const { timestamp, data } = searchCache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
      searchCache.delete(cacheKey);
    }

    try {
      // Removed join with institution_programs to avoid FK errors
      let dbQuery = supabase
        .from('educational_institutions')
        .select(`
          id, uai, name, type, status, address, city, postal_code, region, 
          phone, email, website, latitude, longitude
        `)
        .limit(limit);

      if (query) {
        // Search in name or city
        dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`);
      }

      if (type && type !== 'all') {
        dbQuery = dbQuery.eq('type', type);
      }

      if (sector && sector !== 'all') {
        dbQuery = dbQuery.eq('status', sector);
      }

      if (region && region !== 'all') {
        dbQuery = dbQuery.eq('region', region);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      // If programs count is needed, it should be fetched separately or added later
      // For now, we return 0 to keep the frontend working without the join
      const formattedData = data.map(inst => ({
        ...inst,
        programsCount: 0 
      }));

      // Cache results
      searchCache.set(cacheKey, {
        timestamp: Date.now(),
        data: formattedData
      });

      return formattedData;
    } catch (error) {
      console.error('Institution search error:', error);
      return [];
    }
  },

  /**
   * Get filtered list for autocomplete without detailed relations
   */
  async getAutocompleteSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    return this.search({ query, limit: 5 });
  }
};