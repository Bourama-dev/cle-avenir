export const RecommendationAnalysisService = {
  analyze(data) {
    if (!data) return { topCareers: [], acceptanceRate: 0, effectiveness: [] };

    // Simulated data
    const topCareers = [
      { career: 'Développeur', recommendations: 120, accepted: 90 },
      { career: 'Designer', recommendations: 85, accepted: 40 },
      { career: 'Manager', recommendations: 60, accepted: 50 }
    ];

    const totalRecs = topCareers.reduce((acc, c) => acc + c.recommendations, 0);
    const totalAcc = topCareers.reduce((acc, c) => acc + c.accepted, 0);

    return {
      topCareers,
      acceptanceRate: (totalAcc / totalRecs) * 100,
      effectiveness: [
        { metric: 'Pertinence IA', score: 88 },
        { metric: 'Satisfaction', score: 92 },
        { metric: 'Conversion', score: 75 }
      ]
    };
  }
};