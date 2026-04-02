export const PERSONALITY_PROFILES = {
  // --- LEADERSHIP & ACTION ---
  'visionnaire': {
    id: 'visionnaire',
    title: 'Le Visionnaire',
    emoji: '🔭',
    description: "Vous voyez ce que les autres ne voient pas encore. Votre esprit est constamment tourné vers l'avenir, imaginant des innovations et des solutions de rupture.",
    strengths: ['Anticipation', 'Innovation', 'Inspiration', 'Stratégie long-terme'],
    weaknesses: ['Peut négliger les détails opérationnels', 'Parfois perçu comme idéaliste'],
    idealDimensions: { innovation: 90, leadership: 80, risque: 70, creativite: 80 }
  },
  'leader': {
    id: 'leader',
    title: 'Le Leader Naturel',
    emoji: '🦁',
    description: "Prendre les devants est une seconde nature pour vous. Vous savez fédérer les énergies, trancher dans l'incertitude et porter la responsabilité du groupe.",
    strengths: ['Prise de décision', 'Charisme', 'Responsabilité', 'Délégation'],
    weaknesses: ['Peut être autoritaire', 'Difficulté à suivre les ordres'],
    idealDimensions: { leadership: 100, equipe: 80, relationnel: 70, risque: 60 }
  },
  'entrepreneur': {
    id: 'entrepreneur',
    title: 'L\'Entrepreneur',
    emoji: '🚀',
    description: "Vous voyez des opportunités là où d'autres voient des problèmes. L'action, le risque calculé et la création de valeur sont vos moteurs quotidiens.",
    strengths: ['Audace', 'Résilience', 'Adaptabilité', 'Sens des affaires'],
    weaknesses: ['Impatience', 'Tolérance au risque parfois excessive'],
    idealDimensions: { risque: 90, commerce: 80, autonomie: 90, innovation: 70 }
  },
  'stratege': {
    id: 'stratege',
    title: 'Le Stratège',
    emoji: '♟️',
    description: "Pour vous, la vie est un jeu d'échecs. Vous planifiez plusieurs coups à l'avance, analysez les systèmes complexes et optimisez chaque mouvement.",
    strengths: ['Planification', 'Vision globale', 'Logique', 'Efficacité'],
    weaknesses: ['Paralysie par l\'analyse', 'Manque de spontanéité'],
    idealDimensions: { analytique: 90, leadership: 60, rigueur: 70, etudes_longues: 60 }
  },

  // --- SOCIAL & EMPATHIE ---
  'empathique': {
    id: 'empathique',
    title: 'L\'Empathique',
    emoji: '❤️',
    description: "Vous ressentez les émotions des autres comme les vôtres. Votre super-pouvoir est de comprendre, soutenir et guérir ceux qui vous entourent.",
    strengths: ['Écoute active', 'Bienveillance', 'Intelligence émotionnelle', 'Diplomatie'],
    weaknesses: ['Peut s\'oublier pour les autres', 'Sensibilité au stress émotionnel'],
    idealDimensions: { sante: 90, relationnel: 100, equipe: 80, education: 70 }
  },
  'mediateur': {
    id: 'mediateur',
    title: 'Le Médiateur',
    emoji: '🕊️',
    description: "L'harmonie est votre priorité. Vous savez désamorcer les conflits, trouver des terrains d'entente et faciliter la communication entre des profils opposés.",
    strengths: ['Négociation', 'Calme', 'Impartialité', 'Synthèse'],
    weaknesses: ['Évitement des conflits directs', 'Indécision'],
    idealDimensions: { relationnel: 90, equipe: 80, droit: 60, commerce: 50 }
  },
  'pedagogue': {
    id: 'pedagogue',
    title: 'Le Pédagogue',
    emoji: '🦉',
    description: "Transmettre est votre passion. Vous avez le don de rendre simple ce qui est complexe et de faire grandir les compétences des autres.",
    strengths: ['Communication', 'Patience', 'Clarté', 'Mentorat'],
    weaknesses: ['Peut être didactique', 'Besoin de reconnaissance'],
    idealDimensions: { education: 100, relationnel: 80, leadership: 60, analytique: 50 }
  },
  'communicant': {
    id: 'communicant',
    title: 'Le Communicant',
    emoji: '📢',
    description: "Les mots sont vos armes. Que ce soit à l'oral ou à l'écrit, vous savez persuader, captiver et faire passer des messages avec impact.",
    strengths: ['Éloquence', 'Persuasion', 'Réseau', 'Charisme'],
    weaknesses: ['Bavardage', 'Peut manquer d\'écoute'],
    idealDimensions: { relationnel: 90, art: 60, commerce: 70, creativite: 60 }
  },

  // --- ANALYSE & RIGUEUR ---
  'analytique': {
    id: 'analytique',
    title: 'L\'Analytique',
    emoji: '📊',
    description: "Les données ne mentent jamais. Vous aimez les faits, les chiffres et la logique irréfutable. Vous apportez de la clarté dans le chaos.",
    strengths: ['Précision', 'Logique', 'Objectivité', 'Résolution de problèmes'],
    weaknesses: ['Froideur apparente', 'Scepticisme'],
    idealDimensions: { analytique: 100, rigueur: 90, tech: 70, science: 80 }
  },
  'expert': {
    id: 'expert',
    title: 'L\'Expert Technique',
    emoji: '🔬',
    description: "Vous visez l'excellence dans un domaine précis. La superficialité vous ennuie ; vous voulez comprendre le 'comment' et le 'pourquoi' en profondeur.",
    strengths: ['Maîtrise', 'Fiabilité', 'Perfectionnisme', 'Curiosité'],
    weaknesses: ['Vision tunnel', 'Jargon technique'],
    idealDimensions: { etudes_longues: 80, tech: 90, rigueur: 80, autonomie: 60 }
  },
  'organisateur': {
    id: 'organisateur',
    title: 'L\'Organisateur',
    emoji: '📋',
    description: "Pour vous, chaque chose a sa place. Vous structurez, planifiez et optimisez les processus pour que tout roule comme une horloge suisse.",
    strengths: ['Méthode', 'Fiabilité', 'Gestion du temps', 'Ordre'],
    weaknesses: ['Rigidité', 'Difficulté face à l\'imprévu'],
    idealDimensions: { rigueur: 100, construction: 60, droit: 70, analytique: 60 }
  },
  'protecteur': {
    id: 'protecteur',
    title: 'Le Protecteur',
    emoji: '🛡️',
    description: "Vous êtes le gardien des règles et de la sécurité. On compte sur vous pour veiller au respect des normes, à la justice et à la stabilité.",
    strengths: ['Intégrité', 'Loyauté', 'Vigilance', 'Sérieux'],
    weaknesses: ['Conservatisme', 'Méfiance'],
    idealDimensions: { droit: 90, rigueur: 80, risque: 10, relationnel: 50 }
  },

  // --- CRÉATIVITÉ & ART ---
  'creatif': {
    id: 'creatif',
    title: 'Le Créatif Pur',
    emoji: '🎨',
    description: "Le monde est votre toile. Vous avez besoin d'exprimer votre originalité et de créer du beau, du nouveau, de l'unique.",
    strengths: ['Originalité', 'Esthétique', 'Imagination', 'Sensibilité'],
    weaknesses: ['Discipline variable', 'Sensibilité à la critique'],
    idealDimensions: { art: 100, creativite: 100, innovation: 80, rigueur: 20 }
  },
  'innovateur': {
    id: 'innovateur',
    title: 'L\'Innovateur',
    emoji: '💡',
    description: "Le statu quo vous ennuie. Vous cherchez constamment de nouvelles façons de faire, de nouvelles technologies, de nouveaux horizons.",
    strengths: ['Inventivité', 'Curiosité', 'Agilité', 'Futurisme'],
    weaknesses: ['Se lasse vite', 'Désorganisé'],
    idealDimensions: { innovation: 100, tech: 80, risque: 60, autonomie: 70 }
  },
  'artisan': {
    id: 'artisan',
    title: 'L\'Artisan',
    emoji: '🛠️',
    description: "Vous pensez avec vos mains. Construire, réparer, façonner la matière concrète est ce qui vous donne le plus de satisfaction.",
    strengths: ['Habileté', 'Pragmatisme', 'Patience', 'Résultat tangible'],
    weaknesses: ['Peu d\'intérêt pour l\'abstrait', 'Communication écrite'],
    idealDimensions: { pratique: 100, construction: 80, art: 50, tech: 40 }
  },

  // --- ACTION & TERRAIN ---
  'aventurier': {
    id: 'aventurier',
    title: 'L\'Aventurier',
    emoji: '🌍',
    description: "La routine est votre ennemie. Vous avez besoin de mouvement, de découverte, d'action et parfois d'adrénaline pour vous sentir vivant.",
    strengths: ['Courage', 'Adaptabilité', 'Énergie', 'Débrouillardise'],
    weaknesses: ['Impulsivité', 'Instabilité'],
    idealDimensions: { risque: 90, sport: 80, environnement: 70, pratique: 60 }
  },
  'athlete': {
    id: 'athlete',
    title: 'Le Compétiteur',
    emoji: '🏆',
    description: "La performance est votre moteur. Que ce soit dans le sport ou le travail, vous aimez vous dépasser, relever des défis et gagner.",
    strengths: ['Discipline', 'Persévérance', 'Focus', 'Énergie'],
    weaknesses: ['Mauvais perdant', 'Compétition excessive'],
    idealDimensions: { sport: 100, sante: 60, leadership: 50, pratique: 70 }
  },
  'realiste': {
    id: 'realiste',
    title: 'Le Réaliste',
    emoji: '⚓',
    description: "Vous gardez les pieds sur terre. Pragmatique et sensé, vous préférez les solutions concrètes aux grandes théories fumeuses.",
    strengths: ['Bon sens', 'Stabilité', 'Efficacité', 'Simplicité'],
    weaknesses: ['Manque d\'imagination', 'Scepticisme'],
    idealDimensions: { pratique: 90, rigueur: 60, nature: 50, autonomie: 50 }
  },

  // --- PROFILS HYBRIDES ---
  'techno-humaniste': {
    id: 'techno-humaniste',
    title: 'Le Techno-Humaniste',
    emoji: '🤖',
    description: "Vous croyez que la technologie doit servir l'humain. Vous faites le pont entre le monde froid des machines et les besoins chaleureux de la société.",
    strengths: ['Éthique', 'Vision', 'Polyvalence', 'Médiation'],
    weaknesses: ['Conflits de valeurs', 'Complexité'],
    idealDimensions: { tech: 80, sante: 70, relationnel: 60, education: 60 }
  },
  'eco-acteur': {
    id: 'eco-acteur',
    title: 'L\'Éco-Acteur',
    emoji: '🌱',
    description: "Votre mission est de préserver. Vous alliez conviction et action pour un impact positif sur l'environnement et le vivant.",
    strengths: ['Engagement', 'Conscience', 'Patience', 'Vision systémique'],
    weaknesses: ['Militantisme parfois clivant', 'Anxiété écologique'],
    idealDimensions: { environnement: 100, sante: 60, science: 50, pratique: 50 }
  }
};