export const PerformanceAnalysisService = {
  analyze(data) {
    if (!data) return { metrics: {}, recommendations: [] };

    const total = data.length || 1;
    const scores = data.map(d => d.score || 0);
    const avg = scores.reduce((a, b) => a + b, 0) / total;
    
    const atRisk = data.filter(d => (d.score || 0) < 50);
    const excellent = data.filter(d => (d.score || 0) > 70);

    const recommendations = [];
    if (atRisk.length / total > 0.2) {
      recommendations.push("Plus de 20% des étudiants sont en difficulté. Envisagez des sessions de tutorat.");
    }
    if (avg < 60) {
      recommendations.push("Moyenne globale faible. Révisez le matériel d'orientation.");
    }

    return {
      metrics: {
        averageScore: avg,
        atRiskCount: atRisk.length,
        excellentCount: excellent.length,
        successRate: (excellent.length / total) * 100
      },
      recommendations
    };
  }
};