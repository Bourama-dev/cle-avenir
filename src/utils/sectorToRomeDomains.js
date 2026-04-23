/**
 * Maps the sector preference to ROME domains
 * Now supports 12 distinct professional sectors instead of 4 generic groups
 */

import { ROME_DOMAINS } from '@/data/romeMapping';

/**
 * Get all ROME domain IDs
 * @returns {string[]} Array of all domain IDs
 */
export const getAllRomeDomainIds = () => {
  return Object.keys(ROME_DOMAINS);
};

/**
 * Get ROME domain by ID
 * @param {string} domainId - The domain ID (e.g., 'technology', 'health')
 * @returns {object} The domain object or null
 */
export const getRomeDomain = (domainId) => {
  return ROME_DOMAINS[domainId] || null;
};

/**
 * Get all ROME codes for a specific domain
 * @param {string} domainId - The domain ID
 * @returns {string[]} Array of ROME codes for this domain
 */
export const getDomainRomeCodes = (domainId) => {
  const domain = ROME_DOMAINS[domainId];
  return domain ? domain.codes : [];
};

/**
 * Get ROME codes for multiple domains
 * @param {string[]} domainIds - Array of domain IDs
 * @returns {string[]} Array of all ROME codes for these domains
 */
export const getMultipleDomainRomeCodes = (domainIds) => {
  if (!Array.isArray(domainIds) || domainIds.length === 0) {
    return [];
  }
  return domainIds.flatMap(id => getDomainRomeCodes(id));
};

/**
 * Get domain label
 * @param {string} domainId - The domain ID
 * @returns {string} Human-readable domain label
 */
export const getDomainLabel = (domainId) => {
  const domain = ROME_DOMAINS[domainId];
  return domain ? domain.label : domainId;
};

/**
 * Get all domains formatted for display
 * @returns {Array} Array of {id, label, codes} objects
 */
export const getAllDomainsForDisplay = () => {
  return Object.entries(ROME_DOMAINS).map(([id, domain]) => ({
    id,
    label: domain.label,
    codes: domain.codes,
    keywords: domain.keywords,
    salaryRange: domain.salary_range,
    trend: domain.trend
  }));
};

