export const SegmentationService = {
  segmentByPerformance(data) {
    if (!data) return { atRisk: [], average: [], excellent: [] };
    
    return {
      atRisk: data.filter(d => (d.score || 0) < 50),
      average: data.filter(d => (d.score || 0) >= 50 && (d.score || 0) <= 70),
      excellent: data.filter(d => (d.score || 0) > 70)
    };
  },

  segmentByProfile(data) {
    if (!data) return {};
    return data.reduce((acc, curr) => {
      const profile = curr.profile || 'Non défini';
      if (!acc[profile]) acc[profile] = [];
      acc[profile].push(curr);
      return acc;
    }, {});
  }
};