import { adaptiveTestQuestions } from '../data/adaptiveTestQuestions';
import { realCareerDataService } from './realCareerDataService';

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
   * Match sectors to REAL careers from database using RIASEC profile
   */
  async getMatchingCareers(history, userRIASECProfile = null) {
    try {
      // If RIASEC profile is provided, use it for better matching
      if (userRIASECProfile) {
        return await realCareerDataService.getCareersByRIASEC(userRIASECProfile, 15);
      }

      // Otherwise, get top sectors and fetch careers in those sectors
      const topSectors = this.getTopSectors(history, 3);

      if (topSectors.length === 0) {
        // Fallback: return most in-demand careers
        return await realCareerDataService.getAllCareers().then(careers => careers.slice(0, 15));
      }

      // Fetch careers for each top sector
      const careersByTopSectors = [];
      for (const { sector } of topSectors) {
        const careers = await realCareerDataService.getCareersBySector(sector, 5);
        careersByTopSectors.push(...careers);
      }

      // Return unique careers, up to 15 total
      const uniqueCareers = Array.from(
        new Map(careersByTopSectors.map(c => [c.code, c])).values()
      ).slice(0, 15);

      return uniqueCareers.length > 0 ? uniqueCareers : await realCareerDataService.getAllCareers().then(careers => careers.slice(0, 15));
    } catch (error) {
      console.error('Error getting matching careers:', error);
      // Graceful fallback
      return await realCareerDataService.getAllCareers().then(careers => careers.slice(0, 15));
    }
  }
};