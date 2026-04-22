import { supabase } from '../lib/customSupabaseClient';
import { getCachedMetier, setCachedMetier } from './metierCacheService';
import { queueRequest } from './requestQueueService';
import { mockMetiers } from '@/data/mockMetiers';

const TABLE_NAME = 'rome_metiers';

export const metierService = {
  /**
   * Generate fallback RIASEC weights if neither adjusted_weights nor riasec_vector is available.
   */
  generateRiasecWeights: (majeur, mineur) => {
    const weights = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const sumMax = 100;

    if (majeur) {
      const majorChars = majeur.toUpperCase().split('');
      const majorWeight = 50 / majorChars.length;
      for (const char of majorChars) {
        if (weights.hasOwnProperty(char)) {
          weights[char] = Math.round(majorWeight);
        }
      }
    }

    if (mineur) {
      const minorChars = mineur.toUpperCase().split('').filter(char => !majeur?.toUpperCase().includes(char));
      const minorWeight = 30 / Math.max(minorChars.length, 1);
      for (const char of minorChars) {
        if (weights.hasOwnProperty(char)) {
          weights[char] = Math.round(minorWeight);
        }
      }
    }

    // Fill remaining with neutral values
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    if (total < sumMax) {
      const remaining = (sumMax - total) / Object.values(weights).filter(v => v === 0).length;
      for (const key in weights) {
        if (weights[key] === 0) weights[key] = Math.round(remaining);
      }
    }

    return weights;
  },

  /**
   * Format a raw database metier to a matching-friendly format
   */
  formatMetierForMatching: (rawMetier) => {
    try {
      let riasec = rawMetier.adjusted_weights;

      if (!riasec || Object.keys(riasec).length === 0 || riasec === '0') {
         riasec = rawMetier.riasec_vector;
      }

      if (!riasec || Object.keys(riasec).length === 0 || riasec === '0') {
        riasec = metierService.generateRiasecWeights(rawMetier.riasecMajeur, rawMetier.riasecMineur);
      }

      // Normalize RIASEC weights to ensure consistent scale (0-100)
      const rawNormalized = {
        R: Number(riasec.R || riasec.r || 0),
        I: Number(riasec.I || riasec.i || 0),
        A: Number(riasec.A || riasec.a || 0),
        S: Number(riasec.S || riasec.s || 0),
        E: Number(riasec.E || riasec.e || 0),
        C: Number(riasec.C || riasec.c || 0),
      };

      // Normalize to 0-100 scale if needed
      const total = Object.values(rawNormalized).reduce((a, b) => a + b, 0);
      let normalizedRiasec = rawNormalized;
      if (total > 0 && total !== 100) {
        normalizedRiasec = {};
        for (const [key, val] of Object.entries(rawNormalized)) {
          normalizedRiasec[key] = Math.round((val / total) * 100);
        }
      }

      const hybridProfile = [];
      if (rawMetier.riasecMajeur) hybridProfile.push(rawMetier.riasecMajeur.charAt(0).toUpperCase());
      if (rawMetier.riasecMineur && rawMetier.riasecMineur.charAt(0).toUpperCase() !== rawMetier.riasecMajeur?.charAt(0).toUpperCase()) {
        hybridProfile.push(rawMetier.riasecMineur.charAt(0).toUpperCase());
      }

      const debouchesLower = (rawMetier.debouches || '').toLowerCase();
      let demandLevel = 'moyenne';
      let growthTrend = 'stable';

      // Improved demand level detection
      if (
        debouchesLower.includes('très favorable') ||
        debouchesLower.includes('forte demande') ||
        debouchesLower.includes('très élevée') ||
        debouchesLower.includes('explor') ||
        debouchesLower.includes('excellentes perspectives')
      ) {
        demandLevel = 'très_élevée';
        growthTrend = 'croissant';
      } else if (
        debouchesLower.includes('favorable') ||
        debouchesLower.includes('bon potentiel') ||
        debouchesLower.includes('élevée') ||
        debouchesLower.includes('bonne demande')
      ) {
        demandLevel = 'élevée';
        growthTrend = 'croissant';
      } else if (
        debouchesLower.includes('difficile') ||
        debouchesLower.includes('faible') ||
        debouchesLower.includes('très faible') ||
        debouchesLower.includes('decline') ||
        debouchesLower.includes('restreint')
      ) {
        demandLevel = 'faible';
        growthTrend = 'décroissant';
      } else if (debouchesLower.includes('modéré')) {
        demandLevel = 'moyenne';
        growthTrend = 'stable';
      }

      return {
        ...rawMetier,
        code: rawMetier.code,
        name: rawMetier.libelle,
        description: rawMetier.description || rawMetier.definition,
        riasec: normalizedRiasec,
        hybridProfile,
        salaryRange: rawMetier.salaire || "Non renseigné",
        demandLevel,
        growthTrend,
        sector: "Général",
        educationLevel: rawMetier.niveau_etudes || "Non renseigné",
        emoji: '💼',
        rawMetier: rawMetier
      };
    } catch (err) {
      console.error(`Error formatting metier ${rawMetier.code}:`, err);
      return null;
    }
  },

  getAllMetiersForMatching: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('code, libelle, description, definition, riasecMajeur, riasecMineur, adjusted_weights, riasec_vector, salaire, debouches, niveau_etudes');

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn("Supabase returned empty data, using mock métiers for testing");
        const formatted = mockMetiers
          .map(metierService.formatMetierForMatching)
          .filter(m => m !== null);
        return formatted;
      }

      const formatted = data
        .map(metierService.formatMetierForMatching)
        .filter(m => m !== null);

      return formatted;
    } catch (err) {
      console.error("Error in getAllMetiersForMatching:", err);
      console.warn("Falling back to mock métiers for testing");
      // Use mock data as fallback when Supabase is unavailable
      const formatted = mockMetiers
        .map(metierService.formatMetierForMatching)
        .filter(m => m !== null);
      return formatted;
    }
  },

  getAllMetiers: async () => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*');
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getAllMetiers:", err);
      throw err;
    }
  },

  getMetierByCode: async (code) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error fetching metier by code ${code}:`, err);
      throw err;
    }
  },

  getMetierByRomeCode: async (code) => {
    if (!code) return {};
    
    const cachedData = getCachedMetier(code);
    if (cachedData) {
      return cachedData;
    }

    try {
      const { data, error } = await queueRequest(async () => {
        return await supabase.functions.invoke('get-rome-metier-detail', {
          body: { code }
        });
      });
      
      if (error) {
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
           throw new Error("Trop de requêtes. Veuillez réessayer dans quelques secondes.");
        }
        throw error;
      }
      
      if (!data || Object.keys(data).length === 0) {
        const dbData = await metierService.getMetierByCode(code);
        setCachedMetier(code, dbData);
        return dbData;
      }
      
      setCachedMetier(code, data);
      return data;
    } catch (error) {
      console.error('Error fetching metier from Edge Function, falling back to DB:', error);
      
      if (error.message && error.message.includes("Trop de requêtes")) {
         throw error; 
      }
      
      try {
        const dbData = await metierService.getMetierByCode(code);
        setCachedMetier(code, dbData);
        return dbData;
      } catch (dbError) {
         console.error('Fallback DB fetch failed as well:', dbError);
         return { code };
      }
    }
  },

  searchMetiers: async (query) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .or(`libelle.ilike.%${query}%,code.ilike.%${query}%`);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error searching metiers with query ${query}:`, err);
      throw err;
    }
  },

  createMetier: async (metierData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([metierData])
        .select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error creating metier:', err);
      throw err;
    }
  },

  updateMetier: async (id, metierData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(metierData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error(`Error updating metier ${id}:`, err);
      throw err;
    }
  },

  deactivateMetier: async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deactivating metier ${id}:`, err);
      throw err;
    }
  },
};