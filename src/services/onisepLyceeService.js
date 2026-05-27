import { supabase } from '@/lib/customSupabaseClient';

const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function cacheKey(params) {
  return JSON.stringify(params);
}

function fromCache(key) {
  const entry = CACHE.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  CACHE.delete(key);
  return null;
}

function toCache(key, data) {
  CACHE.set(key, { data, ts: Date.now() });
  // Evict oldest when cache grows large
  if (CACHE.size > 80) {
    CACHE.delete(CACHE.keys().next().value);
  }
}

export const onisepLyceeService = {
  /**
   * Search lycées with optional filters.
   * @param {object} params
   * @param {string} [params.q]            - Full-text search (name, specialty…)
   * @param {string} [params.ville]        - City name
   * @param {string} [params.departement]  - Department name or code
   * @param {'general'|'technologique'|'professionnel'|'all'} [params.type]
   * @param {'public'|'prive'|'all'} [params.statut]
   * @param {number} [params.limit]
   * @param {number} [params.offset]
   * @returns {{ lycees: object[], total: number }}
   */
  async searchLycees({
    q = '',
    ville = '',
    departement = '',
    type = 'all',
    statut = 'all',
    limit = 20,
    offset = 0,
  } = {}) {
    const params = { q, ville, departement, type, statut, limit, offset };
    const key = cacheKey(params);
    const cached = fromCache(key);
    if (cached) return cached;

    const { data, error } = await supabase.functions.invoke('get-onisep-lycees', {
      body: params,
    });

    if (error) throw error;

    const result = {
      lycees: data?.lycees ?? [],
      total: data?.total ?? 0,
      warning: data?.warning ?? null,
    };

    toCache(key, result);
    return result;
  },

  /**
   * Get details for a single lycée by UAI code.
   * Uses the same search function filtered to the UAI identifier.
   */
  async getLyceeByUai(uai) {
    if (!uai) return null;
    const key = `uai:${uai}`;
    const cached = fromCache(key);
    if (cached) return cached;

    const { data, error } = await supabase.functions.invoke('get-onisep-lycees', {
      body: { q: uai, limit: 5, enrich: true },
    });

    if (error) throw error;

    const lycees = data?.lycees ?? [];
    // Match exact UAI
    const lycee = lycees.find((l) => l.uai === uai) ?? lycees[0] ?? null;
    toCache(key, lycee);
    return lycee;
  },
};

// Human-readable labels for lycée types
export const LYCEE_TYPE_LABELS = {
  general: 'Lycée Général',
  technologique: 'Lycée Technologique',
  polyvalent: 'Lycée Général & Technologique',
  professionnel: 'Lycée Professionnel',
};

export const LYCEE_TYPE_COLORS = {
  general: 'blue',
  technologique: 'violet',
  polyvalent: 'indigo',
  professionnel: 'emerald',
};

// Contextual descriptions for collégiens
export const LYCEE_TYPE_DESCRIPTIONS = {
  general: {
    short: 'Bac Général — 3 spécialités au choix',
    description:
      'Le lycée général permet de suivre le baccalauréat général en choisissant 3 matières de spécialité parmi une large offre (maths, sciences, langues, SES, LLCE…). Il prépare surtout aux études supérieures longues.',
    debouches: ['Classes prépa', 'Université', 'BUT', 'BTS', 'Écoles'],
    niveaux: ['Seconde générale', 'Première (3 spécialités)', 'Terminale (2 spécialités + Grand oral)'],
    icon: '🎓',
    color: 'blue',
  },
  technologique: {
    short: 'Bac Technologique — filière spécialisée',
    description:
      'Le lycée technologique propose des baccalauréats technologiques organisés en séries (ST2S, STI2D, STMG, STL, STD2A, STHR…). Il allie théorie et pratique et mène principalement vers le BTS ou le BUT.',
    debouches: ['BTS', 'BUT', 'Université', 'Écoles spécialisées'],
    niveaux: ['Seconde', 'Première (série techno)', 'Terminale (série techno)'],
    icon: '⚙️',
    color: 'violet',
  },
  polyvalent: {
    short: 'Bac Général & Technologique',
    description:
      'Ce lycée propose à la fois la voie générale (spécialités libres) et une ou plusieurs séries technologiques. Tu pourras choisir ta voie en fin de seconde.',
    debouches: ['Classes prépa', 'BTS', 'BUT', 'Université', 'Écoles'],
    niveaux: ['Seconde générale', 'Première', 'Terminale'],
    icon: '🏫',
    color: 'indigo',
  },
  professionnel: {
    short: 'Bac Pro ou CAP — insertion rapide',
    description:
      'Le lycée professionnel forme à un métier concret via le baccalauréat professionnel (3 ans) ou le CAP (2 ans). Il comprend de nombreuses périodes de stages en entreprise.',
    debouches: ['Emploi direct', 'BTS en alternance', 'Mention complémentaire'],
    niveaux: ['Seconde professionnelle', 'Première Pro', 'Terminale Pro', 'CAP (2 ans)'],
    icon: '🔧',
    color: 'emerald',
  },
};
