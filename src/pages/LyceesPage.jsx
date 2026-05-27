import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PageHelmet from '@/components/SEO/PageHelmet';
import LyceeCard from '@/components/lycees/LyceeCard';
import { onisepLyceeService } from '@/services/onisepLyceeService';

const PAGE_SIZE = 20;

const TYPE_TABS = [
  { key: 'all',           label: 'Tous',             icon: '🏫' },
  { key: 'general',       label: 'Général',          icon: '🎓' },
  { key: 'technologique', label: 'Technologique',    icon: '⚙️' },
  { key: 'professionnel', label: 'Professionnel',    icon: '🔧' },
];

const GUIDE_CARDS = [
  {
    icon: '🎓',
    title: 'Lycée Général',
    color: 'blue',
    desc: 'Tu choisis 3 spécialités en seconde et 2 en terminale. Il prépare aux études supérieures longues (fac, prépas, grandes écoles).',
  },
  {
    icon: '⚙️',
    title: 'Lycée Technologique',
    color: 'violet',
    desc: 'Des bacs techno par secteur (STI2D, STMG, ST2S…). Alliant cours et pratique, il mène surtout vers le BTS ou le BUT.',
  },
  {
    icon: '🔧',
    title: 'Lycée Professionnel',
    color: 'emerald',
    desc: 'Bac Pro (3 ans) ou CAP (2 ans) pour apprendre un métier avec de nombreux stages. Insertion rapide possible.',
  },
];

export default function LyceesPage() {
  const [q, setQ] = useState('');
  const [ville, setVille] = useState('');
  const [type, setType] = useState('all');
  const [statut, setStatut] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [lycees, setLycees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  // Submitted search params (to avoid re-fetching on every keystroke)
  const [activeParams, setActiveParams] = useState(null);

  const abortRef = useRef(null);
  const resultsRef = useRef(null);
  const didInitialLoad = useRef(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const doSearch = useCallback(async (params, pageNum = 1) => {
    if (abortRef.current) abortRef.current = false;
    const token = {};
    abortRef.current = token;

    setLoading(true);
    setError(null);

    try {
      const result = await onisepLyceeService.searchLycees({
        ...params,
        limit: PAGE_SIZE,
        offset: (pageNum - 1) * PAGE_SIZE,
      });

      if (token !== abortRef.current) return; // stale

      setLycees(result.lycees);
      setTotal(result.total);
      setSearched(true);
      setPage(pageNum);
    } catch (err) {
      if (token !== abortRef.current) return;
      setError(err?.message ?? 'Erreur lors de la recherche');
    } finally {
      if (token === abortRef.current) setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = { q, ville, type, statut };
    setActiveParams(params);
    doSearch(params, 1);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (activeParams !== null) {
      const params = { ...activeParams, type: newType };
      setActiveParams(params);
      doSearch(params, 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (!activeParams) return;
    doSearch(activeParams, newPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Auto-load on mount
  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    const params = { q: '', ville: '', type: 'all', statut: 'all' };
    setActiveParams(params);
    doSearch(params, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-search when type tab changes after first load
  useEffect(() => {
    if (activeParams !== null) {
      const params = { ...activeParams, type };
      setActiveParams(params);
      doSearch(params, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <>
      <PageHelmet
        title="Explorer les lycées | Clé Avenir"
        description="Trouve ton futur lycée — général, technologique ou professionnel. Informations, formations et conseils pour collégiens."
      />

      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                <School className="w-4 h-4" />
                Données ONISEP & Éducation Nationale
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
                Trouve ton futur lycée
              </h1>
              <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto mb-8">
                Tu es en collège et tu cherches le lycée qui te correspond ?
                Explore les lycées généraux, technologiques et professionnels de France.
              </p>

              {/* Search form */}
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nom du lycée, spécialité…"
                    className="pl-9 bg-white dark:bg-slate-800 border-[var(--border-color)] h-11"
                  />
                </div>
                <div className="relative sm:w-52">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Ville ou département"
                    className="pl-9 bg-white dark:bg-slate-800 border-[var(--border-color)] h-11"
                  />
                </div>
                <Button type="submit" disabled={loading} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Rechercher'}
                </Button>
              </form>

              {/* Advanced filters toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Masquer les filtres' : 'Filtres avancés'}
              </button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 flex justify-center gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-secondary)]">Statut :</span>
                    {['all', 'public', 'prive'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatut(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          statut === s
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-[var(--text-secondary)] border-[var(--border-color)] hover:border-indigo-300'
                        }`}
                      >
                        {s === 'all' ? 'Tous' : s === 'public' ? 'Public' : 'Privé'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Guide for collégiens ─────────────────────────────────── */}
        {!searched && (
          <section className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
              Les 3 voies du lycée
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {GUIDE_CARDS.map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border p-5 bg-${card.color}-50/60 dark:bg-slate-800/60 border-${card.color}-200/60`}
                >
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <h3 className={`font-semibold text-${card.color}-700 dark:text-${card.color}-300 mb-2`}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Results section ───────────────────────────────────────── */}
        <div ref={resultsRef} className="max-w-7xl mx-auto px-4 pb-16">
          {/* Type filter tabs */}
          {searched && (
            <div className="sticky top-0 z-10 bg-[var(--bg-primary)] py-4 border-b border-[var(--border-color)] mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {TYPE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTypeChange(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      type === tab.key
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-[var(--text-secondary)] border-[var(--border-color)] hover:border-indigo-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
                {total > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {total.toLocaleString('fr-FR')} lycée{total > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border-color)] p-5 animate-pulse space-y-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-2/5" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Results grid */}
          {!loading && searched && lycees.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {lycees.map((lycee) => (
                  <LyceeCard key={lycee.uai || lycee.id} lycee={lycee} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Précédent
                  </Button>
                  <span className="text-sm text-[var(--text-secondary)]">
                    Page {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="gap-1"
                  >
                    Suivant <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No results */}
          {!loading && searched && lycees.length === 0 && !error && (
            <div className="text-center py-20">
              <School className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] text-base">
                Aucun lycée trouvé pour cette recherche.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Essaie une autre ville ou supprime les filtres.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
