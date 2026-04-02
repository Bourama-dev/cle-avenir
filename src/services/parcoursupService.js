import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch and filter Parcoursup formations.
 * Uses Supabase Edge Functions to securely access API/OpenData.
 */

const CACHE_KEY = 'parcoursup_search_';

export const parcoursupService = {
  /**
   * Fetch formations with advanced filters
   * @param {Object} filters
   * @param {string} filters.query - Search keywords
   * @param {string} filters.region - Region name
   * @param {string} filters.type - 'BTS', 'Licence', etc.
   * @param {string} filters.modality - 'full_time', 'alternance', 'remote'
   */
  async searchFormations(filters = {}) {
    // Generate a cache key based on filters to avoid redundant API calls
    const filterKey = JSON.stringify(filters);
    const cached = localStorage.getItem(CACHE_KEY + filterKey);
    
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 3600000) return data; // 1 hour cache
      } catch (e) {
        localStorage.removeItem(CACHE_KEY + filterKey);
      }
    }

    try {
      // Map frontend filters to API params suitable for the edge function
      const apiParams = {
        action: 'formations',
        q: filters.query || '',
        ville: filters.city || '',
        limit: 50,
        type: filters.type || '',
        region: filters.region || ''
      };

      // Call the secure edge function
      // This function holds any necessary API keys (LBA_API_KEY, etc.) in backend secrets
      const { data, error } = await supabase.functions.invoke('parcoursup-api', {
        body: apiParams
      });

      if (error) throw error;

      let results = data?.results || [];

      // Additional client-side filtering if the API is too broad
      if (filters.modality === 'alternance') {
        results = results.filter(f => f.tags?.includes('Apprentissage') || f.amenagement_alternance === true);
      } else if (filters.modality === 'remote') {
        results = results.filter(f => f.tags?.includes('Distance') || f.amenagement_distance === true);
      }

      // Format results to a standard structure if they come from different sources
      const formattedResults = results.map(item => ({
        id: item.id || item.id_formation || Math.random().toString(36).substr(2, 9),
        intitule: item.libelle_formation || item.title || item.intitule,
        organisme: { 
            nom: item.etablissement_libelle || item.company?.name || "Organisme inconnu",
            uai: item.uai 
        },
        adresse: {
            libelleCommune: item.commune || item.place?.city || "",
            codePostal: item.code_postal || ""
        },
        url: item.lien_formation || item.url,
        tags: item.tags || [],
        dureeEnHeures: item.duree,
        niveauSortie: item.niveau || "Non spécifié"
      }));

      // Cache results
      localStorage.setItem(CACHE_KEY + filterKey, JSON.stringify({
        data: formattedResults,
        timestamp: Date.now()
      }));

      return formattedResults;

    } catch (err) {
      console.error('Parcoursup Service Error:', err);
      // Return empty array instead of crashing, allowing UI to show empty state
      return [];
    }
  }
};