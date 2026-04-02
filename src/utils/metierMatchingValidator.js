export const VALID_PROFILE_TYPES = [
  "Créatif & Innovant",
  "Analytique & Tech",
  "Social & Humain",
  "Leader & Business",
  "Pragmatique & Terrain",
  "Pragmatique & Polyvalent"
];

export const VALID_SECTORS = [
  "Design", "Arts", "Construction", "IT", "Santé", "Commerce", "Environnement", "Administration", "Éducation"
];

export const VALID_COMPETENCIES = [
  "Analyse", "Résolution de problèmes", "Adaptabilité", "Rigueur", "Autonomie", "Créativité", "Communication", "Leadership"
];

export const validateMatchingInputs = (profileType, sectors, competencies) => {
  const issues = [];
  
  if (!VALID_PROFILE_TYPES.includes(profileType)) {
    issues.push(`Unknown profile type: ${profileType}`);
  }
  
  sectors.forEach(s => {
    if (!VALID_SECTORS.some(vs => s.toLowerCase().includes(vs.toLowerCase()))) {
      issues.push(`Potentially invalid sector: ${s}`);
    }
  });

  competencies.forEach(c => {
    if (!VALID_COMPETENCIES.some(vc => c.toLowerCase().includes(vc.toLowerCase()))) {
      issues.push(`Potentially invalid competency: ${c}`);
    }
  });

  if (issues.length > 0) {
    console.warn("⚠️ Metier Matching Validation Warnings:", issues);
  }

  return issues.length === 0;
};

export const validateMatchingOutputs = (profileType, matchedMetiers) => {
  if (!matchedMetiers || matchedMetiers.length === 0) return false;

  // Strict check for "Créatif & Innovant"
  if (profileType === "Créatif & Innovant") {
    const invalidMatches = matchedMetiers.filter(m => {
      const desc = (m.description || "").toLowerCase();
      const lib = (m.libelle || "").toLowerCase();
      return lib.includes("logistique") || lib.includes("routier") || lib.includes("supply chain");
    });
    
    if (invalidMatches.length > 0) {
      console.error("❌ CRITICAL: Found completely unrelated metiers for Créatif profile:", invalidMatches);
      return false;
    }
  }

  return true;
};