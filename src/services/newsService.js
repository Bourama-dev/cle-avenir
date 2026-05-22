import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY_ALL = 'news_feeds_all';

export const CATEGORIES = [
  { id: 'all',           label: 'Toutes les actualités',  emoji: '🗞️' },
  { id: 'emploi',        label: 'Emploi',                 emoji: '💼' },
  { id: 'formation',     label: 'Formation',              emoji: '📚' },
  { id: 'orientation',   label: 'Orientation',            emoji: '🎯' },
  { id: 'marche-travail',label: 'Marché du travail',      emoji: '📊' },
  { id: 'economie',      label: 'Économie',               emoji: '📈' },
  { id: 'open-data',     label: 'Open Data',              emoji: '🗃️' },
];

export const newsService = {
  async getAll() {
    const cached = CacheService.get(CACHE_KEY_ALL);
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

      CacheService.set(CACHE_KEY_ALL, result, CACHE_TTL);
      return result;
    } catch (err) {
      console.error('[newsService] getAll failed:', err);
      return { items: [], total: 0, fetched_at: null };
    }
  },

  async getById(id) {
    const { items } = await this.getAll();
    return items.find((item) => item.id === id) || null;
  },
};
