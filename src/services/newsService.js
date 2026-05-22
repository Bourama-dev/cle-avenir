import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const CATEGORIES = [
  { id: 'all', label: 'Toutes les actualités', emoji: '🗞️' },
  { id: 'emploi', label: 'Emploi', emoji: '💼' },
  { id: 'formation', label: 'Formation', emoji: '📚' },
  { id: 'orientation', label: 'Orientation', emoji: '🎯' },
  { id: 'marche-travail', label: 'Marché du travail', emoji: '📊' },
  { id: 'economie', label: 'Économie', emoji: '📈' },
  { id: 'open-data', label: 'Open Data', emoji: '🗃️' },
];

export const newsService = {
  async getAll() {
    const cacheKey = 'news_feeds_all';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase.functions.invoke('fetch-news-feeds', {
        method: 'GET',
      });

      if (error) throw error;

      const result = {
        items: data?.items || [],
        total: data?.total || 0,
        fetched_at: data?.fetched_at || new Date().toISOString(),
      };

      CacheService.set(cacheKey, result, CACHE_TTL);
      return result;
    } catch (err) {
      console.error('[newsService] getAll failed:', err);
      return { items: [], total: 0, fetched_at: null };
    }
  },
};
