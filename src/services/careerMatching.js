import { supabase } from '@/lib/customSupabaseClient';

/* =========================================
   CONFIG
========================================= */
const DEBUG = false;
const log = (...a) => DEBUG && console.log('[CareerEngine]', ...a);

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const LS_PREFIX = 'cleavenir_rome_cache_v2:';

/* =========================================
   SAFE UTILS (anti-crash)
========================================= */
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const isArr = (v) => Array.isArray(v);
const toStr = (v) => (v == null ? '' : String(v));
const norm = (v) => toStr(v).toLowerCase().trim();
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const clamp100 = (x) => Math.max(0, Math.min(100, Math.round(x)));
const safeNum = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const safeArr = (v) => (isArr(v) ? v : []);
const safeObj = (v) => (isObj(v) ? v : {});

function escapeKey(k) {
  return norm(k).replace(/[^a-z0-9:_-]/g, '_');
}

function now() {
  return Date.now();
}

function sigmoid(z) {
  if (z > 50) return 1;
  if (z < -50) return 0;
  return 1 / (1 + Math.exp(-z));
}

/* =========================================
   CACHE (memory + localStorage)
========================================= */
const memCache = new Map();

function cacheGet(key) {
  const k = escapeKey(key);
  const m = memCache.get(k);
  if (m && (now() - m.ts) < CACHE_TTL_MS) return m.value;
  try {
    const raw = localStorage.getItem(LS_PREFIX + k);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || (now() - parsed.ts) >= CACHE_TTL_MS) return null;
    memCache.set(k, { ts: parsed.ts, value: parsed.value });
    return parsed.value;
  } catch {
    return null;
  }
}

function cacheSet(key, value) {
  const k = escapeKey(key);
  const payload = { ts: now(), value };
  memCache.set(k, payload);
  try {
    localStorage.setItem(LS_PREFIX + k, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

/* =========================================
   1) ROME / API MÉTIERS — Direct DB Call
========================================= */

export async function getRomeMetier(romeCode) {
  const code = toStr(romeCode).trim();
  if (!code) return null;

  const cached = cacheGet(`metier:${code}`);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('rome_metiers')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error) throw error;
    if (data) cacheSet(`metier:${code}`, data);
    return data;
  } catch (e) {
    log('getRomeMetier error', code, e?.message);
    return null;
  }
}

export async function searchRomeMetiers(q, limit = 20) {
  const query = toStr(q).trim();
  if (!query) return { success: true, results: [] };

  const cacheKey = `search:${query}:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('rome_metiers')
      .select('code, libelle, description')
      .ilike('libelle', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    const res = {
      success: true,
      results: safeArr(data)
    };
    cacheSet(cacheKey, res);
    return res;
  } catch (e) {
    return { success: false, error: e?.message || 'Erreur recherche', results: [] };
  }
}

/* =========================================
   2) PARSER ROME
========================================= */

function pickStringsDeep(obj, max = 200) {
  const out = [];
  const seen = new Set();
  const stack = [obj];

  while (stack.length && out.length < max) {
    const cur = stack.pop();
    if (!cur) continue;
    if (typeof cur === 'string') {
      const s = cur.trim();
      if (s && !seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
      continue;
    }
    if (Array.isArray(cur)) {
      for (let i = cur.length - 1; i >= 0; i--) stack.push(cur[i]);
      continue;
    }
    if (typeof cur === 'object') {
      for (const v of Object.values(cur)) stack.push(v);
    }
  }

  return out;
}

function normalizeTagList(list) {
  return safeArr(list)
    .flatMap(x => (typeof x === 'string' ? [x] : (x?.libelle ? [x.libelle] : x?.label ? [x.label] : [])))
    .map(s => norm(s))
    .filter(Boolean);
}

export function parseRomeMetier(metierJson) {
  const m = safeObj(metierJson);

  const title = m.libelle || m.intitule || m.titre || '';

  // Use correct casing: competencesMobiliseesPrincipales, competencesMobiliseesEmergentes, competencesMobilisees
  const competences = [
    ...normalizeTagList(m.competencesMobiliseesPrincipales),
    ...normalizeTagList(m.competencesMobiliseesEmergentes),
    ...normalizeTagList(m.competencesMobilisees)
  ];

  const softSkills = [
    ...normalizeTagList(m.competencesMobilisees) 
  ];

  // Use correct casing: centresInteretsLies, themes, divisionsNaf
  const interests = [
    ...normalizeTagList(m.centresInteretsLies),
    ...normalizeTagList(m.themes),
    ...normalizeTagList(m.divisionsNaf)
  ];

  const riasec = normalizeTagList([m.riasecMajeur, m.riasecMineur]);

  const fallback = (competences.length + softSkills.length + interests.length) === 0
    ? pickStringsDeep(m, 120).map(norm)
    : [];

  return {
    title: toStr(title).trim(),
    competences: Array.from(new Set([...competences, ...fallback])).slice(0, 120),
    softSkills: Array.from(new Set([...softSkills, ...fallback])).slice(0, 80),
    interests: Array.from(new Set([...interests, ...riasec, ...fallback])).slice(0, 80),
    riasec
  };
}

/* =========================================
   3) USER VECTOR NORMALIZATION
========================================= */

function normalizeUserVector(userVector = {}) {
  const uv = safeObj(userVector);

  const dimensions = {};
  const dims = safeObj(uv.dimensions);
  for (const [k, v] of Object.entries(dims)) {
    dimensions[norm(k)] = Math.max(0, Math.min(100, safeNum(v, 0)));
  }

  const interests = Array.from(new Set(safeArr(uv.interests).map(norm).filter(Boolean)));
  const skills = Array.from(new Set(safeArr(uv.skills).map(norm).filter(Boolean)));

  let softSkills = [];
  if (isArr(uv.softSkills)) softSkills = uv.softSkills.map(norm);
  else if (isObj(uv.softSkills)) softSkills = Object.keys(uv.softSkills).map(norm);
  softSkills = Array.from(new Set(softSkills.filter(Boolean)));

  const likedCareers = Array.from(new Set(safeArr(uv.likedCareers).map(toStr).map(s => s.trim()).filter(Boolean)));

  return { dimensions, interests, skills, softSkills, likedCareers };
}

/* =========================================
   4) MATCHING
========================================= */

function overlapScore(userList, jobList) {
  const u = new Set(safeArr(userList).map(norm).filter(Boolean));
  const j = safeArr(jobList).map(norm).filter(Boolean);
  if (!j.length) return 0.5;
  let hits = 0;
  for (const x of j) if (u.has(x)) hits++;
  return clamp01(hits / j.length);
}

function dimensionStrength01(dimensions) {
  const vals = Object.values(dimensions || {});
  if (!vals.length) return 0;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return clamp01(avg / 100);
}

function riasecMatch01(userInterests, jobRiasec) {
  const u = new Set(safeArr(userInterests).map(norm));
  const j = new Set(safeArr(jobRiasec).map(norm));
  if (!j.size) return 0.5;
  let hits = 0;
  for (const x of j) if (u.has(x)) hits++;
  return clamp01(hits / j.size);
}

function infoRichness01(jobProfile) {
  const c = safeArr(jobProfile.competences).length;
  const s = safeArr(jobProfile.softSkills).length;
  const i = safeArr(jobProfile.interests).length;
  return clamp01((c + s + i) / 150);
}

function likeBoost01(userLikedCareers, romeCode) {
  if (!romeCode) return 0;
  const set = new Set(safeArr(userLikedCareers).map(toStr));
  return set.has(romeCode) ? 1 : 0;
}

function extractFeaturesForRome(userVectorNorm, jobProfile, romeCode, demand01 = 0.5) {
  return [
    overlapScore(userVectorNorm.skills, jobProfile.competences),
    overlapScore(userVectorNorm.softSkills, jobProfile.softSkills),
    overlapScore(userVectorNorm.interests, jobProfile.interests),
    overlapScore(userVectorNorm.skills, jobProfile.competences),
    riasecMatch01(userVectorNorm.interests, jobProfile.riasec),
    dimensionStrength01(userVectorNorm.dimensions),
    likeBoost01(userVectorNorm.likedCareers, romeCode),
    infoRichness01(jobProfile),
    clamp01(demand01),
    1
  ];
}

/* =========================================
   5) MODEL
========================================= */

let MODEL = {
  type: 'linear-logistic',
  weights: [1.4, 1.2, 1.1, 0.3, 0.4, 0.5, 1.0, 0.2, 0.3, -1.0]
};

function predictProbaBaseline(features) {
  const w = MODEL.weights;
  let z = 0;
  for (let i = 0; i < features.length; i++) z += features[i] * w[i];
  return clamp01(sigmoid(z));
}

function buildReasons(features) {
  const reasons = [];
  if (features[0] >= 0.25) reasons.push('Compétences proches du métier');
  if (features[1] >= 0.25) reasons.push('Soft skills compatibles');
  if (features[2] >= 0.25) reasons.push('Centres d’intérêt alignés');
  if (features[4] >= 0.6) reasons.push('Profil RIASEC cohérent');
  if (features[6] >= 1) reasons.push('Métier déjà apprécié / favori');
  if (!reasons.length) reasons.push('Compatibilité à affiner avec plus d’infos');
  return reasons.slice(0, 5);
}

export async function scoreRomeCareers({ userVector, romeCodes = [], userStudyLevel = null }) {
  const uv = normalizeUserVector(userVector);
  const codes = Array.from(new Set(safeArr(romeCodes).map(toStr).map(s => s.trim()).filter(Boolean))).slice(0, 200);
  const results = [];

  for (const code of codes) {
    try {
      const metierJson = await getRomeMetier(code);
      if (!metierJson) {
        results.push({ romeCode: code, title: code, percentage: 0, proba: 0, reasons: ['Données métier indisponibles (API)'], matchDetails: { error: 'metier_not_found' } });
        continue;
      }

      const jobProfile = parseRomeMetier(metierJson);
      const features = extractFeaturesForRome(uv, jobProfile, code, 0.5);
      const proba = predictProbaBaseline(features);

      results.push({
        romeCode: code,
        title: jobProfile.title || code,
        percentage: clamp100(proba * 100),
        proba: Number(proba.toFixed(4)),
        reasons: buildReasons(features),
        matchDetails: {
          model: MODEL.type,
          features: features.map(x => Number(x.toFixed(4)))
        }
      });
    } catch (e) {
      results.push({ romeCode: code, title: code, percentage: 0, proba: 0, reasons: ['Erreur de scoring'], matchDetails: { error: e?.message } });
    }
  }

  results.sort((a, b) => b.percentage - a.percentage);
  return results;
}