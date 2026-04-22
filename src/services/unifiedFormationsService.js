import { fetchFormations as fetchParcoursupFormations } from '@/services/parcoursup';
import { onisepSyncService } from '@/services/onisepSyncService';

/**
 * Unified service to fetch from multiple formation sources
 * Combines Parcoursup API and ONISEP database
 */
export const unifiedFormationsService = {
  /**
   * Fetch formations from a specific source
   */
  async fetchFormations(source = 'parcoursup', params = {}) {
    if (source === 'onisep') {
      return this.fetchOnisepFormations(params);
    }
    return this.fetchParcoursupFormations(params);
  },

  /**
   * Fetch from Parcoursup API
   */
  async fetchParcoursupFormations(params = {}) {
    try {
      const response = await fetchParcoursupFormations(params);

      if (!response.success) {
        return {
          success: false,
          error: response.error,
          results: [],
          total: 0,
          source: 'parcoursup'
        };
      }

      // Normalize Parcoursup data
      const normalizedResults = (response.results || []).map(f => ({
        id: f.id_formation || f.g_ea_lib_vx || `ps-${Math.random()}`,
        libelle_formation: f.libelle_formation || 'Formation sans titre',
        title: f.libelle_formation,
        description: f.description || '',
        sector: f.sector || 'Général',
        level: this.getFormationLevel(f),
        type: 'Formation',
        provider: f.g_ea_lib_vx || 'Non spécifié',
        location: f.localisation || '',
        source: 'parcoursup',
        url: f.url || null,
        external_id: f.id_formation,
        ...f
      }));

      return {
        success: true,
        results: normalizedResults,
        total: response.total || 0,
        source: 'parcoursup'
      };
    } catch (error) {
      console.error('Error fetching from Parcoursup:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        total: 0,
        source: 'parcoursup'
      };
    }
  },

  /**
   * Fetch from ONISEP database
   */
  async fetchOnisepFormations(params = {}) {
    try {
      const query = params.q || '';

      let result;
      if (query) {
        result = await onisepSyncService.searchFormations(query, {
          level: params.level,
          sector: params.sector,
          limit: params.limit || 100
        });
      } else {
        // Get all ONISEP formations
        result = await onisepSyncService.getOnisepStats();
        // Fallback: search with empty term to get all
        const allResult = await onisepSyncService.searchFormations('', {
          limit: params.limit || 100
        });
        result = allResult;
      }

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Erreur lors du chargement ONISEP',
          results: [],
          total: 0,
          source: 'onisep'
        };
      }

      // Normalize ONISEP data to match Parcoursup format
      const normalizedResults = (result.formations || []).map(f => ({
        id: f.id,
        libelle_formation: f.name || f.title || 'Formation sans titre',
        title: f.title || f.name,
        description: f.description || '',
        sector: f.sector || 'Général',
        level: f.level || 'Non spécifié',
        type: f.type || 'Formation',
        provider: f.provider || 'ONISEP',
        location: 'France',
        source: 'onisep',
        url: f.url,
        external_id: f.external_id,
        sigle: f.sigle,
        duration: f.duration,
        ...f
      }));

      return {
        success: true,
        results: normalizedResults,
        total: result.total || normalizedResults.length,
        source: 'onisep'
      };
    } catch (error) {
      console.error('Error fetching from ONISEP:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        total: 0,
        source: 'onisep'
      };
    }
  },

  /**
   * Get formation level from title
   */
  getFormationLevel(formation) {
    const text = (formation.libelle_formation || '').toUpperCase();
    if (text.includes('BTS')) return 'BAC+2';
    if (text.includes('BUT')) return 'BAC+3';
    if (text.includes('LICENCE')) return 'BAC+3';
    if (text.includes('MASTER')) return 'BAC+5';
    if (text.includes('INGÉNIEUR')) return 'BAC+5';
    if (text.includes('CAP')) return 'CAP';
    if (text.includes('BAC') && !text.includes('BACHELORTECHNOLOGIES')) return 'BAC';
    return 'Non spécifié';
  }
};
