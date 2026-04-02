const CACHE_KEYS = {
  ARTICLES: 'blog_articles_cache',
  CATEGORIES: 'blog_categories_cache',
  RECENT: 'blog_recent_cache'
};

const TTL = {
  ARTICLES: 2 * 60 * 60 * 1000, // 2 hours
  CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
  RECENT: 1 * 60 * 60 * 1000 // 1 hour
};

class BlogCacheService {
  constructor() {
    this.storage = window.localStorage;
  }

  set(key, data, ttl) {
    try {
      const item = {
        value: data,
        expiry: Date.now() + ttl,
      };
      this.storage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('Failed to cache data', e);
      // If quota exceeded, clear old cache
      if (e.name === 'QuotaExceededError') {
        this.clearExpired();
      }
    }
  }

  get(key) {
    try {
      const itemStr = this.storage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now > item.expiry) {
        this.storage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      return null;
    }
  }

  // Articles List
  setArticles(page, category, search, data, total) {
    const key = `${CACHE_KEYS.ARTICLES}_${page}_${category}_${search}`;
    this.set(key, { data, total }, TTL.ARTICLES);
  }

  getArticles(page, category, search) {
    const key = `${CACHE_KEYS.ARTICLES}_${page}_${category}_${search}`;
    return this.get(key);
  }

  // Categories
  setCategories(data) {
    this.set(CACHE_KEYS.CATEGORIES, data, TTL.CATEGORIES);
  }

  getCategories() {
    return this.get(CACHE_KEYS.CATEGORIES);
  }

  // Single Article
  setArticle(slug, data) {
    this.set(`article_${slug}`, data, TTL.ARTICLES);
  }

  getArticle(slug) {
    return this.get(`article_${slug}`);
  }

  // Clear Logic
  clearExpired() {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && (key.startsWith('blog_') || key.startsWith('article_'))) {
        this.get(key); // This automatically removes if expired
      }
    }
  }

  invalidateCache() {
    const keysToRemove = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && (key.startsWith('blog_') || key.startsWith('article_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => this.storage.removeItem(k));
  }
}

export const blogCache = new BlogCacheService();