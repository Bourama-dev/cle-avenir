import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, GraduationCap, Cpu, Wrench, Building2, RotateCcw,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageHelmet from '@/components/SEO/PageHelmet';
import LyceeCard from '@/components/lycees/LyceeCard';
import Footer from '@/components/Footer';
import { onisepLyceeService } from '@/services/onisepLyceeService';

const PAGE_SIZE = 20;

const TYPE_FILTERS = [
  { key: 'all',           label: 'Tous les lycées',     icon: <Building2 className="h-4 w-4" /> },
  { key: 'general',       label: 'Général',             icon: <GraduationCap className="h-4 w-4" /> },
  { key: 'technologique', label: 'Technologique',       icon: <Cpu className="h-4 w-4" /> },
  { key: 'professionnel', label: 'Professionnel',       icon: <Wrench className="h-4 w-4" /> },
];

const STATUT_FILTERS = [
  { key: 'all',    label: 'Tous' },
  { key: 'public', label: 'Public' },
  { key: 'prive',  label: 'Privé' },
];

// Quick-search chips — clicking sets the q field and triggers a search
const FILIERES_PRO = [
  { label: '🍽️ Hôtellerie', q: 'hôtellerie' },
  { label: '💻 Numérique', q: 'numérique' },
  { label: '🏗️ Bâtiment', q: 'bâtiment' },
  { label: '🚗 Auto / Mécanique', q: 'automobile' },
  { label: '🛍️ Commerce', q: 'commerce' },
  { label: '✂️ Coiffure', q: 'coiffure' },
  { label: '🌱 Agriculture', q: 'agricole' },
  { label: '🏥 Santé / Social', q: 'sanitaire' },
];

const SERIES_TECHNO = [
  { label: 'STMG', q: 'STMG' },
  { label: 'STI2D', q: 'STI2D' },
  { label: 'ST2S', q: 'ST2S' },
  { label: 'STL', q: 'STL' },
  { label: 'STD2A', q: 'STD2A' },
  { label: 'STHR', q: 'STHR' },
];

export default function LyceesPage() {
  const [q, setQ] = useState('');
  const [ville, setVille] = useState('');
  const [type, setType] = useState('all');
  const [statut, setStatut] = useState('all');

  const [lycees, setLycees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active search params snapshot (avoids re-fetch on every keystroke)
  const [activeParams, setActiveParams] = useState(null);

  const abortRef = useRef(null);
  const resultsRef = useRef(null);
  const didInitialLoad = useRef(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const doSearch = useCallback(async (params, pageNum = 1, isInitial = false) => {
    if (abortRef.current) abortRef.current = false;
    const token = {};
    abortRef.current = token;

    if (isInitial) setInitialLoading(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await onisepLyceeService.searchLycees({
        ...params,
        limit: PAGE_SIZE,
        offset: (pageNum - 1) * PAGE_SIZE,
      });

      if (token !== abortRef.current) return;

      setLycees(result.lycees);
      setTotal(result.total);
      setPage(pageNum);
      if (result.warning) setError(`Avertissement : ${result.warning}`);
    } catch (err) {
      if (token !== abortRef.current) return;
      setError(err?.message ?? 'Erreur lors de la recherche');
    } finally {
      if (token === abortRef.current) {
        setLoading(false);
        setInitialLoading(false);
      }
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
    const params = { ...(activeParams ?? { q, ville, statut }), type: newType };
    setActiveParams(params);
    doSearch(params, 1);
  };

  const handleStatutChange = (newStatut) => {
    setStatut(newStatut);
    const params = { ...(activeParams ?? { q, ville, type }), statut: newStatut };
    setActiveParams(params);
    doSearch(params, 1);
  };

  const handlePageChange = (newPage) => {
    if (!activeParams) return;
    doSearch(activeParams, newPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChipSearch = (chipQ, chipType = null) => {
    const newQ = chipQ;
    const newType = chipType ?? type;
    setQ(newQ);
    if (chipType) setType(chipType);
    const params = { q: newQ, ville, type: newType, statut };
    setActiveParams(params);
    doSearch(params, 1);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    setQ('');
    setVille('');
    setType('all');
    setStatut('all');
    const params = { q: '', ville: '', type: 'all', statut: 'all' };
    setActiveParams(params);
    doSearch(params, 1, true);
  };

  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    const params = { q: '', ville: '', type: 'all', statut: 'all' };
    setActiveParams(params);
    doSearch(params, 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasActiveFilters = type !== 'all' || statut !== 'all' || q || ville;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col">
      <PageHelmet
        title="Explorer les lycées | Clé Avenir"
        description="Trouve ton futur lycée — général, technologique ou professionnel. Informations, formations et conseils pour collégiens."
      />

      {/* ── Sticky search header ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm transition-all duration-200">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nom du lycée, spécialité…"
                className="pl-10 h-12 text-base bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:text-white dark:placeholder:text-slate-400"
              />
            </div>
            <div className="relative md:w-64 w-full group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ville ou département…"
                className="pl-10 h-12 text-base bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:text-white dark:placeholder:text-slate-400"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-12 w-full md:w-auto px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Rechercher'}
            </Button>
          </form>
        </div>
      </div>

      <main ref={resultsRef} className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="lg:w-72 shrink-0 space-y-6">

            {/* Total count */}
            {total > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {total.toLocaleString('fr-FR')} lycée{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Source : Éducation Nationale</p>
              </div>
            )}

            {/* Type filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                Type de lycée
              </h3>
              <div className="space-y-1">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => handleTypeChange(f.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      type === f.key
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={type === f.key ? 'text-indigo-600' : 'text-slate-400'}>{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Statut</h3>
              <div className="space-y-1">
                {STATUT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => handleStatutChange(f.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      statut === f.key
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filières professionnelles */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-500" />
                Filières pro
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {FILIERES_PRO.map((f) => (
                  <button
                    key={f.q}
                    onClick={() => handleChipSearch(f.q, 'professionnel')}
                    className="text-xs px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-medium"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Séries technologiques */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-violet-500" />
                Séries techno
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {SERIES_TECHNO.map((s) => (
                  <button
                    key={s.q}
                    onClick={() => handleChipSearch(s.q, 'technologique')}
                    className="text-xs px-2.5 py-1 rounded-full border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors font-medium"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full gap-2 text-slate-600 border-slate-200"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser les filtres
              </Button>
            )}
          </aside>

          {/* ── Results ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Loading skeleton */}
            {(initialLoading || loading) && (
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-24 bg-slate-100 dark:bg-slate-800 rounded-t-xl" />
                    <CardContent className="h-40 bg-slate-50 dark:bg-slate-800/50" />
                  </Card>
                ))}
              </div>
            )}

            {/* Results */}
            {!initialLoading && !loading && lycees.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {lycees.map((lycee, idx) => (
                    <LyceeCard key={lycee.uai || lycee.id} lycee={lycee} index={idx} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Page {page} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!initialLoading && !loading && lycees.length === 0 && !error && (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun lycée trouvé</h3>
                <p className="text-slate-500 dark:text-slate-400">Essayez de modifier vos critères de recherche.</p>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
