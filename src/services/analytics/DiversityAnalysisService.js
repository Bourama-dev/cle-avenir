export const DiversityAnalysisService = {
  async getDiversityMetrics() {
    return {
      gender: [{ name: 'Féminin', value: 55 }, { name: 'Masculin', value: 45 }],
      age: [{ range: '15-16', value: 30 }, { range: '17-18', value: 50 }, { range: '19+', value: 20 }]
    };
  }
};