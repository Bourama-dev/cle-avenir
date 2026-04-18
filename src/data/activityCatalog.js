/**
 * Local activity catalog — used as rich fallback when the DB has
 * fewer than 10 published activities.
 *
 * Each activity mirrors the Supabase `activities` table shape:
 *   id, title, type, difficulty, duration_minutes, xp_reward,
 *   skills_rewarded, description, content: { steps: [...] }
 *
 * Step types:
 *   text   — { type, title?, content }
 *   quiz   — { type, question, choices[], correct, explanation }
 *   interview  — { type, question, hint?, auto_listen? }
 *   simulation — { type, context, cleo_line, user_role?, hint? }
 */

export const LOCAL_ACTIVITY_CATALOG = [

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 1 : CONNAISSANCE DE SOI
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-01',
    title: 'Comprendre le modèle RIASEC',
    type: 'Cours interactif',
    difficulty: 'Débutant',
    duration_minutes: 15,
    xp_reward: 50,
    skills_rewarded: ['orientation', 'connaissance_soi'],
    description: 'Découvrez comment le modèle RIASEC peut vous aider à identifier les métiers qui vous correspondent.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Qu\'est-ce que le RIASEC ?',
          content: 'Le modèle RIASEC (Holland) classe les personnalités professionnelles en 6 types : Réaliste (R), Investigateur (I), Artistique (A), Social (S), Entrepreneur (E), Conventionnel (C). Chaque personne a une combinaison unique de ces traits. Connaître son profil permet de cibler des métiers où l\'on s\'épanouira naturellement.',
        },
        {
          type: 'quiz',
          question: 'Quel type RIASEC correspond à une personne qui aime analyser des données et résoudre des problèmes complexes ?',
          choices: ['Réaliste (R)', 'Investigateur (I)', 'Artistique (A)', 'Social (S)'],
          correct: 1,
          explanation: 'L\'Investigateur (I) est caractérisé par le goût pour l\'analyse, la recherche et la résolution de problèmes intellectuels.',
        },
        {
          type: 'quiz',
          question: 'Un profil "Social" (S) sera le plus épanoui dans quel type de métier ?',
          choices: ['Ingénieur en robotique', 'Infirmier ou assistant social', 'Comptable', 'Opérateur de machine'],
          correct: 1,
          explanation: 'Le type Social est attiré par l\'aide aux autres, l\'enseignement et les relations humaines. Les métiers de soin et d\'accompagnement sont idéaux.',
        },
        {
          type: 'quiz',
          question: 'Quelle combinaison RIASEC est typique d\'un entrepreneur ?',
          choices: ['RIC', 'SEC', 'ECS', 'AIR'],
          correct: 2,
          explanation: 'L\'entrepreneur combine souvent E (leadership, initiative), C (organisation) et S (relationnel). La combinaison ECS est fréquente chez les créateurs d\'entreprise.',
        },
        {
          type: 'interview',
          question: 'En réfléchissant à vos activités préférées (loisirs, projets scolaires, jobs…), quels types RIASEC pensez-vous retrouver dans votre personnalité ? Expliquez votre raisonnement.',
          hint: 'Pensez aux situations où vous vous êtes senti(e) vraiment dans votre élément.',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-02',
    title: 'Identifier vos valeurs professionnelles',
    type: 'Réflexion guidée',
    difficulty: 'Débutant',
    duration_minutes: 20,
    xp_reward: 60,
    skills_rewarded: ['connaissance_soi', 'orientation'],
    description: 'Vos valeurs guident vos choix. Apprenez à les identifier pour mieux orienter votre projet professionnel.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Pourquoi les valeurs comptent ?',
          content: 'Les valeurs professionnelles sont les principes qui donnent du sens à votre travail : autonomie, impact social, sécurité, créativité, reconnaissance, équilibre vie pro/perso… Travailler en accord avec ses valeurs réduit le stress et augmente la satisfaction. Un(e) employé(e) dont les valeurs sont alignées avec l\'entreprise est 3× plus engagé(e).',
        },
        {
          type: 'quiz',
          question: 'Laquelle de ces affirmations décrit le mieux une "valeur professionnelle" ?',
          choices: [
            'Une compétence technique acquise en formation',
            'Un principe fondamental qui guide vos choix de carrière',
            'Le salaire minimum attendu',
            'Le titre de poste souhaité',
          ],
          correct: 1,
          explanation: 'Les valeurs sont des principes profonds (autonomie, impact, sécurité…) qui influencent vos décisions de carrière, bien au-delà des compétences ou du salaire.',
        },
        {
          type: 'quiz',
          question: 'Si "créativité" est votre valeur principale, quel environnement vous conviendrait le moins ?',
          choices: ['Startup tech avec beaucoup d\'innovation', 'Agence de design', 'Administration publique très hiérarchisée', 'Studio de jeu vidéo'],
          correct: 2,
          explanation: 'Une administration très hiérarchisée et codifiée laisse peu de place à la créativité et à l\'initiative personnelle, ce qui crée souvent de la frustration pour ce profil.',
        },
        {
          type: 'interview',
          question: 'Citez 3 valeurs qui sont non-négociables pour vous dans votre vie professionnelle. Pour chacune, expliquez pourquoi elle est importante et donnez un exemple concret de situation où elle a été respectée ou bafouée.',
          hint: 'Soyez précis(e) : "autonomie" c\'est quoi concrètement pour vous ? Pouvoir organiser votre temps ? Travailler seul(e) ?',
          auto_listen: true,
        },
        {
          type: 'interview',
          question: 'Si vous deviez choisir entre un poste très bien rémunéré mais contraire à vos valeurs, et un poste moins payé mais parfaitement aligné avec elles, quel serait votre choix et pourquoi ?',
          hint: 'Il n\'y a pas de bonne ou mauvaise réponse — réfléchissez à ce qui compte vraiment pour vous.',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 2 : PRÉPARATION À L'ENTRETIEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-03',
    title: 'Maîtriser la question "Parlez-moi de vous"',
    type: 'Simulation entretien',
    difficulty: 'Intermédiaire',
    duration_minutes: 25,
    xp_reward: 80,
    skills_rewarded: ['communication', 'relationnel'],
    description: 'La première question de tout entretien. Apprenez la méthode STAR pour y répondre avec impact.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'La méthode STAR pour se présenter',
          content: 'La méthode STAR structure votre présentation en 4 parties :\n• Situation : Le contexte de votre parcours\n• Tâche : Ce que vous faisiez / étiez chargé de faire\n• Action : Ce que vous avez fait concrètement\n• Résultat : Ce que vous avez accompli\n\nÉvitez de réciter votre CV ! Les recruteurs veulent une narration cohérente de 2-3 minutes maximum, qui montre votre valeur ajoutée.',
        },
        {
          type: 'quiz',
          question: 'Quelle présentation est la plus efficace en entretien ?',
          choices: [
            '"J\'ai fait un BTS commerce, puis une licence, puis un Master..."',
            '"Je suis quelqu\'un de motivé et de dynamique qui aime les défis."',
            '"Mon parcours en marketing digital m\'a permis de développer X compétence, ce qui m\'a conduit à Y réalisation, et c\'est pourquoi je vise maintenant ce poste chez vous."',
            '"Je n\'ai pas beaucoup d\'expérience mais je suis très motivé."',
          ],
          correct: 2,
          explanation: 'La troisième réponse relie parcours, compétences et ambition de manière cohérente et ciblée vers le recruteur. Elle montre de la valeur, pas juste un CV récité.',
        },
        {
          type: 'quiz',
          question: 'Combien de temps doit durer idéalement une présentation "parlez-moi de vous" ?',
          choices: ['30 secondes maximum', '2 à 3 minutes', '5 à 7 minutes', 'Autant que possible pour montrer votre richesse'],
          correct: 1,
          explanation: '2 à 3 minutes est le format idéal : assez long pour donner du contenu, assez court pour maintenir l\'attention du recruteur et lui laisser rebondir.',
        },
        {
          type: 'simulation',
          context: 'Entretien pour un poste de chargé(e) de communication dans une PME',
          cleo_line: 'Bonjour et bienvenue. Je suis la directrice RH. Pour commencer, pouvez-vous me parler de vous et de votre parcours ?',
          user_role: 'Candidat(e)',
          hint: 'Utilisez la méthode STAR : contexte → compétences développées → réalisation concrète → pourquoi ce poste maintenant.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Suite de l\'entretien',
          cleo_line: 'C\'est intéressant. Vous avez mentionné votre expérience en communication. Quelle est la réalisation dont vous êtes le plus fier ou la plus fière ?',
          user_role: 'Candidat(e)',
          hint: 'Choisissez un exemple concret avec des chiffres si possible (audience, engagement, résultat mesurable).',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-04',
    title: 'Répondre aux questions pièges',
    type: 'Simulation entretien',
    difficulty: 'Intermédiaire',
    duration_minutes: 30,
    xp_reward: 100,
    skills_rewarded: ['communication', 'connaissance_soi'],
    description: 'Défauts, échecs, conflits… Les questions déstabilisantes n\'auront plus de secrets pour vous.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les questions pièges : pourquoi les recruteurs les posent',
          content: 'Les questions difficiles ne sont pas là pour piéger mais pour évaluer :\n• Votre honnêteté et votre conscience de soi\n• Votre capacité à apprendre de vos erreurs\n• Votre gestion du stress et de l\'inattendu\n\nLe secret : transformer chaque "faiblesse" en preuve de maturité professionnelle.',
        },
        {
          type: 'quiz',
          question: '"Quel est votre plus grand défaut ?" — Quelle réponse est la MEILLEURE ?',
          choices: [
            '"Je n\'ai aucun défaut particulier."',
            '"Je suis trop perfectionniste." (sans suite)',
            '"J\'ai tendance à vouloir tout contrôler, ce qui peut ralentir la délégation. J\'y travaille activement en utilisant des outils de suivi qui me permettent de déléguer tout en gardant une visibilité."',
            '"Je suis parfois en retard."',
          ],
          correct: 2,
          explanation: 'La meilleure réponse identifie un vrai défaut (pas un faux perfectionnisme générique), montre une conscience de soi et décrit une action concrète pour le corriger.',
        },
        {
          type: 'quiz',
          question: '"Où vous voyez-vous dans 5 ans ?" — Que cherche vraiment le recruteur ?',
          choices: [
            'Il veut savoir si vous avez un plan de carrière précis',
            'Il teste votre ambition et votre alignement avec le poste et l\'entreprise',
            'Il vérifie que vous ne partirez pas trop tôt',
            'Il veut savoir si vous voulez son poste',
          ],
          correct: 1,
          explanation: 'Cette question évalue votre ambition, votre connaissance du poste ET votre cohérence. La réponse idéale montre que vous vous voyez évoluer dans cette entreprise en apportant de la valeur.',
        },
        {
          type: 'simulation',
          context: 'Entretien pour un premier emploi dans le secteur bancaire',
          cleo_line: 'Parlez-moi d\'une situation où vous avez échoué. Qu\'est-ce que vous en avez tiré ?',
          user_role: 'Candidat(e)',
          hint: 'Choisissez un vrai échec (pas anodin), expliquez ce qui s\'est passé, ce que vous avez appris et comment vous avez changé vos pratiques.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Suite de l\'entretien',
          cleo_line: 'Nous avons plusieurs candidats très qualifiés. Pourquoi devrions-nous vous choisir vous, plutôt qu\'un autre ?',
          user_role: 'Candidat(e)',
          hint: 'Soyez concret(e) et spécifique à CETTE entreprise. Évitez les généralités. Mentionnez ce que vous apportez que les autres n\'ont peut-être pas.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Fin d\'entretien',
          cleo_line: 'Avez-vous des questions à me poser ?',
          user_role: 'Candidat(e)',
          hint: 'TOUJOURS poser des questions ! Montrez votre intérêt pour le poste, l\'équipe, les projets. Exemple : "Qu\'est-ce qui rend cette équipe unique ?" ou "Quels sont les défis du poste ?"',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-05',
    title: 'Négocier son salaire avec confiance',
    type: 'Simulation entretien',
    difficulty: 'Avancé',
    duration_minutes: 25,
    xp_reward: 120,
    skills_rewarded: ['commerce', 'communication', 'leadership'],
    description: 'Apprenez à aborder la question du salaire sans stress et à défendre votre valeur.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Se préparer à la négociation salariale',
          content: 'La négociation salariale est une compétence, pas une confrontation. Quelques règles :\n• Faites vos recherches : grilles sectorielles, offres similaires, INSEE\n• Définissez votre fourchette (minimum acceptable → idéal)\n• Laissez TOUJOURS le recruteur annoncer le premier si possible\n• Justifiez par votre valeur ajoutée, pas vos besoins personnels\n• Pensez au package global : variable, télétravail, formation, RTT',
        },
        {
          type: 'quiz',
          question: 'Le recruteur vous demande vos prétentions salariales. Quelle stratégie est la plus efficace ?',
          choices: [
            'Donner un chiffre précis immédiatement pour montrer que vous savez ce que vous valez',
            'Dire "Je m\'adapte à votre budget"',
            'Donner une fourchette haute cohérente avec le marché, en demandant d\'abord la fourchette prévue',
            'Refuser de répondre car c\'est trop tôt',
          ],
          correct: 2,
          explanation: 'Proposer une fourchette haute mais réaliste vous laisse de la marge, et demander la fourchette prévue vous donne une information précieuse pour adapter votre réponse.',
        },
        {
          type: 'quiz',
          question: 'Le recruteur dit "C\'est au-dessus de notre budget." Quelle est la meilleure réaction ?',
          choices: [
            'Accepter immédiatement le chiffre proposé',
            'Partir — si ils ne peuvent pas payer, ce n\'est pas le bon poste',
            'Explorer le package global (variable, avantages) et demander ce qui est possible',
            'Montrer de la déception pour qu\'ils revoient leur offre',
          ],
          correct: 2,
          explanation: 'Explorer le package global permet souvent de trouver un accord acceptable pour les deux parties. Un variable, des jours de télétravail ou une prime peuvent compenser un fixe plus bas.',
        },
        {
          type: 'simulation',
          context: 'Entretien final pour un poste de développeur fullstack (3 ans d\'expérience)',
          cleo_line: 'Tout s\'est très bien passé. Avant d\'aller plus loin, quelles sont vos prétentions salariales ?',
          user_role: 'Candidat(e)',
          hint: 'Basez-vous sur le marché (40-55k€ pour 3 ans d\'expérience en dev). Donnez une fourchette et justifiez-la.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Suite de la négociation',
          cleo_line: 'Votre fourchette est un peu haute pour nous. Nous pouvions aller jusqu\'à 42 000€. Est-ce que c\'est quelque chose qui vous conviendrait ?',
          user_role: 'Candidat(e)',
          hint: 'Ne dites pas oui immédiatement. Explorez : variable ? Révision à 6 mois ? Formation payée ? Télétravail supplémentaire ?',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 3 : DÉCOUVERTE DES MÉTIERS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-06',
    title: 'Les métiers du numérique : panorama complet',
    type: 'Quiz thématique',
    difficulty: 'Débutant',
    duration_minutes: 20,
    xp_reward: 70,
    skills_rewarded: ['tech', 'analytique'],
    description: 'Développeur, Data Analyst, UX Designer, DevOps… Qui fait quoi dans le secteur numérique ?',
    content: {
      steps: [
        {
          type: 'text',
          title: 'L\'écosystème numérique en 5 minutes',
          content: 'Le secteur numérique regroupe des dizaines de métiers. Quelques familles :\n\n🔧 Développement : Frontend (interfaces), Backend (serveurs), Fullstack, Mobile\n📊 Data : Data Analyst (analyse), Data Scientist (modèles ML), Data Engineer (pipelines)\n🎨 Design : UX/UI Designer, Product Designer, Motion Designer\n🔒 Cybersécurité : Analyste SOC, Pentesteur, RSSI\n☁️ Infrastructure : DevOps, SRE, Architecte Cloud\n📱 Produit : Product Manager, Product Owner, Scrum Master',
        },
        {
          type: 'quiz',
          question: 'Quelle est la différence principale entre un développeur Frontend et Backend ?',
          choices: [
            'Le Frontend code en JavaScript, le Backend en Python uniquement',
            'Le Frontend crée ce que l\'utilisateur voit, le Backend gère les serveurs et données',
            'Le Frontend est moins bien payé',
            'Il n\'y a pas de différence fondamentale',
          ],
          correct: 1,
          explanation: 'Le Frontend s\'occupe de l\'interface utilisateur (HTML/CSS/JS), le Backend gère la logique métier, les APIs et les bases de données. Les deux sont nécessaires dans la plupart des applications web.',
        },
        {
          type: 'quiz',
          question: 'Un "Data Scientist" se différencie d\'un "Data Analyst" par :',
          choices: [
            'Le Data Scientist utilise des tableaux Excel, le Data Analyst Python',
            'Le Data Scientist construit des modèles prédictifs (ML/IA), l\'Analyst analyse et visualise des données existantes',
            'Le Data Scientist est plus junior',
            'Il n\'y a pas de différence',
          ],
          correct: 1,
          explanation: 'Le Data Analyst produit des insights à partir de données (rapports, dashboards). Le Data Scientist va plus loin en construisant des modèles de machine learning pour prédire ou automatiser.',
        },
        {
          type: 'quiz',
          question: 'Quel est le rôle d\'un Product Manager (PM) ?',
          choices: [
            'Il code les fonctionnalités du produit',
            'Il définit la vision, la stratégie et la roadmap du produit en faisant le lien entre business, tech et utilisateurs',
            'Il gère les commandes des clients',
            'Il fait le design graphique',
          ],
          correct: 1,
          explanation: 'Le PM est souvent appelé "le CEO du produit". Il définit le QUOI et le POURQUOI (roadmap, priorités, besoins utilisateurs), l\'équipe technique se charge du COMMENT.',
        },
        {
          type: 'quiz',
          question: 'Quel métier du numérique a la croissance la plus forte en France en 2024 ?',
          choices: [
            'Développeur PHP',
            'Spécialiste en cybersécurité',
            'Technicien de maintenance informatique',
            'Opérateur de saisie',
          ],
          correct: 1,
          explanation: 'La cybersécurité est en pleine explosion : +25% d\'offres par an en France. Les entreprises peinent à trouver des profils qualifiés, ce qui se traduit par des salaires très attractifs.',
        },
        {
          type: 'interview',
          question: 'Parmi les métiers du numérique présentés, lequel vous attire le plus et pourquoi ? Qu\'est-ce qui vous plaît dans ce rôle spécifique ?',
          hint: 'Réfléchissez à vos forces et intérêts : préférez-vous créer, analyser, protéger, ou organiser ?',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-07',
    title: 'Les métiers de la santé et du médico-social',
    type: 'Quiz thématique',
    difficulty: 'Débutant',
    duration_minutes: 20,
    xp_reward: 70,
    skills_rewarded: ['relationnel', 'connaissance_soi'],
    description: 'Un secteur qui recrute massivement. Infirmier, aide-soignant, kiné, psychologue… Découvrez ces métiers essentiels.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'La santé : un secteur en pleine transformation',
          content: 'Le secteur santé/médico-social est le 1er employeur de France avec plus de 2 millions de postes. Les besoins explosent avec le vieillissement de la population.\n\nGrandes familles de métiers :\n🏥 Soins : Infirmier(e), Aide-soignant(e), Médecin, Kinésithérapeute\n👤 Accompagnement : Éducateur spécialisé, AES, Travailleur social, Assistant de service social\n🧠 Mental : Psychologue, Psychiatre, Psychomotricien\n⚙️ Support : Technicien de laboratoire, Manipulateur radio, Préparateur en pharmacie',
        },
        {
          type: 'quiz',
          question: 'Quelle formation permet d\'accéder au métier d\'infirmier(e) en France ?',
          choices: [
            'Un BTS Santé (2 ans)',
            'Le Diplôme d\'État d\'Infirmier (DEI) — 3 ans en IFSI',
            'Une licence de biologie',
            'Un CAP Soins à la personne',
          ],
          correct: 1,
          explanation: 'Le DEI se prépare en 3 ans dans un Institut de Formation en Soins Infirmiers (IFSI), accessible après le baccalauréat via Parcoursup.',
        },
        {
          type: 'quiz',
          question: 'Quelle est la différence entre un aide-soignant et un infirmier ?',
          choices: [
            'L\'infirmier s\'occupe des repas, l\'aide-soignant des médicaments',
            'L\'aide-soignant assiste dans les actes de la vie quotidienne, l\'infirmier réalise les actes techniques médicaux (soins, médicaments, surveillance)',
            'Il n\'y a pas de différence de responsabilités',
            'L\'aide-soignant travaille uniquement à domicile',
          ],
          correct: 1,
          explanation: 'L\'aide-soignant travaille sous la responsabilité de l\'infirmier. Il s\'occupe de l\'hygiène, du confort et de la toilette. L\'infirmier a des responsabilités techniques et médicales plus larges.',
        },
        {
          type: 'quiz',
          question: 'Le secteur médico-social connaît actuellement :',
          choices: [
            'Une surpopulation de professionnels',
            'Une forte pénurie de personnels qualifiés, notamment en zones rurales',
            'Une stabilité de l\'emploi sans tension particulière',
            'Une automatisation qui réduit les besoins',
          ],
          correct: 1,
          explanation: 'La pénurie est critique, notamment pour les infirmiers, aides-soignants et médecins généralistes. Cela représente une opportunité d\'emploi exceptionnelle pour les candidats qualifiés.',
        },
        {
          type: 'interview',
          question: 'Qu\'est-ce qui vous attire dans les métiers du soin ou du social ? Avez-vous une expérience (même personnelle ou bénévole) qui vous a orienté vers ce secteur ?',
          hint: 'Les recruteurs du secteur cherchent des personnes avec une vraie motivation humaine, pas seulement technique.',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 4 : COMPÉTENCES PROFESSIONNELLES (SOFT SKILLS)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-08',
    title: 'Développer son intelligence émotionnelle',
    type: 'Développement personnel',
    difficulty: 'Intermédiaire',
    duration_minutes: 25,
    xp_reward: 90,
    skills_rewarded: ['relationnel', 'leadership', 'communication'],
    description: 'L\'IE est le facteur n°1 de succès professionnel selon Harvard. Comprenez-la et développez-la.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'L\'intelligence émotionnelle (IE) : qu\'est-ce que c\'est ?',
          content: 'Définie par Daniel Goleman, l\'IE comprend 5 composantes :\n\n1. La conscience de soi — Reconnaître ses émotions\n2. La maîtrise de soi — Gérer ses réactions\n3. La motivation — Se motiver par des objectifs internes\n4. L\'empathie — Comprendre les émotions des autres\n5. Les compétences sociales — Gérer les relations\n\nUn QE élevé prédit mieux le succès professionnel que le QI (Harvard Business Review).',
        },
        {
          type: 'quiz',
          question: 'Lors d\'un conflit avec un collègue, quelle réaction reflète une haute intelligence émotionnelle ?',
          choices: [
            'Ignorer le problème en espérant qu\'il se résolve seul',
            'Exprimer votre frustration immédiatement et vivement',
            'Prendre un moment pour vous calmer, puis aborder la situation avec "j\'ai ressenti… quand…"',
            'Demander à votre manager de régler le conflit à votre place',
          ],
          correct: 2,
          explanation: 'La communication non violente (CNV) permet d\'exprimer ses besoins sans attaquer l\'autre. Le "je" évite la défensivité et ouvre le dialogue.',
        },
        {
          type: 'quiz',
          question: 'Qu\'est-ce que l\'empathie professionnelle ?',
          choices: [
            'Être d\'accord avec tout ce que disent les autres',
            'Comprendre et reconnaître les émotions et perspectives des autres sans nécessairement les partager',
            'Pleurer avec ses collègues quand ils sont tristes',
            'Ne jamais critiquer le travail de quelqu\'un',
          ],
          correct: 1,
          explanation: 'L\'empathie ne signifie pas approuver ou ressentir les mêmes choses. C\'est la capacité à se mettre à la place de l\'autre pour comprendre sa perspective — essentiel pour le travail en équipe et le leadership.',
        },
        {
          type: 'simulation',
          context: 'Vous êtes chef de projet. Un membre de votre équipe rend régulièrement un travail de mauvaise qualité.',
          cleo_line: 'Je dois vous parler d\'un problème. Depuis quelques semaines, je remarque que la qualité de votre travail a beaucoup baissé. Vos livrables contiennent des erreurs et les délais ne sont pas respectés. Qu\'est-ce qui se passe ?',
          user_role: 'Chef de projet',
          hint: 'Utilisez l\'IE : montrez de l\'empathie, cherchez à comprendre avant de juger, proposez du soutien plutôt que de sanctionner directement.',
          auto_listen: true,
        },
        {
          type: 'interview',
          question: 'Décrivez une situation où vous avez dû gérer une émotion forte (colère, frustration, déception) dans un contexte professionnel. Comment avez-vous réagi et qu\'est-ce que vous avez appris de cette expérience ?',
          hint: 'Soyez honnête(e) — les recruteurs apprécient la lucidité et la capacité d\'apprentissage plus que la perfection.',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-09',
    title: 'Communication assertive : s\'affirmer sans agresser',
    type: 'Développement personnel',
    difficulty: 'Intermédiaire',
    duration_minutes: 20,
    xp_reward: 80,
    skills_rewarded: ['communication', 'relationnel'],
    description: 'Ni passif, ni agressif : apprenez à exprimer vos besoins et opinions avec clarté et respect.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les 4 styles de communication',
          content: '1. 🟡 Passif : Vous ne dites pas ce que vous pensez, vous cédez toujours\n2. 🔴 Agressif : Vous imposez votre point de vue sans respect pour l\'autre\n3. 🟠 Passif-agressif : Vous montrez votre mécontentement de manière indirecte (sarcasme, procrastination)\n4. 🟢 Assertif : Vous exprimez clairement vos besoins et limites avec respect mutuel\n\nL\'assertivité s\'apprend. La technique "DESC" aide : Décrire la situation → Exprimer son ressenti → Spécifier ce que vous voulez → Conclure sur les conséquences positives.',
        },
        {
          type: 'quiz',
          question: 'Votre manager vous confie régulièrement des tâches en dehors de votre périmètre. Quelle réponse est assertive ?',
          choices: [
            '"Ok, pas de problème." (même si ça l\'est)',
            '"C\'est pas mon boulot !"',
            '"Je comprends l\'urgence. En revanche, si je prends cette tâche, je ne pourrai pas finir X avant vendredi. Qu\'est-ce qui est prioritaire pour vous ?"',
            'Ne rien dire et faire les deux tâches en travaillant jusqu\'à minuit',
          ],
          correct: 2,
          explanation: 'La réponse assertive reconnaît le besoin du manager, pose une limite claire avec une justification objective et propose de résoudre ensemble le problème de priorité.',
        },
        {
          type: 'quiz',
          question: 'Compléter avec le style de communication : "Je me demande si peut-être tu aurais le temps, si c\'est pas trop te demander, de regarder mon rapport…" est un exemple de communication :',
          choices: ['Assertive', 'Agressive', 'Passive', 'Directe'],
          correct: 2,
          explanation: 'Ce style hyper-atténué est passif. Il minimise la demande au point de rendre difficile le refus pour l\'interlocuteur et nuit à la clarté du message.',
        },
        {
          type: 'simulation',
          context: 'Réunion d\'équipe. Un collègue interrompt constamment vos prises de parole.',
          cleo_line: 'Ah, et en plus — [vous commence à parler] — non attends, je voulais ajouter que notre approche marketing devrait...',
          user_role: 'Vous (affirmez-vous de façon assertive)',
          hint: 'Utilisez DESC : Décrivez le comportement (pas la personne), exprimez votre ressenti, dites ce que vous voulez, conséquence positive.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Fin de journée. Votre collègue vous demande de rester 2h supplémentaires non rémunérées.',
          cleo_line: 'Tu peux rester ce soir pour finir la présentation client ? Ça devrait prendre 2-3 heures max. C\'est vraiment important.',
          user_role: 'Vous',
          hint: 'Vous pouvez dire non de manière assertive : reconnaissez l\'importance, expliquez votre contrainte, proposez une alternative si possible.',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 5 : CV ET CANDIDATURE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-10',
    title: 'Rédiger un CV qui passe les filtres ATS',
    type: 'Cours interactif',
    difficulty: 'Débutant',
    duration_minutes: 20,
    xp_reward: 60,
    skills_rewarded: ['communication', 'orientation'],
    description: '75% des CV sont éliminés par des algorithmes avant qu\'un humain les lise. Apprenez à optimiser le vôtre.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les ATS : ces robots qui lisent votre CV',
          content: 'Les ATS (Applicant Tracking Systems) sont des logiciels utilisés par 98% des grandes entreprises pour filtrer les CV. Ils analysent :\n• La présence de mots-clés de l\'offre d\'emploi\n• La lisibilité du format (pas de tableaux complexes)\n• L\'ordre des sections\n\n✅ Format ATS-compatible : texte simple, sections claires, mots-clés de l\'offre\n❌ À éviter : photos de fond, colonnes complexes, texte en image, polices fantaisie',
        },
        {
          type: 'quiz',
          question: 'Quelle section doit apparaître EN PREMIER sur un CV pour être ATS-compatible ?',
          choices: [
            'Loisirs et centres d\'intérêt',
            'Coordonnées et titre professionnel',
            'Langues',
            'Formation',
          ],
          correct: 1,
          explanation: 'Le nom, contact et titre professionnel (aligné avec le poste visé) doivent être en haut. Les ATS et les recruteurs veulent identifier qui vous êtes et quel poste vous visez en 3 secondes.',
        },
        {
          type: 'quiz',
          question: 'Pour un poste de "Chef de projet digital", quelle version de vos expériences est plus impactante ?',
          choices: [
            '"Responsable des projets digitaux"',
            '"J\'ai géré des projets informatiques de différentes tailles"',
            '"Piloté 5 projets digitaux simultanément (budget total : 400k€), livrés dans les délais dans 90% des cas"',
            '"Travail en équipe sur des projets"',
          ],
          correct: 2,
          explanation: 'Les chiffres crédibilisent et différencient. Budget, délais, résultats mesurables : les recruteurs veulent voir de l\'impact concret, pas des descriptions vagues.',
        },
        {
          type: 'quiz',
          question: 'Quelle longueur est recommandée pour un CV en France ?',
          choices: [
            'Maximum 1 page quelle que soit l\'expérience',
            '1 page pour moins de 5 ans d\'expérience, 2 pages au maximum pour les profils plus expérimentés',
            '3-4 pages pour être exhaustif',
            'La longueur n\'a pas d\'importance',
          ],
          correct: 1,
          explanation: '1 page est la norme en France pour les profils jeunes. 2 pages sont acceptées pour les profils senior, mais jamais plus : les recruteurs passent en moyenne 7 secondes sur un CV.',
        },
        {
          type: 'interview',
          question: 'Décrivez une expérience de votre CV (stage, emploi, projet) en utilisant la structure STAR et en incluant des chiffres concrets. Entraînez-vous comme si vous le présentiez à un recruteur.',
          hint: 'Situation → Tâche → Action → Résultat chiffré. Ex: "J\'ai augmenté l\'engagement Instagram de 40% en 3 mois grâce à une stratégie de contenu repensée."',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 6 : MANAGEMENT ET LEADERSHIP
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-11',
    title: 'Les styles de management : lequel est le vôtre ?',
    type: 'Quiz thématique',
    difficulty: 'Intermédiaire',
    duration_minutes: 25,
    xp_reward: 90,
    skills_rewarded: ['leadership', 'gestion'],
    description: 'Directif, participatif, délégatif, transformationnel… Découvrez les différents styles et leurs impacts.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les 4 grands styles de management',
          content: 'Le modèle de Hersey & Blanchard définit 4 styles selon la maturité de l\'équipe :\n\n🎯 Directif : Instructions claires, supervision étroite (pour les novices)\n🤝 Persuasif/Coach : Explications + soutien (pour les débutants motivés)\n🤲 Participatif : Décisions partagées (pour les compétents peu confiants)\n🦅 Délégatif : Autonomie complète (pour les experts motivés)\n\nUn bon manager adapte son style selon la personne ET la situation.',
        },
        {
          type: 'quiz',
          question: 'Vous accueillez un stagiaire de 1ère semaine. Quel style de management est le plus adapté ?',
          choices: [
            'Délégatif : vous lui confiez un projet complet pour le responsabiliser',
            'Participatif : vous décidez ensemble de tout',
            'Directif : vous donnez des instructions précises et accompagnez de près',
            'Aucun — laissez-le se débrouiller',
          ],
          correct: 2,
          explanation: 'Un novice a besoin de cadre clair et de supervision rapprochée. Le style directif est le plus adapté. Le déléguer trop tôt risque de le mettre en échec.',
        },
        {
          type: 'quiz',
          question: 'Un expert de votre équipe (10 ans d\'expérience) est très autonome. Quel style adopter ?',
          choices: [
            'Directif : les règles s\'appliquent à tous',
            'Délégatif : faites-lui confiance et donnez-lui de l\'autonomie',
            'Participatif : co-décidez tout',
            'Persuasif : expliquez chaque décision',
          ],
          correct: 1,
          explanation: 'Un expert motivé et compétent a besoin d\'autonomie pour s\'épanouir. La microgestion d\'un expert démotive et crée des tensions. Déléguez et faites confiance.',
        },
        {
          type: 'quiz',
          question: 'Le "management transformationnel" se caractérise par :',
          choices: [
            'Une transformation radicale de l\'organigramme chaque année',
            'La capacité à inspirer et motiver une équipe autour d\'une vision, tout en favorisant l\'innovation',
            'La gestion des transformations digitales uniquement',
            'Un style très directif et contrôlant',
          ],
          correct: 1,
          explanation: 'Le leadership transformationnel (Bass, 1985) mise sur la vision inspirante, le dépassement de soi et le développement de chaque membre. C\'est le style le plus corrélé à la performance à long terme.',
        },
        {
          type: 'simulation',
          context: 'Vous êtes responsable d\'une équipe de 5 personnes. L\'un de vos meilleurs éléments veut démissionner pour une offre concurrente.',
          cleo_line: 'J\'ai reçu une offre d\'une autre entreprise. Le salaire est 15% plus élevé. J\'ai beaucoup aimé travailler ici, mais financièrement c\'est difficile de refuser.',
          user_role: 'Manager',
          hint: 'Pensez au-delà du salaire : plan de carrière, responsabilités, formation, ambiance, flexibilité. Montrez que vous l\'écoutez vraiment.',
          auto_listen: true,
        },
        {
          type: 'interview',
          question: 'Quel style de management vous correspond le mieux et dans quel type d\'environnement pensez-vous être le plus efficace ? Donnez un exemple de votre pratique managériale.',
          hint: 'Si vous n\'avez pas d\'expérience managériale formelle, parlez d\'une situation où vous avez pris un rôle informel de leader (groupe projet, associations, sports collectifs…).',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 7 : MARCHÉ DU TRAVAIL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-12',
    title: 'Comprendre le marché caché de l\'emploi',
    type: 'Cours interactif',
    difficulty: 'Intermédiaire',
    duration_minutes: 20,
    xp_reward: 80,
    skills_rewarded: ['orientation', 'monde_pro'],
    description: '80% des postes ne sont jamais publiés. Apprenez à accéder au marché caché grâce au réseau.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Le marché caché de l\'emploi : 80% des offres',
          content: 'Une statistique qui surprend : 70 à 80% des embauches se font sans offre publiée. Pourquoi ?\n\n• Cooptation : le collaborateur connaît quelqu\'un\n• Candidature spontanée acceptée\n• Vivier de CV internes\n• Réseaux professionnels (LinkedIn, clubs, événements)\n\nStratégie gagnante :\n1. Activez votre réseau (famille, anciens profs, anciens collègues)\n2. Envoyez des candidatures spontanées ciblées\n3. Utilisez LinkedIn pour du networking proactif\n4. Participez à des événements sectoriels',
        },
        {
          type: 'quiz',
          question: 'Quelle est la méthode la plus efficace pour accéder au marché caché ?',
          choices: [
            'Postuler à 200 offres en ligne par semaine',
            'Développer et activer son réseau professionnel',
            'Attendre qu\'une offre parfaite apparaisse',
            'Envoyer son CV sans lettre de motivation pour aller plus vite',
          ],
          correct: 1,
          explanation: 'Le réseau est responsable de 60-80% des embauches selon les études. Informer son entourage de sa recherche, prendre des "cafés réseau" et être actif sur LinkedIn sont les méthodes les plus efficaces.',
        },
        {
          type: 'quiz',
          question: 'Une "candidature spontanée efficace" doit être :',
          choices: [
            'La même lettre envoyée à 50 entreprises',
            'Hyper-personnalisée : montrer que vous connaissez l\'entreprise, ses enjeux et que vous avez une valeur ajoutée spécifique',
            'Très courte (3 lignes maximum)',
            'Envoyée uniquement par courrier postal',
          ],
          correct: 1,
          explanation: 'La personnalisation est clé. Un recruteur reconnaît une lettre générique en 5 secondes. Montrez que vous avez fait des recherches sur l\'entreprise et expliquez PRÉCISÉMENT ce que vous pouvez apporter.',
        },
        {
          type: 'interview',
          question: 'Décrivez votre stratégie de recherche d\'emploi actuelle. Utilisez-vous le réseau ? LinkedIn ? Comment pourriez-vous améliorer votre approche pour accéder au marché caché ?',
          hint: 'Soyez honnête(e) sur ce que vous faites déjà et ce que vous pourriez améliorer. Il n\'y a pas de réponse parfaite.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Vous rencontrez par hasard un directeur d\'une entreprise qui vous intéresse lors d\'un événement networking.',
          cleo_line: 'Bonsoir ! Je suis directeur commercial chez TechInnovate. Et vous, qu\'est-ce qui vous amène ici ce soir ?',
          user_role: 'Vous (pitch de 30 secondes)',
          hint: '"L\'elevator pitch" : votre nom, votre expertise, ce que vous cherchez, votre valeur ajoutée — le tout en 30 secondes naturels et non récités.',
          auto_listen: true,
        },
      ],
    },
  },

  {
    id: 'local-13',
    title: 'Les secteurs qui recrutent en 2025',
    type: 'Quiz thématique',
    difficulty: 'Débutant',
    duration_minutes: 15,
    xp_reward: 50,
    skills_rewarded: ['orientation', 'monde_pro'],
    description: 'Quels secteurs sont en tension ? Où sont les opportunités pour les prochaines années ?',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les tendances du marché du travail 2025',
          content: '🚀 Secteurs en forte croissance :\n• Numérique / IA : pénurie de 100 000 profils/an\n• Transition écologique : 170 000 emplois créés/an d\'ici 2030\n• Santé / Silver économie : vieillissement démographique\n• Industrie 4.0 : automatisation + maintenance\n\n⚠️ Secteurs en tension :\n• BTP : 80 000 postes non pourvus\n• Hôtellerie-restauration : fidélisation difficile\n• Transport / logistique : digitalisation rapide\n\n📉 Secteurs sous pression :\n• Commerce physique traditionnel\n• Certains métiers administratifs (RPA, IA)',
        },
        {
          type: 'quiz',
          question: 'Quel secteur français va créer le plus d\'emplois d\'ici 2030 selon France Stratégie ?',
          choices: [
            'Le luxe',
            'La transition écologique (EnR, rénovation, économie circulaire)',
            'L\'agriculture conventionnelle',
            'La presse écrite',
          ],
          correct: 1,
          explanation: 'La transition écologique devrait créer entre 150 000 et 200 000 emplois nets par an d\'ici 2030. Énergies renouvelables, rénovation thermique, agriculture durable, économie circulaire sont les moteurs.',
        },
        {
          type: 'quiz',
          question: 'En France, combien de métiers seront "fortement impactés" par l\'IA d\'ici 2030 ?',
          choices: [
            'Moins de 5%',
            'Environ 30-40% (tâches automatisables, pas forcément disparition)',
            'Tous les métiers disparaîtront',
            '80% des emplois seront remplacés',
          ],
          correct: 1,
          explanation: 'L\'OCDE estime que 30-40% des emplois ont une forte part de tâches automatisables. Mais l\'IA transforme les métiers plus qu\'elle ne les supprime. Les compétences humaines (créativité, empathie, jugement) restent difficiles à automatiser.',
        },
        {
          type: 'quiz',
          question: 'Le secteur de l\'économie sociale et solidaire (ESS) en France représente :',
          choices: [
            'Moins de 1% de l\'emploi',
            'Environ 10% de l\'emploi (2,5 millions de salariés)',
            '25% de l\'emploi',
            'Un secteur uniquement composé de bénévoles',
          ],
          correct: 1,
          explanation: 'L\'ESS représente 10% de l\'emploi français avec plus de 2,5 millions de salariés. Associations, coopératives, mutuelles, fondations… Un secteur souvent méconnu mais qui recrute massivement.',
        },
        {
          type: 'interview',
          question: 'En regardant ces tendances, quel secteur vous semble le plus porteur pour votre projet professionnel ? Y a-t-il un décalage entre ce qui recrute et ce qui vous intéresse ? Comment le gérez-vous ?',
          hint: 'Il y a souvent un moyen de trouver le carrefour entre vos intérêts et les secteurs en croissance — cherchez-le !',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 8 : FORMATION ET FINANCEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-14',
    title: 'Financer sa formation : CPF, alternance, et aides',
    type: 'Cours interactif',
    difficulty: 'Débutant',
    duration_minutes: 20,
    xp_reward: 60,
    skills_rewarded: ['orientation', 'monde_pro'],
    description: 'Se former coûte cher ? Pas forcément. Découvrez tous les dispositifs pour financer votre formation.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Les dispositifs de financement de la formation',
          content: '💼 CPF (Compte Personnel de Formation) : Chaque salarié cumule 500€/an (800€ pour non-qualifiés). Utilisable sur moncompteformation.gouv.fr\n\n🎓 Alternance (apprentissage / professionnalisation) : Formation + salaire payé par l\'entreprise. Très attractif !\n\n💰 Aide de France Travail (ex-Pôle Emploi) : AIF (Aide Individuelle à la Formation) pour les demandeurs d\'emploi\n\n🏫 Région : Financement de formations qualifiantes selon le Plan Régional de Formation\n\n🏢 OPCO : Opérateurs de compétences qui financent la formation continue des salariés',
        },
        {
          type: 'quiz',
          question: 'Le CPF (Compte Personnel de Formation) est :',
          choices: [
            'Réservé aux chômeurs',
            'Un crédit formation attaché à la personne (pas à l\'employeur) utilisable tout au long de la vie professionnelle',
            'Une aide de l\'employeur uniquement',
            'Disponible uniquement pour les formations diplômantes',
          ],
          correct: 1,
          explanation: 'Le CPF est personnel : il vous suit même si vous changez d\'emploi ou devenez auto-entrepreneur. Il finance des formations certifiantes inscrites au Répertoire National des Certifications Professionnelles (RNCP).',
        },
        {
          type: 'quiz',
          question: 'L\'alternance (contrat d\'apprentissage) permet à l\'apprenti de :',
          choices: [
            'Se former gratuitement ET percevoir un salaire',
            'Travailler gratuitement pour une entreprise',
            'Obtenir une formation uniquement si l\'entreprise valide chaque étape',
            'Ne pas payer les charges sociales',
          ],
          correct: 0,
          explanation: 'En alternance, l\'apprenti est rémunéré (% du SMIC selon l\'âge et l\'année) et la formation est entièrement financée par l\'OPCO. C\'est souvent le meilleur rapport coût/bénéfice pour se former.',
        },
        {
          type: 'quiz',
          question: 'La VAE (Validation des Acquis de l\'Expérience) permet de :',
          choices: [
            'Valider une formation sans la suivre, sur la base de son expérience professionnelle',
            'Accélérer une formation de 2 ans à 6 mois',
            'Obtenir un CPF supplémentaire',
            'Valider des acquis uniquement dans le secteur industriel',
          ],
          correct: 0,
          explanation: 'La VAE permet d\'obtenir tout ou partie d\'un diplôme en faisant reconnaître son expérience (3 ans minimum dans le domaine). Un dossier + jury suffisent — sans cours à suivre.',
        },
        {
          type: 'interview',
          question: 'Quel dispositif de financement vous semble le plus adapté à votre situation ? Avez-vous déjà consulté votre solde CPF ? Quelles formations vous intéresseraient ?',
          hint: 'Si vous ne connaissez pas votre solde CPF, vous pouvez le vérifier sur moncompteformation.gouv.fr avec votre numéro de sécurité sociale.',
          auto_listen: true,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATÉGORIE 9 : SIMULATION ENTRETIEN AVANCÉE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'local-15',
    title: 'Entretien complet : poste de manager junior',
    type: 'Simulation complète',
    difficulty: 'Avancé',
    duration_minutes: 35,
    xp_reward: 150,
    skills_rewarded: ['leadership', 'communication', 'gestion'],
    description: 'Simulation d\'entretien complet pour un poste d\'encadrement. 5 questions progressives avec feedback IA.',
    content: {
      steps: [
        {
          type: 'text',
          title: 'Contexte de l\'entretien',
          content: 'Vous postulez pour un poste de Responsable d\'équipe (5-8 personnes) dans une entreprise de services B2B de taille intermédiaire (200 salariés). Votre interlocutrice est la DRH. L\'entretien dure 45 minutes. L\'entreprise cherche quelqu\'un capable de :\n• Animer et motiver une équipe\n• Gérer les conflits\n• Atteindre des objectifs commerciaux\n• Fédérer autour d\'une culture d\'excellence',
        },
        {
          type: 'simulation',
          context: 'Entretien — poste Responsable d\'équipe, DRH Sophie Martins',
          cleo_line: 'Bonjour, je suis Sophie Martins, DRH de Servitec. Je vous remercie d\'avoir fait le déplacement. Pour commencer, pouvez-vous vous présenter et m\'expliquer ce qui vous a amené à postuler chez nous ?',
          user_role: 'Candidat(e) — poste Responsable d\'équipe',
          hint: 'Présentation courte (2 min max), axée sur votre expérience managériale ou de coordination, et ce qui vous attire SPÉCIFIQUEMENT dans ce poste.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Suite de l\'entretien',
          cleo_line: 'Vous avez mentionné votre expérience en gestion d\'équipe. Donnez-moi un exemple concret d\'une situation difficile que vous avez eu à gérer avec un collaborateur. Comment avez-vous abordé la situation ?',
          user_role: 'Candidat(e)',
          hint: 'Choisissez un exemple RÉEL où il y avait un vrai enjeu (performance, conflit, comportement). Montrez votre processus : écoute → dialogue → plan d\'action → résultat.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Suite',
          cleo_line: 'Votre équipe n\'atteint pas ses objectifs depuis 2 mois malgré vos efforts. Votre N+1 commence à s\'impatienter. Que faites-vous ?',
          user_role: 'Candidat(e)',
          hint: 'Diagnostic avant action : identifier les causes (compétences ? motivation ? ressources ? process ?), mettre en place un plan correctif, communiquer avec transparence vers le haut ET vers le bas.',
          auto_listen: true,
        },
        {
          type: 'simulation',
          context: 'Fin d\'entretien',
          cleo_line: 'Vous avez des questions sur le poste, l\'équipe ou l\'entreprise ?',
          user_role: 'Candidat(e)',
          hint: 'Préparez 3 questions pertinentes qui montrent votre intérêt pour le fond : "Quelle est la culture managériale ?", "Quels sont les principaux défis de l\'équipe ?", "Comment mesure-t-on le succès sur ce poste ?"',
          auto_listen: true,
        },
      ],
    },
  },
];
