export const TrendAnalysisService = {
  async getTrends() {
    return [
      { date: 'Jan', value: 65, expected: 60 },
      { date: 'Fév', value: 68, expected: 62 },
      { date: 'Mar', value: 74, expected: 64 }
    ];
  }
};