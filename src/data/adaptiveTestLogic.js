import { METIER_ENRICHED_DATA } from './romeMapping';

/* 
  ADAPTIVE TEST ENGINE - V2.1 (Anti-Bias Fix)
  
  Updates:
  - Robust anti-bias for "Développeur" role.
  - Debug logging for scoring transparency.
  - Strict tag matching.
*/

// --- DIMENSIONS ---
// manual, intellectual, creative, social, outdoor, tech, business, medical, service, precision, leadership, risk, empathy

const INITIAL_QUESTIONS = [
  {
    id: 'q1_activity_nature',
    text: "Si vous deviez choisir une activité principale pour vos journées, ce serait quoi ?",
    type: 'choice',
    options: [
      { id: 'build', label: 'Construire ou réparer des choses de mes mains', tags: { manual: 3, precision: 1, construction: 2 } },
      { id: 'think', label: 'Résoudre des problèmes intellectuels complexes', tags: { intellectual: 3, logic: 2, bureau: 1 } },
      { id: 'create', label: 'Imaginer et créer des visuels ou des objets', tags: { creative: 3, arts: 2 } },
      { id: 'care', label: 'Prendre soin des autres ou les soigner', tags: { medical: 3, empathy: 2, social: 1 } },
      { id: 'organize', label: 'Organiser, gérer et structurer des projets', tags: { business: 2, organization: 2, leadership: 1 } },
      { id: 'convince', label: 'Négocier, vendre et convaincre', tags: { business: 3, social: 2, money: 1 } },
      { id: 'nature', label: 'Travailler dehors au contact de la nature', tags: { outdoor: 3, nature: 2, physical: 1 } },
      { id: 'teach', label: 'Transmettre, expliquer et enseigner', tags: { education: 3, social: 2, communication: 1 } }
    ]
  },
  {
    id: 'q2_work_environment',
    text: "Dans quel environnement vous sentez-vous le plus à l'aise ?",
    type: 'choice',
    options: [
      { id: 'office_calm', label: 'Un bureau calme et ordonné', tags: { bureau: 2, organization: 1, calm: 1 } },
      { id: 'workshop', label: 'Un atelier avec des outils et des machines', tags: { manual: 2, atelier: 2, technique: 1 } },
      { id: 'hospital', label: 'Un environnement médical ou de soin', tags: { medical: 3, hospital: 2, health: 1 } },
      { id: 'outdoors', label: 'En plein air, peu importe la météo', tags: { outdoor: 3, nature: 1, physical: 2 } },
      { id: 'busy_place', label: 'Un lieu animé avec du public (magasin, hôtel)', tags: { social: 2, service: 2, dynamic: 1 } },
      { id: 'lab', label: 'Un laboratoire ou un centre de recherche', tags: { science: 3, intellectual: 2, precision: 1 } },
      { id: 'remote', label: 'N\'importe où, tant que j\'ai mon ordinateur', tags: { digital: 2, tech: 1, independence: 1 } },
      { id: 'on_road', label: 'Sur la route, toujours en mouvement', tags: { transport: 3, independence: 2, dynamic: 1 } }
    ]
  }
];

// Branching Logic for Phase 2
const SECTOR_SPECIFIC_QUESTIONS = {
  // If MANUAL / OUTDOOR / INDUSTRY dominant
  'manual_branch': [
    {
      id: 'q3_manual_precision',
      text: "Quel type d'effort physique préférez-vous ?",
      type: 'choice',
      options: [
        { id: 'strength', label: 'L\'effort brut (porter, construire, gros œuvre)', tags: { construction: 3, physical: 2 } },
        { id: 'dexterity', label: 'La précision fine (assemblage, artisanat, réparation)', tags: { precision: 3, artisanat: 2, technique: 1 } },
        { id: 'nature_care', label: 'S\'occuper de plantes ou d\'animaux', tags: { agriculture: 3, nature: 2 } },
        { id: 'machines', label: 'Piloter ou réparer des machines complexes', tags: { industry: 3, technique: 2, mechanic: 2 } },
        { id: 'food', label: 'Transformer des ingrédients (cuisine, boulangerie)', tags: { hospitality: 2, food: 3, manual: 1 } },
        { id: 'clean', label: 'Assurer la propreté et l\'entretien technique', tags: { service: 2, maintenance: 2 } }
      ]
    }
  ],
  // If INTELLECTUAL / TECH / BUSINESS dominant
  'intellectual_branch': [
    {
      id: 'q3_intellectual_focus',
      text: "Sur quel type de sujet aimez-vous réfléchir ?",
      type: 'choice',
      options: [
        { id: 'code_systems', label: 'Les systèmes logiques et le code informatique', tags: { tech: 3, code: 3, logic: 2 } },
        { id: 'finance_data', label: 'Les chiffres, la rentabilité et les données', tags: { finance: 3, math: 2, analysis: 2 } },
        { id: 'strategy_ppl', label: 'La stratégie d\'entreprise et le management', tags: { business: 3, leadership: 2, strategy: 1 } },
        { id: 'legal_rules', label: 'Les règles, le droit et les procédures', tags: { law: 3, admin: 2, rigor: 2 } },
        { id: 'science_research', label: 'La science, la biologie ou la physique', tags: { science: 3, research: 2 } },
        { id: 'communication', label: 'Les mots, les messages et l\'image de marque', tags: { communication: 3, marketing: 2, creative: 1 } }
      ]
    }
  ],
  // If SOCIAL / MEDICAL / SERVICE dominant
  'social_branch': [
    {
      id: 'q3_social_type',
      text: "Quelle relation préférez-vous avoir avec les autres ?",
      type: 'choice',
      options: [
        { id: 'heal_save', label: 'Soigner, sauver, urgence vitale', tags: { medical: 3, hospital: 2, action: 1 } },
        { id: 'listen_support', label: 'Écouter, conseiller, accompagner sur le long terme', tags: { psychology: 3, social: 2, empathy: 2 } },
        { id: 'teach_grow', label: 'Faire grandir, enseigner, former', tags: { education: 3, pedagogy: 2 } },
        { id: 'serve_please', label: 'Faire plaisir, servir, accueillir', tags: { hospitality: 3, service: 2, contact: 1 } },
        { id: 'protect', label: 'Protéger, faire respecter l\'ordre', tags: { security: 3, authority: 2 } },
        { id: 'sell_persuade', label: 'Convaincre, vendre, négocier', tags: { commerce: 3, business: 1 } }
      ]
    }
  ],
  // If CREATIVE / ARTS dominant
  'creative_branch': [
    {
      id: 'q3_creative_medium',
      text: "Quel est votre outil de création favori ?",
      type: 'choice',
      options: [
        { id: 'digital_screen', label: 'L\'ordinateur (Design web, 3D, Vidéo)', tags: { digital: 3, tech: 1, arts: 1 } },
        { id: 'hands_material', label: 'La matière (Bois, Pierre, Tissu, Cuisine)', tags: { artisanat: 3, manual: 2, material: 1 } },
        { id: 'paper_words', label: 'Les mots et l\'écriture', tags: { writing: 3, communication: 2 } },
        { id: 'body_voice', label: 'Mon corps ou ma voix (Spectacle, Animation)', tags: { spectacle: 3, oral: 2 } },
        { id: 'space', label: 'L\'espace et l\'architecture', tags: { architecture: 3, visual: 2 } },
        { id: 'ideas', label: 'Les concepts et les idées pures', tags: { strategy: 2, conceptual: 2 } }
      ]
    }
  ]
};

const FINAL_CALIBRATION = [
  {
    id: 'q4_work_style',
    text: "Face à un problème complexe, que faites-vous ? (Méthode naturelle)",
    type: 'choice',
    options: [
      { id: 'plan', label: 'Je vérifie les règles et les précédents', tags: { organization: 2, rigor: 2, admin: 1 } },
      { id: 'adapt', label: 'Je m\'adapte calmement, je trouve une solution', tags: { logic: 1, autonomy: 1 } },
      { id: 'action', label: 'Je teste directement quelque chose (Action !)', tags: { action: 2, emergency: 2, dynamic: 1 } },
      { id: 'collaborate', label: 'Je demande l\'avis des autres et je communique', tags: { teamwork: 2, social: 1 } },
      { id: 'innovate', label: 'J\'imagine une solution originale et visuelle', tags: { creative: 2, innovation: 1 } },
      { id: 'analyze', label: 'J\'analyse les données et les chiffres', tags: { analysis: 2, quality: 1, logic: 1 } }
    ]
  },
  {
    id: 'q5_motivation',
    text: "Qu'est-ce qui vous rendrait le plus fier(e) à la fin de votre carrière ?",
    type: 'choice',
    options: [
      { id: 'useful', label: 'Avoir été utile aux autres, avoir aidé', tags: { social: 3, medical: 2, education: 2 } },
      { id: 'expert', label: 'Être reconnu comme un expert technique incontournable', tags: { technique: 2, intellectual: 2 } },
      { id: 'rich', label: 'Avoir gagné beaucoup d\'argent et réussi matériellement', tags: { business: 2, money: 2, ambition: 2 } },
      { id: 'create', label: 'Avoir créé quelque chose qui dure (objet, œuvre, bâtiment)', tags: { construction: 2, arts: 2, artisanat: 2 } },
      { id: 'freedom', label: 'Avoir été libre et indépendant tout du long', tags: { independence: 3, freelance: 2 } },
      { id: 'stability', label: 'Avoir eu une vie stable et équilibrée', tags: { admin: 2, security: 1, calm: 2 } },
      { id: 'impact', label: 'Avoir changé les choses à grande échelle', tags: { leadership: 2, strategy: 1, politics: 1 } }
    ]
  }
];

export function determineNextQuestion(history) {
  const answeredIds = history.map(h => h.questionId);

  // 1. Initial Phase
  if (!answeredIds.includes('q1_activity_nature')) return INITIAL_QUESTIONS[0];
  if (!answeredIds.includes('q2_work_environment')) return INITIAL_QUESTIONS[1];

  // 2. Determine Branch
  // Calculate temp scores to decide branch
  const tempTags = {};
  history.forEach(h => {
     if (h.tags) {
        Object.entries(h.tags).forEach(([tag, score]) => {
           tempTags[tag] = (tempTags[tag] || 0) + score;
        });
     } else {
        // Fallback lookup
        const allQs = [...INITIAL_QUESTIONS, ...Object.values(SECTOR_SPECIFIC_QUESTIONS).flat(), ...FINAL_CALIBRATION].find(q => q.id === h.questionId);
        const opt = allQs?.options.find(o => o.id === h.answerId);
        if (opt?.tags) {
             Object.entries(opt.tags).forEach(([tag, score]) => {
                tempTags[tag] = (tempTags[tag] || 0) + score;
             });
        }
     }
  });

  // Branch Logic
  let branch = 'intellectual_branch'; // Default
  const manualScore = (tempTags.manual || 0) + (tempTags.outdoor || 0) + (tempTags.construction || 0);
  const socialScore = (tempTags.social || 0) + (tempTags.medical || 0) + (tempTags.service || 0);
  const creativeScore = (tempTags.creative || 0) + (tempTags.arts || 0);
  const intellectualScore = (tempTags.intellectual || 0) + (tempTags.tech || 0) + (tempTags.business || 0);

  if (manualScore > socialScore && manualScore > intellectualScore && manualScore > creativeScore) branch = 'manual_branch';
  else if (socialScore > intellectualScore && socialScore > creativeScore) branch = 'social_branch';
  else if (creativeScore > intellectualScore) branch = 'creative_branch';
  
  // Ask Branch Specific Question if not asked
  const branchQs = SECTOR_SPECIFIC_QUESTIONS[branch];
  for (let q of branchQs) {
    if (!answeredIds.includes(q.id)) return q;
  }

  // 3. Final Phase
  for (let q of FINAL_CALIBRATION) {
     if (!answeredIds.includes(q.id)) return q;
  }

  return null; // Finished
}

export function scoreCareersFromHistory(history) {
    // 1. Aggregate User Tags
    const userTags = {};
    history.forEach(h => {
        // Retrieve tags from definition if not in history object
        let tags = h.tags;
        if (!tags) {
            const allQs = [...INITIAL_QUESTIONS, ...Object.values(SECTOR_SPECIFIC_QUESTIONS).flat(), ...FINAL_CALIBRATION];
            const q = allQs.find(x => x.id === h.questionId);
            const opt = q?.options.find(o => o.id === h.answerId);
            tags = opt?.tags;
        }

        if (tags) {
            Object.entries(tags).forEach(([tag, val]) => {
                userTags[tag] = (userTags[tag] || 0) + val;
            });
        }
    });

    // 2. Score Careers
    const scores = [];
    Object.entries(METIER_ENRICHED_DATA).forEach(([code, job]) => {
        if (code === 'DEFAULT') return;

        let score = 0;
        let reasons = [];
        
        // Loop through job tags
        job.tags.forEach(jobTag => {
            // Exact match
            if (userTags[jobTag]) {
                score += userTags[jobTag] * 5; // Weighted by user intensity
            }
        });

        // Debug logging for developers
        if (code === 'M1805') {
            console.log(`[Scoring Debug] Dev Job Score Pre-Filter: ${score}`, { userTags, jobTags: job.tags });
        }

        // ============================================
        // STRICT ANTI-BIAS CHECK FOR DEVELOPER / TECH
        // ============================================
        const isTechJob = job.domain === 'Technologie' || job.tags.includes('tech') || job.tags.includes('code');
        const userHasTechInterest = (userTags['tech'] || 0) >= 2 || (userTags['code'] || 0) >= 1;
        
        if (isTechJob && !userHasTechInterest) {
            score = 0; // Hard kill for tech jobs if user didn't explicitly select tech/code options
        }

        // Anti-Bias for Medical (don't show if no empathy/medical tags)
        if (job.domain === 'Santé' && (userTags['medical'] || 0) < 1 && (userTags['health'] || 0) < 1) {
             score = 0;
        }

        // Only keep significant matches
        if (score > 12) {
            scores.push({
                code,
                ...job,
                score,
                percentage: Math.min(98, Math.round(score * 1.5)) // Normalize
            });
        }
    });

    return scores.sort((a, b) => b.score - a.score);
}