import { supabase } from '@/lib/customSupabaseClient';

// Batched, cached access to the France Travail "Synthèse pages employeurs" API
// (via the get-employer-summary edge function). Components ask for one SIRET at a
// time; requests issued within the same tick are merged into a single call.

const FLUSH_DELAY_MS = 40;
const MAX_BATCH = 100;

const bySiren = new Map(); // siren -> Promise<employer|null>
const logos = new Map();   // `${type}:${idRCE}` -> Promise<string|null>
let queue = [];            // { siren, resolve }
let timer = null;

const sirenOf = (siret) => {
  const s = String(siret ?? '').replace(/\s/g, '');
  return /^\d{14}$/.test(s) ? s.slice(0, 9) : /^\d{9}$/.test(s) ? s : null;
};

async function flush() {
  timer = null;
  const batch = queue;
  queue = [];
  for (let i = 0; i < batch.length; i += MAX_BATCH) {
    const chunk = batch.slice(i, i + MAX_BATCH);
    try {
      const { data, error } = await supabase.functions.invoke('get-employer-summary', {
        body: { sirens: chunk.map((c) => c.siren) },
      });
      if (error) throw error;
      const found = new Map((data?.employers ?? []).map((e) => [e.siren, e]));
      chunk.forEach((c) => c.resolve(found.get(c.siren) ?? null));
    } catch (err) {
      console.warn('[employerSummary]', err?.message ?? err);
      chunk.forEach((c) => c.resolve(null));
    }
  }
}

export function getEmployer(siret) {
  const siren = sirenOf(siret);
  if (!siren) return Promise.resolve(null);
  if (!bySiren.has(siren)) {
    bySiren.set(siren, new Promise((resolve) => {
      queue.push({ siren, resolve });
      if (!timer) timer = setTimeout(flush, FLUSH_DELAY_MS);
    }));
  }
  return bySiren.get(siren);
}

export function getEmployerLogo(idRCE, type) {
  if (!idRCE) return Promise.resolve(null);
  const key = `${type}:${idRCE}`;
  if (!logos.has(key)) {
    logos.set(key, supabase.functions
      .invoke('get-employer-summary', { body: { logo: { idRCE, type } } })
      .then(({ data }) => data?.dataUrl ?? null)
      .catch(() => null));
  }
  return logos.get(key);
}

export async function getFeaturedEmployers({ where, codesNaf, limit = 6 } = {}) {
  try {
    const { data } = await supabase.functions.invoke('get-employer-summary', {
      body: { featured: true, where, codesNaf, limit },
    });
    return data?.employers ?? [];
  } catch {
    return [];
  }
}
