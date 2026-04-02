export const ProfileAnalysisService = {
  async getProfileDistribution() {
    return [
      { profile: 'Analytique', count: 45, avgScore: 72 },
      { profile: 'Créatif', count: 35, avgScore: 68 },
      { profile: 'Social', count: 50, avgScore: 70 },
      { profile: 'Réaliste', count: 30, avgScore: 65 }
    ];
  }
};