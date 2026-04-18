/**
 * Safely format a salary value that may be:
 *  - a plain string  → returned as-is
 *  - an object { min, max, currency } from the ROME API → formatted as "20 000 – 35 000 €"
 *  - null / undefined → returns null
 *  - anything else    → converted to string via String()
 */
export const formatSalary = (v) => {
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const { min, max, currency = '€' } = v;
    const fmt = (n) => (n != null ? Number(n).toLocaleString('fr-FR') : null);
    if (min != null && max != null) return `${fmt(min)} – ${fmt(max)} ${currency}`;
    if (min != null) return `À partir de ${fmt(min)} ${currency}`;
    if (max != null) return `Jusqu'à ${fmt(max)} ${currency}`;
    return null;
  }
  return String(v);
};

/* ─────────────────────────────────────────────────────────────────────────────
   Salary estimation based on ROME domain code + education level.
   Used when the actual salary field is null/empty in the database.
   ───────────────────────────────────────────────────────────────────────────── */

/** Salary ranges (k€/year) per ROME domain letter */
const DOMAIN_SALARY = {
  A: { min: 19, max: 28, label: 'Agriculture' },
  B: { min: 21, max: 36, label: 'Arts' },
  C: { min: 27, max: 52, label: 'Banque / Finance / Assurance' },
  D: { min: 22, max: 42, label: 'Commerce' },
  E: { min: 24, max: 46, label: 'Communication / Média' },
  F: { min: 23, max: 40, label: 'Construction / BTP' },
  G: { min: 19, max: 31, label: 'Hôtellerie / Tourisme' },
  H: { min: 25, max: 44, label: 'Industrie' },
  I: { min: 22, max: 39, label: 'Installation / Maintenance' },
  J: { min: 25, max: 56, label: 'Santé' },
  K: { min: 19, max: 32, label: 'Services à la collectivité' },
  L: { min: 19, max: 36, label: 'Spectacle / Culture' },
  M: { min: 27, max: 52, label: 'Support entreprise / IT' },
  N: { min: 22, max: 39, label: 'Transport / Logistique' },
};

/** Education level multipliers */
const EDU_MULT = [
  { keywords: ['doctorat', 'phd'],            mult: 1.55 },
  { keywords: ['ingénieur', 'grande école'],  mult: 1.45 },
  { keywords: ['master', 'bac+5', 'bac + 5'], mult: 1.38 },
  { keywords: ['licence', 'bac+3', 'bac + 3'], mult: 1.18 },
  { keywords: ['bts', 'dut', 'but', 'bac+2', 'bac + 2'], mult: 1.08 },
  { keywords: ['bac', 'baccalauréat'],         mult: 1.02 },
  { keywords: ['cap', 'bep', 'cqp'],           mult: 1.00 },
];

/**
 * Returns a guaranteed salary display string for a métier object.
 * Uses actual DB value first, then estimates from domain + education.
 */
export const getMetierSalary = (metier) => {
  if (!metier) return 'Non renseigné';

  // 1. Use real value if available
  const real = formatSalary(metier.salaire || metier.salary_range);
  if (real) return real;

  // 2. Estimate from ROME domain code
  const domainLetter = (metier.code || '').charAt(0).toUpperCase();
  const domain = DOMAIN_SALARY[domainLetter] || { min: 22, max: 40 };

  // 3. Apply education multiplier
  const edu = (metier.niveau_etudes || '').toLowerCase();
  let mult = 1.0;
  for (const { keywords, mult: m } of EDU_MULT) {
    if (keywords.some(k => edu.includes(k))) { mult = m; break; }
  }

  const min = Math.round(domain.min * mult);
  const max = Math.round(domain.max * mult);

  return `${min}\u202f000\u202f– ${max}\u202f000\u202f€\u202f/ an`;
};
