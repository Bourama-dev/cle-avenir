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
    // object with no useful keys
    return null;
  }
  return String(v);
};
