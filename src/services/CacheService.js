export const CacheService = {
  DEFAULT_TTL: 60 * 60 * 1000, // 1 hour

  set(key, data, ttl = this.DEFAULT_TTL) {
    try {
      const item = {
        data,
        expiry: Date.now() + ttl,
        version: '1.0'
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.warn('Cache storage failed:', e);
    }
  },

  get(key) {
    try {
      const itemStr = localStorage.getItem(`cache_${key}`);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }
      return item.data;
    } catch (e) {
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(`cache_${key}`);
  },

  generateKey(prefix, params) {
    const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
            acc[key] = params[key];
        }
        return acc;
      }, {});
    return `${prefix}_${JSON.stringify(sortedParams)}`;
  }
};