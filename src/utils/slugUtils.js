/**
 * Slug utilities for SEO-friendly URLs.
 *
 * Métier:  /metier/developpeur-web-e1401      (libelle-ROME_CODE)
 * Formation: /formation/master-info-hetic-12345 (libelle-etablissement-id)
 * Job:     /job/ingenieur-logiciel-paris-abc123
 */

import { normalizeStr } from '@/utils/stringUtils';

/**
 * Convert any string to a URL slug.
 * "Développeur Web" → "developpeur-web"
 * "Hôtel & Tourisme" → "hotel-tourisme"
 */
export const slugify = (text) => {
  if (!text) return '';
  return normalizeStr(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a SEO slug for a métier.
 * { code: 'E1401', libelle: 'Développeur Web' } → 'developpeur-web-e1401'
 */
export const metierToSlug = (metier) => {
  if (!metier) return '';
  const namePart = slugify(metier.libelle || '');
  const code = (metier.code || '').toUpperCase();
  return namePart ? `${namePart}-${code.toLowerCase()}` : code.toLowerCase();
};

/**
 * Extract the ROME code from a slug or raw code.
 * 'developpeur-web-e1401' → 'E1401'
 * 'E1401' → 'E1401'
 * 'e1401' → 'E1401'
 */
export const slugToMetierCode = (slug) => {
  if (!slug) return slug;
  // Try to extract ROME code at end: letter + 4 digits
  const match = slug.match(/([a-n]\d{4})$/i);
  if (match) return match[1].toUpperCase();
  // Maybe it's a raw ROME code
  if (/^[a-n]\d{4}$/i.test(slug)) return slug.toUpperCase();
  // Fallback: return as-is (old URLs without slug)
  return slug.toUpperCase();
};

/**
 * Generate a SEO slug for a formation.
 * { id: '12345', libelle_formation: 'Master Informatique', etablissements: [{libelle_uai: 'Université Paris'}] }
 * → 'master-informatique-universite-paris-12345'
 */
export const formationToSlug = (formation) => {
  if (!formation) return '';
  const namePart = slugify(formation.libelle_formation || formation.title || '');
  const orgPart = slugify(
    formation.etablissements?.[0]?.libelle_uai ||
    formation.provider ||
    ''
  );
  const id = formation.id_formation || formation.id || '';
  const parts = [namePart, orgPart, String(id)].filter(Boolean);
  return parts.join('-').replace(/-+/g, '-');
};

/**
 * Extract the formation ID from a slug.
 * 'master-informatique-universite-paris-12345' → '12345'
 * '12345' → '12345'
 */
export const slugToFormationId = (slug) => {
  if (!slug) return slug;
  // ID is at the end — could be numeric or alphanumeric
  const match = slug.match(/([a-z0-9]{4,})$/i);
  return match ? match[1] : slug;
};
