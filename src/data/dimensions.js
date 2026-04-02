/**
 * Dimensions mapping for user profiling
 * Contains only keys, labels, and emojis.
 */

export const DIMENSIONS = {
  tech: { key: 'tech', label: 'Technologie', emoji: '💻' },
  marketing: { key: 'marketing', label: 'Marketing & Communication', emoji: '📢' },
  droit: { key: 'droit', label: 'Droit & Justice', emoji: '⚖️' },
  relationnel: { key: 'relationnel', label: 'Relationnel', emoji: '💬' },
  bien_etre: { key: 'bien_etre', label: 'Bien-être', emoji: '🧘' },
  analytique: { key: 'analytique', label: 'Analytique', emoji: '📊' },
  autonomie: { key: 'autonomie', label: 'Autonomie', emoji: '🎯' },
  equipe: { key: 'equipe', label: 'Travail en équipe', emoji: '🤝' },
  risque: { key: 'risque', label: 'Goût du risque', emoji: '🚀' },
  etudes_longues: { key: 'etudes_longues', label: 'Études longues', emoji: '📚' },
  creativite: { key: 'creativite', label: 'Créativité', emoji: '✨' },
  rigueur: { key: 'rigueur', label: 'Rigueur', emoji: '✓' },
  sante: { key: 'sante', label: 'Santé & Soin', emoji: '🏥' },
  commerce: { key: 'commerce', label: 'Commerce', emoji: '💼' },
  leadership: { key: 'leadership', label: 'Leadership', emoji: '👑' },
  pratique: { key: 'pratique', label: 'Approche pratique', emoji: '🛠️' },
  innovation: { key: 'innovation', label: 'Innovation', emoji: '💡' },
  art: { key: 'art', label: 'Art & Design', emoji: '🎨' },
  sport: { key: 'sport', label: 'Sport', emoji: '⚽' },
  environnement: { key: 'environnement', label: 'Environnement', emoji: '🌱' },
  education: { key: 'education', label: 'Éducation', emoji: '📚' },
  construction: { key: 'construction', label: 'Construction', emoji: '🏗️' }
};

export const DIMENSION_KEYS = Object.keys(DIMENSIONS);

/**
 * Creates an empty vector with all dimensions initialized to 0.
 * Uses Object.fromEntries for a cleaner implementation.
 */
export function createEmptyVector() {
  return Object.fromEntries(DIMENSION_KEYS.map(k => [k, 0]));
}

/**
 * Normalizes a vector using L2 (Euclidean) normalization.
 * Formula: v_i = v_i / ||v||, where ||v|| = sqrt(sum(v_i^2))
 * This ensures that the vector has a length of 1, making it 
 * perfectly suited for cosine similarity calculations.
 */
export function normalizeVector(vector) {
  const norm = Math.sqrt(
    DIMENSION_KEYS.reduce((sum, key) => sum + Math.pow(vector[key] || 0, 2), 0)
  );

  if (!norm) {
    return createEmptyVector();
  }

  return Object.fromEntries(
    DIMENSION_KEYS.map(key => [key, (vector[key] || 0) / norm])
  );
}