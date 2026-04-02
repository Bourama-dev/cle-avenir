export const ComparativeAnalysisService = {
  async compareEntities(entityA, entityB) {
    return [
      { metric: 'Score Moyen', [entityA]: 75, [entityB]: 68 },
      { metric: 'Taux de réussite', [entityA]: 85, [entityB]: 70 }
    ];
  }
};