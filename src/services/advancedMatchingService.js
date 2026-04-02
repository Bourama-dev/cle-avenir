import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';
import { 
  calculateRiasecSimilarity, 
  calculateValueAlignment, 
  calculateSkillCompatibility, 
  calculateInterestAlignment,
  detectContradictions,
  detectRandomness,
  calculateConsistency,
  getProfileStrengths,
  getAreasForDevelopment,
  generateEducationRecommendations,
  getRelevantIndustryTrends,
  generateSalaryExpectations
} from '@/utils/matchingUtils';

export const advancedMatchingService = {
  
  calculateWeightedRiasecProfile(answers, questions) {
    const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    let totalWeight = 0;

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      // Determine weight based on question block
      let weight = 1.0;
      if (question.category.includes('Bloc 1')) weight = MATCHING_CONFIG.QUESTION_WEIGHTS.bloc1;
      else if (question.category.includes('Bloc 2')) weight = MATCHING_CONFIG.QUESTION_WEIGHTS.bloc2;
      else if (question.category.includes('Bloc 3')) weight = MATCHING_CONFIG.QUESTION_WEIGHTS.bloc3;
      else if (question.category.includes('Bloc 4')) weight = MATCHING_CONFIG.QUESTION_WEIGHTS.bloc4;

      const selectedOption = question.answers.find(a => a.id === answer.answerId);
      if (selectedOption && selectedOption.riasecWeights) {
        for (const [dim, val] of Object.entries(selectedOption.riasecWeights)) {
          if (rawScores[dim] !== undefined) {
            rawScores[dim] += val * weight;
            totalWeight += val * weight;
          }
        }
      }
    });

    const maxScore = Math.max(...Object.values(rawScores), 1);
    const normalizedProfile = {};
    for (const [key, value] of Object.entries(rawScores)) {
      normalizedProfile[key] = Math.round((value / maxScore) * 100);
    }

    return { rawScores, normalizedProfile, totalWeight };
  },

  analyzeResponsePatterns(answers) {
    const contradictions = detectContradictions(answers);
    const randomness = detectRandomness(answers);
    const consistency = calculateConsistency(answers);

    return { contradictions, randomness, consistency };
  },

  detectHybridProfile(normalizedProfile) {
    const sorted = Object.entries(normalizedProfile).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][1];
    const hybrids = sorted.filter(item => (top - item[1]) <= 15).map(item => item[0]);
    
    return {
      isHybrid: hybrids.length > 1,
      hybridTypes: hybrids
    };
  },

  calculateConfidenceScore(patterns) {
    // consistency (40%), contradictions (30%), randomness (30%)
    let score = (patterns.consistency * 0.4) 
              - (patterns.contradictions * 10) 
              - (patterns.randomness * 0.3) 
              + 60; // Base baseline
    
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  calculateAdvancedCompatibility(userProfile, metierData, userExtras = {}) {
    const riasecScore = calculateRiasecSimilarity(userProfile, metierData.riasec || metierData.riasec_profile);
    const valueScore = calculateValueAlignment(userExtras.values, metierData.values);
    const skillScore = calculateSkillCompatibility(userExtras.skills, metierData.required_skills);
    const interestScore = calculateInterestAlignment(userExtras.interests, metierData.domain);

    // Weights: RIASEC (50%), Values (20%), Skills (15%), Interests (15%)
    const finalScore = (riasecScore * 0.5) + (valueScore * 0.2) + (skillScore * 0.15) + (interestScore * 0.15);
    
    return Math.round(finalScore);
  },

  generateMultiLevelRecommendations(userProfile, allMetiers, userExtras = {}) {
    const scoredMetiers = allMetiers.map(metier => ({
      ...metier,
      compatibility: this.calculateAdvancedCompatibility(userProfile, metier, userExtras)
    })).sort((a, b) => b.compatibility - a.compatibility);

    return {
      perfectMatches: scoredMetiers.filter(m => m.compatibility >= 90).slice(0, 3),
      excellentMatches: scoredMetiers.filter(m => m.compatibility >= 80 && m.compatibility < 90).slice(0, 3),
      goodMatches: scoredMetiers.filter(m => m.compatibility >= 70 && m.compatibility < 80).slice(0, 3),
      alternativeMatches: scoredMetiers.filter(m => m.compatibility >= 60 && m.compatibility < 70).slice(0, 3),
      exploratoryMatches: scoredMetiers.filter(m => m.compatibility >= 50 && m.compatibility < 60).slice(0, 3)
    };
  },

  generateDetailedInsights(normalizedProfile) {
    const sorted = Object.entries(normalizedProfile).sort((a, b) => b[1] - a[1]);
    const topDims = sorted.slice(0, 3).map(i => i[0]);
    
    return {
      strengths: [...new Set([...getProfileStrengths(topDims[0]), ...getProfileStrengths(topDims[1])])].slice(0, 4),
      developments: getAreasForDevelopment(topDims[0]),
      formations: generateEducationRecommendations(topDims),
      trends: getRelevantIndustryTrends(topDims),
      salary: generateSalaryExpectations(topDims)
    };
  }
};