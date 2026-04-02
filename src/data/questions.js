export const questions = [
  {
    id: "q1",
    text: "Quelles activités vous attirent le plus spontanément ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a1_1", label: "Fabriquer, réparer, travailler avec mes mains", weights: { R: 3, I: 0, A: 0, S: 0, E: 0, C: 0 } },
      { id: "a1_2", label: "Observer, analyser, résoudre des problèmes complexes", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 0 } },
      { id: "a1_3", label: "Créer, imaginer, concevoir (art, design)", weights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 } },
      { id: "a1_4", label: "Aider, soigner, conseiller les autres", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 } },
      { id: "a1_5", label: "Convaincre, diriger, mener des projets à bien", weights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 0 } },
      { id: "a1_6", label: "Organiser, classer, suivre des règles précises", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a1_7", label: "Dépasser mes limites physiques ou sportives", weights: { R: 2, I: 0, A: 0, S: 0, E: 1, C: 0 }, domainId: 'sport' },
      { id: "a1_8", label: "Animer, divertir, organiser des événements", weights: { R: 0, I: 0, A: 1, S: 1, E: 1, C: 0 }, domainId: 'events' },
      { id: "a1_9", label: "Protéger la nature et l'environnement", weights: { R: 1, I: 1, A: 0, S: 1, E: 0, C: 0 }, domainId: 'environment' },
      { id: "a1_10", label: "Explorer, voyager, découvrir d'autres cultures", weights: { R: 0, I: 1, A: 0, S: 1, E: 1, C: 0 }, domainId: 'tourism' }
    ]
  },
  {
    id: "q2",
    text: "Dans quels domaines spécifiques vous projetez-vous ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a2_1", label: "Technologie, IA & Digital", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 }, domainId: 'technology' },
      { id: "a2_2", label: "Sciences & Recherche", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 0 }, domainId: 'sciences' },
      { id: "a2_3", label: "Santé, Médical & Social", weights: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 }, domainId: 'health' },
      { id: "a2_4", label: "Commerce, Vente & Marketing", weights: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 }, domainId: 'commerce' },
      { id: "a2_5", label: "Arts, Design & Culture", weights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 }, domainId: 'arts' },
      { id: "a2_6", label: "Éducation & Formation", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 }, domainId: 'education' },
      { id: "a2_7", label: "Industrie, Ingénierie & BTP", weights: { R: 3, I: 1, A: 0, S: 0, E: 0, C: 0 }, domainId: 'industry' },
      { id: "a2_8", label: "Droit & Justice", weights: { R: 0, I: 1, A: 0, S: 0, E: 1, C: 3 }, domainId: 'law' },
      { id: "a2_9", label: "Sport & Performance", weights: { R: 2, I: 0, A: 0, S: 1, E: 2, C: 0 }, domainId: 'sport' },
      { id: "a2_10", label: "Tourisme & Hôtellerie", weights: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 }, domainId: 'tourism' },
      { id: "a2_11", label: "Événementiel & Spectacle", weights: { R: 0, I: 0, A: 2, S: 1, E: 2, C: 0 }, domainId: 'events' },
      { id: "a2_12", label: "Environnement & Écologie", weights: { R: 1, I: 2, A: 0, S: 1, E: 0, C: 0 }, domainId: 'environment' }
    ]
  },
  {
    id: "q3",
    text: "Quel environnement de travail vous correspond le mieux ?",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a3_1", label: "Bureau structuré et calme", weights: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a3_2", label: "Sur le terrain, en déplacement", weights: { R: 2, I: 0, A: 0, S: 0, E: 1, C: 0 } },
      { id: "a3_3", label: "En atelier, laboratoire ou cuisine", weights: { R: 3, I: 1, A: 0, S: 0, E: 0, C: 0 } },
      { id: "a3_4", label: "Télétravail, depuis n'importe où", weights: { R: 0, I: 1, A: 1, S: 0, E: 1, C: 0 } },
      { id: "a3_5", label: "En plein air, dans la nature", weights: { R: 3, I: 1, A: 0, S: 0, E: 0, C: 0 }, domainId: 'environment' },
      { id: "a3_6", label: "Hybride (Bureau et Terrain)", weights: { R: 0, I: 0, A: 0, S: 1, E: 2, C: 0 } },
      { id: "a3_7", label: "Infrastructures sportives", weights: { R: 2, I: 0, A: 0, S: 1, E: 1, C: 0 }, domainId: 'sport' },
      { id: "a3_8", label: "Lieux d'événements, scènes, salons", weights: { R: 1, I: 0, A: 2, S: 1, E: 1, C: 0 }, domainId: 'events' }
    ]
  },
  {
    id: "q4",
    text: "Quelles tâches préférez-vous gérer au quotidien ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a4_1", label: "Tâches manuelles ou techniques", weights: { R: 3, I: 0, A: 0, S: 0, E: 0, C: 0 } },
      { id: "a4_2", label: "Création et design de contenus", weights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 } },
      { id: "a4_3", label: "Analyse de données et calculs", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 2 } },
      { id: "a4_4", label: "Accompagnement et écoute active", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 } },
      { id: "a4_5", label: "Gestion de budget et d'équipe", weights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 2 } },
      { id: "a4_6", label: "Enseignement et transmission", weights: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 } },
      { id: "a4_7", label: "Performance physique ou sportive", weights: { R: 3, I: 0, A: 0, S: 0, E: 1, C: 0 }, domainId: 'sport' },
      { id: "a4_8", label: "Organisation logistique d'événements", weights: { R: 0, I: 0, A: 1, S: 1, E: 2, C: 2 }, domainId: 'events' },
      { id: "a4_9", label: "Service et satisfaction client", weights: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 }, domainId: 'commerce' }
    ]
  },
  {
    id: "q5",
    text: "Quel rythme de travail vous motive ?",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a5_1", label: "Régulier et prévisible (routine)", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a5_2", label: "Très varié, jamais la même journée", weights: { R: 0, I: 0, A: 2, S: 0, E: 2, C: 0 } },
      { id: "a5_3", label: "Dans l'urgence et l'adrénaline", weights: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 }, domainId: 'events' },
      { id: "a5_4", label: "En totale autonomie, selon mon inspiration", weights: { R: 0, I: 1, A: 3, S: 0, E: 0, C: 0 } },
      { id: "a5_5", label: "Équilibré entre temps pro et perso", weights: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 } },
      { id: "a5_6", label: "Rythmé par les saisons ou de grands projets", weights: { R: 2, I: 0, A: 0, S: 0, E: 1, C: 0 }, domainId: 'tourism' },
      { id: "a5_7", label: "Rythmé par la coordination avec une équipe", weights: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 } }
    ]
  },
  {
    id: "q6",
    text: "Comment envisagez-vous la durée de vos projets ?",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a6_1", label: "Des actions courtes et immédiates", weights: { R: 2, I: 0, A: 0, S: 1, E: 1, C: 0 } },
      { id: "a6_2", label: "Des projets à moyen terme (quelques mois)", weights: { R: 0, I: 1, A: 1, S: 0, E: 2, C: 1 } },
      { id: "a6_3", label: "Des recherches ou missions à très long terme", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 } },
      { id: "a6_4", label: "Une grande variété de durées simultanées", weights: { R: 0, I: 0, A: 1, S: 0, E: 3, C: 0 } },
      { id: "a6_5", label: "Une date butoir stricte (l'événement le jour J)", weights: { R: 0, I: 0, A: 1, S: 0, E: 2, C: 2 }, domainId: 'events' },
      { id: "a6_6", label: "Un impact visible sur le temps long (générations futures)", weights: { R: 0, I: 2, A: 0, S: 2, E: 0, C: 0 }, domainId: 'environment' }
    ]
  },
  {
    id: "q7",
    text: "Comment interagissez-vous avec les autres ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a7_1", label: "Le joueur d'équipe, collaboratif", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 } },
      { id: "a7_2", label: "Le loup solitaire, concentré", weights: { R: 1, I: 3, A: 1, S: 0, E: 0, C: 0 } },
      { id: "a7_3", label: "Le leader, qui tranche et dirige", weights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 0 } },
      { id: "a7_4", label: "Le négociateur face au client", weights: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 } },
      { id: "a7_5", label: "Le soutien, à l'écoute des besoins", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 }, domainId: 'health' },
      { id: "a7_6", label: "Le compétiteur, stimulé par le challenge", weights: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 }, domainId: 'sport' },
      { id: "a7_7", label: "Le partenaire, construisant des réseaux", weights: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 } },
      { id: "a7_8", label: "Le mentor, qui transmet et explique", weights: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 }, domainId: 'education' },
      { id: "a7_9", label: "L'animateur, qui crée du lien social", weights: { R: 0, I: 0, A: 1, S: 3, E: 1, C: 0 }, domainId: 'events' }
    ]
  },
  {
    id: "q8",
    text: "Quelle est votre façon préférée d'apprendre ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a8_1", label: "Par la pratique et l'expérimentation", weights: { R: 3, I: 0, A: 0, S: 0, E: 0, C: 0 } },
      { id: "a8_2", label: "Par la lecture et l'analyse théorique", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 } },
      { id: "a8_3", label: "En obtenant des cadres ou certifications", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a8_4", label: "En échangeant avec un mentor", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 } },
      { id: "a8_5", label: "En autodidacte, à mon propre rythme", weights: { R: 0, I: 2, A: 2, S: 0, E: 0, C: 0 } },
      { id: "a8_6", label: "Sur le terrain, via des projets concrets", weights: { R: 2, I: 0, A: 0, S: 0, E: 1, C: 0 } },
      { id: "a8_7", label: "En travaillant avec un groupe d'étudiants", weights: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 0 } },
      { id: "a8_8", label: "Par l'innovation et la création", weights: { R: 0, I: 0, A: 3, S: 0, E: 1, C: 0 } }
    ]
  },
  {
    id: "q9",
    text: "Face à l'innovation et au risque, vous êtes plutôt :",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a9_1", label: "Innovateur créatif, j'adore inventer", weights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 } },
      { id: "a9_2", label: "Risque calculé, j'analyse avant d'agir", weights: { R: 0, I: 2, A: 0, S: 0, E: 2, C: 0 } },
      { id: "a9_3", label: "Prudent, je préfère ce qui est sûr et testé", weights: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a9_4", label: "Adaptable, je gère les imprévus au jour le jour", weights: { R: 0, I: 0, A: 1, S: 0, E: 2, C: 0 } },
      { id: "a9_5", label: "Audacieux, j'aime disrupter les codes", weights: { R: 0, I: 0, A: 1, S: 0, E: 3, C: 0 } },
      { id: "a9_6", label: "Conservateur, garant des normes et procédures", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 }, domainId: 'law' }
    ]
  },
  {
    id: "q10",
    text: "Quelles sont vos valeurs professionnelles principales ?",
    description: "Sélectionnez 2 réponses maximum.",
    type: "multi_choice",
    maxAnswers: 2,
    answers: [
      { id: "a10_1", label: "Utilité sociale et entraide", weights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 }, domainId: 'health' },
      { id: "a10_2", label: "Créativité et originalité", weights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 }, domainId: 'arts' },
      { id: "a10_3", label: "Stabilité et sécurité de l'emploi", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a10_4", label: "Autonomie et indépendance", weights: { R: 0, I: 0, A: 2, S: 0, E: 2, C: 0 } },
      { id: "a10_5", label: "Argent, statut et réussite matérielle", weights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 0 }, domainId: 'commerce' },
      { id: "a10_6", label: "Équilibre vie pro / vie perso", weights: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 1 } },
      { id: "a10_7", label: "Protection de l'environnement", weights: { R: 1, I: 1, A: 0, S: 1, E: 0, C: 0 }, domainId: 'environment' },
      { id: "a10_8", label: "Savoir, vérité et recherche", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 0 }, domainId: 'sciences' },
      { id: "a10_9", label: "Excellence et dépassement de soi", weights: { R: 1, I: 0, A: 0, S: 0, E: 2, C: 0 }, domainId: 'sport' },
      { id: "a10_10", label: "Aventure et découverte", weights: { R: 0, I: 0, A: 1, S: 0, E: 2, C: 0 }, domainId: 'tourism' },
      { id: "a10_11", label: "Création de moments inoubliables", weights: { R: 0, I: 0, A: 2, S: 2, E: 1, C: 0 }, domainId: 'events' }
    ]
  },
  {
    id: "q11",
    text: "Actuellement, quel est votre rapport aux études ?",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a11_1", label: "Études courtes ou apprentissage (Bac ou moins)", weights: { R: 3, I: 0, A: 0, S: 0, E: 1, C: 1 } },
      { id: "a11_2", label: "Niveau Bac+2 (BTS, DUT...)", weights: { R: 2, I: 1, A: 0, S: 1, E: 1, C: 2 } },
      { id: "a11_3", label: "Niveau Bac+3 (Licence, BUT...)", weights: { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 } },
      { id: "a11_4", label: "Niveau Bac+5 (Master, École d'ingé/commerce)", weights: { R: 0, I: 2, A: 0, S: 0, E: 2, C: 1 } },
      { id: "a11_5", label: "Études très longues (Doctorat, Médecine)", weights: { R: 0, I: 3, A: 0, S: 2, E: 0, C: 0 } },
      { id: "a11_6", label: "Je suis actuellement en cours d'études/réflexion", weights: { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 } },
      { id: "a11_7", label: "Formation professionnelle continue ou reconversion", weights: { R: 1, I: 0, A: 0, S: 1, E: 2, C: 0 } }
    ]
  },
  {
    id: "q12",
    text: "Comment vous projetez-vous dans l'avenir ?",
    description: "Sélectionnez 1 réponse.",
    type: "choice",
    maxAnswers: 1,
    answers: [
      { id: "a12_1", label: "Devenir un expert incontournable dans mon domaine", weights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 } },
      { id: "a12_2", label: "Gérer et diriger une grande équipe ou un service", weights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 } },
      { id: "a12_3", label: "Créer ma propre entreprise (entrepreneuriat)", weights: { R: 0, I: 0, A: 1, S: 0, E: 3, C: 0 } },
      { id: "a12_4", label: "Avoir un impact fort sur la société ou l'écologie", weights: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 }, domainId: 'environment' },
      { id: "a12_5", label: "Profiter d'un emploi stable pour ma vie personnelle", weights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
      { id: "a12_6", label: "Changer régulièrement de projet ou de pays", weights: { R: 0, I: 0, A: 2, S: 0, E: 2, C: 0 }, domainId: 'tourism' },
      { id: "a12_7", label: "Gagner des compétitions ou être reconnu par mes pairs", weights: { R: 2, I: 0, A: 2, S: 0, E: 3, C: 0 }, domainId: 'sport' },
      { id: "a12_8", label: "Transmettre mon savoir à la nouvelle génération", weights: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 }, domainId: 'education' }
    ]
  }
];