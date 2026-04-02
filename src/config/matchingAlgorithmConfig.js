export const MATCHING_CONFIG = {
  QUESTION_WEIGHTS: {
    bloc1: 1.0, // Intérêts spontanés
    bloc2: 1.2, // Compétences perçues
    bloc3: 1.5, // Valeurs et environnement
    bloc4: 1.8  // Projection professionnelle
  },
  CONTRADICTORY_PAIRS: [
    // format: [questionId1, answerId1, questionId2, answerId2]
    // Example: Prefers solitary (q7_2) but also extreme team collaboration (q7_1)
    ['q7', 'a7_2', 'q7', 'a7_1'],
    // Example: Prefers routine (q5_1) but also extreme risk/disruption (q9_5)
    ['q5', 'a5_1', 'q9', 'a9_5']
  ],
  CONFIDENCE_THRESHOLDS: {
    VERY_HIGH: 85,
    HIGH: 70,
    MEDIUM: 50,
    LOW: 0
  },
  MATCH_SCORE_RANGES: {
    PERFECT: { min: 90, max: 100, label: "Match Parfait", color: "bg-emerald-500" },
    EXCELLENT: { min: 80, max: 89, label: "Excellent Match", color: "bg-green-500" },
    GOOD: { min: 70, max: 79, label: "Bon Match", color: "bg-blue-500" },
    ALTERNATIVE: { min: 60, max: 69, label: "Match Alternatif", color: "bg-indigo-400" },
    EXPLORATORY: { min: 50, max: 59, label: "Piste Exploratoire", color: "bg-purple-400" }
  },
  PROFILE_DESCRIPTIONS: {
    R: "Vous êtes une personne pragmatique, axée sur l'action, la technique et le concret.",
    I: "Vous êtes curieux, analytique et aimez résoudre des problèmes complexes par la réflexion.",
    A: "Vous êtes créatif, expressif et attiré par l'innovation, le design ou l'art.",
    S: "Vous êtes tourné vers les autres, empathique et motivé par l'aide et la transmission.",
    E: "Vous êtes un leader naturel, persuasif, attiré par les défis et les objectifs ambitieux.",
    C: "Vous êtes organisé, méthodique, précis et aimez évoluer dans un cadre structuré."
  },
  PROFILE_STRENGTHS: {
    R: ["Sens pratique", "Habileté technique", "Résolution de problèmes concrets"],
    I: ["Capacité d'analyse", "Esprit critique", "Compréhension approfondie"],
    A: ["Créativité", "Pensée hors du cadre", "Sensibilité esthétique"],
    S: ["Intelligence émotionnelle", "Communication", "Esprit d'équipe"],
    E: ["Leadership", "Force de persuasion", "Prise d'initiative"],
    C: ["Rigueur", "Sens de l'organisation", "Fiabilité"]
  },
  PROFILE_WEAKNESSES: {
    R: ["Peut manquer de flexibilité face aux théories abstraites"],
    I: ["Tendance à sur-analyser et repousser l'action"],
    A: ["Peut avoir du mal avec la routine et les règles strictes"],
    S: ["Peut s'oublier au profit des autres"],
    E: ["Peut manquer de patience pour les détails opérationnels"],
    C: ["Peut être déstabilisé par l'imprévu ou le manque de clarté"]
  }
};