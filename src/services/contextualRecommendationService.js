/**
 * Contextual Recommendation Service
 * Detects dominant RIASEC axis and sector preference to provide intelligent job recommendations
 */

import { AXIS_SECTOR_CONFIGS } from '@/data/contextualMappingConfig';

export const contextualRecommendationService = {
  /**
   * Detect the dominant RIASEC axis from profile
   */
  detectDominantRIASECAxis(profile) {
    if (!profile || typeof profile !== 'object') return 'E'; // Default to Entrepreneur

    const sorted = Object.entries(profile)
      .sort(([, a], [, b]) => b - a);

    return sorted[0]?.[0] || 'E';
  },

  /**
   * Analyze sector preference from questions answered
   * Questions have a 'sector' field that indicates professional domain
   */
  analyzeSectorPreference(answers, allQuestions) {
    if (!answers || Object.keys(answers).length === 0) return {};

    const sectorScores = {};

    Object.entries(answers).forEach(([questionId, answerData]) => {
      const question = allQuestions.find(q => q.id === questionId);
      if (!question || !question.sector) return;

      const sector = question.sector;
      const score = answerData.value || 0;

      // Only count positive responses (> 0 = interested)
      if (score > 0) {
        sectorScores[sector] = (sectorScores[sector] || 0) + score;
      }
    });

    // Normalize to 0-1 scale
    const maxScore = Math.max(...Object.values(sectorScores), 1);
    const normalized = {};
    Object.entries(sectorScores).forEach(([sector, score]) => {
      normalized[sector] = score / (maxScore || 1);
    });

    return normalized;
  },

  /**
   * Identify primary sector from normalized scores
   * Returns sector if score > 25%, otherwise 'default'
   */
  identifyPrimarySector(sectorScores) {
    const sortedSectors = Object.entries(sectorScores)
      .sort(([, a], [, b]) => b - a);

    if (sortedSectors.length === 0) return 'default';

    const [primarySector, primaryScore] = sortedSectors[0];

    // Return primary sector if it has significant presence (>25%)
    if (primaryScore > 0.25) {
      return primarySector;
    }

    return 'default';
  },

  /**
   * Build contextual mapping based on axis and sector
   */
  buildContextualMapping(dominantAxis, primarySector) {
    const axisConfig = AXIS_SECTOR_CONFIGS[dominantAxis];

    if (!axisConfig) {
      console.warn(`No config for axis ${dominantAxis}, using E defaults`);
      return AXIS_SECTOR_CONFIGS['E']['default'];
    }

    const sectorConfig = axisConfig[primarySector] || axisConfig['default'];

    return {
      axis: dominantAxis,
      sector: primarySector,
      ...sectorConfig,
    };
  },

  /**
   * Rank métiers by contextual relevance
   * Combines RIASEC matching with sector, keywords, AND user profile criteria
   */
  rankMetiersByContext(allMetiers, contextualMapping, riasecProfile, userCriteria = null) {
    if (!allMetiers || allMetiers.length === 0) return [];

    const rankedMetiers = allMetiers.map(metier => {
      let score = metier.finalScore || 0; // From calculateAdvancedMatching

      // BONUS 1: Keyword matching
      const keywords = contextualMapping.keywords || [];
      const metierName = (metier.name || '').toLowerCase();
      const metierDesc = (metier.description || '').toLowerCase();

      keywords.forEach(keyword => {
        if (metierName.includes(keyword.toLowerCase())) {
          score += 15;
        } else if (metierDesc.includes(keyword.toLowerCase())) {
          score += 8;
        }
      });

      // BONUS 2: Job pattern matching
      const jobPatterns = contextualMapping.jobPatterns || [];
      jobPatterns.forEach(pattern => {
        if (metierName.includes(pattern.toLowerCase())) {
          score += 20;
        }
      });

      // BONUS 3: Apply boost factors based on RIASEC match
      const boostFactors = contextualMapping.boostFactors || {};
      Object.entries(boostFactors).forEach(([factor, multiplier]) => {
        // Map factor names to RIASEC axes
        const factorAxisMap = {
          leadership: 'E',
          teamwork: 'S',
          creativity: 'A',
          analysis: 'I',
          practical: 'R',
          organization: 'C',
          responsibility: 'E',
          rigor: 'C',
        };

        const axis = factorAxisMap[factor];
        if (axis && riasecProfile[axis] > 60) {
          score *= multiplier;
        }
      });

      // BONUS 4: User profile criteria matching (if available)
      let profileBonus = 1.0;
      let profileIssues = [];

      if (userCriteria && userCriteria.found) {
        const criteriaMatch = this._validateMetierAgainstCriteria(metier, userCriteria);
        profileBonus = criteriaMatch.score;
        profileIssues = criteriaMatch.issues;
      }

      score *= profileBonus;

      return {
        ...metier,
        contextualScore: Math.round(score),
        contextReason: `Recommandé pour profil ${contextualMapping.axis} - ${contextualMapping.label}`,
        sectorMatch: contextualMapping.sector,
        profileMatch: profileBonus,
        profileIssues,
      };
    });

    // Sort by contextual score (descending)
    return rankedMetiers.sort((a, b) => b.contextualScore - a.contextualScore);
  },

  /**
   * Helper: Validate métier against user profile criteria
   */
  _validateMetierAgainstCriteria(metier, criteria) {
    if (!criteria.found) return { score: 1.0, issues: [] };

    let score = 1.0;
    const issues = [];

    // 1. Check education compatibility
    if (criteria.education_level) {
      const userEdLevel = this._normalizeEducationLevel(criteria.education_level);
      const metierEdLevel = this._normalizeEducationLevel(metier.niveau_etudes);

      if (userEdLevel < metierEdLevel) {
        score *= 0.5;
        issues.push(`Education: ${metier.niveau_etudes} requis`);
      }
    }

    // 2. Check salary compatibility
    if (criteria.salary_min && criteria.salary_max) {
      const metierSalary = this._extractSalaryRange(metier.salaire);

      if (metierSalary) {
        const [metierMin, metierMax] = metierSalary;
        const userMin = criteria.salary_min;
        const userMax = criteria.salary_max;

        if (metierMin > userMax * 1.5) {
          score *= 0.8;
          issues.push(`Salaire haut (${metierMin}k€+)`);
        }

        if (metierMax < userMin * 0.8) {
          score *= 0.7;
          issues.push(`Salaire bas (${metierMax}k€ max)`);
        }
      }
    }

    return { score, issues };
  },

  /**
   * Helper: Normalize education level to comparable scale
   */
  _normalizeEducationLevel(level) {
    if (!level) return 0;
    const normalized = level.toLowerCase();

    if (normalized.includes('bac') && !normalized.includes('+')) return 1;
    if (normalized.includes('bac+1') || normalized.includes('bac+2')) return 2;
    if (normalized.includes('bac+3') || normalized.includes('licence')) return 3;
    if (normalized.includes('master') || normalized.includes('bac+5')) return 4;
    if (normalized.includes('doctorat') || normalized.includes('phd')) return 5;

    return 1;
  },

  /**
   * Helper: Extract salary range from string
   */
  _extractSalaryRange(salaryStr) {
    if (!salaryStr) return null;

    const match = salaryStr.match(/(\d+)\s*(?:000)?\s*-\s*(\d+)\s*(?:000)?/);
    if (!match) return null;

    let min = parseInt(match[1]);
    let max = parseInt(match[2]);

    if (min < 100) min *= 1000;
    if (max < 100) max *= 1000;

    return [min / 1000, max / 1000];
  },

  /**
   * Get human-readable explanation of recommendations
   */
  getRecommendationRationale(axis, sector, mapping) {
    return {
      profileSummary: `Profil dominant: ${axis} (${this._getAxisLabel(axis)})`,
      sectorFocus: `Secteur exploré: ${sector}`,
      explanation: mapping.description || 'Recommandations adaptées à votre profil',
      jobPatterns: mapping.jobPatterns || [],
    };
  },

  /**
   * Helper: Get axis label
   */
  _getAxisLabel(axis) {
    const labels = {
      R: 'Réaliste',
      I: 'Investigateur',
      A: 'Artistique',
      S: 'Social',
      E: 'Entrepreneur',
      C: 'Conformiste',
    };
    return labels[axis] || 'Entrepreneur';
  },
};
