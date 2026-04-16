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
    text: "Aimez-vous réparer des objets, assembler du mobilier ou bricoler à la maison ?",
    options: OPTIONS,
  },
  {
    id: 'i1', category: 'I', emoji: '🧠',
    text: "Aimez-vous chercher à comprendre en profondeur comment les choses fonctionnent et pourquoi ?",
    options: OPTIONS,
  },
  {
    id: 'a1', category: 'A', emoji: '🎨',
    text: "Exprimez-vous votre créativité à travers le dessin, la musique, la photo ou l'écriture ?",
    options: OPTIONS,
  },
  {
    id: 's1', category: 'S', emoji: '🤝',
    text: "Aimez-vous aider les autres à surmonter leurs difficultés personnelles ou professionnelles ?",
    options: OPTIONS,
  },
  {
    id: 'e1', category: 'E', emoji: '🗣️',
    text: "Aimez-vous convaincre, négocier ou défendre vos idées devant un groupe ?",
    options: OPTIONS,
  },
  {
    id: 'c1', category: 'C', emoji: '📊',
    text: "Aimez-vous travailler avec des chiffres, des tableaux ou des bases de données ?",
    options: OPTIONS,
  },

  // ── Bloc 2 (R I A S E C) ────────────────────────────────────────────────
  {
    id: 'r2', category: 'R', emoji: '🏗️',
    text: "Préférez-vous un travail où vous voyez concrètement le résultat de ce que vous faites de vos mains ?",
    options: OPTIONS,
  },
  {
    id: 'i2', category: 'I', emoji: '🔬',
    text: "Appréciez-vous les problèmes complexes qui demandent observation, méthode et analyse ?",
    options: OPTIONS,
  },
  {
    id: 'a2', category: 'A', emoji: '✨',
    text: "Aimez-vous concevoir et réaliser des projets à votre façon, avec une grande liberté créative ?",
    options: OPTIONS,
  },
  {
    id: 's2', category: 'S', emoji: '🧑‍🏫',
    text: "Êtes-vous patient·e pour expliquer, enseigner ou transmettre des connaissances à d'autres ?",
    options: OPTIONS,
  },
  {
    id: 'e2', category: 'E', emoji: '🚀',
    text: "Êtes-vous à l'aise pour prendre des décisions importantes et assumer des responsabilités de leadership ?",
    options: OPTIONS,
  },
  {
    id: 'c2', category: 'C', emoji: '📋',
    text: "Appréciez-vous les tâches qui demandent rigueur, méthode et respect strict des procédures ?",
    options: OPTIONS,
  },

  // ── Bloc 3 (R I A S E C) ────────────────────────────────────────────────
  {
    id: 'r3', category: 'R', emoji: '🌿',
    text: "Êtes-vous à l'aise avec les activités physiques, le sport ou le travail en plein air ?",
    options: OPTIONS,
  },
  {
    id: 'i3', category: 'I', emoji: '📚',
    text: "Passez-vous du temps à lire, faire des recherches ou approfondir un sujet qui vous passionne ?",
    options: OPTIONS,
  },
  {
    id: 'a3', category: 'A', emoji: '🎭',
    text: "Êtes-vous sensible à l'esthétique — les couleurs, les formes, les sons, la mise en scène ?",
    options: OPTIONS,
  },
  {
    id: 's3', category: 'S', emoji: '👥',
    text: "Vous sentez-vous énergisé·e après avoir collaboré en équipe ou aidé quelqu'un efficacement ?",
    options: OPTIONS,
  },
  {
    id: 'e3', category: 'E', emoji: '🏆',
    text: "Appréciez-vous les contextes compétitifs et les défis ambitieux où vous devez vous dépasser ?",
    options: OPTIONS,
  },
  {
    id: 'c3', category: 'C', emoji: '📁',
    text: "Êtes-vous à l'aise pour planifier, organiser et structurer le travail de façon rigoureuse ?",
    options: OPTIONS,
  },

  // ── Bloc 4 (R I S E C) ──────────────────────────────────────────────────
  {
    id: 'r4', category: 'R', emoji: '⚙️',
    text: "Aimez-vous utiliser, entretenir ou régler des machines, outils ou équipements techniques ?",
    options: OPTIONS,
  },
  {
    id: 'i4', category: 'I', emoji: '📐',
    text: "Êtes-vous attiré·e par les mathématiques, les sciences, l'informatique ou la logique ?",
    options: OPTIONS,
  },
  {
    id: 's4', category: 'S', emoji: '❤️',
    text: "Avez-vous de l'empathie naturelle et aimez-vous soutenir les personnes en difficulté ?",
    options: OPTIONS,
  },
  {
    id: 'e4', category: 'E', emoji: '💡',
    text: "Aimez-vous lancer de nouveaux projets, créer votre propre activité ou prendre des risques calculés ?",
    options: OPTIONS,
  },
  {
    id: 'c4', category: 'C', emoji: '🏢',
    text: "Appréciez-vous un cadre de travail bien structuré, avec des rôles et des objectifs clairement définis ?",
    options: OPTIONS,
  },

  // ── Bloc 5 (R I S A) ────────────────────────────────────────────────────
  {
    id: 'r5', category: 'R', emoji: '🏭',
    text: "Vous sentez-vous dans votre élément sur le terrain, en atelier, en laboratoire pratique ou en chantier ?",
    options: OPTIONS,
  },
  {
    id: 'i5', category: 'I', emoji: '🔭',
    text: "Préférez-vous travailler de façon approfondie et autonome sur des sujets scientifiques ou techniques ?",
    options: OPTIONS,
  },
  {
    id: 's5', category: 'S', emoji: '👂',
    text: "Appréciez-vous les métiers de contact humain : soins, éducation, conseil ou service à la personne ?",
    options: OPTIONS,
  },
  {
    id: 'a4', category: 'A', emoji: '✍️',
    text: "Préférez-vous les environnements qui valorisent l'originalité, l'imagination et l'expression personnelle ?",
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
    counts[q.category] = (counts[q.category] || 0) + 1;
  });
  const result = {};
  Object.entries(counts).forEach(([cat, n]) => {
    result[cat] = n * maxOptionValue;
  });
  return result; // e.g. { R: 500, I: 500, A: 400, S: 500, E: 400, C: 400 }
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
