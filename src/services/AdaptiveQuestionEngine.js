import { adaptiveTestQuestions } from '../data/adaptiveTestQuestions';

export const AdaptiveQuestionEngine = {
  /**
   * Initialize the engine with user history
   */
  init(history = []) {
    return {
      history,
      questions: adaptiveTestQuestions
    };
  },

  /**
   * Determine the next question based on history
   * For this implementation with fixed questions, we primarily return the next in order,
   * but we could implement skipping logic here if needed.
   */
  getNextQuestion(currentQuestionIndex) {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex > adaptiveTestQuestions.length) {
      return null; // Test complete
    }
    
    // Find question with matching order
    const nextQuestion = adaptiveTestQuestions.find(q => q.order === nextIndex);
    return nextQuestion;
  },

  /**
   * Calculate scores based on answer history
   */
  calculateSectorScores(history) {
    const scores = {};

    history.forEach(entry => {
      const question = adaptiveTestQuestions.find(q => q.id === entry.questionId);
      if (!question) return;

      const choice = question.choices.find(c => c.id === entry.choiceId);
      if (!choice) return;

      choice.sector_tags.forEach(tag => {
        if (!scores[tag]) scores[tag] = 0;
        scores[tag] += 1; // Simple increment for now, could be weighted
      });
    });

    return scores;
  },

  /**
   * Get top sectors
   */
  getTopSectors(history, limit = 3) {
    const scores = this.calculateSectorScores(history);
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([sector, score]) => ({ sector, score }));
  },

  /**
   * Match matched sectors to careers
   * This is a mock function using the Sector Tags logic
   */
  getMatchingCareers(history) {
    const topSectors = this.getTopSectors(history, 5);
    const primarySector = topSectors[0]?.sector;

    // Simple mock mapping (In real app, query database)
    const careerDatabase = {
      "Technology": [
        { id: "dev_web", title: "Développeur Web", match: 95 },
        { id: "data_scientist", title: "Data Scientist", match: 90 }
      ],
      "Santé": [
        { id: "infirmier", title: "Infirmier D.E.", match: 95 },
        { id: "psychologue", title: "Psychologue Clinicien", match: 88 }
      ],
      "Commerce": [
        { id: "business_dev", title: "Business Developer", match: 92 },
        { id: "chef_produit", title: "Chef de Produit", match: 85 }
      ],
      "Arts": [
        { id: "ux_designer", title: "UX/UI Designer", match: 94 },
        { id: "directeur_artistique", title: "Directeur Artistique", match: 89 }
      ],
      "Environnement": [
        { id: "ingenieur_ecologue", title: "Ingénieur Écologue", match: 93 },
        { id: "paysagiste", title: "Paysagiste", match: 86 }
      ],
      "Droit": [
        { id: "avocat", title: "Avocat", match: 96 },
        { id: "juriste", title: "Juriste d'entreprise", match: 90 }
      ],
      "Sport": [
        { id: "coach_sportif", title: "Coach Sportif", match: 95 },
        { id: "kine", title: "Kinésithérapeute", match: 88 }
      ],
      "Éducation": [
        { id: "formateur", title: "Formateur pour Adultes", match: 92 },
        { id: "professeur", title: "Professeur des Écoles", match: 87 }
      ]
    };

    if (primarySector && careerDatabase[primarySector]) {
      return careerDatabase[primarySector];
    }

    // Fallback
    return [
      { id: "generic_1", title: "Consultant", match: 80 },
      { id: "generic_2", title: "Chef de Projet", match: 75 }
    ];
  }
};