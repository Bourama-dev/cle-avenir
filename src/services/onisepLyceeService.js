import { supabase } from '@/lib/customSupabaseClient';

// Call ONISEP directly from the browser — public open-data API with CORS enabled.
// This avoids routing through Supabase Edge Functions which adds ~20-30 s of relay
// latency when the Supabase region is far from ONISEP servers (France).
const ONISEP_LYCEES_URL = 'https://api.opendata.onisep.fr/api/1.0/dataset/5fa5816ac6a6e/search';
const TYPE_GENERAL = 'lycée général, technologique ou polyvalent';
const TYPE_PROFESSIONNEL = 'lycée professionnel';

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
  if (CACHE.size > 80) CACHE.delete(CACHE.keys().next().value);
}

function normaliseLycee(r) {
  const typeRaw = (r.type_detablissement ?? '').toLowerCase();
  let type;
  if (typeRaw.includes('professionnel') || typeRaw.includes('agricole')) type = 'professionnel';
  else if (typeRaw.includes('polyvalent')) type = 'polyvalent';
  else type = 'general';

  const statutRaw = (r.statut ?? '').toLowerCase();
  const statut = statutRaw === 'public' ? 'public' : 'prive';

  const geoloc = r._geoloc;
  const lat = geoloc?.lat != null ? Number(geoloc.lat) : r.latitude_y != null ? Number(r.latitude_y) : null;
  const lon = geoloc?.lon != null ? Number(geoloc.lon) : r.longitude_x != null ? Number(r.longitude_x) : null;

  return {
    id: r.code_uai ?? '',
    uai: r.code_uai ?? '',
    nom: r.nom ?? '',
    adresse: r.adresse ?? '',
    ville: r.commune ?? '',
    code_postal: r.cp ?? '',
    departement: r.departement ?? '',
    code_departement: '',
    region: r.region ?? '',
    academie: r.academie ?? '',
    type,
    statut,
    telephone: r.telephone ?? '',
    email: '',
    url: r.url_et_id_onisep ?? '',
    nombre_eleves: null,
    coordonnees: lat != null && lon != null && !isNaN(lat) && !isNaN(lon) ? { lat, lon } : null,
    nature: r.type_detablissement ?? '',
    langues: r.langues_enseignees ?? '',
    jpo: r.journees_portes_ouvertes ?? '',
  };
}

async function fetchOnisepLycees({ q, ville, departement, type, statut, limit, offset }) {
  const p = new URLSearchParams({ size: String(limit), from: String(offset) });

  const textSearch = [q, ville].filter(Boolean).join(' ');
  if (textSearch) p.set('q', textSearch);

  if (type === 'professionnel') {
    p.append('facet.type_detablissement', TYPE_PROFESSIONNEL);
  } else if (type === 'all') {
    p.append('facet.type_detablissement', TYPE_GENERAL);
    p.append('facet.type_detablissement', TYPE_PROFESSIONNEL);
  } else {
    p.append('facet.type_detablissement', TYPE_GENERAL);
  }

  if (statut === 'public') p.append('facet.statut', 'public');
  else if (statut === 'prive') p.append('facet.statut', 'privé sous contrat');
  if (departement) p.append('facet.departement', departement);

  const res = await fetch(`${ONISEP_LYCEES_URL}?${p}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`ONISEP ${res.status}`);
  const data = await res.json();
  const records = Array.isArray(data?.results) ? data.results : [];
  return { lycees: records.map(normaliseLycee), total: Number(data?.total ?? records.length) };
}

export const onisepLyceeService = {
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

    const result = await fetchOnisepLycees(params);
    toCache(key, result);
    return result;
  },

  async getLyceeByUai(uai) {
    if (!uai) return null;
    const key = `uai:${uai}`;
    const cached = fromCache(key);
    if (cached) return cached;

    const { lycees } = await fetchOnisepLycees({ q: uai, type: 'all', statut: 'all', limit: 5, offset: 0, ville: '', departement: '' });
    const lycee = lycees.find((l) => l.uai === uai) ?? lycees[0] ?? null;
    toCache(key, lycee);
    return lycee;
  },

  /**
   * Fetch formations/specialties for a specific lycée by UAI.
   * Returns { formations: [{libelle, diplome, code_specialite, niveau}], extras: string[] }
   */
  async getLyceeFormations(uai) {
    if (!uai) return { formations: [], extras: [] };
    const key = `formations:${uai}`;
    const cached = fromCache(key);
    if (cached) return cached;

    const { data, error } = await supabase.functions.invoke('get-lycee-formations', {
      body: { uai },
    });

    if (error) {
      console.warn('[onisepLyceeService] getLyceeFormations error:', error);
      return { formations: [], extras: [] };
    }

    const result = {
      formations: data?.formations ?? [],
      extras: data?.extras ?? [],
      available_fields: data?.available_fields ?? [],
    };
    toCache(key, result);
    return result;
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
