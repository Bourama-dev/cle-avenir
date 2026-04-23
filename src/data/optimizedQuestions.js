/**
 * RIASEC Orientation Test — 27 Questions
 *
 * Distribution : R×5 · I×5 · A×4 · S×5 · E×4 · C×4 = 27
 *
 * Questions are INTERLEAVED so no two consecutive questions share the same
 * RIASEC category (reduces response bias and category priming).
 *
 * Each question targets a single, well-defined RIASEC dimension based on
 * Holland's occupational theory (behaviors, interests, and preferences —
 * NOT abstract environment preferences).
 *
 * Scale values: 0 = Pas du tout · 33 = Un peu · 66 = Beaucoup · 100 = Passionnément
 * Normalization: rawScore / (n_questions_per_category × 100) × 100
 */

const OPTIONS = [
  { text: 'Pas du tout',  value: 0   },
  { text: 'Un peu',       value: 33  },
  { text: 'Beaucoup',     value: 66  },
  { text: 'Passionnément', value: 100 },
];

export const optimizedQuestions = [
  // ── Bloc 1 (R I A S E C) ────────────────────────────────────────────────
  {
    id: 'r1', category: 'R', emoji: '🔧',
    text: "Aimez-vous réparer des objets, assembler du mobilier, entretenir des équipements en mécanique, électricité ou industrie ?",
    sector: 'industry',
    options: OPTIONS,
  },
  {
    id: 'i1', category: 'I', emoji: '🧠',
    text: "Aimez-vous chercher à comprendre les phénomènes scientifiques, chimiques ou comment fonctionnent les technologies ?",
    sector: 'sciences',
    options: OPTIONS,
  },
  {
    id: 'a1', category: 'A', emoji: '🎨',
    text: "Exprimez-vous votre créativité en arts, design, mode, musique ou dans la conception de visuels ?",
    sector: 'arts',
    options: OPTIONS,
  },
  {
    id: 's1', category: 'S', emoji: '🤝',
    text: "Aimez-vous aider, soigner ou assister les autres — dans les domaines médicaux, sociaux ou éducatifs ?",
    sector: 'health',
    options: OPTIONS,
  },
  {
    id: 'e1', category: 'E', emoji: '🗣️',
    text: "Aimez-vous convaincre, négocier, vendre ou promouvoir des produits en commerce ou marketing ?",
    sector: 'commerce',
    options: OPTIONS,
  },
  {
    id: 'c1', category: 'C', emoji: '📊',
    text: "Aimez-vous respecter les règles, procédures légales ou travailler dans un cadre réglementé (droit, justice, administration) ?",
    sector: 'law',
    options: OPTIONS,
  },

  // ── Bloc 2 (R I A S E C) ────────────────────────────────────────────────
  {
    id: 'r2', category: 'R', emoji: '🏗️',
    text: "Préférez-vous un travail tangible en BTP, construction, infrastructure ou travaux pratiques de terrain ?",
    sector: 'industry',
    options: OPTIONS,
  },
  {
    id: 'i2', category: 'I', emoji: '🔬',
    text: "Appréciez-vous les problèmes complexes en IA, informatique, data science ou recherche scientifique ?",
    sector: 'technology',
    options: OPTIONS,
  },
  {
    id: 'a2', category: 'A', emoji: '✨',
    text: "Aimez-vous concevoir des espaces, bâtiments ou objets avec liberté créative dans le design et l'architecture ?",
    sector: 'arts',
    options: OPTIONS,
  },
  {
    id: 's2', category: 'S', emoji: '🧑‍🏫',
    text: "Êtes-vous patient·e pour enseigner, former ou transmettre des connaissances en éducation et formation ?",
    sector: 'education',
    options: OPTIONS,
  },
  {
    id: 'e2', category: 'E', emoji: '🚀',
    text: "Êtes-vous à l'aise pour créer votre entreprise, lancer des projets ambitieux ou diriger une équipe ?",
    sector: 'commerce',
    options: OPTIONS,
  },
  {
    id: 'c2', category: 'C', emoji: '📋',
    text: "Appréciez-vous les tâches administratives, organisationnelles ou respecter des normes et certifications strictes ?",
    sector: 'law',
    options: OPTIONS,
  },

  // ── Bloc 3 (R I A S E C) ────────────────────────────────────────────────
  {
    id: 'r3', category: 'R', emoji: '🏅',
    text: "Êtes-vous à l'aise avec les activités physiques, le sport, l'entraînement ou les défis physiques ?",
    sector: 'sport',
    options: OPTIONS,
  },
  {
    id: 'i3', category: 'I', emoji: '📚',
    text: "Passez-vous du temps à vous former, lire ou approfondir des sujets en sciences et recherche ?",
    sector: 'sciences',
    options: OPTIONS,
  },
  {
    id: 'a3', category: 'A', emoji: '🎭',
    text: "Êtes-vous sensible à l'esthétique, aux spectacles, aux événements ou à la culture artistique ?",
    sector: 'events',
    options: OPTIONS,
  },
  {
    id: 's3', category: 'S', emoji: '👥',
    text: "Vous sentez-vous énergisé·e en aidant, collaborant en équipe ou en travaillant dans des services à la personne ?",
    sector: 'health',
    options: OPTIONS,
  },
  {
    id: 'e3', category: 'E', emoji: '🏆',
    text: "Appréciez-vous la compétition, les challenges ou la reconnaissance dans le secteur du commerce et du business ?",
    sector: 'commerce',
    options: OPTIONS,
  },
  {
    id: 'c3', category: 'C', emoji: '📁',
    text: "Êtes-vous à l'aise pour planifier, organiser ou structurer des systèmes complexes de manière rigoureuse ?",
    sector: 'law',
    options: OPTIONS,
  },

  // ── Bloc 4 (R I S E C) ──────────────────────────────────────────────────
  {
    id: 'r4', category: 'R', emoji: '⚙️',
    text: "Aimez-vous utiliser, entretenir ou régler des machines, véhicules ou systèmes techniques en industrie et mécanique ?",
    sector: 'industry',
    options: OPTIONS,
  },
  {
    id: 'i4', category: 'I', emoji: '💻',
    text: "Êtes-vous attiré·e par la programmation, l'IA, la cybersécurité, ou les innovations technologiques ?",
    sector: 'technology',
    options: OPTIONS,
  },
  {
    id: 's4', category: 'S', emoji: '❤️',
    text: "Avez-vous de l'empathie et aimez-vous soigner, soutenir les personnes malades ou en difficulté (santé, social) ?",
    sector: 'health',
    options: OPTIONS,
  },
  {
    id: 'e4', category: 'E', emoji: '✈️',
    text: "Aimez-vous lancer des projets, créer votre business ou diriger dans le secteur du tourisme ou de l'hôtellerie ?",
    sector: 'tourism',
    options: OPTIONS,
  },
  {
    id: 'domain', category: 'D', emoji: '🎯',
    text: "Dans quel type de secteur d'activité vous projetez-vous principalement ?",
    sector: 'multi',
    isSectorQuestion: true,
    options: [
      { text: 'Technologie, Sciences & Recherche', value: 100 },
      { text: 'Arts, Design & Culture', value: 66 },
      { text: 'Santé, Social & Éducation', value: 33 },
      { text: 'Commerce, Entrepreneuriat & Industrie', value: 0 },
    ],
  },

  // ── Bloc 5 (R I S A) ────────────────────────────────────────────────────
  {
    id: 'r5', category: 'R', emoji: '🌍',
    text: "Vous sentez-vous dans votre élément en protection de l'environnement, en plein air ou en travail écologique ?",
    sector: 'environment',
    options: OPTIONS,
  },
  {
    id: 'i5', category: 'I', emoji: '🔭',
    text: "Préférez-vous travailler en profondeur dans la recherche scientifique ou l'analyse de données complexes ?",
    sector: 'sciences',
    options: OPTIONS,
  },
  {
    id: 's5', category: 'S', emoji: '👂',
    text: "Appréciez-vous les métiers de contact en santé, éducation, tourisme ou assistance à la personne ?",
    sector: 'education',
    options: OPTIONS,
  },
  {
    id: 'a4', category: 'A', emoji: '✍️',
    text: "Préférez-vous les environnements valorisant l'originalité en arts, culture, événementiel ou design créatif ?",
    sector: 'arts',
    options: OPTIONS,
  },
];

/**
 * Returns the max possible raw score per RIASEC category,
 * computed dynamically from the questions array.
 *
 * Formula: n_questions_in_category × max_option_value (100)
 *
 * Usage in scoring:
 *   normalizedScore[cat] = (rawScore[cat] / MAX_POSSIBLE[cat]) * 100
 */
export const RIASEC_MAX_POSSIBLE = (() => {
  const maxOptionValue = Math.max(...OPTIONS.map(o => o.value)); // 100
  const counts = {};
  optimizedQuestions.forEach(q => {
    // Exclude sector-specific questions (category 'D') from RIASEC scoring
    if (q.category !== 'D') {
      counts[q.category] = (counts[q.category] || 0) + 1;
    }
  });
  const result = {};
  Object.entries(counts).forEach(([cat, n]) => {
    result[cat] = n * maxOptionValue;
  });
  return result; // e.g. { R: 500, I: 500, A: 400, S: 500, E: 400, C: 300 }
})();

/**
 * RIASEC dimension metadata used for display across the app.
 */
export const RIASEC_META = {
  R: {
    label: 'Réaliste',
    color: 'bg-orange-500',
    colorHex: '#f97316',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    description: 'Vous aimez le concret, les travaux pratiques et les métiers techniques. Habile et pragmatique, vous préférez agir plutôt que théoriser.',
    traits: ['Sens pratique', 'Habileté manuelle', 'Esprit technique'],
    metiers: ['Mécanicien', 'Électricien', 'Ingénieur BTP', 'Chirurgien'],
  },
  I: {
    label: 'Investigateur',
    color: 'bg-blue-500',
    colorHex: '#3b82f6',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    description: 'Curieux et analytique, vous aimez comprendre le monde par la réflexion et la recherche. Vous excellez dans les domaines scientifiques.',
    traits: ['Esprit analytique', 'Curiosité intellectuelle', 'Rigueur scientifique'],
    metiers: ['Chercheur', 'Data Scientist', 'Médecin', 'Ingénieur logiciel'],
  },
  A: {
    label: 'Artistique',
    color: 'bg-purple-500',
    colorHex: '#a855f7',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    description: "Créatif et expressif, vous aimez imaginer, créer et travailler avec liberté. Vous êtes sensible à l'esthétique et à l'originalité.",
    traits: ['Créativité', 'Sensibilité esthétique', 'Expression personnelle'],
    metiers: ['Graphiste', 'Architecte', 'Journaliste', 'Designer UX'],
  },
  S: {
    label: 'Social',
    color: 'bg-green-500',
    colorHex: '#22c55e',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    borderLight: 'border-green-200',
    description: 'Empathique et communicatif, vous aimez aider, enseigner et collaborer. Vous vous épanouissez dans les métiers de relation humaine.',
    traits: ['Empathie', 'Communication', 'Esprit d\'équipe'],
    metiers: ['Enseignant', 'Infirmier', 'Psychologue', 'Assistant social'],
  },
  E: {
    label: 'Entreprenant',
    color: 'bg-red-500',
    colorHex: '#ef4444',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    borderLight: 'border-red-200',
    description: 'Ambitieux et persuasif, vous aimez diriger, convaincre et prendre des décisions. Vous vous épanouissez dans le management et l\'entrepreneuriat.',
    traits: ['Leadership', 'Force de persuasion', 'Ambition'],
    metiers: ['Manager', 'Commercial', 'Entrepreneur', 'Avocat'],
  },
  C: {
    label: 'Conventionnel',
    color: 'bg-amber-500',
    colorHex: '#f59e0b',
    textColor: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    description: "Rigoureux et méthodique, vous aimez l'ordre, la précision et les procédures claires. Vous excellez dans les métiers administratifs et organisationnels.",
    traits: ['Rigueur', 'Organisation', 'Fiabilité'],
    metiers: ['Comptable', 'Contrôleur de gestion', 'Analyste financier', 'Logisticien'],
  },
};
