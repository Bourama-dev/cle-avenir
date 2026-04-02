export const AdvancedAnalyticsService = {
  calculateKPIs(currentData, previousData = []) {
    if (!currentData || currentData.length === 0) return this.getEmptyKPIs();

    const total = currentData.length;
    const successCount = currentData.filter(d => (d.score || 0) > 70).length;
    const successRate = (successCount / total) * 100;
    
    const prevSuccessCount = previousData.filter(d => (d.score || 0) > 70).length;
    const prevSuccessRate = previousData.length ? (prevSuccessCount / previousData.length) * 100 : 0;
    const progressionRate = successRate - prevSuccessRate;

    const engagementRate = (currentData.filter(d => d.engaged).length / total) * 100;
    const avgSatisfaction = currentData.reduce((acc, d) => acc + (d.satisfaction || 0), 0) / total;
    const atRiskCount = currentData.filter(d => (d.score || 0) < 50).length;
    
    const uniqueCareers = new Set(currentData.map(d => d.recommendedCareer)).size;
    const profileDiversity = new Set(currentData.map(d => d.profile)).size / 5; // Normalized index
    
    const avgCompletionTime = currentData.reduce((acc, d) => acc + (d.completionTime || 0), 0) / total;
    const retentionRate = (currentData.filter(d => d.status === 'active').length / total) * 100;

    return {
      successRate: { value: successRate.toFixed(1), trend: progressionRate > 0 ? 'up' : 'down', diff: Math.abs(progressionRate).toFixed(1) },
      engagementRate: { value: engagementRate.toFixed(1), trend: 'up', diff: '2.5' },
      recommendationAcceptance: { value: 65.4, trend: 'up', diff: '4.1' }, // Simulated
      satisfactionScore: { value: avgSatisfaction.toFixed(1), trend: 'neutral', diff: '0.0' },
      atRiskCount: { value: atRiskCount, trend: atRiskCount > 10 ? 'down' : 'up', diff: '2' },
      uniqueRecommendedCareers: { value: uniqueCareers, trend: 'up', diff: '5' },
      profileDiversityIndex: { value: profileDiversity.toFixed(2), trend: 'up', diff: '0.1' },
      avgCompletionTime: { value: avgCompletionTime.toFixed(0), trend: 'down', diff: '5' },
      studentRetentionRate: { value: retentionRate.toFixed(1), trend: 'up', diff: '1.2' },
    };
  },

  getEmptyKPIs() {
    return {
      successRate: { value: 0, trend: 'neutral', diff: 0 },
      engagementRate: { value: 0, trend: 'neutral', diff: 0 },
      recommendationAcceptance: { value: 0, trend: 'neutral', diff: 0 },
      satisfactionScore: { value: 0, trend: 'neutral', diff: 0 },
      atRiskCount: { value: 0, trend: 'neutral', diff: 0 },
      uniqueRecommendedCareers: { value: 0, trend: 'neutral', diff: 0 },
      profileDiversityIndex: { value: 0, trend: 'neutral', diff: 0 },
      avgCompletionTime: { value: 0, trend: 'neutral', diff: 0 },
      studentRetentionRate: { value: 0, trend: 'neutral', diff: 0 },
    };
  }
};