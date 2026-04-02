import { semanticMatchingService } from './semanticMatchingService';
import { careerProfileEmbeddingsService } from './careerProfileEmbeddingsService';

export const semanticResultsAnalyzer = {
  
  /**
   * Core analysis function
   * @param {Array} userResponses - Array of { text: string, questionId: string }
   */
  async analyzeUserResponses(userResponses) {
    if (!userResponses || userResponses.length === 0) return null;

    // 1. Consolidate user profile text
    // We take the text of the answers the user selected/typed
    const userProfileText = userResponses
      .map(r => r.answerText || r.text || "")
      .filter(t => t.length > 0)
      .join(" ");

    if (userProfileText.length < 10) return null;

    // 2. Generate User Embedding
    const userEmbedding = await semanticMatchingService.generateEmbedding(userProfileText);

    // 3. Get Comparison Careers (Top popular ones for now to demo)
    const careerCandidates = await careerProfileEmbeddingsService.getPopularCareerEmbeddings(50);

    // 4. Rank Matches
    const rankedCareers = semanticMatchingService.rankByRelevance(userEmbedding, careerCandidates);

    // 5. Generate Insights (Mocked based on score for now, but could be LLM based)
    const insights = this.generateInsights(rankedCareers);

    return {
      userEmbedding,
      matches: rankedCareers.slice(0, 10), // Top 10
      insights
    };
  },

  generateInsights(rankedCareers) {
    if (!rankedCareers.length) return [];
    
    const topMatch = rankedCareers[0];
    const top3 = rankedCareers.slice(0, 3).map(c => c.libelle).join(", ");
    
    return [
      `Vos réponses s'alignent fortement avec les métiers de : ${top3}.`,
      topMatch.score > 0.85 
        ? "Votre profil présente une cohérence exceptionnelle avec votre premier choix." 
        : "Vous avez un profil polyvalent qui touche à plusieurs domaines."
    ];
  }
};