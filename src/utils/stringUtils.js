/**
 * Normalize a string for accent-insensitive, case-insensitive comparison.
 *
 *   normalizeStr('Hôtel')  → 'hotel'
 *   normalizeStr('HÉROS')  → 'heros'
 *   normalizeStr('café')   → 'cafe'
 *
 * Uses Unicode NFD decomposition to separate base characters from their
 * diacritical marks, then strips the marks (U+0300–U+036F range).
 */
export const normalizeStr = (str) => {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

/**
 * Returns true if `text` contains `term` after both are normalized
 * (accent-insensitive + case-insensitive).
 *
 *   normalizedIncludes('Hôtellerie', 'hotel')  → true
 *   normalizedIncludes('Développeur', 'developpeur') → true
 */
export const normalizedIncludes = (text, term) =>
  normalizeStr(text).includes(normalizeStr(term));

/**
 * Returns true if `a` equals `b` after normalization.
 *
 *   normalizedEquals('Île-de-France', 'ile de france') → false (different chars)
 *   normalizedEquals('Café', 'cafe') → true
 */
export const normalizedEquals = (a, b) =>
  normalizeStr(a) === normalizeStr(b);
