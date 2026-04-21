/**
 * Adaptive RIASEC Test — 60 Questions Pool
 *
 * This pool feeds an adaptive algorithm that selects 20-27 questions
 * based on user responses. Each question is tagged with:
 * - category: R, I, A, S, E, C
 * - sector: The professional domain it best represents
 * - difficulty: Used for adaptive selection (basic, intermediate, advanced)
 *
 * Scale: 0 = Pas du tout · 33 = Un peu · 66 = Beaucoup · 100 = Passionnément
 */

const OPTIONS = [
  { text: 'Pas du tout', value: 0 },
  { text: 'Un peu', value: 33 },
  { text: 'Beaucoup', value: 66 },
  { text: 'Passionnément', value: 100 },
];

export const adaptiveQuestionPool = [
  // ─────────────────────────────────────────────────────────────
  // RÉALISTE (R) - 12 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'r-basic-1', category: 'R', emoji: '🔧', difficulty: 'basic',
    sector: 'Industrie & Mécanique',
    text: "Aimez-vous réparer des objets ou bricoler à la maison ?",
    options: OPTIONS,
  },
  {
    id: 'r-basic-2', category: 'R', emoji: '🏗️', difficulty: 'basic',
    sector: 'Bâtiment & Travaux Publics',
    text: "Préférez-vous un travail où vous voyez le résultat concret de vos mains ?",
    options: OPTIONS,
  },
  {
    id: 'r-basic-3', category: 'R', emoji: '🌿', difficulty: 'basic',
    sector: 'Métiers Verts',
    text: "Êtes-vous à l'aise avec les activités physiques et le travail en plein air ?",
    options: OPTIONS,
  },
  {
    id: 'r-inter-1', category: 'R', emoji: '⚙️', difficulty: 'intermediate',
    sector: 'Électricité & Électronique',
    text: "Aimez-vous utiliser, entretenir et régler des équipements techniques ?",
    options: OPTIONS,
  },
  {
    id: 'r-inter-2', category: 'R', emoji: '🏭', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Vous sentez-vous à l'aise en atelier, en usine ou en laboratoire pratique ?",
    options: OPTIONS,
  },
  {
    id: 'r-inter-3', category: 'R', emoji: '🧵', difficulty: 'intermediate',
    sector: 'Métiers du Textile',
    text: "Aimeriez-vous travailler avec des matériaux (textile, cuir, bois, verre) ?",
    options: OPTIONS,
  },
  {
    id: 'r-adv-1', category: 'R', emoji: '🛠️', difficulty: 'advanced',
    sector: 'Métiers du Bois',
    text: "Appréciez-vous les travaux d'artisanat qui demandent précision et savoir-faire ?",
    options: OPTIONS,
  },
  {
    id: 'r-adv-2', category: 'R', emoji: '🚜', difficulty: 'advanced',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimez-vous travailler avec la nature, les plantes ou les animaux ?",
    options: OPTIONS,
  },
  {
    id: 'r-adv-3', category: 'R', emoji: '⚡', difficulty: 'advanced',
    sector: 'Électricité & Électronique',
    text: "Fascinez-vous par le fonctionnement des systèmes électriques ou mécaniques ?",
    options: OPTIONS,
  },
  {
    id: 'r-sector-1', category: 'R', emoji: '💎', difficulty: 'intermediate',
    sector: 'Verre & Cristal',
    text: "Aimeriez-vous transformer des matières brutes en produits finis ?",
    options: OPTIONS,
  },
  {
    id: 'r-sector-2', category: 'R', emoji: '📦', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Êtes-vous organisé et efficace dans les tâches pratiques et matérielles ?",
    options: OPTIONS,
  },
  {
    id: 'r-sector-3', category: 'R', emoji: '🔨', difficulty: 'advanced',
    sector: 'Métiers du Cuir',
    text: "Appréciez-vous la création d'objets fonctionnels avec vos mains ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // INVESTIGATEUR (I) - 12 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'i-basic-1', category: 'I', emoji: '🧠', difficulty: 'basic',
    sector: 'Informatique & Numérique',
    text: "Aimez-vous comprendre comment les choses fonctionnent ?",
    options: OPTIONS,
  },
  {
    id: 'i-basic-2', category: 'I', emoji: '🔬', difficulty: 'basic',
    sector: 'Sciences & Santé',
    text: "Appréciez-vous les problèmes complexes qui demandent analyse ?",
    options: OPTIONS,
  },
  {
    id: 'i-basic-3', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Recherche',
    text: "Passez-vous du temps à lire ou approfondir un sujet qui vous passionne ?",
    options: OPTIONS,
  },
  {
    id: 'i-inter-1', category: 'I', emoji: '📐', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Êtes-vous attiré par les mathématiques, l'informatique ou la logique ?",
    options: OPTIONS,
  },
  {
    id: 'i-inter-2', category: 'I', emoji: '🧪', difficulty: 'intermediate',
    sector: 'Chimie & Pharmacie',
    text: "Aimeriez-vous conduire des expériences ou étudier des processus chimiques ?",
    options: OPTIONS,
  },
  {
    id: 'i-inter-3', category: 'I', emoji: '🔭', difficulty: 'intermediate',
    sector: 'Recherche Scientifique',
    text: "Préférez-vous travailler de façon autonome sur des sujets techniques ?",
    options: OPTIONS,
  },
  {
    id: 'i-adv-1', category: 'I', emoji: '💊', difficulty: 'advanced',
    sector: 'Chimie & Pharmacie',
    text: "Fascineriez-vous les molécules, les formules ou la pharmacologie ?",
    options: OPTIONS,
  },
  {
    id: 'i-adv-2', category: 'I', emoji: '🧬', difficulty: 'advanced',
    sector: 'Sciences de la Vie',
    text: "Êtes-vous curieux des sciences biologiques et de la recherche médicale ?",
    options: OPTIONS,
  },
  {
    id: 'i-adv-3', category: 'I', emoji: '⚛️', difficulty: 'advanced',
    sector: 'Recherche & Développement',
    text: "Aimeriez-vous contribuer à des innovations scientifiques ou technologiques ?",
    options: OPTIONS,
  },
  {
    id: 'i-sector-1', category: 'I', emoji: '👓', difficulty: 'intermediate',
    sector: 'Optique & Lunetterie',
    text: "Intéressez-vous à la précision optique et aux appareils de mesure ?",
    options: OPTIONS,
  },
  {
    id: 'i-sector-2', category: 'I', emoji: '🌍', difficulty: 'intermediate',
    sector: 'Environnement & Développement Durable',
    text: "Vous préoccupez-vous de l'impact environnemental et des solutions durables ?",
    options: OPTIONS,
  },
  {
    id: 'i-sector-3', category: 'I', emoji: '🔩', difficulty: 'advanced',
    sector: 'Ingénierie',
    text: "Aimeriez-vous concevoir et optimiser des systèmes complexes ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ARTISTIQUE (A) - 11 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'a-basic-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Arts & Design',
    text: "Exprimez-vous votre créativité par le dessin, la musique ou l'écriture ?",
    options: OPTIONS,
  },
  {
    id: 'a-basic-2', category: 'A', emoji: '✨', difficulty: 'basic',
    sector: 'Design',
    text: "Aimez-vous concevoir des choses avec liberté créative ?",
    options: OPTIONS,
  },
  {
    id: 'a-basic-3', category: 'A', emoji: '🎭', difficulty: 'basic',
    sector: 'Arts & Spectacle',
    text: "Êtes-vous sensible à l'esthétique — couleurs, formes, sons ?",
    options: OPTIONS,
  },
  {
    id: 'a-inter-1', category: 'A', emoji: '👗', difficulty: 'intermediate',
    sector: 'Luxe & Mode',
    text: "Aimeriez-vous créer des collections ou concevoir des tendances ?",
    options: OPTIONS,
  },
  {
    id: 'a-inter-2', category: 'A', emoji: '🎬', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Appréciez-vous produire du contenu vidéo, audio ou multimédia ?",
    options: OPTIONS,
  },
  {
    id: 'a-inter-3', category: 'A', emoji: '🏛️', difficulty: 'intermediate',
    sector: 'Architecture',
    text: "Aimeriez-vous concevoir des espaces ou des bâtiments ?",
    options: OPTIONS,
  },
  {
    id: 'a-adv-1', category: 'A', emoji: '🖼️', difficulty: 'advanced',
    sector: 'Beaux-Arts',
    text: "Voyez-vous l'art comme un moyen d'expression personnel profond ?",
    options: OPTIONS,
  },
  {
    id: 'a-adv-2', category: 'A', emoji: '🎪', difficulty: 'advanced',
    sector: 'Spectacle & Musique',
    text: "Passionerie-vous par la performance ou l'expression scénique ?",
    options: OPTIONS,
  },
  {
    id: 'a-sector-1', category: 'A', emoji: '🎸', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Aimeriez-vous jouer d'un instrument ou chanter professionnellement ?",
    options: OPTIONS,
  },
  {
    id: 'a-sector-2', category: 'A', emoji: '✍️', difficulty: 'intermediate',
    sector: 'Édition & Journalisme',
    text: "Aimez-vous raconter des histoires et communiquer par l'écrit ?",
    options: OPTIONS,
  },
  {
    id: 'a-sector-3', category: 'A', emoji: '🌈', difficulty: 'advanced',
    sector: 'Branding & Marketing Créatif',
    text: "Préférez-vous des environnements qui valorisent l'originalité et l'imagination ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SOCIAL (S) - 12 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 's-basic-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Services à la Personne',
    text: "Aimez-vous aider les autres à surmonter leurs difficultés ?",
    options: OPTIONS,
  },
  {
    id: 's-basic-2', category: 'S', emoji: '🧑‍🏫', difficulty: 'basic',
    sector: 'Éducation',
    text: "Êtes-vous patient pour expliquer et enseigner à d'autres ?",
    options: OPTIONS,
  },
  {
    id: 's-basic-3', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Travail en Équipe',
    text: "Vous sentez-vous énergisé après avoir collaboré en équipe ?",
    options: OPTIONS,
  },
  {
    id: 's-inter-1', category: 'S', emoji: '❤️', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Avez-vous de l'empathie naturelle et aimez-vous soutenir les personnes ?",
    options: OPTIONS,
  },
  {
    id: 's-inter-2', category: 'S', emoji: '🏥', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Aimeriez-vous soigner, assister ou accompagner des patients ?",
    options: OPTIONS,
  },
  {
    id: 's-inter-3', category: 'S', emoji: '👂', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Aimez-vous écouter, conseiller et orienter les personnes ?",
    options: OPTIONS,
  },
  {
    id: 's-adv-1', category: 'S', emoji: '🛡️', difficulty: 'advanced',
    sector: 'Sécurité & Secours',
    text: "Aimeriez-vous protéger et secourir les personnes en danger ?",
    options: OPTIONS,
  },
  {
    id: 's-adv-2', category: 'S', emoji: '👨‍⚕️', difficulty: 'advanced',
    sector: 'Professions Médicales',
    text: "Passioneriez-vous par les métiers de la santé et des soins intensifs ?",
    options: OPTIONS,
  },
  {
    id: 's-adv-3', category: 'S', emoji: '🧠', difficulty: 'advanced',
    sector: 'Psychologie & Bien-être',
    text: "Aimeriez-vous accompagner des personnes dans leur développement personnel ?",
    options: OPTIONS,
  },
  {
    id: 's-sector-1', category: 'S', emoji: '✈️', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Aimez-vous accueillir et créer des expériences agréables pour les clients ?",
    options: OPTIONS,
  },
  {
    id: 's-sector-2', category: 'S', emoji: '🍽️', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Aimeriez-vous travailler dans l'accueil et le service à la clientèle ?",
    options: OPTIONS,
  },
  {
    id: 's-sector-3', category: 'S', emoji: '👶', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Aimeriez-vous travailler avec des enfants et contribuer à leur éducation ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ENTREPRENANT (E) - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'e-basic-1', category: 'E', emoji: '🗣️', difficulty: 'basic',
    sector: 'Commerce & Vente',
    text: "Aimez-vous convaincre, négocier ou défendre vos idées ?",
    options: OPTIONS,
  },
  {
    id: 'e-basic-2', category: 'E', emoji: '🚀', difficulty: 'basic',
    sector: 'Gestion & Management',
    text: "Êtes-vous à l'aise pour prendre des décisions et assumer le leadership ?",
    options: OPTIONS,
  },
  {
    id: 'e-basic-3', category: 'E', emoji: '🏆', difficulty: 'basic',
    sector: 'Compétition & Défi',
    text: "Appréciez-vous les contextes compétitifs et les défis ambitieux ?",
    options: OPTIONS,
  },
  {
    id: 'e-inter-1', category: 'E', emoji: '💡', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Aimez-vous lancer des projets, créer une activité ou prendre des risques ?",
    options: OPTIONS,
  },
  {
    id: 'e-inter-2', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Aimeriez-vous diriger une équipe et atteindre des objectifs ambitieux ?",
    options: OPTIONS,
  },
  {
    id: 'e-inter-3', category: 'E', emoji: '🏢', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Aimeriez-vous développer des projets immobiliers ou commerciaux ?",
    options: OPTIONS,
  },
  {
    id: 'e-adv-1', category: 'E', emoji: '⚖️', difficulty: 'advanced',
    sector: 'Droit & Notariat',
    text: "Aimeriez-vous représenter, plaider ou négocier comme un avocat ?",
    options: OPTIONS,
  },
  {
    id: 'e-adv-2', category: 'E', emoji: '📊', difficulty: 'advanced',
    sector: 'Finances & Investissement',
    text: "Fascineriez-vous par le monde de la finance et des investissements ?",
    options: OPTIONS,
  },
  {
    id: 'e-adv-3', category: 'E', emoji: '🎯', difficulty: 'advanced',
    sector: 'Stratégie Commerciale',
    text: "Aimeriez-vous définir les stratégies et croissance d'une entreprise ?",
    options: OPTIONS,
  },
  {
    id: 'e-sector-1', category: 'E', emoji: '🛍️', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Aimez-vous convertir les prospects en clients et atteindre les cibles ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // CONVENTIONNEL (C) - 13 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'c-basic-1', category: 'C', emoji: '📊', difficulty: 'basic',
    sector: 'Finance & Comptabilité',
    text: "Aimez-vous travailler avec des chiffres, tableaux ou données ?",
    options: OPTIONS,
  },
  {
    id: 'c-basic-2', category: 'C', emoji: '📋', difficulty: 'basic',
    sector: 'Administration',
    text: "Appréciez-vous les tâches qui demandent rigueur et précision ?",
    options: OPTIONS,
  },
  {
    id: 'c-basic-3', category: 'C', emoji: '📁', difficulty: 'basic',
    sector: 'Organisation & Gestion',
    text: "Êtes-vous à l'aise pour planifier et organiser le travail ?",
    options: OPTIONS,
  },
  {
    id: 'c-inter-1', category: 'C', emoji: '💰', difficulty: 'intermediate',
    sector: 'Finance & Comptabilité',
    text: "Aimeriez-vous analyser des bilans ou gérer un budget ?",
    options: OPTIONS,
  },
  {
    id: 'c-inter-2', category: 'C', emoji: '📈', difficulty: 'intermediate',
    sector: 'Contrôle de Gestion',
    text: "Appréciez-vous suivre les performances et vérifier la conformité ?",
    options: OPTIONS,
  },
  {
    id: 'c-inter-3', category: 'C', emoji: '🏢', difficulty: 'intermediate',
    sector: 'Fonction Publique',
    text: "Aimeriez-vous travailler dans un cadre public avec des règles claires ?",
    options: OPTIONS,
  },
  {
    id: 'c-inter-4', category: 'C', emoji: '🚚', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Aimeriez-vous optimiser la chaîne d'approvisionnement et les flux ?",
    options: OPTIONS,
  },
  {
    id: 'c-adv-1', category: 'C', emoji: '⚖️', difficulty: 'advanced',
    sector: 'Conformité & Audit',
    text: "Aimeriez-vous vérifier la conformité et prévenir les risques ?",
    options: OPTIONS,
  },
  {
    id: 'c-adv-2', category: 'C', emoji: '📜', difficulty: 'advanced',
    sector: 'Droit & Légal',
    text: "Aimeriez-vous interpréter les lois et appliquer les réglementations ?",
    options: OPTIONS,
  },
  {
    id: 'c-adv-3', category: 'C', emoji: '🔐', difficulty: 'advanced',
    sector: 'Sécurité & Conformité',
    text: "Appréciez-vous identifier et prévenir les risques systématiquement ?",
    options: OPTIONS,
  },
  {
    id: 'c-sector-1', category: 'C', emoji: '👔', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Aimeriez-vous gérer les processus RH (recrutement, paie, formations) ?",
    options: OPTIONS,
  },
  {
    id: 'c-sector-2', category: 'C', emoji: '🗂️', difficulty: 'intermediate',
    sector: 'Archivage & Documentation',
    text: "Aimeriez-vous organiser et classer les documents et dossiers ?",
    options: OPTIONS,
  },
  {
    id: 'c-sector-3', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Qualité & Standards',
    text: "Aimeriez-vous vérifier que les processus respectent les normes ISO ?",
    options: OPTIONS,
  },
];

/**
 * Helper: Get max possible score per category dynamically
 */
export const getAdaptiveMaxPossible = () => {
  const maxOptionValue = 100;
  const counts = {};
  adaptiveQuestionPool.forEach(q => {
    counts[q.category] = (counts[q.category] || 0) + 1;
  });
  const result = {};
  Object.entries(counts).forEach(([cat, n]) => {
    result[cat] = n * maxOptionValue;
  });
  return result;
};
