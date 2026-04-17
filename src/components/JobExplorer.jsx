import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, MapPin, AlertCircle, Plus, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import JobCard from '@/components/job-explorer/JobCard';
import JobCardSkeleton from '@/components/job-explorer/JobCardSkeleton';
import EnhancedJobFilters from '@/components/job-explorer/EnhancedJobFilters';
import ResultsSummary from '@/components/job-explorer/ResultsSummary';
import Pagination from '@/components/job-explorer/Pagination';
import useJobFilters from '@/hooks/useJobFilters';
import { useDebounce } from '@/hooks/useDebounce';

const JobExplorer = ({ onNavigate }) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const {
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    handleFilterChange,
    resetFilters,
    jobs, // filtered list
    loading,
    error,
    fetchJobs,
    totalCount,
    filteredCount,
    totalPages,
    setPage
  } = useJobFilters();

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Pre-fill search from ?q= URL param on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch on filter/page/search changes with scroll to top
  useEffect(() => {
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    filters.location,
    filters.contractTypes,
    filters.experiences,
    filters.teletravauxOnly,
    filters.page,
    filters.radius,
    debouncedSearch
  ]);

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  const handleExpandRadius = () => {
      const currentRadius = filters.radius ? Number(filters.radius) : 0;
      let newRadius = null;
      if (currentRadius < 5) newRadius = 10;
      else if (currentRadius < 10) newRadius = 25;
      else if (currentRadius < 25) newRadius = 50;
      else if (currentRadius < 50) newRadius = 100;
      else newRadius = null; 
      
      updateFilter('radius', newRadius);
  };

  const handleClearRadius = () => {
    updateFilter('radius', null);
  };

  const isGeoFilteringActive = filters.location && filters.radius !== null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header & Search */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm transition-all duration-200">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <Input 
                   placeholder="Rechercher un métier, une compétence..." 
                   className="pl-10 h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button 
                size="lg" 
                className="h-12 w-full md:w-auto px-8 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 hover:shadow-lg transition-all"
                onClick={() => fetchJobs()}
             >
                Rechercher
             </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <EnhancedJobFilters 
            filters={filters}
            // Pass handleFilterChange for direct batch updates if needed, or updateFilter for single
            onFilterChange={handleFilterChange}
            resetFilters={resetFilters}
            onSearch={() => fetchJobs()}
          />

          {/* Results Area */}
          <div className="flex-1 min-w-0">
             
            {/* New Results Summary Component */}
            {!loading && (totalCount > 0) && (
                <ResultsSummary 
                    totalResults={totalCount}
                    filteredResults={filteredCount}
                    filters={filters}
                    onClearRadius={handleClearRadius}
                />
            )}

             {loading && jobs.length === 0 ? (
                <div className="grid grid-cols-1 gap-4">
                   {[1, 2, 3, 4].map(i => <JobCardSkeleton key={i} />)}
                </div>
             ) : error === 'credentials_missing' ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-amber-100 p-8 shadow-sm">
                   <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Key className="h-8 w-8 text-amber-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Service en cours de configuration</h3>
                   <p className="text-slate-600 mb-2 max-w-md mx-auto">
                     Les offres d'emploi sont fournies par <strong>France Travail</strong>.
                     La connexion à leur API nécessite des identifiants à configurer côté serveur.
                   </p>
                   <p className="text-sm text-slate-400 mb-6">
                     Variables requises : <code className="bg-slate-100 px-1 rounded">FRANCE_TRAVAIL_CLIENT_ID</code> et <code className="bg-slate-100 px-1 rounded">FRANCE_TRAVAIL_SECRET</code>
                   </p>
                   <a href="https://francetravail.io/data/api" target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                     Obtenir les identifiants France Travail
                   </a>
                </div>
             ) : error === 'auth_failed' ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-amber-100 p-8 shadow-sm">
                   <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Key className="h-8 w-8 text-amber-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Identifiants France Travail invalides</h3>
                   <p className="text-slate-600 mb-2 max-w-md mx-auto">
                     Les identifiants configurés (<code className="bg-slate-100 px-1 rounded text-xs">FRANCE_TRAVAIL_CLIENT_ID</code> / <code className="bg-slate-100 px-1 rounded text-xs">FRANCE_TRAVAIL_SECRET</code>) ne sont pas reconnus par France Travail.
                   </p>
                   <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                     Vérifiez les secrets dans Supabase → Edge Functions → Secrets, puis réessayez.
                   </p>
                   <Button onClick={() => fetchJobs()} variant="outline" className="border-amber-200 hover:bg-amber-50 text-amber-700">
                     Réessayer
                   </Button>
                </div>
             ) : error === 'api_error_401' || error === 'api_error_403' ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-amber-100 p-8 shadow-sm">
                   <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Key className="h-8 w-8 text-amber-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Accès à l'API refusé</h3>
                   <p className="text-slate-600 mb-4 max-w-md mx-auto">
                     Votre application France Travail n'est pas abonnée à l'<strong>API Offres d'emploi v2</strong>.
                   </p>
                   <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                     Connectez-vous sur <strong>francetravail.io</strong> → Mon espace → votre application → Abonnements, puis activez l'API <code className="bg-slate-100 px-1 rounded">Offres d'emploi v2</code>.
                   </p>
                   <a href="https://francetravail.io/data/api/offresdemploiv2" target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                     Activer l'API Offres d'emploi
                   </a>
                </div>
             ) : error ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
                   <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-400" />
                   </div>
                   <p className="text-red-600 mb-6 font-medium">{error}</p>
                   <Button onClick={() => fetchJobs()} variant="outline" className="border-red-200 hover:bg-red-50 text-red-700">
                       Réessayer
                   </Button>
                </div>
             ) : jobs.length > 0 ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 gap-4">
                      {jobs.map((job) => (
                         <JobCard 
                            key={job.id} 
                            job={job}
                            onViewOffer={() => onNavigate(`/job/${job.id}`, { job })}
                            onClick={() => onNavigate(`/job/${job.id}`, { job })}
                            onToggleSave={() => toast({ title: "Fonctionnalité à venir", description: "La sauvegarde sera bientôt disponible." })}
                         />
                      ))}
                   </div>
                   
                   {/* Pagination Component */}
                   <Pagination 
                      currentPage={filters.page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                   />
                </div>
             ) : (
                <div className={`text-center py-24 rounded-2xl border border-dashed shadow-sm ${isGeoFilteringActive ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isGeoFilteringActive ? 'bg-red-100' : 'bg-slate-50'}`}>
                      {isGeoFilteringActive ? (
                          <MapPin className="h-10 w-10 text-red-400" />
                      ) : (
                          <Search className="h-10 w-10 text-slate-300" />
                      )}
                   </div>
                   <h3 className={`text-xl font-bold mb-3 ${isGeoFilteringActive ? 'text-red-900' : 'text-slate-900'}`}>
                       {isGeoFilteringActive ? "Aucune offre dans ce secteur" : "Aucune offre trouvée"}
                   </h3>
                   <p className={`${isGeoFilteringActive ? 'text-red-700' : 'text-slate-500'} mb-8 max-w-md mx-auto leading-relaxed`}>
                      {isGeoFilteringActive 
                        ? `Nous n'avons trouvé aucune offre correspondant à vos critères dans un rayon de ${filters.radius} km.`
                        : "Nous n'avons trouvé aucune offre correspondant à vos critères. Essayez de modifier vos filtres."
                      }
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {isGeoFilteringActive && (
                            <Button 
                                onClick={handleExpandRadius} 
                                size="lg" 
                                className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200/50 gap-2"
                            >
                                <Plus className="w-4 h-4" /> Élargir la recherche
                            </Button>
                        )}
                        
                        <Button 
                            onClick={resetFilters} 
                            size="lg" 
                            variant={isGeoFilteringActive ? "outline" : "default"}
                            className={isGeoFilteringActive ? "bg-white text-red-700 border-red-200 hover:bg-red-50" : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50"}
                        >
                            Réinitialiser tous les filtres
                        </Button>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobExplorer;