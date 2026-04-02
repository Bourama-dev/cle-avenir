// Simple generator for textual insights based on semantic scores
export const semanticInsightsGenerator = {
  getConfidenceLabel(score) {
    if (score >= 0.8) return { label: 'Élevée', color: 'green' };
    if (score >= 0.6) return { label: 'Moyenne', color: 'yellow' };
    return { label: 'Faible', color: 'red' };
  },

  generateSkillGaps(userScore, careerTitle) {
    if (userScore > 0.8) return "Peu d'écarts détectés. Vous semblez prêt pour ce rôle.";
    if (userScore > 0.5) return `Quelques compétences clés pour ${careerTitle} pourraient être renforcées.`;
    return "Ce métier demanderait une reconversion ou une formation importante.";
  }
};