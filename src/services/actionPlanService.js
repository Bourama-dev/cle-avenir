export const actionPlanService = {
  generatePlan: (currentLevel, targetJob) => {
    // Helper logic to generate a personalized action plan
    const steps = [];
    let totalDuration = 0;
    
    // Example mappings for common paths
    const paths = {
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
      ]
    };

    const selectedPath = paths[targetJob] || paths['Développeur Web']; // Fallback for demo
    
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