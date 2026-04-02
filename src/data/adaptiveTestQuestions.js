export const adaptiveTestQuestions = [
  // PHASE 1: EXPLORATION LARGE (Q1-Q4)
  {
    id: 1,
    question_text: "Qu'est-ce qui capte le plus votre attention naturellement ? 👀",
    phase: "Exploration Large",
    order: 1,
    type: "multiple",
    maxAnswers: 3,
    adaptive_rules: {},
    choices: [
      { id: "c1_1", text: "Comment fonctionnent les objets technologiques 🤖", sector_tags: ["Technology", "Engineering"], difficulty: 1 },
      { id: "c1_2", text: "Les émotions et le bien-être des gens ❤️", sector_tags: ["Santé", "Psychologie"], difficulty: 1 },
      { id: "c1_3", text: "Les stratégies pour vendre ou convaincre 💼", sector_tags: ["Commerce", "Marketing"], difficulty: 1 },
      { id: "c1_4", text: "L'esthétique, les couleurs et les formes 🎨", sector_tags: ["Arts", "Design"], difficulty: 1 },
      { id: "c1_5", text: "La protection de la nature et des animaux 🌿", sector_tags: ["Environnement", "Biologie"], difficulty: 1 },
      { id: "c1_6", text: "L'organisation de la société et la justice ⚖️", sector_tags: ["Droit", "Politique"], difficulty: 1 },
      { id: "c1_7", text: "La performance physique et le dépassement 🏆", sector_tags: ["Sport", "Coaching"], difficulty: 1 },
      { id: "c1_8", text: "Transmettre des savoirs et expliquer 📚", sector_tags: ["Éducation", "Formation"], difficulty: 1 }
    ]
  },
  {
    id: 2,
    question_text: "Dans un projet de groupe, quel rôle prenez-vous spontanément ? 🤝",
    phase: "Exploration Large",
    order: 2,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c2_1", text: "Le leader qui décide et tranche 👑", sector_tags: ["Management", "Droit"], difficulty: 1 },
      { id: "c2_2", text: "Le créatif qui a les idées originales 💡", sector_tags: ["Arts", "Innovation"], difficulty: 1 },
      { id: "c2_3", text: "L'organisateur qui planifie tout 📅", sector_tags: ["Commerce", "Administration"], difficulty: 1 },
      { id: "c2_4", text: "Le technicien qui fait fonctionner les outils 🔧", sector_tags: ["Technology", "Production"], difficulty: 1 },
      { id: "c2_5", text: "Le médiateur qui gère l'entente 🕊️", sector_tags: ["Éducation", "Ressources Humaines"], difficulty: 1 },
      { id: "c2_6", text: "L'analyste qui vérifie les données 📊", sector_tags: ["Finance", "Science"], difficulty: 1 },
      { id: "c2_7", text: "Celui qui motive et booste l'énergie ⚡", sector_tags: ["Sport", "Communication"], difficulty: 1 },
      { id: "c2_8", text: "Celui qui s'assure que c'est utile et éthique 🌱", sector_tags: ["Environnement", "Social"], difficulty: 1 }
    ]
  },
  {
    id: 3,
    question_text: "Quel type de problème aimez-vous résoudre ? 🧩",
    phase: "Exploration Large",
    order: 3,
    type: "multiple",
    maxAnswers: 2,
    adaptive_rules: {},
    choices: [
      { id: "c3_1", text: "Un bug informatique complexe 💻", sector_tags: ["Technology"], difficulty: 1 },
      { id: "c3_2", text: "Un conflit entre deux personnes 🗣️", sector_tags: ["Droit", "Psychologie"], difficulty: 1 },
      { id: "c3_3", text: "Comment augmenter les ventes 📈", sector_tags: ["Commerce"], difficulty: 1 },
      { id: "c3_4", text: "Créer une identité visuelle unique 🖌️", sector_tags: ["Arts"], difficulty: 1 },
      { id: "c3_5", text: "Sauver une plante ou un animal malade 🐾", sector_tags: ["Environnement", "Santé"], difficulty: 1 },
      { id: "c3_6", text: "Optimiser un entraînement sportif ⏱️", sector_tags: ["Sport"], difficulty: 1 },
      { id: "c3_7", text: "Expliquer une notion difficile à comprendre 🧠", sector_tags: ["Éducation"], difficulty: 1 },
      { id: "c3_8", text: "Diagnostiquer une maladie 🩺", sector_tags: ["Santé"], difficulty: 1 }
    ]
  },
  {
    id: 4,
    question_text: "Où vous voyez-vous travailler idéalement ? 🏢",
    phase: "Exploration Large",
    order: 4,
    type: "multiple",
    maxAnswers: 2,
    adaptive_rules: {},
    choices: [
      { id: "c4_1", text: "Dans un labo de recherche ou un bureau calme 🔬", sector_tags: ["Science", "Technology"], difficulty: 1 },
      { id: "c4_2", text: "Au contact direct des clients dans un magasin 🛍️", sector_tags: ["Commerce"], difficulty: 1 },
      { id: "c4_3", text: "En extérieur, dans la nature 🌲", sector_tags: ["Environnement", "Agriculture"], difficulty: 1 },
      { id: "c4_4", text: "Dans un tribunal ou une administration 🏛️", sector_tags: ["Droit", "Public"], difficulty: 1 },
      { id: "c4_5", text: "Dans un atelier d'artiste ou un studio 🎭", sector_tags: ["Arts"], difficulty: 1 },
      { id: "c4_6", text: "Dans un hôpital ou un cabinet 🏥", sector_tags: ["Santé"], difficulty: 1 },
      { id: "c4_7", text: "Sur un terrain de sport ou un gymnase 🏟️", sector_tags: ["Sport"], difficulty: 1 },
      { id: "c4_8", text: "Dans une salle de classe ou de formation 🏫", sector_tags: ["Éducation"], difficulty: 1 }
    ]
  },

  // PHASE 2: AFFINAGE (Q5-Q9)
  {
    id: 5,
    question_text: "Quelle activité vous ferait perdre la notion du temps ? ⏳",
    phase: "Affinage",
    order: 5,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c5_1", text: "Coder une application ou un site ⌨️", sector_tags: ["Technology"], difficulty: 2 },
      { id: "c5_2", text: "Écouter et conseiller quelqu'un en difficulté 👂", sector_tags: ["Santé", "Psychologie"], difficulty: 2 },
      { id: "c5_3", text: "Négocier un contrat important 🤝", sector_tags: ["Commerce", "Droit"], difficulty: 2 },
      { id: "c5_4", text: "Peindre, dessiner ou sculpter 🖍️", sector_tags: ["Arts"], difficulty: 2 },
      { id: "c5_5", text: "Jardiner ou s'occuper d'animaux 🌻", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c5_6", text: "Organiser un tournoi sportif ⚽", sector_tags: ["Sport", "Événementiel"], difficulty: 2 },
      { id: "c5_7", text: "Préparer un cours ou une présentation 📝", sector_tags: ["Éducation"], difficulty: 2 },
      { id: "c5_8", text: "Analyser des lois et règlements 📜", sector_tags: ["Droit"], difficulty: 2 }
    ]
  },
  {
    id: 6,
    question_text: "Quel impact voulez-vous avoir sur le monde ? 🌍",
    phase: "Affinage",
    order: 6,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c6_1", text: "Inventer les technologies de demain 🚀", sector_tags: ["Technology", "Innovation"], difficulty: 2 },
      { id: "c6_2", text: "Guérir les maladies 💊", sector_tags: ["Santé"], difficulty: 2 },
      { id: "c6_3", text: "Créer de la richesse et de l'emploi 💰", sector_tags: ["Commerce", "Économie"], difficulty: 2 },
      { id: "c6_4", text: "Embellir le monde par l'art 🎨", sector_tags: ["Arts"], difficulty: 2 },
      { id: "c6_5", text: "Protéger la planète ♻️", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c6_6", text: "Défendre les droits et la justice ⚖️", sector_tags: ["Droit"], difficulty: 2 },
      { id: "c6_7", text: "Inspirer par la performance physique 🥇", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c6_8", text: "Éduquer les futures générations 👶", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  },
  {
    id: 7,
    question_text: "Quelle qualité vos amis vous reconnaissent-ils ? 🌟",
    phase: "Affinage",
    order: 7,
    type: "multiple",
    maxAnswers: 2,
    adaptive_rules: {},
    choices: [
      { id: "c7_1", text: "Logique et Geek 🤓", sector_tags: ["Technology"], difficulty: 2 },
      { id: "c7_2", text: "Empathique et Soignant 🤗", sector_tags: ["Santé"], difficulty: 2 },
      { id: "c7_3", text: "Persuasif et Vendeur 😎", sector_tags: ["Commerce"], difficulty: 2 },
      { id: "c7_4", text: "Créatif et Original 🦄", sector_tags: ["Arts"], difficulty: 2 },
      { id: "c7_5", text: "Écolo et Nature 🍃", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c7_6", text: "Juste et Rigoureux 📏", sector_tags: ["Droit"], difficulty: 2 },
      { id: "c7_7", text: "Énergique et Sportif 🏃", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c7_8", text: "Pédagogue et Patient 🧘", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  },
  {
    id: 8,
    question_text: "Quel outil préférez-vous utiliser ? 🛠️",
    phase: "Affinage",
    order: 8,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c8_1", text: "Un ordinateur puissant 🖥️", sector_tags: ["Technology"], difficulty: 2 },
      { id: "c8_2", text: "Un stéthoscope ou trousse de soin 🩺", sector_tags: ["Santé"], difficulty: 2 },
      { id: "c8_3", text: "Un téléphone pour appeler des clients 📱", sector_tags: ["Commerce"], difficulty: 2 },
      { id: "c8_4", text: "Un pinceau ou une tablette graphique 🖌️", sector_tags: ["Arts"], difficulty: 2 },
      { id: "c8_5", text: "Une paire de jumelles ou un microscope 🔬", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c8_6", text: "Un code civil ou des contrats 📑", sector_tags: ["Droit"], difficulty: 2 },
      { id: "c8_7", text: "Un ballon ou des haltères 🏐", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c8_8", text: "Un tableau blanc et des marqueurs 🖍️", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  },
  {
    id: 9,
    question_text: "Qu'est-ce qui vous stresse le plus ? 😰",
    phase: "Affinage",
    order: 9,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c9_1", text: "Quand la technologie plante 🚫", sector_tags: ["Technology"], difficulty: 2 },
      { id: "c9_2", text: "Voir quelqu'un souffrir 🤕", sector_tags: ["Santé"], difficulty: 2 },
      { id: "c9_3", text: "Perdre de l'argent 💸", sector_tags: ["Commerce"], difficulty: 2 },
      { id: "c9_4", text: "La laideur et le manque d'harmonie 🏚️", sector_tags: ["Arts"], difficulty: 2 },
      { id: "c9_5", text: "La pollution et le gaspillage 🗑️", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c9_6", text: "L'injustice et le désordre 👎", sector_tags: ["Droit"], difficulty: 2 },
      { id: "c9_7", text: "L'inactivité physique 🛋️", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c9_8", text: "L'ignorance et la bêtise 🤡", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  },

  // PHASE 3: CONSOLIDATION (Q10-Q13)
  {
    id: 10,
    question_text: "Si vous deviez écrire un livre, quel serait le sujet ? 📖",
    phase: "Consolidation",
    order: 10,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c10_1", text: "L'intelligence artificielle 🤖", sector_tags: ["Technology"], difficulty: 3 },
      { id: "c10_2", text: "Les secrets de la longévité 🧬", sector_tags: ["Santé"], difficulty: 3 },
      { id: "c10_3", text: "L'art de devenir millionnaire 💎", sector_tags: ["Commerce"], difficulty: 3 },
      { id: "c10_4", text: "Une histoire fantastique illustrée 🐉", sector_tags: ["Arts"], difficulty: 3 },
      { id: "c10_5", text: "Guide de survie en forêt ⛺", sector_tags: ["Environnement"], difficulty: 3 },
      { id: "c10_6", text: "Les grandes affaires criminelles 🕵️", sector_tags: ["Droit"], difficulty: 3 },
      { id: "c10_7", text: "Méthode d'entraînement olympique 🏋️", sector_tags: ["Sport"], difficulty: 3 },
      { id: "c10_8", text: "Comment tout apprendre vite 🎓", sector_tags: ["Éducation"], difficulty: 3 }
    ]
  },
  {
    id: 11,
    question_text: "Quel documentaire regarderiez-vous ce soir ? 📺",
    phase: "Consolidation",
    order: 11,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c11_1", text: "Silicon Valley : Les géants du web 🌐", sector_tags: ["Technology"], difficulty: 3 },
      { id: "c11_2", text: "Au cœur des urgences 🚑", sector_tags: ["Santé"], difficulty: 3 },
      { id: "c11_3", text: "Les rois de la vente 🤑", sector_tags: ["Commerce"], difficulty: 3 },
      { id: "c11_4", text: "Les grands peintres de la Renaissance 🖼️", sector_tags: ["Arts"], difficulty: 3 },
      { id: "c11_5", text: "La planète bleue 🌏", sector_tags: ["Environnement"], difficulty: 3 },
      { id: "c11_6", text: "Procès médiatiques 🎬", sector_tags: ["Droit"], difficulty: 3 },
      { id: "c11_7", text: "Dans la tête d'un champion 🧠", sector_tags: ["Sport"], difficulty: 3 },
      { id: "c11_8", text: "L'école du futur 🏫", sector_tags: ["Éducation"], difficulty: 3 }
    ]
  },
  {
    id: 12,
    question_text: "Pour vous, réussir sa vie c'est... ⭐",
    phase: "Consolidation",
    order: 12,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c12_1", text: "Innover et changer le futur 🚀", sector_tags: ["Technology"], difficulty: 3 },
      { id: "c12_2", text: "Sauver des vies ❤️", sector_tags: ["Santé"], difficulty: 3 },
      { id: "c12_3", text: "Bâtir un empire commercial 🏰", sector_tags: ["Commerce"], difficulty: 3 },
      { id: "c12_4", text: "Créer une œuvre intemporelle 🎭", sector_tags: ["Arts"], difficulty: 3 },
      { id: "c12_5", text: "Vivre en harmonie avec la nature 🌺", sector_tags: ["Environnement"], difficulty: 3 },
      { id: "c12_6", text: "Faire respecter la loi ⚖️", sector_tags: ["Droit"], difficulty: 3 },
      { id: "c12_7", text: "Repousser les limites du corps 💪", sector_tags: ["Sport"], difficulty: 3 },
      { id: "c12_8", text: "Transmettre son savoir 📚", sector_tags: ["Éducation"], difficulty: 3 }
    ]
  },
  {
    id: 13,
    question_text: "Quel super-pouvoir aimeriez-vous avoir ? 🦸",
    phase: "Consolidation",
    order: 13,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c13_1", text: "Contrôler les machines par la pensée 🤖", sector_tags: ["Technology"], difficulty: 3 },
      { id: "c13_2", text: "Guérir par simple contact ✨", sector_tags: ["Santé"], difficulty: 3 },
      { id: "c13_3", text: "Convaincre n'importe qui 🗣️", sector_tags: ["Commerce"], difficulty: 3 },
      { id: "c13_4", text: "Donner vie à ses dessins 🎨", sector_tags: ["Arts"], difficulty: 3 },
      { id: "c13_5", text: "Parler aux animaux 🦊", sector_tags: ["Environnement"], difficulty: 3 },
      { id: "c13_6", text: "Détecter tous les mensonges 🤥", sector_tags: ["Droit"], difficulty: 3 },
      { id: "c13_7", text: "Ne jamais se fatiguer 🔋", sector_tags: ["Sport"], difficulty: 3 },
      { id: "c13_8", text: "Tout connaître instantanément 🧠", sector_tags: ["Éducation"], difficulty: 3 }
    ]
  },

  // BONUS (Q14)
  {
    id: 14,
    question_text: "Si vous aviez une baguette magique pour votre carrière, que feriez-vous ? ✨",
    phase: "Bonus",
    order: 14,
    type: "single",
    maxAnswers: 1,
    adaptive_rules: {},
    choices: [
      { id: "c14_1", text: "CEO d'une boite Tech mondiale 🦄", sector_tags: ["Technology", "Leadership"], difficulty: 4 },
      { id: "c14_2", text: "Chirurgien de renommée mondiale 🩺", sector_tags: ["Santé", "Expertise"], difficulty: 4 },
      { id: "c14_3", text: "Investisseur milliardaire 💹", sector_tags: ["Commerce", "Finance"], difficulty: 4 },
      { id: "c14_4", text: "Artiste exposé dans le monde entier 🖼️", sector_tags: ["Arts", "Célébrité"], difficulty: 4 },
      { id: "c14_5", text: "Explorateur National Geographic 🗺️", sector_tags: ["Environnement", "Aventure"], difficulty: 4 },
      { id: "c14_6", text: "Juge à la Cour Suprême ⚖️", sector_tags: ["Droit", "Pouvoir"], difficulty: 4 },
      { id: "c14_7", text: "Champion Olympique 🥇", sector_tags: ["Sport", "Gloire"], difficulty: 4 },
      { id: "c14_8", text: "Prix Nobel 🏆", sector_tags: ["Éducation", "Recherche"], difficulty: 4 }
    ]
  },
  
  // NEW MOTIVATION QUESTIONS (Q15-Q18)
  {
    id: 15,
    question_text: "Qu'est-ce qui te motive vraiment au quotidien ? 🚀",
    phase: "Motivation",
    order: 15,
    type: "multiple",
    maxAnswers: 3,
    adaptive_rules: {},
    choices: [
      { id: "c15_1", text: "Créer et innover en permanence 🎨", sector_tags: ["Arts", "Technology"], difficulty: 2 },
      { id: "c15_2", text: "Gagner beaucoup d'argent 💰", sector_tags: ["Commerce", "Finance"], difficulty: 2 },
      { id: "c15_3", text: "Aider concrètement les autres 🤝", sector_tags: ["Santé", "Social"], difficulty: 2 },
      { id: "c15_4", text: "Résoudre des problèmes complexes 🧩", sector_tags: ["Science", "Engineering"], difficulty: 2 },
      { id: "c15_5", text: "Être en contact avec la nature 🌿", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c15_6", text: "Défendre une cause juste ⚖️", sector_tags: ["Droit", "Politique"], difficulty: 2 },
      { id: "c15_7", text: "La compétition et le challenge 🏆", sector_tags: ["Sport", "Commerce"], difficulty: 2 },
      { id: "c15_8", text: "Apprendre et partager 📚", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  },
  {
    id: 16,
    question_text: "Quel style de vie professionnel te convient ? 💼",
    phase: "Style de Vie",
    order: 16,
    type: "multiple",
    maxAnswers: 2,
    adaptive_rules: {},
    choices: [
      { id: "c16_1", text: "Télétravail et flexibilité totale 🏠", sector_tags: ["Technology", "Design"], difficulty: 2 },
      { id: "c16_2", text: "Bureau d'équipe dynamique 🏢", sector_tags: ["Commerce", "Management"], difficulty: 2 },
      { id: "c16_3", text: "Terrain, forêt ou extérieur 🌲", sector_tags: ["Environnement", "Construction"], difficulty: 2 },
      { id: "c16_4", text: "Voyages fréquents à l'international ✈️", sector_tags: ["Commerce", "Tourisme"], difficulty: 2 },
      { id: "c16_5", text: "Calme et concentration (Labo/Bureau) 🔬", sector_tags: ["Science", "Recherche"], difficulty: 2 },
      { id: "c16_6", text: "Sur scène ou face au public 🎤", sector_tags: ["Arts", "Communication"], difficulty: 2 },
      { id: "c16_7", text: "Atelier créatif ou studio 🖌️", sector_tags: ["Arts", "Artisanat"], difficulty: 2 },
      { id: "c16_8", text: "Environnement hospitalier ou médical 🏥", sector_tags: ["Santé"], difficulty: 2 }
    ]
  },
  {
    id: 17,
    question_text: "Tes passions et hobbies en dehors du travail ? 🌟",
    phase: "Intérêts",
    order: 17,
    type: "multiple",
    maxAnswers: 3,
    adaptive_rules: {},
    choices: [
      { id: "c17_1", text: "Jeux vidéo et nouvelles technologies 🎮", sector_tags: ["Technology"], difficulty: 2 },
      { id: "c17_2", text: "Bénévolat et associatif ❤️", sector_tags: ["Social", "Santé"], difficulty: 2 },
      { id: "c17_3", text: "Trading ou petits business 📈", sector_tags: ["Commerce", "Finance"], difficulty: 2 },
      { id: "c17_4", text: "Bricolage, couture ou DIY 🧶", sector_tags: ["Artisanat", "Arts"], difficulty: 2 },
      { id: "c17_5", text: "Randonnée et animaux 🐾", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c17_6", text: "Débats politiques ou actualités 🗣️", sector_tags: ["Droit", "Journalisme"], difficulty: 2 },
      { id: "c17_7", text: "Sport intensif ou fitness 🏋️", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c17_8", text: "Lecture et documentaires 📖", sector_tags: ["Éducation", "Culture"], difficulty: 2 }
    ]
  },
  {
    id: 18,
    question_text: "Quelles sont tes valeurs fondamentales ? 💎",
    phase: "Valeurs",
    order: 18,
    type: "multiple",
    maxAnswers: 3,
    adaptive_rules: {},
    choices: [
      { id: "c18_1", text: "Innovation et Progrès 💡", sector_tags: ["Technology", "Science"], difficulty: 2 },
      { id: "c18_2", text: "Empathie et Soin 💗", sector_tags: ["Santé", "Social"], difficulty: 2 },
      { id: "c18_3", text: "Ambition et Réussite 🚀", sector_tags: ["Commerce", "Management"], difficulty: 2 },
      { id: "c18_4", text: "Esthétique et Beauté 🎭", sector_tags: ["Arts", "Luxe"], difficulty: 2 },
      { id: "c18_5", text: "Durabilité et Écologie 🌍", sector_tags: ["Environnement"], difficulty: 2 },
      { id: "c18_6", text: "Équité et Justice 🏛️", sector_tags: ["Droit", "Politique"], difficulty: 2 },
      { id: "c18_7", text: "Excellence et Dépassement 🥇", sector_tags: ["Sport"], difficulty: 2 },
      { id: "c18_8", text: "Transmission et Savoir 🦉", sector_tags: ["Éducation"], difficulty: 2 }
    ]
  }
];