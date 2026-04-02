export const AnomalyDetectionService = {
  async detectAnomalies() {
    return [
      { date: '15 Mar', metric: 'Participation', value: 20, expected: 80, severity: 'high' }
    ];
  }
};