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
  return generateRiasecWeights(
    metier.riasecMajeur || metier.riasecmajeur,
    metier.riasecMineur || metier.riasecmineur
  );
};

export const calculateRIASECScore = (userProfile, metierRiasec) => {
  if (!userProfile || !metierRiasec) return 0;

  const DIMS = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dot = 0, normU = 0, normM = 0;

  for (const d of DIMS) {
    const u = Number(userProfile[d]) || 0;
    const m = Number(metierRiasec[d]) || 0;
    dot += u * m;
    normU += u * u;
    normM += m * m;
  }

  if (normU === 0 || normM === 0) return 0;
  const cosine = dot / (Math.sqrt(normU) * Math.sqrt(normM));

  // Bonus quand la dimension dominante de l'utilisateur correspond exactement au métier
  const userTopDim  = DIMS.reduce((best, d) => (userProfile[d]  || 0) > (userProfile[best]  || 0) ? d : best, DIMS[0]);
  const metierTopDim = DIMS.reduce((best, d) => (metierRiasec[d] || 0) > (metierRiasec[best] || 0) ? d : best, DIMS[0]);
  const dominantBonus = userTopDim === metierTopDim ? 0.06 : 0;

  return Math.round(Math.min(1, cosine + dominantBonus) * 100);
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

  const metierSet = new Set(metierHybrid);
  // Part de chevauchement : combien de dimensions top de l'utilisateur sont dans le profil métier
  const overlap = userTop2.filter(d => metierSet.has(d)).length;
  const overlapRatio = overlap / Math.max(metierHybrid.length, 1);

  // Bonus si la dimension primaire correspond exactement
  const primaryBonus = userTop2[0] === metierHybrid[0] ? 20 : 0;

  return Math.round(Math.min(100, overlapRatio * 80 + primaryBonus));
};

export const calculateStabilityScore = (growthTrend) => {
  // Measures how stable/predictable the job market is
  if (growthTrend === 'stable') return 85;
  if (growthTrend === 'croissant') return 70;
  if (growthTrend === 'décroissant') return 45;
  return 60;
};

export const calculateGrowthScore = (growthTrend) => {
  // Measures future opportunities and expansion
  if (growthTrend === 'croissant') return 90;
  if (growthTrend === 'stable') return 65;
  if (growthTrend === 'décroissant') return 25;
  return 50;
};

export const calculateDemandScore = (demandLevel) => {
  // Market demand affects career viability and job availability
  if (demandLevel === 'très_élevée') return 92;
  if (demandLevel === 'élevée') return 75;
  if (demandLevel === 'moyenne') return 55;
  if (demandLevel === 'faible') return 35;
  return 50;
};

export const calculateConfidence = (finalScore, profileClarity = 'modérée') => {
  // La clarté du profil pondère légèrement la confiance affichée
  const clarityBonus = profileClarity === 'élevée' ? 3 : profileClarity === 'diffuse' ? -3 : 0;
  const adjusted = finalScore + clarityBonus;

  if (adjusted >= 88) return { level: 'très_élevée', label: 'Très Élevée', color: 'bg-green-500' };
  if (adjusted >= 75) return { level: 'élevée',      label: 'Élevée',      color: 'bg-blue-500'  };
  if (adjusted >= 60) return { level: 'modérée',     label: 'Modérée',     color: 'bg-yellow-500'};
  if (adjusted >= 45) return { level: 'faible',      label: 'Faible',      color: 'bg-orange-500'};
  return                     { level: 'très_faible', label: 'Très Faible', color: 'bg-red-500'   };
};

export const getRecommendation = (finalScore) => {
  if (finalScore >= 85) return "🌟 Correspondance exceptionnelle ! Ce métier résonne parfaitement avec vos aspirations naturelles.";
  if (finalScore >= 75) return "✨ Très bon potentiel. Cette voie offre de belles opportunités d'épanouissement pour votre profil.";
  if (finalScore >= 60) return "👍 Piste intéressante à explorer, nécessitant peut-être quelques ajustements ou formations spécifiques.";
  return "🤔 Éloigné de vos affinités dominantes, mais peut constituer un défi motivant si vous êtes passionné(e).";
};

const RIASEC_VERB = {
  R: 'tes aptitudes manuelles et techniques',
  I: 'ta curiosité analytique',
  A: 'ta créativité',
  S: 'ton sens du contact humain',
  E: 'ton leadership',
  C: 'ta rigueur et ton sens de l\'organisation',
};

export const generateAdvice = (scores, userContext = {}) => {
  const { status, education, riasecTop, region } = userContext;
  const advices = [];

  // RIASEC fit
  if (scores.riasecScore >= 80) {
    const verb = riasecTop ? RIASEC_VERB[riasecTop] : 'tes traits de personnalité';
    advices.push(`💪 ${verb.charAt(0).toUpperCase() + verb.slice(1)} correspondent très bien à ce métier.`);
  } else if (scores.riasecScore >= 60) {
    advices.push("🤔 Tu as des points communs avec ce métier, mais quelques écarts existent à explorer.");
  }

  // Market signals
  if (scores.demandScore >= 80) {
    const regionHint = region ? ` en ${region}` : '';
    advices.push(`📈 Forte demande de recrutement${regionHint} — le marché est favorable.`);
  }
  if (scores.growthScore >= 80) advices.push("🌱 Secteur en croissance : les opportunités vont s'accélérer dans les prochaines années.");

  // Status-specific advice
  if (status === 'lyceen' && scores.finalScore >= 70)
    advices.push("🎓 Excellent choix d'orientation post-bac — explore les BTS, licences pro ou BUT liés.");
  if (status === 'reconversion' && scores.finalScore >= 65)
    advices.push("🔄 Accessible en reconversion via une formation courte ou un bilan de compétences CPF.");
  if (status === 'en_recherche' && scores.finalScore >= 70)
    advices.push("💼 Des offres existent dans ce secteur — commence par cibler les entreprises qui recrutent.");
  if (status === 'en_emploi' && scores.finalScore >= 70)
    advices.push("📊 Une évolution vers ce métier est envisageable avec une montée en compétences ciblée.");

  // Criteria mismatch note
  if (scores.criteriaNotes?.length > 0)
    advices.push(`⚠️ Point de vigilance : ${scores.criteriaNotes[0].toLowerCase()}`);

  if (advices.length === 0)
    advices.push("💡 Échange avec des professionnels de ce secteur pour valider ton intérêt avant de te lancer.");

  return advices;
};

export const generateNextSteps = (scores, userContext = {}) => {
  const { status, education, riasecTop, region } = userContext;
  const regionHint = region ? ` en ${region}` : '';
  const steps = [];

  if (scores.finalScore >= 85) {
    if (status === 'lyceen') {
      steps.push(`Recherche les formations post-bac menant à ce métier${regionHint}.`);
      steps.push("Inscris-toi sur Parcoursup ou candidature directe selon la filière.");
      steps.push("Cherche un stage ou une alternance pour confirmer ton choix.");
    } else if (status === 'reconversion') {
      steps.push("Identifie les formations certifiantes finançables par le CPF.");
      steps.push(`Contacte un conseiller en évolution professionnelle (CEP)${regionHint}.`);
      steps.push("Mets en avant tes compétences transférables dans ton CV.");
    } else if (status === 'en_recherche') {
      steps.push(`Consulte les offres d'emploi ciblées sur ce métier${regionHint}.`);
      steps.push("Actualise ton CV en valorisant les soft skills liés à ce profil.");
      steps.push("Prépare un pitch de 2 minutes sur ta motivation pour ce secteur.");
    } else {
      steps.push(`Consulter les offres de formation certifiantes${regionHint}.`);
      steps.push("Identifier les entreprises du secteur qui recrutent activement.");
      steps.push("Mettre à jour ton CV en valorisant tes compétences clés.");
    }
  } else if (scores.finalScore >= 70) {
    if (status === 'reconversion') {
      steps.push("Fais un bilan de compétences pour valider la faisabilité.");
      steps.push("Rencontre des professionnels du secteur (LinkedIn, forums métiers).");
      steps.push("Identifie les compétences manquantes et le plan de formation associé.");
    } else {
      steps.push("Réalise des enquêtes métiers (interviews de professionnels en poste).");
      steps.push("Cherche une immersion professionnelle (stage court, job shadowing).");
      steps.push("Identifie les compétences manquantes pour créer un plan de formation.");
    }
  } else {
    if (status === 'lyceen') {
      steps.push("Passe le test d'orientation de ton lycée pour affiner tes pistes.");
      steps.push("Explore les journées portes ouvertes des écoles de ce secteur.");
    } else {
      steps.push("Explore d'autres pistes professionnelles plus alignées avec ton profil.");
      steps.push("Discute avec un conseiller d'orientation pour affiner tes choix.");
      steps.push("Envisage un bilan de compétences complet pour clarifier ton projet.");
    }
  }

  return steps;
};

export const getPersonalizedRecommendations = (matchResult, userContext = {}) => {
  return {
    advice:    generateAdvice(matchResult, userContext),
    nextSteps: generateNextSteps(matchResult, userContext),
  };
};

/**
 * Normalise education level to a comparable integer (1–5).
 * Kept here to avoid circular imports with userProfileService.
 */
const _normalizeEducationLevel = (level) => {
  if (!level) return 0;
  const n = level.toLowerCase();
  if (n.includes('bac+5') || n.includes('master') || n.includes('ingénieur')) return 4;
  if (n.includes('bac+3') || n.includes('licence') || n.includes('bac+4')) return 3;
  if (n.includes('bac+2') || n.includes('bts') || n.includes('dut') || n.includes('bac+1')) return 2;
  if (n.includes('doctorat') || n.includes('phd')) return 5;
  if (n.includes('bac') || n.includes('cap') || n.includes('bep')) return 1;
  return 0;
};

/**
 * Applies user profile criteria (education, salary, status) as a score multiplier.
 * Returns a multiplier between 0.5 and 1.0 and an array of mismatch notes.
 */
const applyCriteriaMultiplier = (metier, userCriteria) => {
  if (!userCriteria || !userCriteria.found) return { multiplier: 1.0, notes: [] };

  let multiplier = 1.0;
  const notes = [];

  // --- Education level check ---
  const userEd  = _normalizeEducationLevel(userCriteria.education_level);
  const metierEd = _normalizeEducationLevel(metier.details?.niveau_etudes || metier.educationLevel);
  if (userEd > 0 && metierEd > 0 && userEd < metierEd) {
    const gap = metierEd - userEd;
    const penalty = gap >= 2 ? 0.65 : 0.82; // large gap = bigger penalty
    multiplier *= penalty;
    notes.push(`Niveau d'études insuffisant (tu as ${userCriteria.education_level}, requis ~Bac+${metierEd * 1.5 | 0})`);
  }

  // --- Salary range check ---
  if (userCriteria.salary_min && userCriteria.salary_max && metier.details?.salaryRange) {
    const match = metier.details.salaryRange.match(/(\d[\d\s]*)\s*[-–]\s*(\d[\d\s]*)/);
    if (match) {
      const mMin = parseInt(match[1].replace(/\s/g, '')) / 1000;
      const mMax = parseInt(match[2].replace(/\s/g, '')) / 1000;
      if (mMax < userCriteria.salary_min * 0.8) {
        multiplier *= 0.80;
        notes.push(`Salaire trop bas (max ~${mMax}k€ vs ton min ${userCriteria.salary_min}k€)`);
      }
    }
  }

  // --- Status-based accessibility ---
  if (userCriteria.current_status) {
    const status = userCriteria.current_status;
    if (status === 'lyceen' && metierEd >= 4) {
      multiplier *= 0.85; // long path ahead, but not impossible
      notes.push('Parcours long depuis le lycée');
    }
    if ((status === 'reconversion' || status === 'en_recherche') && metierEd > 0 && userEd > 0 && userEd >= metierEd) {
      multiplier = Math.min(1.05, multiplier * 1.05); // slight boost for reachable jobs
    }
  }

  return { multiplier: Math.max(0.50, Math.min(1.05, multiplier)), notes };
};

/**
 * Calculates advanced matching score between a user profile and a metier object.
 * @param {Object} userProfile - RIASEC scores { R, I, A, S, E, C }
 * @param {Object} metier      - Metier data from DB
 * @param {Object} [userCriteria] - Optional user profile criteria (education, salary, status)
 */
export const calculateAdvancedMatching = (userProfile, metier, userCriteria = null) => {
  if (!metier || !userProfile) return null;

  try {
    const metierRiasec = metier.riasec || extractMetierWeights(metier.rawMetier || metier);

    // Scores individuels (0-100)
    const riasecScore = calculateRIASECScore(userProfile, metierRiasec);

    const userHybrid = getHybridProfile(userProfile);
    const hybridScore = calculateHybridScore(userHybrid, metier.hybridProfile);

    const stabilityScore = calculateStabilityScore(metier.growthTrend);
    const growthScore    = calculateGrowthScore(metier.growthTrend);
    const demandScore    = calculateDemandScore(metier.demandLevel);

    // Poids dynamiques selon la clarté du profil utilisateur
    // Profil clair → RIASEC plus fiable → on lui donne plus de poids
    const sortedScores = Object.values(userProfile).sort((a, b) => b - a);
    const profileGap = (sortedScores[0] || 0) - (sortedScores[1] || 0);
    const profileClarity = profileGap >= 25 ? 'élevée' : profileGap >= 12 ? 'modérée' : 'diffuse';

    const riasecW  = profileGap >= 25 ? 0.60 : profileGap >= 12 ? 0.55 : 0.50;
    const hybridW  = 0.70 - riasecW; // complément pour que riasec + hybrid = 70 %
    const marketW  = 0.10;           // stabilité, croissance, demande = 30 %

    const baseScore = Math.round(
      (riasecScore  * riasecW) +
      (hybridScore  * hybridW) +
      (stabilityScore * marketW) +
      (growthScore    * marketW) +
      (demandScore    * marketW)
    );

    // Appliquer le multiplicateur profil utilisateur (éducation, salaire, statut)
    const { multiplier, notes: criteriaNotes } = applyCriteriaMultiplier(metier, userCriteria);
    const finalScore = Math.round(Math.min(100, baseScore * multiplier));

    const confidence   = calculateConfidence(finalScore, profileClarity);
    const recommendation = getRecommendation(finalScore);
    
    const baseResult = {
      metierCode: metier.code,
      name: metier.name,
      emoji: metier.emoji || '💼',
      sector: metier.sector || 'Général',
      finalScore,
      baseScore,
      criteriaMultiplier: multiplier,
      criteriaNotes,
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

    // Build user context for personalized advice and next steps
    const userContext = {
      status:    userCriteria?.current_status || null,
      education: userCriteria?.education_level || null,
      region:    userCriteria?.full_profile?.region || null,
      riasecTop: Object.entries(userProfile).sort(([, a], [, b]) => b - a)[0]?.[0] || null,
    };

    const { advice, nextSteps } = getPersonalizedRecommendations(baseResult, userContext);
    baseResult.advice = advice;
    baseResult.nextSteps = nextSteps;

    return baseResult;
  } catch (err) {
    console.error(`Error calculating match for metier ${metier?.code}:`, err);
    return null;
  }
};