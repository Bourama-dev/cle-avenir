export const PedagogicalAnalysisService = {
  async getTeacherMetrics() {
    return [
      { name: 'M. Martin', subject: 'Mathématiques', effectiveness: 85, satisfaction: 4.5 },
      { name: 'Mme. Dubois', subject: 'Histoire', effectiveness: 92, satisfaction: 4.8 }
    ];
  }
};