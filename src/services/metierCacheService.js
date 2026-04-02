const CACHE_KEY = 'metier_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const isCacheExpired = (timestamp) => {
  if (!timestamp) return true;
  return (Date.now() - timestamp) > CACHE_EXPIRY;
};

export const getCachedMetier = (code) => {
  try {
    const cacheString = localStorage.getItem(CACHE_KEY);
    if (!cacheString) return null;
    
    const cache = JSON.parse(cacheString);
    const entry = cache[code];
    
    if (entry && !isCacheExpired(entry.timestamp)) {
      return entry.data;
    }
    
    // If expired, clean it up
    if (entry && isCacheExpired(entry.timestamp)) {
      delete cache[code];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to retrieve metier from cache:', error);
    return null;
  }
};

export const setCachedMetier = (code, data) => {
  try {
    const cacheString = localStorage.getItem(CACHE_KEY);
    const cache = cacheString ? JSON.parse(cacheString) : {};
    
    cache[code] = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save metier to cache:', error);
  }
};

export const clearMetierCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear metier cache:', error);
  }
};