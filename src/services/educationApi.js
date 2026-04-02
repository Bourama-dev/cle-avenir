import { supabase } from '@/lib/customSupabaseClient';

const DEBUG = true;
const log = (...args) => DEBUG && console.log('🏫 [Education API]', ...args);
const err = (...args) => console.error('❌ [Education API]', ...args);

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const toStr = (v) => (v == null ? '' : String(v).trim());
const toInt = (v, fallback) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeSecteur = (s) => {
  const v = toStr(s).toLowerCase();
  if (!v) return '';
  if (v === 'public') return 'Public';
  if (v === 'privé' || v === 'prive') return 'Privé';
  return toStr(s);
};

const normalizeLimitOffset = (limit, offset) => {
  const l = Math.min(Math.max(toInt(limit, DEFAULT_LIMIT), 1), MAX_LIMIT);
  const o = Math.max(toInt(offset, 0), 0);
  return { limit: l, offset: o };
};

export const educationApi = {
  /**
   * Récupère la liste des établissements filtrée.
   */
  async fetchEtablissements(params = {}) {
    try {
      log('fetchEtablissements called with:', params);

      const commune = toStr(params.commune);
      const code_postal = toStr(params.code_postal);
      const secteur = normalizeSecteur(params.secteur);
      const type = toStr(params.type);
      const { limit, offset } = normalizeLimitOffset(params.limit, params.offset);

      const body = {
        commune,
        code_postal,
        secteur,
        type,
        limit,
        offset
      };

      log('Invoking "get-etablissements" with body:', body);

      const { data, error } = await supabase.functions.invoke('get-etablissements', { body });

      if (error) {
        err('Supabase function error:', error);
        // Return a safe fallback instead of crashing
        return { success: false, error: error.message || "Erreur lors de l'appel API", results: [] };
      }

      if (!data) {
        err('No data returned from get-etablissements');
        return { success: false, error: 'Réponse vide', results: [] };
      }

      // Check for logical error returned in 200 OK response
      if (data.success === false) {
         err('API returned logical error:', data.error);
         return { success: false, error: data.error, results: [] };
      }

      log(`Received ${data.results?.length || 0} etablissements`);

      return {
        ...data,
        success: true,
        results: Array.isArray(data.results) ? data.results : []
      };
    } catch (error) {
      err('Service Exception:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue',
        results: []
      };
    }
  },

  async fetchLogs({ limit = 50 } = {}) {
    // Placeholder for log fetching if needed
    return { success: false, error: 'Not implemented for debugging', results: [] };
  }
};