export const AlertingService = {
  checkThresholds(kpis) {
    const alerts = [];
    
    if (kpis.successRate && kpis.successRate.value < 70) {
      alerts.push({ id: 1, type: 'warning', message: `Taux de réussite critique : ${kpis.successRate.value}% (< 70%)` });
    }
    if (kpis.atRiskCount && kpis.atRiskCount.value > 15) {
      alerts.push({ id: 2, type: 'danger', message: `Nombre élevé d'étudiants en difficulté : ${kpis.atRiskCount.value}` });
    }
    if (kpis.engagementRate && kpis.engagementRate.value < 50) {
      alerts.push({ id: 3, type: 'warning', message: `Engagement faible détécté : ${kpis.engagementRate.value}%` });
    }

    return alerts;
  }
};