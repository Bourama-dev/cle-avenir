export const RecommendationEngineService = {
  async getRecommendations() {
    return [
      { id: 1, title: 'Renforcer le tutorat', description: 'Taux d\'échec élevé en Première.', urgency: 'high' },
      { id: 2, title: 'Ateliers créatifs', description: 'Baisse d\'engagement des profils créatifs.', urgency: 'medium' }
    ];
  }
};