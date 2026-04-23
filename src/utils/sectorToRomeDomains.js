/**
 * Maps the sector preference question answer to ROME domains
 * Used to filter metier recommendations by selected sector
 */

export const SECTOR_ANSWER_MAP = {
  100: {
    label: 'Technologie, Sciences & Recherche',
    romeDomains: ['technology'],
  },
  66: {
    label: 'Arts, Design & Culture',
    romeDomains: ['arts'],
  },
  33: {
    label: 'Santé, Social & Éducation',
    romeDomains: ['health', 'service'],
  },
  0: {
    label: 'Commerce, Entrepreneuriat & Industrie',
    romeDomains: ['business', 'construction'],
  },
};

/**
 * Converts a sector answer value to ROME domain IDs
 * @param {number} value - The answer value (0, 33, 66, or 100)
 * @returns {string[]} Array of ROME domain IDs
 */
export const getSectorRomeDomains = (value) => {
  const mapping = SECTOR_ANSWER_MAP[value];
  if (!mapping) {
    // Default to all sectors if value doesn't match
    return [];
  }
  return mapping.romeDomains;
};

/**
 * Gets the sector label from answer value
 * @param {number} value - The answer value
 * @returns {string} Readable sector label
 */
export const getSectorLabel = (value) => {
  const mapping = SECTOR_ANSWER_MAP[value];
  return mapping ? mapping.label : 'Tous les secteurs';
};
