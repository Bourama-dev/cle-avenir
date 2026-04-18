import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const MetierCard = ({ metier, onSelect, index }) => {
  const salary = getMetierSalary(metier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      onClick={() => onSelect(metier)}
      className="bg-card rounded-2xl p-6 card-hover flex flex-col justify-between shadow-md border border-border/20 cursor-pointer h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Briefcase className="w-24 h-24 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start mb-3 gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl shrink-0 group-hover:bg-primary/20 transition-colors shadow-sm">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <Badge variant="outline" className="mb-1.5 text-[10px] tracking-wider font-mono text-muted-foreground bg-muted/50 border-border/50">
              ROME {metier.code}
            </Badge>
            <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {metier.libelle}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {metier.description || "Découvrez les compétences, les conditions de travail et les opportunités liées à ce métier."}
        </p>

        {/* Salary + level chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            <Euro className="w-3 h-3" />
            {salary}
          </span>
          {metier.niveau_etudes && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              <GraduationCap className="w-3 h-3" />
              {metier.niveau_etudes}
            </span>
          )}
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-border/10 flex justify-between items-center">
          <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline group-hover:underline-offset-4 decoration-primary/30 transition-all">
            Voir la fiche <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
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
      window.scrollTo({ top: resultsRef.current.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Helmet>
        <title>Catalogue Métiers - CléAvenir</title>
        <meta name="description" content={`Explorez ${totalMetiersCount > 0 ? totalMetiersCount.toLocaleString() : 'de nombreux'} métiers issus du répertoire officiel.`} />
      </Helmet>

      <main className="container mx-auto px-4 py-8" ref={resultsRef}>
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 px-3 py-1">Répertoire Opérationnel des Métiers et des Emplois (ROME)</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explorez le <span className="gradient-text">Catalogue Métiers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {totalMetiersCount > 0
              ? `${totalMetiersCount.toLocaleString('fr-FR')} métiers du répertoire officiel ROME`
              : "Accédez à l’intégralité des fiches métiers officielles."}
          </p>
        </div>

        <div className="bg-background p-4 rounded-2xl shadow-lg border border-border/40 mb-8 max-w-3xl mx-auto sticky top-24 z-30">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Rechercher un métier (ex: Boulanger, Data Analyst...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-10 py-6 text-lg border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-6 px-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium">
            {!isLoading && (
              <>{displayedMetiers.length.toLocaleString('fr-FR')} métier(s) trouvé(s) sur {totalMetiersCount.toLocaleString('fr-FR')}</>
            )}
          </div>
          {!isLoading && (
            <Button variant="ghost" size="sm" onClick={loadMetiers} className="text-muted-foreground hover:text-primary gap-2">
              <RefreshCcw className="h-3.5 w-3.5" /> Actualiser la liste
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[220px] w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={loadMetiers}>Réessayer</Button>
          </div>
        ) : displayedMetiers.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-foreground mb-2">Aucun métier trouvé</h3>
            <Button variant="outline" className="mt-6" onClick={() => setSearchTerm('')}>Effacer la recherche</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {currentItems.map((metier, index) => (
                  <MetierCard
                    key={metier.code}
                    metier={metier}
                    onSelect={() => onNavigate(`/metier/${metier.code}`)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pb-12">
                <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="font-medium text-sm text-foreground">Page {currentPage}</span>
                  <span className="text-muted-foreground text-sm">/ {totalPages}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
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
