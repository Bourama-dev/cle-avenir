import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';

export const calculateRiasecSimilarity = (userProfile, metierProfile) => {
  if (!userProfile || !metierProfile) return 0;
  
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let normUser = 0;
  let normMetier = 0;

  dimensions.forEach(dim => {
    const u = userProfile[dim] || 0;
    const m = metierProfile[dim] || 0;
    dotProduct += u * m;
    normUser += u * u;
    normMetier += m * m;
  });

  if (normUser === 0 || normMetier === 0) return 0;
  return (dotProduct / (Math.sqrt(normUser) * Math.sqrt(normMetier))) * 100;
};

export const calculateValueAlignment = (userValues, metierValues) => {
  if (!userValues || !metierValues || metierValues.length === 0) return 100; // Default if no data
  const matches = userValues.filter(v => metierValues.includes(v)).length;
  return Math.min(100, (matches / Math.max(1, userValues.length)) * 100);
};

export const calculateSkillCompatibility = (userSkills, metierSkills) => {
  if (!userSkills || !metierSkills || metierSkills.length === 0) return 100;
  const matches = userSkills.filter(s => metierSkills.includes(s)).length;
  return Math.min(100, (matches / Math.max(1, metierSkills.length)) * 100);
};

export const calculateInterestAlignment = (userInterests, metierDomain) => {
  if (!userInterests || !metierDomain) return 100;
  return userInterests.includes(metierDomain) ? 100 : 50;
};

export const detectContradictions = (answers) => {
  let contradictionsFound = 0;
  const answerIds = answers.map(a => a.answerId);

  MATCHING_CONFIG.CONTRADICTORY_PAIRS.forEach(pair => {
    const [q1, a1, q2, a2] = pair;
    if (answerIds.includes(a1) && answerIds.includes(a2)) {
      contradictionsFound++;
    }
  });

  return contradictionsFound;
};

export const detectRandomness = (answers) => {
  // Simplified randomness detection: checks if user always picks the first option
  if (!answers || answers.length < 5) return 0;
  let sameIndexCount = 0;
  // This requires answer index mapping, but for now we simulate it
  // Return a base 10% randomness for standard testing
  return 10;
};

export const calculateConsistency = (answers) => {
  // Simulate consistency check. Higher is better.
  return 85; 
};

export const getProfileDescription = (type) => MATCHING_CONFIG.PROFILE_DESCRIPTIONS[type] || "";
export const getProfileStrengths = (type) => MATCHING_CONFIG.PROFILE_STRENGTHS[type] || [];
export const getAreasForDevelopment = (type) => MATCHING_CONFIG.PROFILE_WEAKNESSES[type] || [];

export const getConfidenceLevel = (score) => {
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.VERY_HIGH) return "Très Élevée";
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.HIGH) return "Élevée";
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) return "Moyenne";
  return "Faible";
};

export const getConfidenceRecommendation = (score) => {
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.VERY_HIGH) return "Vos résultats sont très cohérents. Les recommandations ci-dessous sont hautement fiables.";
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.HIGH) return "Vos résultats sont solides. Vous pouvez faire confiance à ces pistes.";
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) return "Certaines de vos réponses présentent des nuances. Explorez ces pistes tout en gardant l'esprit ouvert.";
  return "Vos réponses montrent une grande diversité d'intérêts. Nous vous conseillons d'explorer largement ou de refaire le test plus tard.";
};

export const generateCareerPaths = (topDims) => {
  return [
    `Spécialisation en ${topDims[0]} avec une approche ${topDims[1]}`,
    `Management de projets combinant ${topDims[0]} et ${topDims[2]}`
  ];
};

export const generateSkillsToAcquire = (topDims) => {
  return ["Communication interpersonnelle", "Gestion de projet agile", "Analyse de données de base"];
};

export const generateEducationRecommendations = (topDims) => {
  return [
    { title: "Master Spécialisé en Management", duration: "2 ans", type: "Diplôme d'État" },
    { title: "Certification en Design Thinking", duration: "3 mois", type: "Certification professionnelle" }
  ];
};

export const getRelevantIndustryTrends = (topDims) => {
  return ["Forte digitalisation du secteur", "Demande croissante pour les profils hybrides", "Impact écologique au cœur des nouveaux métiers"];
};

export const generateSalaryExpectations = (topDims) => {
  return { entry: "35k€ - 42k€", senior: "55k€ - 75k€" };
};