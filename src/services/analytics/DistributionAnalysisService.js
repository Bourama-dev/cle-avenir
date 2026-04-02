export const DistributionAnalysisService = {
  analyzeScores(data) {
    if (!data) return [];
    const bins = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    
    data.forEach(d => {
      const s = d.score || 0;
      if (s <= 20) bins['0-20']++;
      else if (s <= 40) bins['21-40']++;
      else if (s <= 60) bins['41-60']++;
      else if (s <= 80) bins['61-80']++;
      else bins['81-100']++;
    });

    return Object.keys(bins).map(k => ({ range: k, count: bins[k] }));
  },

  analyzeProfiles(data) {
    if (!data) return [];
    const counts = {};
    data.forEach(d => {
      const p = d.profile || 'Autre';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
  }
};