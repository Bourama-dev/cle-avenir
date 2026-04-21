import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch REAL blog content from database
 * Replaces hardcoded blogPosts.js and faqBlogArticles.js
 */
export const realBlogDataService = {
  /**
   * Get all published blog articles
   */
  async getAllArticles(limit = 20, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('blog_articles')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { articles: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching blog articles:', error);
      return { articles: [], total: 0 };
    }
  },

  /**
   * Get blog articles by category
   */
  async getArticlesByCategory(categoryId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching articles for category ${categoryId}:`, error);
      return [];
    }
  },

  /**
   * Get a specific blog article by slug
   */
  async getArticleBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching article with slug ${slug}:`, error);
      return null;
    }
  },

  /**
   * Get featured blog articles
   */
  async getFeaturedArticles(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
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
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching blog articles:', error);
      return [];
    }
  },

  /**
   * Get all blog posts (legacy - for backward compatibility)
   */
  async getAllPosts(limit = 20, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { posts: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { posts: [], total: 0 };
    }
  },

  /**
   * Get blog categories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  },

  /**
   * Get article comments
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
   * Get recent articles
   */
  async getRecentArticles(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, published_at, featured_image')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      return [];
    }
  },

  /**
   * Get popular articles by view count
   */
  async getPopularArticles(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, view_count')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching popular articles:', error);
      return [];
    }
  }
};
