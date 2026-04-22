/**
 * Adaptive RIASEC Test — 400 Questions Pool (COMPLETE: All 40 Sectors)
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
  // DÉFENSE & ARMÉE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'def-r-1', category: 'R', emoji: '⚙️', difficulty: 'basic',
    sector: 'Défense & Armée',
    text: "Êtes-vous à l'aise avec les équipements militaires, les véhicules et les technologies tactiques ?",
    options: OPTIONS,
  },
  {
    id: 'def-r-2', category: 'R', emoji: '🛠️', difficulty: 'intermediate',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous apprendre à piloter ou maintenir des appareils militaires sophistiqués ?",
    options: OPTIONS,
  },
  {
    id: 'def-i-1', category: 'I', emoji: '🔐', difficulty: 'basic',
    sector: 'Défense & Armée',
    text: "Êtes-vous intéressé par la cybersécurité, le renseignement et les stratégies militaires ?",
    options: OPTIONS,
  },
  {
    id: 'def-i-2', category: 'I', emoji: '🗺️', difficulty: 'advanced',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous analyser les données géopolitiques et planifier des opérations ?",
    options: OPTIONS,
  },
  {
    id: 'def-a-1', category: 'A', emoji: '🎖️', difficulty: 'basic',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous créer des insignes, des uniformes ou des communications visuelles militaires ?",
    options: OPTIONS,
  },
  {
    id: 'def-a-2', category: 'A', emoji: '📡', difficulty: 'intermediate',
    sector: 'Défense & Armée',
    text: "Appréciez-vous concevoir des systèmes de communication et de coordination tactique ?",
    options: OPTIONS,
  },
  {
    id: 'def-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous servir votre pays et protéger les citoyens en uniforme ?",
    options: OPTIONS,
  },
  {
    id: 'def-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Défense & Armée',
    text: "Aimez-vous travailler en équipe disciplinée et hiérarchisée ?",
    options: OPTIONS,
  },
  {
    id: 'def-e-1', category: 'E', emoji: '🎯', difficulty: 'intermediate',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous commander une unité ou diriger des opérations militaires ?",
    options: OPTIONS,
  },
  {
    id: 'def-c-1', category: 'C', emoji: '📋', difficulty: 'advanced',
    sector: 'Défense & Armée',
    text: "Aimeriez-vous gérer les protocoles de sécurité, les règlements et la conformité militaire ?",
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

  // ─────────────────────────────────────────────────────────────
  // CHIMIE & PHARMACIE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'chem-r-1', category: 'R', emoji: '🧪', difficulty: 'basic',
    sector: 'Chimie & Pharmacie',
    text: "Aimez-vous manipuler du matériel de laboratoire et des produits chimiques ?",
    options: OPTIONS,
  },
  {
    id: 'chem-r-2', category: 'R', emoji: '⚗️', difficulty: 'intermediate',
    sector: 'Chimie & Pharmacie',
    text: "Êtes-vous à l'aise avec les équipements de chimie et les processus pratiques ?",
    options: OPTIONS,
  },
  {
    id: 'chem-i-1', category: 'I', emoji: '🧬', difficulty: 'basic',
    sector: 'Chimie & Pharmacie',
    text: "Êtes-vous fasciné par les molécules, les réactions chimiques et la physique ?",
    options: OPTIONS,
  },
  {
    id: 'chem-i-2', category: 'I', emoji: '🔬', difficulty: 'advanced',
    sector: 'Chimie & Pharmacie',
    text: "Aimeriez-vous concevoir de nouveaux médicaments ou composés chimiques ?",
    options: OPTIONS,
  },
  {
    id: 'chem-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Chimie & Pharmacie',
    text: "Aimeriez-vous créer des formulations innovantes et esthétiques ?",
    options: OPTIONS,
  },
  {
    id: 'chem-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Chimie & Pharmacie',
    text: "Aimez-vous résoudre les défis complexes de façon créative ?",
    options: OPTIONS,
  },
  {
    id: 'chem-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Chimie & Pharmacie',
    text: "Aimez-vous expliquer les procédés chimiques aux personnes ?",
    options: OPTIONS,
  },
  {
    id: 'chem-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Chimie & Pharmacie',
    text: "Êtes-vous doué pour collaborer en équipe scientifique ?",
    options: OPTIONS,
  },
  {
    id: 'chem-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Chimie & Pharmacie',
    text: "Aimeriez-vous créer une entreprise pharmaceutique ou chimique ?",
    options: OPTIONS,
  },
  {
    id: 'chem-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Chimie & Pharmacie',
    text: "Aimeriez-vous assurer la conformité des normes de sécurité et qualité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // RECHERCHE SCIENTIFIQUE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'research-r-1', category: 'R', emoji: '🔬', difficulty: 'basic',
    sector: 'Recherche Scientifique',
    text: "Aimez-vous conduire des expériences pratiques et observer les résultats ?",
    options: OPTIONS,
  },
  {
    id: 'research-r-2', category: 'R', emoji: '🧬', difficulty: 'intermediate',
    sector: 'Recherche Scientifique',
    text: "Êtes-vous à l'aise avec les appareils scientifiques complexes ?",
    options: OPTIONS,
  },
  {
    id: 'research-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Recherche Scientifique',
    text: "Avez-vous une soif intense de découverte et de connaissance ?",
    options: OPTIONS,
  },
  {
    id: 'research-i-2', category: 'I', emoji: '🧮', difficulty: 'advanced',
    sector: 'Recherche Scientifique',
    text: "Aimeriez-vous contribuer à des découvertes scientifiques majeures ?",
    options: OPTIONS,
  },
  {
    id: 'research-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Recherche Scientifique',
    text: "Aimeriez-vous approcher la science de manière créative et innovante ?",
    options: OPTIONS,
  },
  {
    id: 'research-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Recherche Scientifique',
    text: "Aimez-vous proposer des hypothèses originales et non conventionnelles ?",
    options: OPTIONS,
  },
  {
    id: 'research-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Recherche Scientifique',
    text: "Aimez-vous collaborer avec d'autres chercheurs et partager vos findings ?",
    options: OPTIONS,
  },
  {
    id: 'research-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Recherche Scientifique',
    text: "Êtes-vous doué pour présenter vos résultats et convaincre les pairs ?",
    options: OPTIONS,
  },
  {
    id: 'research-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Recherche Scientifique',
    text: "Aimeriez-vous diriger un laboratoire ou une équipe de recherche ?",
    options: OPTIONS,
  },
  {
    id: 'research-c-1', category: 'C', emoji: '📋', difficulty: 'advanced',
    sector: 'Recherche Scientifique',
    text: "Aimeriez-vous gérer les budgets de recherche et la documentation ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ENVIRONNEMENT & DÉVELOPPEMENT DURABLE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'env-r-1', category: 'R', emoji: '♻️', difficulty: 'basic',
    sector: 'Environnement & Développement Durable',
    text: "Aimez-vous mettre en œuvre des solutions écologiques concrètes ?",
    options: OPTIONS,
  },
  {
    id: 'env-r-2', category: 'R', emoji: '🌱', difficulty: 'intermediate',
    sector: 'Environnement & Développement Durable',
    text: "Êtes-vous à l'aise pour gérer les déchets et les ressources durables ?",
    options: OPTIONS,
  },
  {
    id: 'env-i-1', category: 'I', emoji: '🌍', difficulty: 'basic',
    sector: 'Environnement & Développement Durable',
    text: "Êtes-vous préoccupé par les enjeux environnementaux mondiaux ?",
    options: OPTIONS,
  },
  {
    id: 'env-i-2', category: 'I', emoji: '📊', difficulty: 'advanced',
    sector: 'Environnement & Développement Durable',
    text: "Aimeriez-vous analyser et réduire l'empreinte carbone des entreprises ?",
    options: OPTIONS,
  },
  {
    id: 'env-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Environnement & Développement Durable',
    text: "Aimeriez-vous créer des campagnes écologiques inspirantes ?",
    options: OPTIONS,
  },
  {
    id: 'env-a-2', category: 'A', emoji: '🌈', difficulty: 'intermediate',
    sector: 'Environnement & Développement Durable',
    text: "Aimez-vous concevoir des projets durables et esthétiques ?",
    options: OPTIONS,
  },
  {
    id: 'env-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Environnement & Développement Durable',
    text: "Aimeriez-vous sensibiliser et éduquer les communautés ?",
    options: OPTIONS,
  },
  {
    id: 'env-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Environnement & Développement Durable',
    text: "Aimez-vous mobiliser les gens pour des causes environnementales ?",
    options: OPTIONS,
  },
  {
    id: 'env-e-1', category: 'E', emoji: '🚀', difficulty: 'intermediate',
    sector: 'Environnement & Développement Durable',
    text: "Aimeriez-vous créer une startup ou une ONG écologique ?",
    options: OPTIONS,
  },
  {
    id: 'env-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Environnement & Développement Durable',
    text: "Aimeriez-vous assurer la conformité aux normes environnementales ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // INGÉNIERIE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'eng-r-1', category: 'R', emoji: '🏗️', difficulty: 'basic',
    sector: 'Ingénierie',
    text: "Aimez-vous construire et assembler des structures complexes ?",
    options: OPTIONS,
  },
  {
    id: 'eng-r-2', category: 'R', emoji: '⚙️', difficulty: 'intermediate',
    sector: 'Ingénierie',
    text: "Êtes-vous à l'aise avec les outils et machines industrielles ?",
    options: OPTIONS,
  },
  {
    id: 'eng-i-1', category: 'I', emoji: '📐', difficulty: 'basic',
    sector: 'Ingénierie',
    text: "Êtes-vous fasciné par les mathématiques, la physique et les systèmes ?",
    options: OPTIONS,
  },
  {
    id: 'eng-i-2', category: 'I', emoji: '🧮', difficulty: 'advanced',
    sector: 'Ingénierie',
    text: "Aimeriez-vous concevoir et optimiser des systèmes complexes ?",
    options: OPTIONS,
  },
  {
    id: 'eng-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Ingénierie',
    text: "Aimeriez-vous créer des designs innovants et élégants ?",
    options: OPTIONS,
  },
  {
    id: 'eng-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Ingénierie',
    text: "Aimez-vous trouver des solutions créatives aux défis techniques ?",
    options: OPTIONS,
  },
  {
    id: 'eng-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Ingénierie',
    text: "Aimez-vous collaborer avec d'autres ingénieurs et experts ?",
    options: OPTIONS,
  },
  {
    id: 'eng-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Ingénierie',
    text: "Êtes-vous doué pour communiquer des concepts techniques complexes ?",
    options: OPTIONS,
  },
  {
    id: 'eng-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Ingénierie',
    text: "Aimeriez-vous diriger un bureau d'études ou une équipe d'ingénierie ?",
    options: OPTIONS,
  },
  {
    id: 'eng-c-1', category: 'C', emoji: '📋', difficulty: 'advanced',
    sector: 'Ingénierie',
    text: "Aimeriez-vous respecter les normes ISO et les réglementations techniques ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ENTREPRENEURIAT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'entre-r-1', category: 'R', emoji: '💼', difficulty: 'basic',
    sector: 'Entrepreneuriat',
    text: "Aimez-vous voir vos idées devenir réalité concrètement ?",
    options: OPTIONS,
  },
  {
    id: 'entre-r-2', category: 'R', emoji: '🛠️', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Êtes-vous à l'aise pour résoudre les problèmes pratiques rapidement ?",
    options: OPTIONS,
  },
  {
    id: 'entre-i-1', category: 'I', emoji: '💡', difficulty: 'basic',
    sector: 'Entrepreneuriat',
    text: "Aimez-vous analyser les marchés et identifier les opportunités ?",
    options: OPTIONS,
  },
  {
    id: 'entre-i-2', category: 'I', emoji: '📊', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Aimeriez-vous étudier les tendances et planifier la croissance ?",
    options: OPTIONS,
  },
  {
    id: 'entre-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Entrepreneuriat',
    text: "Avez-vous une vision créative pour votre entreprise future ?",
    options: OPTIONS,
  },
  {
    id: 'entre-a-2', category: 'A', emoji: '🌟', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Aimez-vous innover et créer des solutions nouvelles ?",
    options: OPTIONS,
  },
  {
    id: 'entre-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Entrepreneuriat',
    text: "Aimez-vous inspirer et motiver une équipe autour de votre vision ?",
    options: OPTIONS,
  },
  {
    id: 'entre-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Êtes-vous doué pour négocier avec partenaires et investisseurs ?",
    options: OPTIONS,
  },
  {
    id: 'entre-e-1', category: 'E', emoji: '🚀', difficulty: 'advanced',
    sector: 'Entrepreneuriat',
    text: "Aimeriez-vous créer et diriger votre propre entreprise ?",
    options: OPTIONS,
  },
  {
    id: 'entre-c-1', category: 'C', emoji: '📈', difficulty: 'intermediate',
    sector: 'Entrepreneuriat',
    text: "Aimeriez-vous gérer les finances et assurer la viabilité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // CONSEIL & COACHING - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'coach-r-1', category: 'R', emoji: '📋', difficulty: 'basic',
    sector: 'Conseil & Coaching',
    text: "Aimez-vous organiser et structurer les actions concrètement ?",
    options: OPTIONS,
  },
  {
    id: 'coach-r-2', category: 'R', emoji: '✅', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Êtes-vous à l'aise pour mettre en place et suivre les plans d'action ?",
    options: OPTIONS,
  },
  {
    id: 'coach-i-1', category: 'I', emoji: '🧠', difficulty: 'basic',
    sector: 'Conseil & Coaching',
    text: "Aimez-vous analyser les problèmes et trouver des solutions ?",
    options: OPTIONS,
  },
  {
    id: 'coach-i-2', category: 'I', emoji: '💡', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Aimeriez-vous concevoir des stratégies et des formations personnalisées ?",
    options: OPTIONS,
  },
  {
    id: 'coach-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Conseil & Coaching',
    text: "Aimeriez-vous créer des programmes d'accompagnement innovants ?",
    options: OPTIONS,
  },
  {
    id: 'coach-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Aimez-vous trouver des approches créatives au développement humain ?",
    options: OPTIONS,
  },
  {
    id: 'coach-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Conseil & Coaching',
    text: "Aimez-vous aider les personnes à atteindre leurs objectifs ?",
    options: OPTIONS,
  },
  {
    id: 'coach-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Conseil & Coaching',
    text: "Êtes-vous doué pour établir une relation de confiance et de confiance ?",
    options: OPTIONS,
  },
  {
    id: 'coach-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Aimeriez-vous créer votre propre entreprise de coaching ou conseil ?",
    options: OPTIONS,
  },
  {
    id: 'coach-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Conseil & Coaching',
    text: "Aimeriez-vous évaluer les résultats et assurer la conformité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // PROFESSIONS MÉDICALES - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'med-r-1', category: 'R', emoji: '🩺', difficulty: 'basic',
    sector: 'Professions Médicales',
    text: "Aimez-vous manipuler du matériel médical avec précision ?",
    options: OPTIONS,
  },
  {
    id: 'med-r-2', category: 'R', emoji: '🔬', difficulty: 'intermediate',
    sector: 'Professions Médicales',
    text: "Êtes-vous à l'aise avec les procédures médicales et les interventions ?",
    options: OPTIONS,
  },
  {
    id: 'med-i-1', category: 'I', emoji: '🧬', difficulty: 'basic',
    sector: 'Professions Médicales',
    text: "Êtes-vous intéressé par l'anatomie et la physiologie humaine ?",
    options: OPTIONS,
  },
  {
    id: 'med-i-2', category: 'I', emoji: '📚', difficulty: 'advanced',
    sector: 'Professions Médicales',
    text: "Aimeriez-vous contribuer à des avancées en médecine et santé ?",
    options: OPTIONS,
  },
  {
    id: 'med-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Professions Médicales',
    text: "Aimeriez-vous créer des approches innovantes aux soins de santé ?",
    options: OPTIONS,
  },
  {
    id: 'med-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Professions Médicales',
    text: "Aimez-vous résoudre les cas médicaux complexes de manière créative ?",
    options: OPTIONS,
  },
  {
    id: 'med-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Professions Médicales',
    text: "Avez-vous une forte compassion pour les patients souffrants ?",
    options: OPTIONS,
  },
  {
    id: 'med-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Professions Médicales',
    text: "Êtes-vous doué pour communiquer des diagnostics difficiles ?",
    options: OPTIONS,
  },
  {
    id: 'med-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Professions Médicales',
    text: "Aimeriez-vous diriger un hôpital ou une clinique ?",
    options: OPTIONS,
  },
  {
    id: 'med-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Professions Médicales',
    text: "Aimeriez-vous assurer la conformité aux normes médicales et éthiques ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SANTÉ & PARAMÉDICAL - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'param-r-1', category: 'R', emoji: '🏥', difficulty: 'basic',
    sector: 'Santé & Paramédical',
    text: "Aimez-vous aider les patients à se sentir mieux physiquement ?",
    options: OPTIONS,
  },
  {
    id: 'param-r-2', category: 'R', emoji: '💪', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Êtes-vous à l'aise pour appliquer des techniques thérapeutiques ?",
    options: OPTIONS,
  },
  {
    id: 'param-i-1', category: 'I', emoji: '📖', difficulty: 'basic',
    sector: 'Santé & Paramédical',
    text: "Êtes-vous intéressé par les techniques de réadaptation et rééducation ?",
    options: OPTIONS,
  },
  {
    id: 'param-i-2', category: 'I', emoji: '🧬', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Aimeriez-vous contribuer à l'amélioration de la qualité de vie ?",
    options: OPTIONS,
  },
  {
    id: 'param-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Santé & Paramédical',
    text: "Aimeriez-vous créer des programmes de bien-être holistiques ?",
    options: OPTIONS,
  },
  {
    id: 'param-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Aimez-vous innover dans les approches de soin et guérison ?",
    options: OPTIONS,
  },
  {
    id: 'param-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Santé & Paramédical',
    text: "Avez-vous une empathie naturelle pour les personnes en difficulté ?",
    options: OPTIONS,
  },
  {
    id: 'param-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Santé & Paramédical',
    text: "Êtes-vous doué pour motiver les patients dans leur récupération ?",
    options: OPTIONS,
  },
  {
    id: 'param-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Aimeriez-vous créer un centre de soins ou un cabinet indépendant ?",
    options: OPTIONS,
  },
  {
    id: 'param-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Santé & Paramédical',
    text: "Aimeriez-vous gérer les dossiers patients et assurer la conformité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // PETITE ENFANCE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'child-r-1', category: 'R', emoji: '👶', difficulty: 'basic',
    sector: 'Petite Enfance',
    text: "Aimez-vous participer à des jeux et activités pratiques avec les enfants ?",
    options: OPTIONS,
  },
  {
    id: 'child-r-2', category: 'R', emoji: '🧸', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Êtes-vous à l'aise pour gérer la sécurité et les besoins pratiques des enfants ?",
    options: OPTIONS,
  },
  {
    id: 'child-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Petite Enfance',
    text: "Êtes-vous intéressé par le développement et l'apprentissage de l'enfant ?",
    options: OPTIONS,
  },
  {
    id: 'child-i-2', category: 'I', emoji: '🧠', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Aimeriez-vous concevoir des programmes pédagogiques pour les tout-petits ?",
    options: OPTIONS,
  },
  {
    id: 'child-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Petite Enfance',
    text: "Aimeriez-vous créer des environnements colorés et stimulants ?",
    options: OPTIONS,
  },
  {
    id: 'child-a-2', category: 'A', emoji: '🎭', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Aimez-vous animer des activités créatives et ludiques ?",
    options: OPTIONS,
  },
  {
    id: 'child-s-1', category: 'S', emoji: '💕', difficulty: 'basic',
    sector: 'Petite Enfance',
    text: "Avez-vous beaucoup de patience et d'affection pour les enfants ?",
    options: OPTIONS,
  },
  {
    id: 'child-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Petite Enfance',
    text: "Êtes-vous doué pour communiquer avec les parents et créer des liens ?",
    options: OPTIONS,
  },
  {
    id: 'child-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Aimeriez-vous créer une crèche ou une école maternelle privée ?",
    options: OPTIONS,
  },
  {
    id: 'child-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Petite Enfance',
    text: "Aimeriez-vous gérer l'administration et les normes de sécurité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // ANIMATION SOCIALE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'anim-r-1', category: 'R', emoji: '🎪', difficulty: 'basic',
    sector: 'Animation Sociale',
    text: "Aimez-vous organiser et animer des événements pratiques ?",
    options: OPTIONS,
  },
  {
    id: 'anim-r-2', category: 'R', emoji: '🎉', difficulty: 'intermediate',
    sector: 'Animation Sociale',
    text: "Êtes-vous à l'aise pour gérer le matériel et l'espace physique ?",
    options: OPTIONS,
  },
  {
    id: 'anim-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Animation Sociale',
    text: "Aimez-vous comprendre les besoins sociaux et les dynamiques de groupe ?",
    options: OPTIONS,
  },
  {
    id: 'anim-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Animation Sociale',
    text: "Aimeriez-vous analyser l'impact social de vos interventions ?",
    options: OPTIONS,
  },
  {
    id: 'anim-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Animation Sociale',
    text: "Avez-vous une créativité naturelle pour animer et divertir ?",
    options: OPTIONS,
  },
  {
    id: 'anim-a-2', category: 'A', emoji: '🎭', difficulty: 'advanced',
    sector: 'Animation Sociale',
    text: "Aimeriez-vous créer des expériences mémorables et enrichissantes ?",
    options: OPTIONS,
  },
  {
    id: 'anim-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Animation Sociale',
    text: "Aimez-vous créer des moments de joie et de cohésion sociale ?",
    options: OPTIONS,
  },
  {
    id: 'anim-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Animation Sociale',
    text: "Êtes-vous doué pour motiver les participants et créer l'inclusion ?",
    options: OPTIONS,
  },
  {
    id: 'anim-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Animation Sociale',
    text: "Aimeriez-vous créer une association ou agence d'animation ?",
    options: OPTIONS,
  },
  {
    id: 'anim-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Animation Sociale',
    text: "Aimeriez-vous gérer les budgets et assurer la conformité des activités ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // LUXE & MODE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'luxury-r-1', category: 'R', emoji: '👗', difficulty: 'basic',
    sector: 'Luxe & Mode',
    text: "Aimez-vous manipuler des textiles raffinés et des matériaux précieux ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-r-2', category: 'R', emoji: '✂️', difficulty: 'intermediate',
    sector: 'Luxe & Mode',
    text: "Êtes-vous à l'aise pour créer et assembler des vêtements ou accessoires ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Luxe & Mode',
    text: "Aimez-vous comprendre les tendances et l'évolution de la mode ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Luxe & Mode',
    text: "Aimeriez-vous analyser les préférences de clientèle haut de gamme ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Luxe & Mode',
    text: "Avez-vous une vision artistique forte pour la mode et le design ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Luxe & Mode',
    text: "Aimeriez-vous créer des collections de mode luxe originales ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Luxe & Mode',
    text: "Aimez-vous servir une clientèle exigeante avec élégance ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Luxe & Mode',
    text: "Êtes-vous doué pour créer des relations avec les clients VIP ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Luxe & Mode',
    text: "Aimeriez-vous créer votre propre marque de luxe ou de mode ?",
    options: OPTIONS,
  },
  {
    id: 'luxury-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Luxe & Mode',
    text: "Aimeriez-vous gérer les stocks de produits de luxe ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // BEAUX-ARTS - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'beaux-r-1', category: 'R', emoji: '🖼️', difficulty: 'basic',
    sector: 'Beaux-Arts',
    text: "Aimez-vous créer et peindre avec vos mains ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-r-2', category: 'R', emoji: '🖌️', difficulty: 'intermediate',
    sector: 'Beaux-Arts',
    text: "Êtes-vous à l'aise avec les techniques traditionnelles des beaux-arts ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-i-1', category: 'I', emoji: '🔍', difficulty: 'basic',
    sector: 'Beaux-Arts',
    text: "Êtes-vous intéressé par l'histoire et la théorie de l'art ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-i-2', category: 'I', emoji: '📚', difficulty: 'intermediate',
    sector: 'Beaux-Arts',
    text: "Aimeriez-vous analyser et critiquer les œuvres d'art ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Beaux-Arts',
    text: "Avez-vous une expression artistique personnelle et profonde ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Beaux-Arts',
    text: "Aimeriez-vous développer votre propre style et vision artistique ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-s-1', category: 'S', emoji: '👥', difficulty: 'basic',
    sector: 'Beaux-Arts',
    text: "Aimez-vous partager votre art avec une communauté ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Beaux-Arts',
    text: "Êtes-vous doué pour enseigner l'art à d'autres personnes ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Beaux-Arts',
    text: "Aimeriez-vous promouvoir et vendre vos œuvres d'art ?",
    options: OPTIONS,
  },
  {
    id: 'beaux-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Beaux-Arts',
    text: "Aimeriez-vous gérer une galerie ou un studio d'art ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // MUSIQUE & SPECTACLE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'music-r-1', category: 'R', emoji: '🎸', difficulty: 'basic',
    sector: 'Musique & Spectacle',
    text: "Aimez-vous jouer d'un instrument ou chanter passionnément ?",
    options: OPTIONS,
  },
  {
    id: 'music-r-2', category: 'R', emoji: '🎹', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Êtes-vous à l'aise avec les équipements et instruments de musique ?",
    options: OPTIONS,
  },
  {
    id: 'music-i-1', category: 'I', emoji: '🎵', difficulty: 'basic',
    sector: 'Musique & Spectacle',
    text: "Êtes-vous intéressé par la théorie musicale et la composition ?",
    options: OPTIONS,
  },
  {
    id: 'music-i-2', category: 'I', emoji: '🧠', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Aimeriez-vous analyser et critiquer les performances musicales ?",
    options: OPTIONS,
  },
  {
    id: 'music-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Musique & Spectacle',
    text: "Avez-vous une expression musicale ou artistique unique ?",
    options: OPTIONS,
  },
  {
    id: 'music-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Musique & Spectacle',
    text: "Aimeriez-vous composer ou créer de la musique originale ?",
    options: OPTIONS,
  },
  {
    id: 'music-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Musique & Spectacle',
    text: "Aimez-vous performer et émouvoir votre public ?",
    options: OPTIONS,
  },
  {
    id: 'music-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Êtes-vous doué pour collaborer avec d'autres musiciens ?",
    options: OPTIONS,
  },
  {
    id: 'music-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Aimeriez-vous produire ou organiser des concerts et événements ?",
    options: OPTIONS,
  },
  {
    id: 'music-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Musique & Spectacle',
    text: "Aimeriez-vous gérer les droits d'auteur et les contrats musicaux ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // JOURNALISME & ÉDITION - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'journal-r-1', category: 'R', emoji: '📰', difficulty: 'basic',
    sector: 'Journalisme & Édition',
    text: "Aimez-vous rédiger et publier des contenus écrits ?",
    options: OPTIONS,
  },
  {
    id: 'journal-r-2', category: 'R', emoji: '✍️', difficulty: 'intermediate',
    sector: 'Journalisme & Édition',
    text: "Êtes-vous à l'aise pour collecter des informations et les vérifier ?",
    options: OPTIONS,
  },
  {
    id: 'journal-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Journalisme & Édition',
    text: "Êtes-vous curieux et avide d'apprendre sur tous les sujets ?",
    options: OPTIONS,
  },
  {
    id: 'journal-i-2', category: 'I', emoji: '🔍', difficulty: 'advanced',
    sector: 'Journalisme & Édition',
    text: "Aimeriez-vous enquêter et analyser des sujets en profondeur ?",
    options: OPTIONS,
  },
  {
    id: 'journal-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Journalisme & Édition',
    text: "Aimez-vous raconter des histoires de façon captivante ?",
    options: OPTIONS,
  },
  {
    id: 'journal-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Journalisme & Édition',
    text: "Aimeriez-vous créer des contenus éditoriaux originaux et percutants ?",
    options: OPTIONS,
  },
  {
    id: 'journal-s-1', category: 'S', emoji: '💬', difficulty: 'basic',
    sector: 'Journalisme & Édition',
    text: "Aimez-vous communiquer et vous connecter avec votre audience ?",
    options: OPTIONS,
  },
  {
    id: 'journal-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Journalisme & Édition',
    text: "Êtes-vous doué pour interviewer et écouter les témoignages ?",
    options: OPTIONS,
  },
  {
    id: 'journal-e-1', category: 'E', emoji: '📢', difficulty: 'intermediate',
    sector: 'Journalisme & Édition',
    text: "Aimeriez-vous créer un média ou une publication indépendante ?",
    options: OPTIONS,
  },
  {
    id: 'journal-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Journalisme & Édition',
    text: "Aimeriez-vous gérer les droits d'auteur et les aspects légaux ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // MARKETING & COMMUNICATION - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'market-r-1', category: 'R', emoji: '📢', difficulty: 'basic',
    sector: 'Marketing & Communication',
    text: "Aimez-vous créer des campagnes et mettre en avant des produits ?",
    options: OPTIONS,
  },
  {
    id: 'market-r-2', category: 'R', emoji: '📣', difficulty: 'intermediate',
    sector: 'Marketing & Communication',
    text: "Êtes-vous à l'aise pour gérer les événements et les relations publiques ?",
    options: OPTIONS,
  },
  {
    id: 'market-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Marketing & Communication',
    text: "Aimez-vous analyser les données marketing et les comportements ?",
    options: OPTIONS,
  },
  {
    id: 'market-i-2', category: 'I', emoji: '🔍', difficulty: 'intermediate',
    sector: 'Marketing & Communication',
    text: "Aimeriez-vous élaborer des stratégies marketing basées sur les données ?",
    options: OPTIONS,
  },
  {
    id: 'market-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Marketing & Communication',
    text: "Avez-vous une créativité naturelle pour la communication ?",
    options: OPTIONS,
  },
  {
    id: 'market-a-2', category: 'A', emoji: '✨', difficulty: 'advanced',
    sector: 'Marketing & Communication',
    text: "Aimeriez-vous créer des campagnes publicitaires mémorables ?",
    options: OPTIONS,
  },
  {
    id: 'market-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Marketing & Communication',
    text: "Aimez-vous engager votre audience et créer une communauté ?",
    options: OPTIONS,
  },
  {
    id: 'market-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Marketing & Communication',
    text: "Êtes-vous doué pour écouter et répondre aux clients ?",
    options: OPTIONS,
  },
  {
    id: 'market-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Marketing & Communication',
    text: "Aimeriez-vous diriger un département marketing ou une agence ?",
    options: OPTIONS,
  },
  {
    id: 'market-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Marketing & Communication',
    text: "Aimeriez-vous gérer les budgets et mesurer le ROI ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SPORTS & ACTIVITÉS PHYSIQUES - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'sports-r-1', category: 'R', emoji: '⚽', difficulty: 'basic',
    sector: 'Sports & Activités Physiques',
    text: "Aimez-vous pratiquer des sports et développer vos capacités physiques ?",
    options: OPTIONS,
  },
  {
    id: 'sports-r-2', category: 'R', emoji: '🏋️', difficulty: 'intermediate',
    sector: 'Sports & Activités Physiques',
    text: "Êtes-vous à l'aise avec l'équipement sportif et les installations ?",
    options: OPTIONS,
  },
  {
    id: 'sports-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Sports & Activités Physiques',
    text: "Aimez-vous comprendre les stratégies et tactiques sportives ?",
    options: OPTIONS,
  },
  {
    id: 'sports-i-2', category: 'I', emoji: '📈', difficulty: 'intermediate',
    sector: 'Sports & Activités Physiques',
    text: "Aimeriez-vous analyser les performances et les statistiques ?",
    options: OPTIONS,
  },
  {
    id: 'sports-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Sports & Activités Physiques',
    text: "Aimeriez-vous créer des mouvements et des styles uniques ?",
    options: OPTIONS,
  },
  {
    id: 'sports-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Sports & Activités Physiques',
    text: "Aimez-vous innover dans la façon de pratiquer ou d'enseigner ?",
    options: OPTIONS,
  },
  {
    id: 'sports-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Sports & Activités Physiques',
    text: "Aimez-vous participer en équipe et créer l'esprit d'équipe ?",
    options: OPTIONS,
  },
  {
    id: 'sports-s-2', category: 'S', emoji: '👥', difficulty: 'intermediate',
    sector: 'Sports & Activités Physiques',
    text: "Êtes-vous doué pour motiver vos coéquipiers ou collègues ?",
    options: OPTIONS,
  },
  {
    id: 'sports-e-1', category: 'E', emoji: '🏆', difficulty: 'advanced',
    sector: 'Sports & Activités Physiques',
    text: "Aimeriez-vous devenir un athlète professionnel ou champion ?",
    options: OPTIONS,
  },
  {
    id: 'sports-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Sports & Activités Physiques',
    text: "Aimeriez-vous respecter les règles et les régulations sportives ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SPORTS & COACHING - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'coach-sport-r-1', category: 'R', emoji: '💪', difficulty: 'basic',
    sector: 'Sports & Coaching',
    text: "Aimez-vous entraîner et préparer physiquement les athlètes ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-r-2', category: 'R', emoji: '🏃', difficulty: 'intermediate',
    sector: 'Sports & Coaching',
    text: "Êtes-vous à l'aise pour démontrer les techniques et exercices ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Sports & Coaching',
    text: "Êtes-vous intéressé par la physiologie et la science du sport ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-i-2', category: 'I', emoji: '📊', difficulty: 'intermediate',
    sector: 'Sports & Coaching',
    text: "Aimeriez-vous analyser les performances et optimiser les résultats ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Sports & Coaching',
    text: "Aimeriez-vous créer des programmes d'entraînement originaux ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Sports & Coaching',
    text: "Aimez-vous innover dans les méthodes d'entraînement ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-s-1', category: 'S', emoji: '❤️', difficulty: 'basic',
    sector: 'Sports & Coaching',
    text: "Aimez-vous aider les gens à atteindre leurs objectifs sportifs ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-s-2', category: 'S', emoji: '🤝', difficulty: 'advanced',
    sector: 'Sports & Coaching',
    text: "Êtes-vous doué pour motiver et encourager vos athlètes ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Sports & Coaching',
    text: "Aimeriez-vous créer une académie ou un centre de coaching sportif ?",
    options: OPTIONS,
  },
  {
    id: 'coach-sport-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Sports & Coaching',
    text: "Aimeriez-vous gérer les certifications et assurer la conformité ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // MANAGEMENT SPORTIF - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'sport-mgmt-r-1', category: 'R', emoji: '🎪', difficulty: 'basic',
    sector: 'Management Sportif',
    text: "Aimez-vous organiser des événements sportifs et des compétitions ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-r-2', category: 'R', emoji: '📋', difficulty: 'intermediate',
    sector: 'Management Sportif',
    text: "Êtes-vous à l'aise pour gérer les installations et les ressources ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-i-1', category: 'I', emoji: '📊', difficulty: 'basic',
    sector: 'Management Sportif',
    text: "Aimez-vous analyser les données sportives et les tendances ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-i-2', category: 'I', emoji: '🧮', difficulty: 'intermediate',
    sector: 'Management Sportif',
    text: "Aimeriez-vous planifier la stratégie et le développement sportif ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Management Sportif',
    text: "Aimeriez-vous créer des expériences sportives mémorables ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Management Sportif',
    text: "Aimez-vous innover dans la promotion et le marketing sportif ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Management Sportif',
    text: "Aimez-vous créer une communauté de fans et de supporters ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-s-2', category: 'S', emoji: '🤝', difficulty: 'intermediate',
    sector: 'Management Sportif',
    text: "Êtes-vous doué pour négocier avec les partenaires sportifs ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-e-1', category: 'E', emoji: '📈', difficulty: 'advanced',
    sector: 'Management Sportif',
    text: "Aimeriez-vous diriger une équipe sportive ou une organisation ?",
    options: OPTIONS,
  },
  {
    id: 'sport-mgmt-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Management Sportif',
    text: "Aimeriez-vous gérer les budgets et assurer la conformité réglementaire ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // CONFORMITÉ & AUDIT - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'compliance-r-1', category: 'R', emoji: '📋', difficulty: 'basic',
    sector: 'Conformité & Audit',
    text: "Aimez-vous vérifier et documenter les processus ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-r-2', category: 'R', emoji: '✅', difficulty: 'intermediate',
    sector: 'Conformité & Audit',
    text: "Êtes-vous à l'aise pour contrôler et certifier la qualité ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-i-1', category: 'I', emoji: '🔍', difficulty: 'basic',
    sector: 'Conformité & Audit',
    text: "Aimez-vous analyser les risques et détecter les anomalies ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-i-2', category: 'I', emoji: '📚', difficulty: 'advanced',
    sector: 'Conformité & Audit',
    text: "Aimeriez-vous interpréter les normes et réglementations ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Conformité & Audit',
    text: "Aimeriez-vous créer des rapports clairs et compréhensibles ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-a-2', category: 'A', emoji: '💡', difficulty: 'intermediate',
    sector: 'Conformité & Audit',
    text: "Aimez-vous proposer des solutions créatives de conformité ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-s-1', category: 'S', emoji: '🤝', difficulty: 'basic',
    sector: 'Conformité & Audit',
    text: "Aimez-vous communiquer les enjeux de conformité aux équipes ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-s-2', category: 'S', emoji: '💬', difficulty: 'intermediate',
    sector: 'Conformité & Audit',
    text: "Êtes-vous doué pour expliquer les implications réglementaires ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Conformité & Audit',
    text: "Aimeriez-vous diriger un département de conformité ou d'audit ?",
    options: OPTIONS,
  },
  {
    id: 'compliance-c-1', category: 'C', emoji: '✅', difficulty: 'advanced',
    sector: 'Conformité & Audit',
    text: "Aimeriez-vous assurer l'adhésion stricte aux normes ISO ?",
    options: OPTIONS,
  },

  // ─────────────────────────────────────────────────────────────
  // SERVICES À LA PERSONNE - 10 Questions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'service-r-1', category: 'R', emoji: '🧹', difficulty: 'basic',
    sector: 'Services à la Personne',
    text: "Aimez-vous accomplir des tâches pratiques et domestiques ?",
    options: OPTIONS,
  },
  {
    id: 'service-r-2', category: 'R', emoji: '🛠️', difficulty: 'intermediate',
    sector: 'Services à la Personne',
    text: "Êtes-vous à l'aise pour entretenir et réparer les choses ?",
    options: OPTIONS,
  },
  {
    id: 'service-i-1', category: 'I', emoji: '📚', difficulty: 'basic',
    sector: 'Services à la Personne',
    text: "Êtes-vous intéressé par les techniques de service et de bien-être ?",
    options: OPTIONS,
  },
  {
    id: 'service-i-2', category: 'I', emoji: '🧠', difficulty: 'intermediate',
    sector: 'Services à la Personne',
    text: "Aimeriez-vous apprendre et maîtriser différentes spécialités ?",
    options: OPTIONS,
  },
  {
    id: 'service-a-1', category: 'A', emoji: '🎨', difficulty: 'basic',
    sector: 'Services à la Personne',
    text: "Aimeriez-vous créer une ambiance agréable et accueillante ?",
    options: OPTIONS,
  },
  {
    id: 'service-a-2', category: 'A', emoji: '✨', difficulty: 'intermediate',
    sector: 'Services à la Personne',
    text: "Aimez-vous personnaliser vos services pour chaque client ?",
    options: OPTIONS,
  },
  {
    id: 'service-s-1', category: 'S', emoji: '😊', difficulty: 'basic',
    sector: 'Services à la Personne',
    text: "Aimez-vous aider les personnes avec empathie et dévouement ?",
    options: OPTIONS,
  },
  {
    id: 'service-s-2', category: 'S', emoji: '❤️', difficulty: 'advanced',
    sector: 'Services à la Personne',
    text: "Êtes-vous doué pour établir des relations de confiance ?",
    options: OPTIONS,
  },
  {
    id: 'service-e-1', category: 'E', emoji: '📈', difficulty: 'intermediate',
    sector: 'Services à la Personne',
    text: "Aimeriez-vous créer votre propre entreprise de services ?",
    options: OPTIONS,
  },
  {
    id: 'service-c-1', category: 'C', emoji: '📋', difficulty: 'intermediate',
    sector: 'Services à la Personne',
    text: "Aimeriez-vous gérer les plannings et assurer la qualité ?",
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
