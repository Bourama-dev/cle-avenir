import { supabase } from '@/lib/customSupabaseClient';
import { ANSWER_WEIGHTS, METIER_CRITERIA } from '@/data/matchingConfig';

export const getMatchingExplanation = (metierCode, score) => {
  if (score > 80) return "Excellent match based on your primary interests and values.";
  if (score > 60) return "Good match aligning with your skills and preferred environment.";
  if (score > 40) return "Moderate match that satisfies some of your criteria.";
  return "Could be interesting, but missing some key alignments.";
};

export const calculateMetierScore = (metierCode, userAnswers) => {
  let score = 0;
  let maxPossible = 0;
  let userTraits = {};

  // Aggregate user traits
  userAnswers.forEach(ans => {
    const weights = ANSWER_WEIGHTS[ans.answerId] || {};
    Object.entries(weights).forEach(([trait, val]) => {
      userTraits[trait] = (userTraits[trait] || 0) + val;
    });
  });

  const criteria = METIER_CRITERIA[metierCode];
  if (!criteria) {
    // Fallback simple scoring
    const traitsSum = Object.values(userTraits).reduce((a, b) => a + b, 0);
    return traitsSum > 0 ? Math.min(100, Math.floor(traitsSum / 10)) : 25;
  }

  // Score based on required traits
  criteria.required.forEach(req => {
    maxPossible += 100;
    if (userTraits[req]) {
      score += Math.min(100, userTraits[req]);
    }
  });

  return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 50;
};

export const matchMetiersToAnswers = async (userAnswers) => {
  if (!userAnswers || userAnswers.length === 0) return [];

  const { data: metiers, error } = await supabase
    .from('rome_metiers')
    .select('code, libelle, description');

  if (error || !metiers) {
    console.error("Error fetching metiers for matching:", error);
    return [];
  }

  const scored = metiers.map(m => {
    const score = calculateMetierScore(m.code, userAnswers);
    return {
      metierCode: m.code,
      libelle: m.libelle,
      description: m.description,
      score,
      matchReasons: [getMatchingExplanation(m.code, score)]
    };
  });

  return scored
    .filter(m => m.score >= 20)
    .sort((a, b) => b.score - a.score);
};