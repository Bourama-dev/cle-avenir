export const generateRiasecWeights = (majeur, mineur) => {
  const weights = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  if (majeur) {
    for (const char of majeur.toUpperCase()) {
      if (weights.hasOwnProperty(char)) weights[char] = 30;
    }
  }
  
  if (mineur) {
    for (const char of mineur.toUpperCase()) {
      if (weights.hasOwnProperty(char) && weights[char] === 0) {
        weights[char] = 20;
      }
    }
  }
  
  return weights;
};

export const extractMetierWeights = (metier) => {
  if (metier.adjusted_weights && Object.keys(metier.adjusted_weights).length > 0) {
    return metier.adjusted_weights;
  }
  if (metier.riasec_vector && Object.keys(metier.riasec_vector).length > 0) {
    return metier.riasec_vector;
  }
  return generateRiasecWeights(metier.riasecMajeur, metier.riasecMineur);
};

export const calculateRIASECScore = (userProfile, metierRiasec) => {
  if (!userProfile || !metierRiasec) return 0;
  
  let score = 0;
  let maxPossible = 0;
  
  for (const [dim, weight] of Object.entries(metierRiasec)) {
    const w = Number(weight) || 0;
    const userVal = Number(userProfile[dim.toUpperCase()]) || 0;
    
    score += (userVal / 100) * w;
    maxPossible += w;
  }
  
  return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
};

export const getHybridProfile = (userProfile) => {
  if (!userProfile) return [];
  return Object.entries(userProfile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0]);
};

export const calculateHybridScore = (userTop2, metierHybrid) => {
  if (!metierHybrid || metierHybrid.length === 0) return 50; 
  let matchCount = 0;
  
  if (metierHybrid[0] && userTop2.includes(metierHybrid[0])) matchCount += 1.5;
  if (metierHybrid[1] && userTop2.includes(metierHybrid[1])) matchCount += 1.0;
  
  return Math.min(100, Math.round((matchCount / 2.5) * 100));
};

export const calculateStabilityScore = (growthTrend) => {
  if (growthTrend === 'stable') return 80;
  if (growthTrend === 'croissant') return 90;
  if (growthTrend === 'décroissant') return 40;
  return 60;
};

export const calculateGrowthScore = (growthTrend) => {
  if (growthTrend === 'croissant') return 95;
  if (growthTrend === 'stable') return 60;
  if (growthTrend === 'décroissant') return 20;
  return 50;
};

export const calculateDemandScore = (demandLevel) => {
  if (demandLevel === 'très_élevée') return 95;
  if (demandLevel === 'élevée') return 80;
  if (demandLevel === 'moyenne') return 60;
  if (demandLevel === 'faible') return 30;
  return 50;
};

export const calculateConfidence = (finalScore) => {
  if (finalScore >= 85) return { level: 'très_élevée', label: 'Très Élevée', color: 'bg-green-500' };
  if (finalScore >= 75) return { level: 'élevée', label: 'Élevée', color: 'bg-blue-500' };
  if (finalScore >= 60) return { level: 'modérée', label: 'Modérée', color: 'bg-yellow-500' };
  if (finalScore >= 45) return { level: 'faible', label: 'Faible', color: 'bg-orange-500' };
  return { level: 'très_faible', label: 'Très Faible', color: 'bg-red-500' };
};

export const getRecommendation = (finalScore) => {
  if (finalScore >= 85) return "🌟 Correspondance exceptionnelle ! Ce métier résonne parfaitement avec vos aspirations naturelles.";
  if (finalScore >= 75) return "✨ Très bon potentiel. Cette voie offre de belles opportunités d'épanouissement pour votre profil.";
  if (finalScore >= 60) return "👍 Piste intéressante à explorer, nécessitant peut-être quelques ajustements ou formations spécifiques.";
  return "🤔 Éloigné de vos affinités dominantes, mais peut constituer un défi motivant si vous êtes passionné(e).";
};

export const generateAdvice = (scores) => {
  const advices = [];
  if (scores.riasecScore >= 80) advices.push("💪 Vos traits de personnalité correspondent très bien à ce métier.");
  else if (scores.riasecScore >= 60) advices.push("🤔 Votre personnalité a des points communs avec ce métier, mais quelques écarts existent.");
  
  if (scores.hybridScore >= 80) advices.push("🧬 Votre combinaison unique de talents correspond parfaitement.");
  if (scores.demandScore >= 80) advices.push("📈 Le marché est très porteur : vos compétences seront très recherchées !");
  if (scores.growthScore >= 80) advices.push("🌱 Ce secteur est en pleine mutation, restez curieux(se) et formez-vous en continu.");
  
  if (advices.length === 0) advices.push("💡 Prenez le temps d'échanger avec des professionnels de ce secteur pour valider votre intérêt.");
  return advices;
};

export const generateNextSteps = (scores) => {
  const steps = [];
  if (scores.finalScore >= 85) {
    steps.push("Consulter les offres de formation certifiantes dans votre région.");
    steps.push("Identifier les entreprises qui recrutent massivement.");
    steps.push("Mettre à jour votre CV en valorisant vos soft skills clés.");
  } else if (scores.finalScore >= 70) {
    steps.push("Réaliser des enquêtes métiers (interviews de professionnels).");
    steps.push("Chercher une immersion professionnelle (stage court).");
    steps.push("Identifier les compétences manquantes pour créer un plan de formation.");
  } else {
    steps.push("Explorer d'autres pistes professionnelles plus alignées avec votre profil.");
    steps.push("Discuter avec un conseiller d'orientation pour affiner vos choix.");
    steps.push("Faire un bilan de compétences complet.");
  }
  return steps;
};

export const getPersonalizedRecommendations = (matchResult) => {
  return {
    advice: generateAdvice(matchResult),
    nextSteps: generateNextSteps(matchResult)
  };
};

/**
 * Calculates advanced matching score between a user profile and a metier object
 */
export const calculateAdvancedMatching = (userProfile, metier) => {
  if (!metier || !userProfile) return null;

  try {
    const metierRiasec = metier.riasec || extractMetierWeights(metier.rawMetier || metier);
    
    // Calculate individual component scores (0-100)
    const riasecScore = calculateRIASECScore(userProfile, metierRiasec);
    
    const userHybrid = getHybridProfile(userProfile);
    const hybridScore = calculateHybridScore(userHybrid, metier.hybridProfile);
    
    const stabilityScore = calculateStabilityScore(metier.growthTrend);
    const growthScore = calculateGrowthScore(metier.growthTrend);
    const demandScore = calculateDemandScore(metier.demandLevel);

    // Apply weightings: RIASEC(50%), Hybrid(20%), Stability(10%), Growth(10%), Demand(10%)
    const finalScore = Math.round(
      (riasecScore * 0.50) +
      (hybridScore * 0.20) +
      (stabilityScore * 0.10) +
      (growthScore * 0.10) +
      (demandScore * 0.10)
    );

    const confidence = calculateConfidence(finalScore);
    const recommendation = getRecommendation(finalScore);
    
    const baseResult = {
      metierCode: metier.code,
      name: metier.name,
      emoji: metier.emoji || '💼',
      sector: metier.sector || 'Général',
      finalScore,
      riasecScore,
      hybridScore,
      stabilityScore,
      growthScore,
      demandScore,
      confidence,
      recommendation,
      details: {
        salaryRange: metier.salaryRange,
        demandLevel: metier.demandLevel,
        growthTrend: metier.growthTrend,
        hybridProfileStr: (metier.hybridProfile || []).join(" / "),
        niveau_etudes: metier.educationLevel,
        debouches: metier.rawMetier?.debouches || "Non renseigné",
        riasecMajeur: metier.rawMetier?.riasecMajeur,
        riasecMineur: metier.rawMetier?.riasecMineur
      },
      rawMetier: metier.rawMetier
    };

    const { advice, nextSteps } = getPersonalizedRecommendations(baseResult);
    baseResult.advice = advice;
    baseResult.nextSteps = nextSteps;

    return baseResult;
  } catch (err) {
    console.error(`Error calculating match for metier ${metier?.code}:`, err);
    return null;
  }
};