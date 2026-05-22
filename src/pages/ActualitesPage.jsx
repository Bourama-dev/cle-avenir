import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, X, RefreshCw, Newspaper, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newsService, CATEGORIES } from '@/services/newsService';
import { normalizedIncludes } from '@/utils/stringUtils';
import MetaTags from '@/components/SEO/MetaTags';

const ITEMS_PER_PAGE = 12;

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function NewsCard({ item, index }) {
  const cat = CATEGORIES.find((c) => c.id === item.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex flex-col bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-200 group"
    >
      {/* Category bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-400 opacity-60" />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Source + category */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
            <span>{item.source_logo}</span>
            {item.source}
          </span>
          {cat && cat.id !== 'all' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium border border-[var(--border-color)]">
              {cat.emoji} {cat.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug line-clamp-3 group-hover:text-[var(--color-primary)] transition-colors">
          {item.title}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">
            {item.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(item.published_at)}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            Lire la suite
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-[var(--bg-secondary)]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-24 rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-full rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--bg-secondary)]" />
        <div className="h-3 w-full rounded bg-[var(--bg-secondary)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--bg-secondary)]" />
        <div className="flex justify-between mt-4">
          <div className="h-3 w-20 rounded bg-[var(--bg-secondary)]" />
          <div className="h-3 w-16 rounded bg-[var(--bg-secondary)]" />
        </div>
      </div>
    </div>
  );
}

export default function ActualitesPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await newsService.getAll();
      setAllItems(result.items);
      setFetchedAt(result.fetched_at);
    } catch {
      setError('Impossible de charger les actualités pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !search.trim() ||
        normalizedIncludes(item.title, search) ||
        normalizedIncludes(item.excerpt, search) ||
        normalizedIncludes(item.source, search);
      return matchCat && matchSearch;
    });
  }, [allItems, activeCategory, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count per category for badges
  const counts = useMemo(() => {
    const map = {};
    for (const item of allItems) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    map['all'] = allItems.length;
    return map;
  }, [allItems]);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <MetaTags
        title="Actualités — Emploi, Formation & Orientation | CléAvenir"
        description="Suivez l'actualité de l'emploi, de la formation professionnelle et du marché du travail en France. Sources officielles : DARES, Ministère du Travail, ONISEP, data.gouv.fr."
        url="/actualites"
      />

      {/* Hero */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🗞️</span>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                  Actualités emploi & formation
                </h1>
              </div>
              <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-xl">
                Veille en temps réel sur le marché du travail en France — sources officielles DARES,
                Ministère du Travail, ONISEP et data.gouv.fr.
              </p>
              {fetchedAt && (
                <p className="text-xs text-[var(--text-secondary)] mt-2 opacity-60">
                  Dernière mise à jour : {formatDate(fetchedAt)}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadNews}
              disabled={loading}
              className="shrink-0 gap-2 self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </motion.div>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans les actualités…"
              className="pl-9 pr-9 bg-[var(--bg-secondary)] border-[var(--border-color)]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--color-primary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                {counts[cat.id] !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {counts[cat.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Newspaper className="w-12 h-12 text-[var(--text-secondary)] opacity-40" />
            <p className="text-[var(--text-secondary)]">{error}</p>
            <Button onClick={loadNews} variant="outline">
              Réessayer
            </Button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Newspaper className="w-12 h-12 text-[var(--text-secondary)] opacity-40" />
            <p className="text-[var(--text-secondary)]">
              {search
                ? `Aucun résultat pour « ${search} »`
                : 'Aucune actualité disponible pour cette catégorie.'}
            </p>
            {search && (
              <Button variant="outline" onClick={() => setSearch('')}>
                Effacer la recherche
              </Button>
            )}
          </div>
        )}

        {!loading && !error && paginated.length > 0 && (
          <>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {filtered.length} actualité{filtered.length > 1 ? 's' : ''}
              {activeCategory !== 'all' && ` · ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
              {search && ` · « ${search} »`}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${search}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {paginated.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === page ? 'default' : 'outline'}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}

        {/* Sources attribution */}
        <div className="mt-12 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
          <p className="text-xs text-[var(--text-secondary)] text-center">
            Sources officielles :{' '}
            {[
              'DARES',
              'Ministère du Travail',
              'Min. Économie & Finances',
              'ONISEP',
              'Centre Inffo',
              'data.gouv.fr',
              'MESRI / Parcoursup',
            ].join(' · ')}
            {' '}— Données publiques en libre accès (Licence Ouverte / ODbL)
          </p>
        </div>
      </div>
    </div>
  );
}
