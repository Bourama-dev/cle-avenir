// This file acts as our "Intelligence Layer" mapping user preferences to ROME data
// and providing enriched metadata like salaries, market trends, and realistic RIASEC overrides.

export const ROME_DOMAINS = {
  technology: {
    id: 'tech',
    label: "Technologie & Digital",
    codes: ["M1801", "M1805", "M1802", "M1806", "E1104", "E1205"], 
    keywords: ["informatique", "ordinateur", "web", "code", "digital", "data", "logiciel", "tech"],
    salary_range: "35k€ - 70k€",
    trend: "high"
  },
  health: {
    id: 'health',
    label: "Santé & Soin",
    codes: ["J1102", "J1506", "J1301", "K1304", "J1505", "K1903", "K1901"], 
    keywords: ["soin", "médical", "hôpital", "patient", "santé", "aide", "juridique", "droit"],
    salary_range: "25k€ - 90k€",
    trend: "very_high"
  },
  business: {
    id: 'business',
    label: "Commerce & Gestion",
    codes: ["D1401", "M1707", "D1301", "M1205", "M1604", "M1203", "G1603"], 
    keywords: ["vente", "commerce", "gestion", "management", "stratégie", "marketing", "comptabilité", "business"],
    salary_range: "30k€ - 80k€",
    trend: "stable"
  },
  arts: {
    id: 'arts',
    label: "Arts & Création",
    codes: ["E1104", "E1205", "L1304", "B1101", "L1503"], 
    keywords: ["art", "design", "création", "graphisme", "musique", "culture", "creative"],
    salary_range: "22k€ - 55k€",
    trend: "medium"
  },
  construction: {
    id: 'construction',
    label: "Construction & BTP",
    codes: ["F1106", "F1601", "F1201", "F1103"], 
    keywords: ["bâtiment", "construction", "chantier", "architecture", "travaux", "manual"],
    salary_range: "25k€ - 60k€",
    trend: "high"
  },
  service: {
    id: 'service',
    label: "Service & Social",
    codes: ["K1303", "G1202", "K1201"],
    keywords: ["service", "social", "aide", "personne", "accompagnement"],
    salary_range: "22k€ - 40k€",
    trend: "stable"
  }
};

// Enriched metadata for key métiers with realistic, differentiated RIASEC profiles
export const METIER_ENRICHED_DATA = {
  "G1603": {
    libelle: "Manager en restauration rapide",
    description: "Coordonne et supervise l'activité d'un restaurant à service rapide, gère les équipes et veille à la satisfaction client.",
    salary: "24k€ - 38k€",
    salaryMin: 24000,
    salaryMax: 38000,
    demand: "Très Forte",
    difficulty: "Bac à Bac+2",
    progression: "Manager -> Directeur de restaurant",
    access: "Promotion interne fréquente",
    tags: ["management", "food", "social", "action", "commerce"],
    domain: "Commerce & Gestion",
    matchKeywords: ["restaurant", "fast-food", "manager", "équipe", "restauration"],
    riasec: { R: 80, I: 40, A: 60, S: 70, E: 80, C: 60 }
  },
  "M1805": { 
    libelle: "Développeur Informatique",
    description: "Conçoit et programme des applications, sites web ou logiciels selon les besoins des utilisateurs.",
    salary: "35k€ - 65k€",
    salaryMin: 35000,
    salaryMax: 65000,
    demand: "Très Élevée",
    difficulty: "Bac+3 à Bac+5",
    progression: "Développeur → Lead Tech → CTO",
    access: "Formation continue, Bootcamp, École d'ingénieur",
    tags: ["tech", "code", "logic", "digital", "intellectual"], 
    domain: "Technologie",
    matchKeywords: ["développement", "code", "informatique", "web"],
    riasec: { R: 20, I: 90, A: 60, S: 30, E: 50, C: 80 }
  },
  "M1801": { 
    libelle: "Administrateur Systèmes et Réseaux",
    description: "Gère et maintient l'infrastructure informatique et les réseaux de l'entreprise pour garantir leur bon fonctionnement.",
    salary: "30k€ - 55k€",
    salaryMin: 30000,
    salaryMax: 55000,
    demand: "Élevée",
    difficulty: "Bac+2 à Bac+5",
    progression: "Admin → Architecte Cloud → DSI",
    access: "BTS SIO, Licence Pro, Master",
    tags: ["tech", "logic", "infrastructure", "admin"],
    domain: "Technologie",
    matchKeywords: ["réseau", "système", "serveur", "infrastructure"],
    riasec: { R: 40, I: 80, A: 20, S: 30, E: 40, C: 90 }
  },
  "K1903": {
    libelle: "Avocat / Conseil Juridique",
    description: "Conseille et défend des particuliers ou des entreprises lors de procédures judiciaires.",
    salary: "35k€ - 120k€",
    salaryMin: 35000,
    salaryMax: 120000,
    demand: "Forte",
    difficulty: "Bac+5 (Master Droit + CAPA)",
    progression: "Avocat associé → Bâtonnier",
    access: "École d'avocats, Université",
    tags: ["law", "intellectual", "communication", "social"],
    domain: "Droit",
    matchKeywords: ["avocat", "droit", "juriste", "conseil"],
    riasec: { R: 10, I: 70, A: 40, S: 80, E: 90, C: 70 }
  },
  "M1203": {
    libelle: "Comptable / Expert Comptable",
    description: "Enregistre et centralise les données commerciales, industrielles ou financières.",
    salary: "28k€ - 50k€",
    salaryMin: 28000,
    salaryMax: 50000,
    demand: "Très Forte",
    difficulty: "Bac+2 à Bac+5",
    progression: "Comptable → Chef Comptable → Expert Comptable",
    access: "BTS CG, DCG, DSCG",
    tags: ["finance", "analysis", "organization", "bureau", "logic"],
    domain: "Gestion",
    matchKeywords: ["comptable", "finance", "gestion"],
    riasec: { R: 10, I: 60, A: 10, S: 30, E: 70, C: 95 }
  },
  "E1104": { 
    libelle: "Designer Web / UI Designer",
    description: "Imagine et réalise l'identité visuelle de sites internet et d'interfaces digitales.",
    salary: "28k€ - 50k€",
    salaryMin: 28000,
    salaryMax: 50000,
    demand: "Moyenne",
    difficulty: "Bac+3",
    progression: "Designer → Directeur Artistique → Creative Director",
    access: "École d'art, Formation spécialisée",
    tags: ["creative", "digital", "tech", "visual", "art"],
    domain: "Arts & Création",
    matchKeywords: ["design", "web", "création", "graphisme", "interface"],
    riasec: { R: 20, I: 50, A: 90, S: 40, E: 60, C: 40 }
  },
  "D1401": { 
    libelle: "Commercial / Attaché Commercial",
    description: "Développe le chiffre d'affaires en proposant des produits ou services à des clients ou prospects.",
    salary: "25k€ - 60k€",
    salaryMin: 25000,
    salaryMax: 60000,
    demand: "Très Élevée",
    difficulty: "Bac+2",
    progression: "Commercial → Chef des Ventes → Directeur Commercial",
    access: "BTS NDRC, École de commerce",
    tags: ["business", "social", "communication", "money", "action"],
    domain: "Commerce",
    matchKeywords: ["vente", "négociation", "client", "business"],
    riasec: { R: 30, I: 40, A: 30, S: 70, E: 95, C: 50 }
  },
  "J1506": { 
    libelle: "Infirmier en Soins Généraux",
    description: "Dispense des soins de nature préventive, curative ou palliative pour promouvoir la santé des patients.",
    salary: "25k€ - 45k€",
    salaryMin: 25000,
    salaryMax: 45000,
    demand: "Critique",
    difficulty: "Bac+3 (DE)",
    progression: "Infirmier → Cadre de santé → Directeur de soins",
    access: "IFSI",
    tags: ["health", "medical", "social", "empathie", "care"],
    domain: "Santé & Soin",
    matchKeywords: ["soin", "santé", "patient", "hôpital", "infirmier"],
    riasec: { R: 70, I: 60, A: 20, S: 95, E: 40, C: 60 }
  },
  "F1601": {
    libelle: "Maçon / Chef de chantier",
    description: "Réalise le gros œuvre des bâtiments et gère l'avancement des constructions sur le terrain.",
    salary: "22k€ - 40k€",
    salaryMin: 22000,
    salaryMax: 40000,
    demand: "Forte",
    difficulty: "CAP/BEP à Bac pro",
    progression: "Ouvrier → Chef d'équipe → Chef de chantier",
    access: "Apprentissage, Lycée professionnel",
    tags: ["manual", "construction", "outdoor", "physical", "action"],
    domain: "Construction",
    matchKeywords: ["bâtiment", "maçon", "chantier", "travaux"],
    riasec: { R: 95, I: 40, A: 30, S: 30, E: 60, C: 50 }
  },
  "K1201": {
    libelle: "Éducateur Spécialisé",
    description: "Accompagne des enfants ou des adultes en difficulté pour faciliter leur insertion sociale et leur autonomie.",
    salary: "22k€ - 35k€",
    salaryMin: 22000,
    salaryMax: 35000,
    demand: "Forte",
    difficulty: "Bac+3 (DEES)",
    progression: "Éducateur → Chef de service éducatif",
    access: "IRTS, Écoles spécialisées",
    tags: ["social", "education", "empathie", "human"],
    domain: "Service & Social",
    matchKeywords: ["éducateur", "social", "enfant", "accompagnement"],
    riasec: { R: 40, I: 50, A: 50, S: 95, E: 60, C: 30 }
  },
  "DEFAULT": {
    libelle: "Professionnel du secteur",
    description: "Découvrez ce métier passionnant et ses opportunités de carrière.",
    salary: "Selon expérience",
    salaryMin: 20000,
    salaryMax: 40000,
    demand: "Stable",
    difficulty: "Variable",
    progression: "Évolution vers des postes de management ou d'expertise",
    access: "Voir fiche détaillée",
    tags: [],
    domain: "Général",
    matchKeywords: [],
    riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 }
  }
};

const matchesKeywords = (userText, keywords) => {
  if (!userText || !keywords) return false;
  const normalizedText = userText.toLowerCase();
  return keywords.some(kw => normalizedText.includes(kw.toLowerCase()));
};

export const calculateMatches = (profile = {}) => {
  const safeProfile = profile || {};
  const scores = {};
  const reasons = {};

  if (safeProfile.interests && Array.isArray(safeProfile.interests)) {
    safeProfile.interests.forEach(interest => {
      const domain = Object.values(ROME_DOMAINS).find(d => d.id === interest || d.label === interest);
      if (domain) {
        domain.codes.forEach(code => {
          scores[code] = (scores[code] || 0) + 15;
          reasons[code] = reasons[code] || "Correspond à vos centres d'intérêt";
        });
      }
    });
  }

  if (safeProfile.skills && Array.isArray(safeProfile.skills)) {
    safeProfile.skills.forEach(skill => {
      Object.entries(METIER_ENRICHED_DATA).forEach(([code, data]) => {
         if (code === 'DEFAULT') return;
         if (matchesKeywords(skill, data.matchKeywords)) {
            scores[code] = (scores[code] || 0) + 10;
            if (!reasons[code]) reasons[code] = `Correspond à la compétence "${skill}"`;
         }
      });
    });
  }

  let results = Object.entries(scores)
    .map(([code, score]) => ({ code, score }))
    .filter(item => item.score > 0);

  if (results.length === 0) {
      return [];
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 10).map(item => {
      const enriched = METIER_ENRICHED_DATA[item.code] || { ...METIER_ENRICHED_DATA.DEFAULT, code: item.code };
      return {
          ...item,
          ...enriched,
          matchReason: reasons[item.code] || "Profil compatible",
          relevance: item.score > 20 ? 100 : Math.min(Math.round((item.score / 20) * 100), 95)
      };
  });
};