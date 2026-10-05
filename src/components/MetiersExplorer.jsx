import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, Briefcase, ChevronLeft, ChevronRight,
  Loader2, X, RefreshCcw, Euro, GraduationCap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';
import { getMetierSalary } from '@/utils/salaryUtils';
import { normalizedIncludes } from '@/utils/stringUtils';
import { metierToSlug } from '@/utils/slugUtils';

const MetierCard = ({ metier, onSelect, index, reduce }) => {
  const salary = getMetierSalary(metier);

  return (
    <motion.button
      type="button"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: reduce ? 0 : Math.min(index * 0.03, 0.3) }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      onClick={() => onSelect(metier)}
      className="w-full text-left bg-card rounded-2xl p-4 min-h-[88px] flex items-center gap-4 border border-border/40 shadow-sm md:flex-col md:items-start md:gap-3 md:p-5 md:hover:shadow-lg md:hover:-translate-y-0.5 transition-all group"
    >
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Briefcase className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 md:w-full">
        <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {metier.libelle}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <Euro className="w-3 h-3" />
            {salary}
          </span>
          {metier.niveau_etudes && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              <GraduationCap className="w-3 h-3" />
              {metier.niveau_etudes}
            </span>
          )}
        </div>
        <p className="hidden md:block text-sm text-muted-foreground line-clamp-2 mt-2">
          {metier.description || "Découvrez les compétences, les conditions de travail et les opportunités liées à ce métier."}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 md:hidden" />
    </motion.button>
  );
};

/* ─── Fetch ALL metiers using paginated .range() to bypass Supabase 1000-row cap ─── */
const fetchAllMetiers = async () => {
  const BATCH = 1000;
  let from = 0;
  let accumulated = [];

  while (true) {
    const { data, error } = await supabase
      .from('rome_metiers')
      .select('code, libelle, description, salaire, salary_range, niveau_etudes')
      .order('libelle')
      .range(from, from + BATCH - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    accumulated = accumulated.concat(data);

    if (data.length < BATCH) break; // last page
    from += BATCH;
  }

  return accumulated;
};

const MetiersExplorer = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [allMetiers, setAllMetiers] = useState([]);
  const [displayedMetiers, setDisplayedMetiers] = useState([]);
  const [totalMetiersCount, setTotalMetiersCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const resultsRef = useRef(null);
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const loadMetiers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllMetiers();
      setAllMetiers(data);
      setDisplayedMetiers(data);
      setTotalMetiersCount(data.length);
    } catch (err) {
      console.error("Error fetching metiers:", err);
      setError("Impossible de charger la liste des métiers. Veuillez réessayer.");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de récupérer le catalogue des métiers."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadMetiers(); }, []);

  useEffect(() => {
    if (allMetiers.length === 0) return;
    let results = allMetiers;

    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm;
      results = results.filter(m =>
        normalizedIncludes(m.libelle, term) ||
        normalizedIncludes(m.code, term) ||
        normalizedIncludes(m.description, term)
      );
    }

    setDisplayedMetiers(results);
    setCurrentPage(1);
  }, [debouncedSearchTerm, allMetiers]);

  const totalPages = Math.ceil(displayedMetiers.length / itemsPerPage);
  const currentItems = displayedMetiers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (resultsRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Helmet>
        <title>Catalogue Métiers - CléAvenir</title>
        <meta name="description" content={`Explorez ${totalMetiersCount > 0 ? totalMetiersCount.toLocaleString() : 'de nombreux'} métiers issus du répertoire officiel.`} />
      </Helmet>

      <div className="sticky top-14 md:top-16 lg:top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="text-xl md:text-3xl font-bold text-foreground">
              Explorer les <span className="gradient-text">métiers</span>
            </h1>
            {!isLoading && (
              <button onClick={loadMetiers} aria-label="Actualiser la liste" className="h-11 w-11 -mr-2 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted">
                <RefreshCcw className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Rechercher un métier"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-2xl text-base bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} aria-label="Effacer" className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {!isLoading && (
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              {displayedMetiers.length.toLocaleString('fr-FR')} métier(s) sur {totalMetiersCount.toLocaleString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-4 md:py-8" ref={resultsRef}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[88px] md:h-[180px] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-6 px-4">{error}</p>
            <Button className="h-11" onClick={loadMetiers}>Réessayer</Button>
          </div>
        ) : displayedMetiers.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-foreground mb-2">Aucun métier trouvé</h3>
            <Button variant="outline" className="mt-4 h-11" onClick={() => setSearchTerm('')}>Effacer la recherche</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {currentItems.map((metier, index) => (
                <MetierCard
                  key={metier.code}
                  metier={metier}
                  reduce={reduce}
                  onSelect={() => onNavigate(`/metier/${metierToSlug(metier)}`)}
                  index={index}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8 pb-6">
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="font-medium text-sm text-foreground">Page {currentPage}</span>
                  <span className="text-muted-foreground text-sm">/ {totalPages}</span>
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MetiersExplorer;
