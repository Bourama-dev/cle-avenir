export const actionPlanService = {
  generatePlan: (currentLevel, targetJob) => {
    const paths = {
      // ── Commerce / Gestion ──────────────────────────────────────────────
      'Responsable Grand Compte': [
        {
          title: 'Obtenir un Bac (STMG ou Général)',
          duration: '1 à 3 ans',
          status: 'completed',
          objective: 'Valider le niveau secondaire',
          actions: ['Passer les épreuves du Baccalauréat'],
          competencies: ['Culture générale', 'Expression écrite'],
          resources: ['Lycée', 'Soutien scolaire']
        },
        {
          title: 'BTS NDRC (Négociation et Digitalisation de la Relation Client)',
          duration: '2 ans',
          status: 'current',
          objective: 'Acquérir les bases commerciales',
          actions: ['Rechercher une alternance', 'Valider les examens de fin d\'année'],
          competencies: ['Vente', 'Négociation', 'Prospection'],
          resources: ['Lycée Pro', 'CFA', 'Offres d\'alternance']
        },
        {
          title: 'Licence Pro / Bachelor Commerce',
          duration: '1 an',
          status: 'todo',
          objective: 'Spécialisation en B2B',
          actions: ['Postuler en école de commerce ou IAE', 'Trouver un stage long'],
          competencies: ['Marketing B2B', 'Gestion de portefeuille'],
          resources: ['IAE', 'Écoles de commerce']
        },
        {
          title: 'Master / Bac+5 Ingénierie d\'Affaires',
          duration: '2 ans',
          status: 'todo',
          objective: 'Devenir expert en comptes stratégiques',
          actions: ['Développer son réseau', 'Maîtriser l\'anglais professionnel'],
          competencies: ['Stratégie commerciale', 'Management transversal', 'Anglais'],
          resources: ['Mentoring', 'Réseau Alumni']
        }
      ],
      'Développeur Web': [
        {
          title: 'Auto-formation & Initiation',
          duration: '3 mois',
          status: 'completed',
          objective: 'Découvrir les bases de l\'algorithmique',
          actions: ['Suivre des cours en ligne (OpenClassrooms, Codecademy)'],
          competencies: ['Logique', 'HTML/CSS'],
          resources: ['Plateformes e-learning']
        },
        {
          title: 'Formation Intensive (Bootcamp)',
          duration: '6 mois',
          status: 'current',
          objective: 'Apprendre un framework moderne (React/Node.js)',
          actions: ['Réaliser 3 projets pratiques', 'Participer à des hackathons'],
          competencies: ['JavaScript', 'React', 'Git'],
          resources: ['Le Wagon', 'La Capsule', 'OClock']
        },
        {
          title: 'Stage ou Première Alternance',
          duration: '1 an',
          status: 'todo',
          objective: 'Acquérir de l\'expérience professionnelle',
          actions: ['Créer un portfolio GitHub', 'Passer des entretiens techniques'],
          competencies: ['Travail en équipe', 'Méthodes Agiles'],
          resources: ['Welcome to the Jungle', 'Mentoring technique']
        }
      ],

      // ── Informatique / Numérique ─────────────────────────────────────────
      'Ingénieur Logiciel': [
        { title: 'Mathématiques & Sciences (Bac S/STI2D)', duration: '3 ans', status: 'completed', objective: 'Solides bases scientifiques', actions: ['Consolider algo et maths', 'Participer à des clubs tech'], competencies: ['Maths', 'Physique', 'Logique'], resources: ['Lycée', 'Khan Academy'] },
        { title: 'Classes Prépa ou Licence Informatique', duration: '2-3 ans', status: 'current', objective: 'Algorithmique avancée et POO', actions: ['Projets algorithmiques', 'Contributions open source'], competencies: ['Java', 'Python', 'C++', 'Structures de données'], resources: ['Université', 'CPGE', 'France IOI'] },
        { title: 'École d\'Ingénieur ou Master Informatique', duration: '2-3 ans', status: 'todo', objective: 'Spécialisation (IA, cloud, cybersécurité)', actions: ['Stage en entreprise tech', 'Projets de fin d\'études'], competencies: ['Architecture logicielle', 'Cloud', 'DevOps'], resources: ['École polytechnique', 'INSA', 'Epitech'] },
        { title: 'Premier poste ingénieur', duration: '1-2 ans', status: 'todo', objective: 'Autonomie et leadership technique', actions: ['Contribuer à des projets complexes', 'Mentorer des juniors'], competencies: ['Design patterns', 'Management technique'], resources: ['Tech blog', 'Conférences dev'] }
      ],
      'Data Scientist': [
        { title: 'Bac Scientifique ou STI2D', duration: '3 ans', status: 'completed', objective: 'Bases solides en maths/stats', actions: ['Renforcer les mathématiques', 'Initiation au Python'], competencies: ['Maths', 'Statistiques', 'Logique'], resources: ['Lycée', 'OpenClassrooms'] },
        { title: 'Licence/Master Mathématiques ou Informatique', duration: '3-5 ans', status: 'current', objective: 'Machine learning et statistiques avancées', actions: ['Projets Kaggle', 'Certifications Python/ML'], competencies: ['Python', 'Pandas', 'Scikit-learn', 'SQL'], resources: ['Université', 'Coursera', 'Kaggle'] },
        { title: 'Spécialisation Data Science (Master 2 ou Bootcamp)', duration: '1-2 ans', status: 'todo', objective: 'Deep learning et déploiement modèles', actions: ['Construire un portfolio de projets ML', 'Publier sur GitHub'], competencies: ['TensorFlow', 'PyTorch', 'MLflow', 'Cloud AWS/GCP'], resources: ['DataScientest', 'CentraleSupélec', 'Jedha'] },
        { title: 'Poste Data Scientist', duration: 'continu', status: 'todo', objective: 'Impact business via modèles prédictifs', actions: ['Participer à des hackathons IA', 'Veille technologique'], competencies: ['Communication données', 'A/B testing', 'MLOps'], resources: ['Medium', 'Papers with Code'] }
      ],
      'Développeur Web': [
        { title: 'Auto-formation & Initiation', duration: '3 mois', status: 'completed', objective: 'Découvrir les bases de l\'algorithmique', actions: ['Suivre des cours en ligne (OpenClassrooms, Codecademy)'], competencies: ['Logique', 'HTML/CSS'], resources: ['Plateformes e-learning'] },
        { title: 'Formation Intensive (Bootcamp)', duration: '6 mois', status: 'current', objective: 'Apprendre un framework moderne (React/Node.js)', actions: ['Réaliser 3 projets pratiques', 'Participer à des hackathons'], competencies: ['JavaScript', 'React', 'Git'], resources: ['Le Wagon', 'La Capsule', 'OClock'] },
        { title: 'Stage ou Première Alternance', duration: '1 an', status: 'todo', objective: 'Acquérir de l\'expérience professionnelle', actions: ['Créer un portfolio GitHub', 'Passer des entretiens techniques'], competencies: ['Travail en équipe', 'Méthodes Agiles'], resources: ['Welcome to the Jungle', 'Mentoring technique'] }
      ],

      // ── Santé / Social ───────────────────────────────────────────────────
      'Infirmier': [
        { title: 'Bac S, ST2S ou Bac Pro ASSP', duration: '3 ans', status: 'completed', objective: 'Socle scientifique et soins de base', actions: ['Stages en EHPAD ou hôpital', 'Bénévolat en associations'], competencies: ['Biologie', 'Premiers secours', 'Empathie'], resources: ['Lycée', 'Croix-Rouge'] },
        { title: 'Concours IFSI + 3 ans de formation', duration: '3 ans', status: 'current', objective: 'Diplôme d\'État Infirmier (DEI)', actions: ['Valider les stages cliniques', 'Préparer les écrits professionnels'], competencies: ['Soins infirmiers', 'Pharmacologie', 'Relation patient'], resources: ['IFSI', 'Tutorat universitaire'] },
        { title: 'Spécialisation ou Master (IADE, IBODE…)', duration: '2 ans', status: 'todo', objective: 'Expertise dans une spécialité', actions: ['Passer les concours de spécialité', 'Exercer en service spécialisé'], competencies: ['Anesthésie', 'Bloc opératoire', 'Pédiatrie'], resources: ['CHU', 'Écoles spécialisées'] }
      ],
      'Éducateur Spécialisé': [
        { title: 'Bac (toutes séries acceptées)', duration: '3 ans', status: 'completed', objective: 'Culture générale et engagement citoyen', actions: ['Bénévolat en associations sociales', 'Service civique'], competencies: ['Communication', 'Empathie', 'Citoyenneté'], resources: ['Lycée', 'Unis-Cité'] },
        { title: 'DEES (Diplôme d\'État Éducateur Spécialisé) — 3 ans', duration: '3 ans', status: 'current', objective: 'Accompagnement des publics vulnérables', actions: ['Stages en IME, foyer, CMP', 'Écrits professionnels'], competencies: ['Animation', 'Travail éducatif', 'Cadre légal'], resources: ['EFTS', 'Erasme', 'IRTS'] },
        { title: 'Expérience terrain et spécialisation', duration: 'continu', status: 'todo', objective: 'Autonomie et coordination d\'équipe', actions: ['Formation CAFERUIS pour encadrement', 'Supervision clinique'], competencies: ['Management d\'équipe', 'Projet éducatif', 'Partenariats'], resources: ['CNFPT', 'Formations continues'] }
      ],

      // ── Ingénierie / Industrie ───────────────────────────────────────────
      'Ingénieur Mécanique': [
        { title: 'Bac S ou STI2D (option IM)', duration: '3 ans', status: 'completed', objective: 'Fondamentaux scientifiques', actions: ['Projets de conception', 'Olympiades de sciences'], competencies: ['Physique', 'Maths', 'Dessin technique'], resources: ['Lycée', 'STI2D'] },
        { title: 'Classe Prépa MPSI ou DUT GMP', duration: '2 ans', status: 'current', objective: 'Bases solides en mécanique', actions: ['Projets CAO (SolidWorks)', 'Stage en industrie'], competencies: ['Résistance des matériaux', 'Thermodynamique', 'CAO'], resources: ['IUT', 'CPGE', 'SolidWorks Academy'] },
        { title: 'École d\'Ingénieur (INSA, Arts & Métiers…)', duration: '3 ans', status: 'todo', objective: 'Ingénierie de conception ou production', actions: ['Projet de fin d\'études industriel', 'Mobilité internationale'], competencies: ['Éléments finis', 'Gestion projet', 'Normes ISO'], resources: ['INSA', 'Arts & Métiers', 'UTC'] }
      ],

      // ── Art / Design / Créativité ────────────────────────────────────────
      'Graphiste': [
        { title: 'Bac (Général, STMG ou Arts Appliqués)', duration: '3 ans', status: 'completed', objective: 'Sensibilité artistique et culture visuelle', actions: ['Portfolio de créations personnelles', 'Concours de design'], competencies: ['Dessin', 'Couleur', 'Composition'], resources: ['Lycée arts appliqués', 'Dribble', 'Behance'] },
        { title: 'BTS Communication Visuelle ou Licence Design', duration: '2-3 ans', status: 'current', objective: 'Maîtriser la suite Adobe', actions: ['Créer 10+ projets professionnels', 'Stage en agence'], competencies: ['Photoshop', 'Illustrator', 'InDesign', 'Typographie'], resources: ['LISAA', 'Gobelins', 'IUT MMI'] },
        { title: 'Alternance ou Freelance', duration: '1-2 ans', status: 'todo', objective: 'Construire une clientèle et une identité', actions: ['Portfolio en ligne (Behance, site pro)', 'Réseautage sur LinkedIn'], competencies: ['UX/UI', 'Motion design', 'Branding'], resources: ['Malt', 'Behance', 'Adobe Color'] }
      ],
      'Architecte': [
        { title: 'Bac S ou L avec option arts', duration: '3 ans', status: 'completed', objective: 'Culture générale et artistique', actions: ['Portfolio de dessins/maquettes', 'Visites d\'expositions d\'archi'], competencies: ['Dessin', 'Maths', 'Histoire de l\'art'], resources: ['Lycée', 'Musées d\'architecture'] },
        { title: 'Licence Architecture (3 ans) — ENSA', duration: '3 ans', status: 'current', objective: 'Bases de la conception architecturale', actions: ['Ateliers de projet', 'Maîtriser Revit/AutoCAD'], competencies: ['Dessin technique', 'Maquette', 'BIM'], resources: ['ENSA Paris', 'ENSA Lyon', 'Revit'] },
        { title: 'Master Architecture (2 ans) + HMONP', duration: '3 ans', status: 'todo', objective: 'Habilitation à exercer', actions: ['Stage en agence d\'architecture', 'Soutenance de projet'], competencies: ['Gestion chantier', 'Normes construction', 'Urbanisme'], resources: ['Agences partenaires', 'Ordre des Architectes'] }
      ],

      // ── Environnement / Agriculture ──────────────────────────────────────
      'Agronome': [
        { title: 'Bac S ou STAV (Sciences et Technologies de l\'Agronomie)', duration: '3 ans', status: 'completed', objective: 'Biologie, chimie et écologie', actions: ['Stages en exploitation agricole', 'Clubs nature'], competencies: ['Biologie', 'Chimie', 'Écologie'], resources: ['Lycée agricole', 'Agri-Techno'] },
        { title: 'BTS Agronomie ou Licence Sciences Agro', duration: '2-3 ans', status: 'current', objective: 'Techniques agricoles et agro-alimentaires', actions: ['Stage en laboratoire ou exploitation', 'Projets terrain'], competencies: ['Agronomie', 'Pédologie', 'Phytopathologie'], resources: ['AgroParisTech', 'Montpellier SupAgro'] },
        { title: 'Ingénieur Agronome (Bac+5)', duration: '2-3 ans', status: 'todo', objective: 'Expertise en systèmes alimentaires durables', actions: ['Thèse ou VIE en recherche', 'Mission humanitaire agro'], competencies: ['Agroécologie', 'Gestion de projet', 'Modélisation'], resources: ['INRAE', 'AgroParisTech', 'Agrisud'] }
      ],
      'Écologue': [
        { title: 'Bac S avec spécialité SVT', duration: '3 ans', status: 'completed', objective: 'Sciences du vivant et environnement', actions: ['Sorties naturalistes', 'Bénévolat LPO ou Surfrider'], competencies: ['Biologie', 'Géologie', 'Cartographie'], resources: ['Lycée', 'LPO', 'Surfrider'] },
        { title: 'Licence Sciences de la Vie et de la Terre', duration: '3 ans', status: 'current', objective: 'Écologie des milieux et biodiversité', actions: ['Stages terrain en espaces naturels', 'SIG et télédétection'], competencies: ['Écologie', 'Statistiques R', 'SIG'], resources: ['Université', 'GIEC rapports', 'QGis'] },
        { title: 'Master Écologie et Biodiversité', duration: '2 ans', status: 'todo', objective: 'Expertise naturaliste et conseil environnemental', actions: ['Études d\'impact', 'Missions en bureaux d\'études'], competencies: ['Évaluation environnementale', 'Droit de l\'environnement', 'Rédaction technique'], resources: ['MNHN', 'Bureaux d\'études (Biotope, Ecovia)'] }
      ],

      // ── Enseignement / Formation ─────────────────────────────────────────
      'Professeur': [
        { title: 'Bac général (L, ES, S selon la matière)', duration: '3 ans', status: 'completed', objective: 'Maîtrise des savoirs fondamentaux', actions: ['Excellent niveau scolaire dans la matière', 'Tutorat entre pairs'], competencies: ['Maîtrise disciplinaire', 'Rigueur', 'Communication'], resources: ['Lycée', 'Annales baccalauréat'] },
        { title: 'Licence dans la discipline', duration: '3 ans', status: 'current', objective: 'Approfondissement académique', actions: ['Monitorat ou tutorat à l\'université', 'Stages en école'], competencies: ['Pédagogie', 'Recherche documentaire', 'Rédaction'], resources: ['Université', 'CNED', 'Eduscol'] },
        { title: 'Master MEEF (Métiers de l\'Enseignement)', duration: '2 ans', status: 'todo', objective: 'Préparer les concours CAPES/Agrégation', actions: ['Stage en établissement scolaire', 'Préparer le mémoire MEEF'], competencies: ['Didactique', 'Gestion de classe', 'Évaluation'], resources: ['INSPE', 'Neoprof', 'Eduscol'] }
      ],

      // ── Droit / Administration ───────────────────────────────────────────
      'Juriste': [
        { title: 'Bac général (de préférence L ou ES)', duration: '3 ans', status: 'completed', objective: 'Culture générale et esprit d\'analyse', actions: ['Lectures juridiques', 'Club de débat'], competencies: ['Rédaction', 'Analyse', 'Argumentation'], resources: ['Lycée', 'Vie-Publique.fr'] },
        { title: 'Licence Droit', duration: '3 ans', status: 'current', objective: 'Fondamentaux du droit civil, public et commercial', actions: ['Concours de plaidoirie', 'Stage en cabinet d\'avocat'], competencies: ['Droit civil', 'Procédure', 'Contrats'], resources: ['Université de droit', 'Dalloz', 'Légifrance'] },
        { title: 'Master Droit spécialisé (M2)', duration: '2 ans', status: 'todo', objective: 'Expertise dans un domaine (droit des affaires, pénal…)', actions: ['Stage de fin de master', 'Réseau professionnel d\'avocats'], competencies: ['Droit des sociétés', 'Fiscalité', 'Contentieux'], resources: ['Jurisprudence', 'Cabinets partenaires', 'EFB'] }
      ],

      // ── Communication / Marketing ────────────────────────────────────────
      'Chef de Projet Marketing': [
        { title: 'Bac (toutes séries, STMG apprécié)', duration: '3 ans', status: 'completed', objective: 'Sens du commerce et créativité', actions: ['Projets associatifs', 'Gestion des réseaux sociaux personnels'], competencies: ['Communication', 'Créativité', 'Chiffres'], resources: ['Lycée STMG', 'HubSpot Academy'] },
        { title: 'BTS NDRC ou DUT Techniques de Commercialisation', duration: '2 ans', status: 'current', objective: 'Techniques marketing et commerciales', actions: ['Stage en agence ou service marketing', 'Certifications Google Ads/Analytics'], competencies: ['SEO/SEA', 'CRM', 'Analyse de marché'], resources: ['Google Digital Garage', 'HubSpot', 'Meta Blueprint'] },
        { title: 'Master Marketing & Communication', duration: '2-3 ans', status: 'todo', objective: 'Pilotage stratégique de campagnes', actions: ['Gérer un budget marketing réel en alternance', 'Certification PMI Marketing'], competencies: ['Marketing digital', 'Data analytics', 'Leadership'], resources: ['CELSA', 'IAE', 'ESCP', 'Google Analytics'] }
      ]
    };

    // Normalise the job name to find closest match (case-insensitive, partial match)
    const findPath = (job) => {
      if (!job) return null;
      const jobLower = job.toLowerCase();
      const exactKey = Object.keys(paths).find(k => k.toLowerCase() === jobLower);
      if (exactKey) return paths[exactKey];
      const partialKey = Object.keys(paths).find(k =>
        jobLower.includes(k.toLowerCase()) || k.toLowerCase().includes(jobLower)
      );
      return partialKey ? paths[partialKey] : null;
    };

    const selectedPath = findPath(targetJob) || paths['Développeur Web'];
    
    // Adjust status based on current level (simplified logic)
    const levelIndex = {
      'Collège': 0, 'Seconde': 0, 'Première': 0, 'Terminal': 0,
      'Bac+1': 1, 'Bac+2': 2, 'Bac+3+': 3
    }[currentLevel] || 0;

    const adjustedSteps = selectedPath.map((step, idx) => ({
      ...step,
      status: idx < levelIndex ? 'completed' : (idx === levelIndex ? 'current' : 'todo')
    }));

    return {
      targetJob,
      currentLevel,
      duration: '2 à 5 ans selon le profil',
      steps: adjustedSteps
    };
  }
};