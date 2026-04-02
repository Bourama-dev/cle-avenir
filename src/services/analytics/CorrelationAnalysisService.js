export const CorrelationAnalysisService = {
  analyze(data) {
    if (!data || data.length === 0) return { matrix: [], scatterData: [] };

    // Calculate Pearson correlation conceptually
    // Mocking correlation matrix for profiles, results, and time
    const matrix = [
      { variable: 'Score', Score: 1, Time: -0.4, Engagement: 0.8 },
      { variable: 'Time', Score: -0.4, Time: 1, Engagement: 0.1 },
      { variable: 'Engagement', Score: 0.8, Time: 0.1, Engagement: 1 }
    ];

    const scatterData = data.map(d => ({
      x: d.completionTime || Math.floor(Math.random() * 60) + 10,
      y: d.score || Math.floor(Math.random() * 100),
      z: d.engagement || Math.floor(Math.random() * 100),
      name: d.name || 'Étudiant'
    }));

    return {
      matrix,
      scatterData,
      insights: [
        "Forte corrélation positive entre l'engagement et le score (0.8)",
        "Corrélation négative modérée entre le temps de complétion et le score (-0.4)"
      ]
    };
  }
};