import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';
import { CURATED_ARTICLES } from '@/data/curatedArticles';

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

      const apiItems = data?.items || [];
      const merged = [...CURATED_ARTICLES, ...apiItems].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
      );

      const result = {
        items: merged,
        total: merged.length,
        fetched_at: data?.fetched_at || new Date().toISOString(),
      };

      CacheService.set(CACHE_KEY_ALL, result, CACHE_TTL);
      return result;
    } catch (err) {
      console.error('[newsService] getAll failed:', err);
      // Even on API failure, return curated articles
      return { items: CURATED_ARTICLES, total: CURATED_ARTICLES.length, fetched_at: null };
    }
  },

  async getById(id) {
    const { items } = await this.getAll();
    return items.find((item) => item.id === id) || null;
  },
};
