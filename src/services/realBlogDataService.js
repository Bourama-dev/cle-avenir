import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';

const CACHE_TTL_ARTICLES  = 10 * 60 * 1000; // 10 minutes
const CACHE_TTL_CATEGORIES = 60 * 60 * 1000; // 1 hour (categories rarely change)

export const realBlogDataService = {
  /**
   * Get all published blog articles (cached)
   */
  async getAllArticles(limit = 20, offset = 0) {
    const cacheKey = CacheService.generateKey('blog_articles_all', { limit, offset });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error, count } = await supabase
        .from('blog_articles')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result = { articles: data || [], total: count || 0 };
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error('Error fetching blog articles:', error);
      return { articles: [], total: 0 };
    }
  },

  /**
   * Get blog articles by category
   */
  async getArticlesByCategory(categoryId, limit = 20) {
    const cacheKey = CacheService.generateKey('blog_articles_cat', { categoryId, limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error(`Error fetching articles for category ${categoryId}:`, error);
      return [];
    }
  },

  /**
   * Get a specific blog article by slug
   */
  async getArticleBySlug(slug) {
    const cacheKey = `blog_article_slug_${slug}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) CacheService.set(cacheKey, data, CACHE_TTL_ARTICLES);
      return data || null;
    } catch (error) {
      console.error(`Error fetching article with slug ${slug}:`, error);
      return null;
    }
  },

  /**
   * Get featured blog articles (cached)
   */
  async getFeaturedArticles(limit = 5) {
    const cacheKey = CacheService.generateKey('blog_articles_featured', { limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  },

  /**
   * Search blog articles
   */
  async searchArticles(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching blog articles:', error);
      return [];
    }
  },

  /**
   * Get all blog posts - legacy table (cached)
   */
  async getAllPosts(limit = 20, offset = 0) {
    const cacheKey = CacheService.generateKey('blog_posts_all', { limit, offset });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error, count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result = { posts: data || [], total: count || 0 };
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { posts: [], total: 0 };
    }
  },

  /**
   * Get blog categories (long-lived cache - categories rarely change)
   */
  async getCategories() {
    const cacheKey = 'blog_categories';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_CATEGORIES);
      return result;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  },

  /**
   * Get article comments (not cached - should be real-time)
   */
  async getArticleComments(articleId) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching comments for article ${articleId}:`, error);
      return [];
    }
  },

  /**
   * Get recent articles (cached)
   */
  async getRecentArticles(limit = 10) {
    const cacheKey = CacheService.generateKey('blog_articles_recent', { limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, published_at, featured_image')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      return [];
    }
  },

  /**
   * Get popular articles by view count (cached)
   */
  async getPopularArticles(limit = 10) {
    const cacheKey = CacheService.generateKey('blog_articles_popular', { limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, view_count')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_ARTICLES);
      return result;
    } catch (error) {
      console.error('Error fetching popular articles:', error);
      return [];
    }
  },
};
