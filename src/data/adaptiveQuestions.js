/**
 * Adaptive RIASEC Test — 400 Questions Pool (ÉTAPE 1-2/4: Secteurs 1-20)
 *
 * This pool feeds an adaptive algorithm that selects 24-30 questions
 * based on user responses. Each question is tagged with:
 * - category: R, I, A, S, E, C
 * - sector: The professional domain it best represents
 * - difficulty: Used for adaptive selection (basic, intermediate, advanced)
 *
 * Scale: 0 = Pas du tout · 33 = Un peu · 66 = Beaucoup · 100 = Passionnément
 *
 * Distribution: 10 questions per sector × 40 sectors = 400 questions total
 */

const OPTIONS = [
  { text: 'Pas du tout', value: 0 },
  { text: 'Un peu', value: 33 },
  { text: 'Beaucoup', value: 66 },
  { text: 'Passionnément', value: 100 },
];

export const adaptiveQuestionPool = [
  // ─────────────────────────────────────────────────────────────
  // GÉNÉRALISTE - 10 Questions (Foundation for all RIASEC)
  // ─────────────────────────────────────────────────────────────

  {
    id: 'gen-r-1', category: 'R', emoji: '🔧', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Préférez-vous travailler avec des choses concrètes plutôt qu'avec des idées abstraites ?",
    options: OPTIONS,
  },
  {
    id: 'gen-r-2', category: 'R', emoji: '👐', difficulty: 'intermediate',
    sector: 'Généraliste',
    text: "Êtes-vous à l'aise avec les activités pratiques et manuelles ?",
    options: OPTIONS,
  },
  {
    id: 'gen-i-1', category: 'I', emoji: '🧠', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Aimez-vous analyser les problèmes et comprendre comment les choses fonctionnent ?",
    options: OPTIONS,
  },
  {
    id: 'gen-i-2', category: 'I', emoji: '📚', difficulty: 'intermediate',
    sector: 'Généraliste',
    text: "Avez-vous une soif naturelle d'apprendre et d'approfondir vos connaissances ?",
    options: OPTIONS,
  },
  {
    id: 'gen-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Avez-vous besoin d'exprimer votre créativité et votre imagination au travail ?",
    options: OPTIONS,
  },
  {
    id: 'gen-a-2', category: 'A', emoji: '🖌️', difficulty: 'intermediate',
    sector: 'Généraliste',
    text: "Êtes-vous sensible à l'esthétique — couleurs, formes, design et beauté ?",
    options: OPTIONS,
  },
  {
    id: 'gen-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Aimez-vous aider, soutenir et vous occuper des autres ?",
    options: OPTIONS,
  },
  {
    id: 'gen-s-2', category: 'S', emoji: '👂', difficulty: 'intermediate',
    sector: 'Généraliste',
    text: "Êtes-vous empathique et doué pour écouter et comprendre les personnes ?",
    options: OPTIONS,
  },
  {
    id: 'gen-e-1', category: 'E', emoji: '🗣️', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Aimez-vous influencer, convaincre et mener des projets ?",
    options: OPTIONS,
  },
  {
    id: 'gen-c-1', category: 'C', emoji: '📋', difficulty: 'basic',
    sector: 'Généraliste',
    text: "Appréciez-vous la rigueur, la précision et l'organisation ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // INFORMATIQUE & NUMÉRIQUE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'info-r-1', category: 'R', emoji: '⌨️', difficulty: 'basic',
    sector: 'Informatique & Numérique',
    text: "Aimez-vous assembler, monter et configurer des équipements informatiques ?",
    options: OPTIONS,
  },
  {
    id: 'info-r-2', category: 'R', emoji: '🖥️', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Êtes-vous à l'aise pour dépanner et réparer des problèmes techniques ?",
    options: OPTIONS,
  },
  {
    id: 'info-i-1', category: 'I', emoji: '💻', difficulty: 'basic',
    sector: 'Informatique & Numérique',
    text: "Êtes-vous attiré par la programmation, le code et la logique informatique ?",
    options: OPTIONS,
  },
  {
    id: 'info-i-2', category: 'I', emoji: '🔐', difficulty: 'advanced',
    sector: 'Informatique & Numérique',
    text: "Aimeriez-vous résoudre des problèmes complexes de cybersécurité et de données ?",
    options: OPTIONS,
  },
  {
    id: 'info-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Informatique & Numérique',
    text: "Aimeriez-vous créer des interfaces et des designs web attrayants ?",
    options: OPTIONS,
  },
  {
    id: 'info-a-2', category: 'A', emoji: '🌐', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Appréciez-vous concevoir l'expérience utilisateur et l'ergonomie des applications ?",
    options: OPTIONS,
  },
  {
    id: 'info-s-1', category: 'S', emoji: '💬', difficulty: 'basic',
    sector: 'Informatique & Numérique',
    text: "Aimeriez-vous aider les utilisateurs et fournir un support technique ?",
    options: OPTIONS,
  },
  {
    id: 'info-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Aimez-vous travailler en équipe sur des projets informatiques collaboratifs ?",
    options: OPTIONS,
  },
  {
    id: 'info-e-1', category: 'E', emoji: '🚀', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Aimeriez-vous lancer une startup technologique ou une app innovante ?",
    options: OPTIONS,
  },
  {
    id: 'info-c-1', category: 'C', emoji: '📊', difficulty: 'intermediate',
    sector: 'Informatique & Numérique',
    text: "Aimeriez-vous gérer les bases de données et assurer leur conformité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SANTÉ & SOCIAL - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'health-r-1', category: 'R', emoji: '🩺', difficulty: 'basic',
    sector: 'Santé & Social',
    text: "Êtes-vous à l'aise pour manipuler du matériel médical et des équipements de soin ?",
    options: OPTIONS,
  },
  {
    id: 'health-r-2', category: 'R', emoji: '💊', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Aimeriez-vous préparer et administrer des traitements ou des médicaments ?",
    options: OPTIONS,
  },
  {
    id: 'health-i-1', category: 'I', emoji: '🧬', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Êtes-vous intéressé par la biologie et les mécanismes du corps humain ?",
    options: OPTIONS,
  },
  {
    id: 'health-i-2', category: 'I', emoji: '📖', difficulty: 'advanced',
    sector: 'Santé & Social',
    text: "Aimeriez-vous étudier et contribuer à la recherche en santé ?",
    options: OPTIONS,
  },
  {
    id: 'health-a-1', category: 'A', emoji: '🎭', difficulty: 'basic',
    sector: 'Santé & Social',
    text: "Aimeriez-vous créer des programmes ludiques ou des thérapies créatives ?",
    options: OPTIONS,
  },
  {
    id: 'health-a-2', category: 'A', emoji: '🎵', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Aimeriez-vous utiliser l'art ou la musique comme moyen de soin ?",
    options: OPTIONS,
  },
  {
    id: 'health-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Santé & Social',
    text: "Avez-vous de l'empathie naturelle et aimez-vous soutenir les personnes souffrantes ?",
    options: OPTIONS,
  },
  {
    id: 'health-s-2', category: 'S', emoji: '🏥', difficulty: 'advanced',
    sector: 'Santé & Social',
    text: "Aimeriez-vous accompagner les patients dans leur parcours de soin ?",
    options: OPTIONS,
  },
  {
    id: 'health-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Aimeriez-vous promouvoir la santé publique et sensibiliser les populations ?",
    options: OPTIONS,
  },
  {
    id: 'health-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Santé & Social',
    text: "Aimeriez-vous gérer les dossiers médicaux et les données des patients ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ARTS & DESIGN - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'art-r-1', category: 'R', emoji: '🖌️', difficulty: 'basic',
    sector: 'Arts & Design',
    text: "Aimez-vous créer et manipuler des matériaux pour faire des objets artistiques ?",
    options: OPTIONS,
  },
  {
    id: 'art-r-2', category: 'R', emoji: '🏺', difficulty: 'intermediate',
    sector: 'Arts & Design',
    text: "Aimeriez-vous travailler avec des matériaux bruts (argile, bois, métal) ?",
    options: OPTIONS,
  },
  {
    id: 'art-i-1', category: 'I', emoji: '🔍', difficulty: 'basic',
    sector: 'Arts & Design',
    text: "Êtes-vous intéressé par l'histoire de l'art et les mouvements artistiques ?",
    options: OPTIONS,
  },
  {
    id: 'art-i-2', category: 'I', emoji: '📐', difficulty: 'intermediate',
    sector: 'Arts & Design',
    text: "Appréciez-vous l'analyse des proportions et de l'harmonie visuelle ?",
    options: OPTIONS,
  },
  {
    id: 'art-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Arts & Design',
    text: "Avez-vous une forte sensibilité artistique et créative ?",
    options: OPTIONS,
  },
  {
    id: 'art-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Arts & Design',
    text: "Aimeriez-vous exprimer votre vision personnelle à travers une œuvre d'art ?",
    options: OPTIONS,
  },
  {
    id: 'art-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Arts & Design',
    text: "Aimez-vous partager votre créativité et inspirer les autres ?",
    options: OPTIONS,
  },
  {
    id: 'art-s-2', category: 'S', emoji: '🎭', difficulty: 'intermediate',
    sector: 'Arts & Design',
    text: "Aimeriez-vous enseigner l'art ou animer des ateliers créatifs ?",
    options: OPTIONS,
  },
  {
    id: 'art-e-1', category: 'E', emoji: '💼', difficulty: 'intermediate',
    sector: 'Arts & Design',
    text: "Aimeriez-vous promouvoir et vendre vos créations artistiques ?",
    options: OPTIONS,
  },
  {
    id: 'art-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Arts & Design',
    text: "Aimeriez-vous gérer des catalogues et organiser des expositions ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // GESTION & MANAGEMENT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'mgmt-r-1', category: 'R', emoji: '🏗️', difficulty: 'basic',
    sector: 'Gestion & Management',
    text: "Aimez-vous voir les résultats concrets de vos décisions managériales ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-r-2', category: 'R', emoji: '⚙️', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Appréciez-vous optimiser les processus et améliorer l'efficacité ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Gestion & Management',
    text: "Aimez-vous analyser les données et les statistiques pour prendre des décisions ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-i-2', category: 'I', emoji: '🧮', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Êtes-vous à l'aise avec les chiffres, budgets et prévisions financières ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-a-1', category: 'A', emoji: '🎯', difficulty: 'basic',
    sector: 'Gestion & Management',
    text: "Aimeriez-vous créer une stratégie et une vision originale pour votre entreprise ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Aimez-vous innover et mettre en place de nouvelles approches ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Gestion & Management',
    text: "Aimez-vous motiver et développer votre équipe ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Êtes-vous doué pour créer un climat de confiance au travail ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-e-1', category: 'E', emoji: '🚀', difficulty: 'advanced',
    sector: 'Gestion & Management',
    text: "Aimeriez-vous diriger une entreprise et en assurer la croissance ?",
    options: OPTIONS,
  },
  {
    id: 'mgmt-c-1', category: 'C', emoji: '📈', difficulty: 'intermediate',
    sector: 'Gestion & Management',
    text: "Aimeriez-vous mettre en place des systèmes de contrôle et de suivi ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // COMMERCE & VENTE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'sales-r-1', category: 'R', emoji: '🛍️', difficulty: 'basic',
    sector: 'Commerce & Vente',
    text: "Aimez-vous manipuler des produits et les mettre en avant ?",
    options: OPTIONS,
  },
  {
    id: 'sales-r-2', category: 'R', emoji: '📦', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Êtes-vous à l'aise avec la gestion du stock et de l'inventaire ?",
    options: OPTIONS,
  },
  {
    id: 'sales-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Commerce & Vente',
    text: "Aimez-vous analyser les tendances de marché et le comportement des clients ?",
    options: OPTIONS,
  },
  {
    id: 'sales-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Appréciez-vous comprendre les motivations d'achat des consommateurs ?",
    options: OPTIONS,
  },
  {
    id: 'sales-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Commerce & Vente',
    text: "Aimeriez-vous créer des présentations et des vitrines attractives ?",
    options: OPTIONS,
  },
  {
    id: 'sales-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Aimez-vous concevoir des campagnes publicitaires créatives ?",
    options: OPTIONS,
  },
  {
    id: 'sales-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Commerce & Vente',
    text: "Aimez-vous interagir avec les clients et leur offrir une bonne expérience ?",
    options: OPTIONS,
  },
  {
    id: 'sales-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Êtes-vous doué pour écouter les besoins et proposer des solutions ?",
    options: OPTIONS,
  },
  {
    id: 'sales-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Commerce & Vente',
    text: "Aimeriez-vous atteindre des objectifs de vente ambitieux et compétitifs ?",
    options: OPTIONS,
  },
  {
    id: 'sales-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Commerce & Vente',
    text: "Aimeriez-vous gérer les contrats et assurer le suivi administratif des ventes ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // FINANCE & COMPTABILITÉ - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'finance-r-1', category: 'R', emoji: '💵', difficulty: 'basic',
    sector: 'Finance & Comptabilité',
    text: "Aimez-vous manier l'argent et gérer les transactions financières ?",
    options: OPTIONS,
  },
  {
    id: 'finance-r-2', category: 'R', emoji: '🏦', difficulty: 'intermediate',
    sector: 'Finance & Comptabilité',
    text: "Êtes-vous à l'aise pour archiver et classer les documents financiers ?",
    options: OPTIONS,
  },
  {
    id: 'finance-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Finance & Comptabilité',
    text: "Aimez-vous comprendre les mécanismes financiers et économiques ?",
    options: OPTIONS,
  },
  {
    id: 'finance-i-2', category: 'I', emoji: '🧮', difficulty: 'advanced',
    sector: 'Finance & Comptabilité',
    text: "Aimeriez-vous analyser les états financiers et détecter les anomalies ?",
    options: OPTIONS,
  },
  {
    id: 'finance-a-1', category: 'A', emoji: '📈', difficulty: 'basic',
    sector: 'Finance & Comptabilité',
    text: "Aimeriez-vous créer des visualisations et des graphiques financiers clairs ?",
    options: OPTIONS,
  },
  {
    id: 'finance-a-2', category: 'A', emoji: '🎨', difficulty: 'intermediate',
    sector: 'Finance & Comptabilité',
    text: "Aimez-vous présenter les données financières de façon compréhensible ?",
    options: OPTIONS,
  },
  {
    id: 'finance-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Finance & Comptabilité',
    text: "Aimez-vous expliquer les concepts financiers aux clients et collègues ?",
    options: OPTIONS,
  },
  {
    id: 'finance-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Finance & Comptabilité',
    text: "Êtes-vous doué pour conseiller les personnes sur leurs finances ?",
    options: OPTIONS,
  },
  {
    id: 'finance-e-1', category: 'E', emoji: '💡', difficulty: 'advanced',
    sector: 'Finance & Comptabilité',
    text: "Aimeriez-vous proposer des stratégies d'investissement innovantes ?",
    options: OPTIONS,
  },
  {
    id: 'finance-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Finance & Comptabilité',
    text: "Aimeriez-vous assurer la conformité fiscale et comptable stricte ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // INDUSTRIE & MÉCANIQUE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'mech-r-1', category: 'R', emoji: '⚙️', difficulty: 'basic',
    sector: 'Industrie & Mécanique',
    text: "Aimez-vous assembler, monter et fabriquer des pièces mécaniques ?",
    options: OPTIONS,
  },
  {
    id: 'mech-r-2', category: 'R', emoji: '🔧', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Êtes-vous à l'aise pour réparer et entretenir des machines ?",
    options: OPTIONS,
  },
  {
    id: 'mech-i-1', category: 'I', emoji: '🔬', difficulty: 'basic',
    sector: 'Industrie & Mécanique',
    text: "Êtes-vous curieux de comprendre comment fonctionnent les systèmes mécaniques ?",
    options: OPTIONS,
  },
  {
    id: 'mech-i-2', category: 'I', emoji: '📐', difficulty: 'advanced',
    sector: 'Industrie & Mécanique',
    text: "Aimeriez-vous concevoir et optimiser des systèmes mécaniques ?",
    options: OPTIONS,
  },
  {
    id: 'mech-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Industrie & Mécanique',
    text: "Aimeriez-vous créer des prototypes et des designs innovants ?",
    options: OPTIONS,
  },
  {
    id: 'mech-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Appréciez-vous les défis créatifs de résolution de problèmes techniques ?",
    options: OPTIONS,
  },
  {
    id: 'mech-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Industrie & Mécanique',
    text: "Aimez-vous travailler en équipe sur une chaîne de production ?",
    options: OPTIONS,
  },
  {
    id: 'mech-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Êtes-vous prêt à partager vos connaissances avec des apprentis ?",
    options: OPTIONS,
  },
  {
    id: 'mech-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Aimeriez-vous manager une équipe de production et atteindre des quotas ?",
    options: OPTIONS,
  },
  {
    id: 'mech-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Industrie & Mécanique',
    text: "Aimeriez-vous assurer le contrôle qualité et les normes de sécurité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ÉLECTRICITÉ & ÉLECTRONIQUE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'elec-r-1', category: 'R', emoji: '⚡', difficulty: 'basic',
    sector: 'Électricité & Électronique',
    text: "Aimez-vous installer, câbler et connecter des systèmes électriques ?",
    options: OPTIONS,
  },
  {
    id: 'elec-r-2', category: 'R', emoji: '🔌', difficulty: 'intermediate',
    sector: 'Électricité & Électronique',
    text: "Êtes-vous à l'aise pour dépanner des pannes électriques ?",
    options: OPTIONS,
  },
  {
    id: 'elec-i-1', category: 'I', emoji: '⚙️', difficulty: 'basic',
    sector: 'Électricité & Électronique',
    text: "Êtes-vous fasciné par le fonctionnement des circuits électroniques ?",
    options: OPTIONS,
  },
  {
    id: 'elec-i-2', category: 'I', emoji: '🧪', difficulty: 'advanced',
    sector: 'Électricité & Électronique',
    text: "Aimeriez-vous concevoir de nouveaux composants ou circuits innovants ?",
    options: OPTIONS,
  },
  {
    id: 'elec-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Électricité & Électronique',
    text: "Aimeriez-vous créer des designs élégants pour des appareils électroniques ?",
    options: OPTIONS,
  },
  {
    id: 'elec-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Électricité & Électronique',
    text: "Aimez-vous inventer des solutions créatives aux problèmes techniques ?",
    options: OPTIONS,
  },
  {
    id: 'elec-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Électricité & Électronique',
    text: "Aimez-vous expliquer les concepts électriques aux clients ?",
    options: OPTIONS,
  },
  {
    id: 'elec-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Électricité & Électronique',
    text: "Êtes-vous doué pour conseiller les personnes sur leurs installations ?",
    options: OPTIONS,
  },
  {
    id: 'elec-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Électricité & Électronique',
    text: "Aimeriez-vous lancer une entreprise d'électricité ou d'électronique ?",
    options: OPTIONS,
  },
  {
    id: 'elec-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Électricité & Électronique',
    text: "Aimeriez-vous assurer la conformité aux normes électriques et de sécurité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // MÉTIERS VERTS - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'green-r-1', category: 'R', emoji: '🌱', difficulty: 'basic',
    sector: 'Métiers Verts',
    text: "Aimez-vous travailler avec la nature, les plantes et les animaux ?",
    options: OPTIONS,
  },
  {
    id: 'green-r-2', category: 'R', emoji: '🌿', difficulty: 'intermediate',
    sector: 'Métiers Verts',
    text: "Êtes-vous à l'aise pour jardiner, cultiver ou entretenir la nature ?",
    options: OPTIONS,
  },
  {
    id: 'green-i-1', category: 'I', emoji: '🧬', difficulty: 'basic',
    sector: 'Métiers Verts',
    text: "Êtes-vous intéressé par l'écologie et les écosystèmes ?",
    options: OPTIONS,
  },
  {
    id: 'green-i-2', category: 'I', emoji: '🌍', difficulty: 'advanced',
    sector: 'Métiers Verts',
    text: "Aimeriez-vous étudier et résoudre les problèmes environnementaux ?",
    options: OPTIONS,
  },
  {
    id: 'green-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Métiers Verts',
    text: "Aimeriez-vous créer des paysages et des espaces verts beaux ?",
    options: OPTIONS,
  },
  {
    id: 'green-a-2', category: 'A', emoji: '🌈', difficulty: 'intermediate',
    sector: 'Métiers Verts',
    text: "Appréciez-vous concevoir des jardins et des plans d'aménagement ?",
    options: OPTIONS,
  },
  {
    id: 'green-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Métiers Verts',
    text: "Aimeriez-vous sensibiliser les gens à l'environnement et à la nature ?",
    options: OPTIONS,
  },
  {
    id: 'green-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Métiers Verts',
    text: "Aimez-vous travailler en équipe pour des projets écologiques ?",
    options: OPTIONS,
  },
  {
    id: 'green-e-1', category: 'E', emoji: '🚀', difficulty: 'intermediate',
    sector: 'Métiers Verts',
    text: "Aimeriez-vous créer une entreprise verte ou un projet écologique ?",
    options: OPTIONS,
  },
  {
    id: 'green-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Métiers Verts',
    text: "Aimeriez-vous assurer la conformité environnementale et les certifications ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // TOURISME & LOISIRS - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'tour-r-1', category: 'R', emoji: '✈️', difficulty: 'basic',
    sector: 'Tourisme & Loisirs',
    text: "Aimez-vous organiser et planifier des voyages et des excursions ?",
    options: OPTIONS,
  },
  {
    id: 'tour-r-2', category: 'R', emoji: '🗺️', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Êtes-vous à l'aise pour gérer la logistique de groupes touristiques ?",
    options: OPTIONS,
  },
  {
    id: 'tour-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Tourisme & Loisirs',
    text: "Êtes-vous intéressé par la géographie, l'histoire et les cultures ?",
    options: OPTIONS,
  },
  {
    id: 'tour-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Aimeriez-vous analyser les données de fréquentation et les tendances touristiques ?",
    options: OPTIONS,
  },
  {
    id: 'tour-a-1', category: 'A', emoji: '📸', difficulty: 'basic',
    sector: 'Tourisme & Loisirs',
    text: "Aimeriez-vous créer des expériences touristiques originales et mémorables ?",
    options: OPTIONS,
  },
  {
    id: 'tour-a-2', category: 'A', emoji: '🎨', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Aimez-vous concevoir des événements et des animations créatives ?",
    options: OPTIONS,
  },
  {
    id: 'tour-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Tourisme & Loisirs',
    text: "Aimez-vous accueillir et créer des expériences agréables pour les clients ?",
    options: OPTIONS,
  },
  {
    id: 'tour-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Êtes-vous doué pour communiquer avec les touristes de différentes cultures ?",
    options: OPTIONS,
  },
  {
    id: 'tour-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Tourisme & Loisirs',
    text: "Aimeriez-vous développer une entreprise touristique ou une agence de voyages ?",
    options: OPTIONS,
  },
  {
    id: 'tour-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Tourisme & Loisirs',
    text: "Aimeriez-vous gérer les réservations et les contrats touristiques ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // HÔTELLERIE & RESTAURATION - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'hotel-r-1', category: 'R', emoji: '🍳', difficulty: 'basic',
    sector: 'Hôtellerie & Restauration',
    text: "Aimez-vous préparer et servir de la nourriture et des boissons ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-r-2', category: 'R', emoji: '🔪', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Êtes-vous à l'aise pour gérer une cuisine ou une salle de service ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Hôtellerie & Restauration',
    text: "Aimez-vous comprendre les techniques culinaires et les process ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-i-2', category: 'I', emoji: '🧪', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Aimeriez-vous concevoir de nouveaux menus ou techniques culinaires ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Hôtellerie & Restauration',
    text: "Aimeriez-vous créer des plats esthétiquement beaux et appétissants ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Aimez-vous décorer et créer une ambiance accueillante ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Hôtellerie & Restauration',
    text: "Aimez-vous servir les clients et créer une expérience positive ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Êtes-vous doué pour gérer les demandes spéciales des clients ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-e-1', category: 'E', emoji: '🏨', difficulty: 'advanced',
    sector: 'Hôtellerie & Restauration',
    text: "Aimeriez-vous diriger un restaurant ou un établissement hôtelier ?",
    options: OPTIONS,
  },
  {
    id: 'hotel-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Hôtellerie & Restauration',
    text: "Aimeriez-vous gérer les stocks, l'hygiène et les normes de sécurité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ÉDUCATION & ENSEIGNEMENT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'edu-r-1', category: 'R', emoji: '📐', difficulty: 'basic',
    sector: 'Éducation & Enseignement',
    text: "Aimez-vous utiliser des matériels pédagogiques et des outils concrets ?",
    options: OPTIONS,
  },
  {
    id: 'edu-r-2', category: 'R', emoji: '🏫', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Êtes-vous à l'aise pour mettre en place des activités pratiques et manuelles ?",
    options: OPTIONS,
  },
  {
    id: 'edu-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Éducation & Enseignement',
    text: "Avez-vous une passion pour l'apprentissage et la transmission du savoir ?",
    options: OPTIONS,
  },
  {
    id: 'edu-i-2', category: 'I', emoji: '🧠', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Aimeriez-vous développer des programmes pédagogiques innovants ?",
    options: OPTIONS,
  },
  {
    id: 'edu-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Éducation & Enseignement',
    text: "Aimeriez-vous créer des supports pédagogiques attractifs et créatifs ?",
    options: OPTIONS,
  },
  {
    id: 'edu-a-2', category: 'A', emoji: '🎭', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Aimez-vous animer les cours de façon dynamique et engageante ?",
    options: OPTIONS,
  },
  {
    id: 'edu-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Éducation & Enseignement',
    text: "Aimez-vous enseigner et aider les élèves à progresser ?",
    options: OPTIONS,
  },
  {
    id: 'edu-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Êtes-vous doué pour motivar et créer un bon climat de classe ?",
    options: OPTIONS,
  },
  {
    id: 'edu-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Aimeriez-vous diriger un établissement scolaire ou éducatif ?",
    options: OPTIONS,
  },
  {
    id: 'edu-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Éducation & Enseignement',
    text: "Aimeriez-vous gérer l'administration et les dossiers des élèves ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // MULTIMÉDIA & AUDIOVISUEL - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'media-r-1', category: 'R', emoji: '🎥', difficulty: 'basic',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimez-vous utiliser des équipements de tournage et de montage ?",
    options: OPTIONS,
  },
  {
    id: 'media-r-2', category: 'R', emoji: '🎙️', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Êtes-vous à l'aise avec les technologies audiovisuelles et d'enregistrement ?",
    options: OPTIONS,
  },
  {
    id: 'media-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Multimédia & Audiovisuel',
    text: "Êtes-vous intéressé par la technologie et les systèmes de diffusion ?",
    options: OPTIONS,
  },
  {
    id: 'media-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimeriez-vous analyser les audiences et l'impact des contenus ?",
    options: OPTIONS,
  },
  {
    id: 'media-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Multimédia & Audiovisuel',
    text: "Avez-vous une vision créative pour raconter des histoires visuelles ?",
    options: OPTIONS,
  },
  {
    id: 'media-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimeriez-vous créer des productions audiovisuelles originales ?",
    options: OPTIONS,
  },
  {
    id: 'media-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimez-vous collaborer en équipe sur des projets créatifs ?",
    options: OPTIONS,
  },
  {
    id: 'media-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Êtes-vous doué pour communiquer et exprimer des émotions ?",
    options: OPTIONS,
  },
  {
    id: 'media-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimeriez-vous lancer une entreprise de production audiovisuelle ?",
    options: OPTIONS,
  },
  {
    id: 'media-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Multimédia & Audiovisuel',
    text: "Aimeriez-vous gérer les budgets et les plannings de production ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ARCHITECTURE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'arch-r-1', category: 'R', emoji: '🏗️', difficulty: 'basic',
    sector: 'Architecture',
    text: "Aimez-vous construire, assembler et concevoir des structures ?",
    options: OPTIONS,
  },
  {
    id: 'arch-r-2', category: 'R', emoji: '📏', difficulty: 'intermediate',
    sector: 'Architecture',
    text: "Êtes-vous à l'aise avec les matériaux de construction et les outils ?",
    options: OPTIONS,
  },
  {
    id: 'arch-i-1', category: 'I', emoji: '📐', difficulty: 'basic',
    sector: 'Architecture',
    text: "Êtes-vous fasciné par les structures, les proportions et l'ingénierie ?",
    options: OPTIONS,
  },
  {
    id: 'arch-i-2', category: 'I', emoji: '🧮', difficulty: 'advanced',
    sector: 'Architecture',
    text: "Aimeriez-vous concevoir des bâtiments durables et innovants ?",
    options: OPTIONS,
  },
  {
    id: 'arch-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Architecture',
    text: "Avez-vous une forte sensibilité à l'esthétique des bâtiments ?",
    options: OPTIONS,
  },
  {
    id: 'arch-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Architecture',
    text: "Aimeriez-vous créer des espaces qui reflètent votre vision artistique ?",
    options: OPTIONS,
  },
  {
    id: 'arch-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Architecture',
    text: "Aimez-vous travailler avec les clients pour comprendre leurs besoins ?",
    options: OPTIONS,
  },
  {
    id: 'arch-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Architecture',
    text: "Êtes-vous doué pour collaborer avec des équipes multidisciplinaires ?",
    options: OPTIONS,
  },
  {
    id: 'arch-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Architecture',
    text: "Aimeriez-vous créer votre propre cabinet d'architecture ?",
    options: OPTIONS,
  },
  {
    id: 'arch-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Architecture',
    text: "Aimeriez-vous respecter les normes, réglementations et devis ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // IMMOBILIER & DÉVELOPPEMENT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'real-r-1', category: 'R', emoji: '🏠', difficulty: 'basic',
    sector: 'Immobilier & Développement',
    text: "Aimez-vous visiter des propriétés et les évaluer concrètement ?",
    options: OPTIONS,
  },
  {
    id: 'real-r-2', category: 'R', emoji: '🔑', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Êtes-vous à l'aise pour gérer les aspects pratiques des transactions ?",
    options: OPTIONS,
  },
  {
    id: 'real-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Immobilier & Développement',
    text: "Aimez-vous analyser le marché immobilier et les tendances des prix ?",
    options: OPTIONS,
  },
  {
    id: 'real-i-2', category: 'I', emoji: '📐', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Aimeriez-vous planifier et développer des projets immobiliers ?",
    options: OPTIONS,
  },
  {
    id: 'real-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Immobilier & Développement',
    text: "Aimeriez-vous concevoir des espaces attrayants et fonctionnels ?",
    options: OPTIONS,
  },
  {
    id: 'real-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Aimez-vous créer une ambiance accueillante dans les propriétés ?",
    options: OPTIONS,
  },
  {
    id: 'real-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Immobilier & Développement',
    text: "Aimez-vous interagir avec les clients et comprendre leurs rêves immobiliers ?",
    options: OPTIONS,
  },
  {
    id: 'real-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Êtes-vous doué pour négocier et conclure des accords ?",
    options: OPTIONS,
  },
  {
    id: 'real-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Immobilier & Développement',
    text: "Aimeriez-vous créer une agence immobilière ou développer des projets ?",
    options: OPTIONS,
  },
  {
    id: 'real-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Immobilier & Développement',
    text: "Aimeriez-vous gérer les dossiers légaux et les contrats immobiliers ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // DROIT & LÉGAL - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'law-r-1', category: 'R', emoji: '📄', difficulty: 'basic',
    sector: 'Droit & Légal',
    text: "Aimez-vous organiser et classer les documents légaux ?",
    options: OPTIONS,
  },
  {
    id: 'law-r-2', category: 'R', emoji: '⚖️', difficulty: 'intermediate',
    sector: 'Droit & Légal',
    text: "Êtes-vous à l'aise pour gérer des dossiers judiciaires et administratifs ?",
    options: OPTIONS,
  },
  {
    id: 'law-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Droit & Légal',
    text: "Avez-vous une passion pour la loi, la justice et l'ordre légal ?",
    options: OPTIONS,
  },
  {
    id: 'law-i-2', category: 'I', emoji: '🔍', difficulty: 'advanced',
    sector: 'Droit & Légal',
    text: "Aimeriez-vous analyser les cas complexes et trouver des solutions légales ?",
    options: OPTIONS,
  },
  {
    id: 'law-a-1', category: 'A', emoji: '🗣️', difficulty: 'basic',
    sector: 'Droit & Légal',
    text: "Aimeriez-vous exprimer vos idées avec éloquence et persuasion ?",
    options: OPTIONS,
  },
  {
    id: 'law-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Droit & Légal',
    text: "Aimez-vous rédiger des documents légaux clairs et persuasifs ?",
    options: OPTIONS,
  },
  {
    id: 'law-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Droit & Légal',
    text: "Aimez-vous aider les personnes à comprendre leurs droits ?",
    options: OPTIONS,
  },
  {
    id: 'law-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Droit & Légal',
    text: "Êtes-vous doué pour négocier et trouver des solutions équitables ?",
    options: OPTIONS,
  },
  {
    id: 'law-e-1', category: 'E', emoji: '📢', difficulty: 'advanced',
    sector: 'Droit & Légal',
    text: "Aimeriez-vous représenter des clients en tant qu'avocat ou avocat spécialisé ?",
    options: OPTIONS,
  },
  {
    id: 'law-c-1', category: 'C', emoji: '📋', difficulty: 'advanced',
    sector: 'Droit & Légal',
    text: "Aimeriez-vous assurer le respect strict des normes et réglementations ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // RESSOURCES HUMAINES - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'hr-r-1', category: 'R', emoji: '📋', difficulty: 'basic',
    sector: 'Ressources Humaines',
    text: "Aimez-vous organiser des événements et des activités de team-building ?",
    options: OPTIONS,
  },
  {
    id: 'hr-r-2', category: 'R', emoji: '📊', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Êtes-vous à l'aise pour gérer les aspects administratifs du personnel ?",
    options: OPTIONS,
  },
  {
    id: 'hr-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Ressources Humaines',
    text: "Êtes-vous intéressé par la psychologie du travail et le comportement humain ?",
    options: OPTIONS,
  },
  {
    id: 'hr-i-2', category: 'I', emoji: '📊', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Aimeriez-vous analyser les données de performance et satisfaction du personnel ?",
    options: OPTIONS,
  },
  {
    id: 'hr-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Ressources Humaines',
    text: "Aimeriez-vous créer des programs de développement personnel innovants ?",
    options: OPTIONS,
  },
  {
    id: 'hr-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Aimez-vous concevoir des stratégies de communication créatives ?",
    options: OPTIONS,
  },
  {
    id: 'hr-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Ressources Humaines',
    text: "Aimez-vous écouter et aider les employés à résoudre leurs problèmes ?",
    options: OPTIONS,
  },
  {
    id: 'hr-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Êtes-vous doué pour créer un climat de confiance au travail ?",
    options: OPTIONS,
  },
  {
    id: 'hr-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Ressources Humaines',
    text: "Aimeriez-vous diriger le département RH et influencer la culture d'entreprise ?",
    options: OPTIONS,
  },
  {
    id: 'hr-c-1', category: 'C', emoji: '📋', difficulty: 'advanced',
    sector: 'Ressources Humaines',
    text: "Aimeriez-vous assurer la conformité des règles d'emploi et des normes ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // LOGISTIQUE & TRANSPORT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'logis-r-1', category: 'R', emoji: '🚚', difficulty: 'basic',
    sector: 'Logistique & Transport',
    text: "Aimez-vous conduire et vous déplacer pour livrer des marchandises ?",
    options: OPTIONS,
  },
  {
    id: 'logis-r-2', category: 'R', emoji: '📦', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Êtes-vous à l'aise pour charger, décharger et manipuler des colis ?",
    options: OPTIONS,
  },
  {
    id: 'logis-i-1', category: 'I', emoji: '🗺️', difficulty: 'basic',
    sector: 'Logistique & Transport',
    text: "Aimez-vous planifier des itinéraires et optimiser les déplacements ?",
    options: OPTIONS,
  },
  {
    id: 'logis-i-2', category: 'I', emoji: '📊', difficulty: 'advanced',
    sector: 'Logistique & Transport',
    text: "Aimeriez-vous analyser les flux et optimiser les chaînes d'approvisionnement ?",
    options: OPTIONS,
  },
  {
    id: 'logis-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Logistique & Transport',
    text: "Aimeriez-vous concevoir des solutions créatives aux problèmes logistiques ?",
    options: OPTIONS,
  },
  {
    id: 'logis-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Aimez-vous innover dans l'organisation et l'optimisation ?",
    options: OPTIONS,
  },
  {
    id: 'logis-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Logistique & Transport',
    text: "Aimez-vous travailler en équipe et coordonner avec d'autres ?",
    options: OPTIONS,
  },
  {
    id: 'logis-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Êtes-vous doué pour communiquer avec les clients et les fournisseurs ?",
    options: OPTIONS,
  },
  {
    id: 'logis-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Logistique & Transport',
    text: "Aimeriez-vous gérer une entreprise de transport ou de logistique ?",
    options: OPTIONS,
  },
  {
    id: 'logis-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Logistique & Transport',
    text: "Aimeriez-vous gérer les inventaires et assurer le suivi des expéditions ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // AGRICULTURE & MÉTIERS VERTS - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'agri-r-1', category: 'R', emoji: '🚜', difficulty: 'basic',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimez-vous utiliser des machines agricoles et des outils pratiques ?",
    options: OPTIONS,
  },
  {
    id: 'agri-r-2', category: 'R', emoji: '🌾', difficulty: 'intermediate',
    sector: 'Agriculture & Métiers Verts',
    text: "Êtes-vous à l'aise pour cultiver, semer et récolter ?",
    options: OPTIONS,
  },
  {
    id: 'agri-i-1', category: 'I', emoji: '🧬', difficulty: 'basic',
    sector: 'Agriculture & Métiers Verts',
    text: "Êtes-vous intéressé par l'agronomie, les sols et les cultures ?",
    options: OPTIONS,
  },
  {
    id: 'agri-i-2', category: 'I', emoji: '🌍', difficulty: 'advanced',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimeriez-vous développer l'agriculture durable et écologique ?",
    options: OPTIONS,
  },
  {
    id: 'agri-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimeriez-vous créer de beaux espaces verts et paysagers ?",
    options: OPTIONS,
  },
  {
    id: 'agri-a-2', category: 'A', emoji: '🌈', difficulty: 'intermediate',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimez-vous concevoir des projets d'aménagement paysager ?",
    options: OPTIONS,
  },
  {
    id: 'agri-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimez-vous travailler avec d'autres agriculteurs ou dans une coopérative ?",
    options: OPTIONS,
  },
  {
    id: 'agri-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Agriculture & Métiers Verts',
    text: "Êtes-vous doué pour enseigner les techniques agricoles ?",
    options: OPTIONS,
  },
  {
    id: 'agri-e-1', category: 'E', emoji: '🚀', difficulty: 'intermediate',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimeriez-vous créer une exploitation agricole ou une entreprise verte ?",
    options: OPTIONS,
  },
  {
    id: 'agri-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Agriculture & Métiers Verts',
    text: "Aimeriez-vous gérer les budgets, les subventions et la conformité ?",
    options: OPTIONS,
  },
];

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
