export const LevelAnalysisService = {
  async getLevelMetrics(establishmentId) {
    return [
      { level: 'Seconde', studentCount: 150, avgScore: 68, successRate: 75, status: 'good' },
      { level: 'Première', studentCount: 120, avgScore: 62, successRate: 65, status: 'warning' },
      { level: 'Terminale', studentCount: 100, avgScore: 71, successRate: 82, status: 'excellent' }
    ];
  },
  async getLevelEvolution(establishmentId) {
    return [
      { date: 'Sep', Seconde: 65, Première: 60, Terminale: 68 },
      { date: 'Oct', Seconde: 66, Première: 61, Terminale: 70 },
      { date: 'Nov', Seconde: 68, Première: 62, Terminale: 71 }
    ];
  }
};