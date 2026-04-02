export const AnalyticsService = {
  mean(data, key) {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + (val[key] || 0), 0);
    return sum / data.length;
  },
  
  median(data, key) {
    if (!data || data.length === 0) return 0;
    const values = data.map(d => d[key] || 0).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  },
  
  stdDev(data, key) {
    if (!data || data.length === 0) return 0;
    const m = this.mean(data, key);
    const squareDiffs = data.map(d => Math.pow((d[key] || 0) - m, 2));
    const avgSquareDiff = this.mean(squareDiffs.map(val => ({ val })), 'val');
    return Math.sqrt(avgSquareDiff);
  },
  
  min(data, key) {
    if (!data || data.length === 0) return 0;
    return Math.min(...data.map(d => d[key] || 0));
  },
  
  max(data, key) {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(d => d[key] || 0));
  },
  
  percentile(data, key, p) {
    if (!data || data.length === 0) return 0;
    const values = data.map(d => d[key] || 0).sort((a, b) => a - b);
    const index = (p / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = lower + 1;
    const weight = index % 1;
    if (upper >= values.length) return values[lower];
    return values[lower] * (1 - weight) + values[upper] * weight;
  },

  getRates(data) {
    if (!data || data.length === 0) return { completion: 0, abandonment: 0, satisfaction: 0 };
    const completed = data.filter(d => d.status === 'completed').length;
    const abandoned = data.filter(d => d.status === 'abandoned').length;
    const satisfied = data.filter(d => d.satisfaction >= 4).length;
    
    return {
      completion: (completed / data.length) * 100,
      abandonment: (abandoned / data.length) * 100,
      satisfaction: completed > 0 ? (satisfied / completed) * 100 : 0
    };
  },

  filterData(data, filters) {
    if (!data) return [];
    return data.filter(item => {
      let match = true;
      if (filters.class && item.class !== filters.class) match = false;
      if (filters.level && item.level !== filters.level) match = false;
      if (filters.profile && item.dominant_profile !== filters.profile) match = false;
      if (filters.status && item.status !== filters.status) match = false;
      return match;
    });
  }
};