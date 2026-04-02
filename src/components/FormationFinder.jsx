import React, { useState, useEffect } from 'react';
import { useSafeToast } from '@/hooks/useSafeToast';
import SearchBar from '@/components/formation-finder/SearchBar';
import FormationFilters from '@/components/formation-finder/FormationFilters';
import FilterSummary from '@/components/formation-finder/FilterSummary';
import FormationCard from '@/components/formation-finder/FormationCard';
import { fetchFormations } from '@/services/franceTravail';
import { useFormationFilters } from '@/hooks/useFormationFilters';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { filterFormationsBySectors } from '@/utils/sectorUtils';

export default function FormationFinder() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { toast } = useSafeToast();
  
  const { 
    filters, 
    updateFilter, 
    toggleArrayFilter, 
    removeFilter, 
    clearAll, 
    activeFilterCount 
  } = useFormationFilters();

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Pass adapted filters to API
      const response = await fetchFormations({
        q: filters.query,
        ville: filters.ville,
        codePostal: filters.codePostal,
        limit: 50 // Increased limit to allow local filtering
      });
      
      if (response.success) {
        let filteredResults = response.results;
        
        // Frontend filtering for advanced options
        if (filters.minRating > 0) {
          filteredResults = filteredResults.filter(f => (f.rating || 0) >= filters.minRating);
        }
        if (filters.modality?.length > 0) {
          filteredResults = filteredResults.filter(f => filters.modality.includes(f.modality || 'Présentiel'));
        }
        
        // Sector filtering
        filteredResults = filterFormationsBySectors(filteredResults, filters.sectors);
        
        setFormations(filteredResults);
        setTotal(response.total);
      } else {
        toast({ title: "Erreur", description: response.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les formations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFilter = (key, val) => {
    if (val && Array.isArray(filters[key])) {
      toggleArrayFilter(key, val);
    } else {
      removeFilter(key);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SearchBar 
        searchQuery={filters.query}
        onSearchChange={(val) => updateFilter('query', val)}
        onSearch={handleSearch}
        loading={loading}
        resultCount={formations.length}
        totalCount={total}
      />

      <FilterSummary 
        filters={filters}
        onRemove={handleRemoveFilter}
        onClear={clearAll}
        totalResults={formations.length}
      />

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 transition-all duration-300">
        {/* Mobile Filters Trigger */}
        <div className="lg:hidden w-full flex justify-end mb-4 sticky top-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2 shadow-lg w-full sm:w-auto bg-white text-slate-800 border-slate-200 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                Filtres 
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto p-4 sm:p-6">
              <div className="pt-6 pb-20">
                <FormationFilters 
                  filters={filters} 
                  updateFilter={updateFilter} 
                  toggleArrayFilter={toggleArrayFilter} 
                  formations={formations}
                />
                <Button className="w-full mt-6" onClick={handleSearch}>Appliquer et Rechercher</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-1/4 min-w-[300px]">
          <FormationFilters 
            filters={filters} 
            updateFilter={updateFilter} 
            toggleArrayFilter={toggleArrayFilter} 
            formations={formations}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : formations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {formations.map((formation, idx) => (
                <FormationCard 
                  key={formation.id || idx} 
                  formation={formation} 
                  source="france-travail"
                  onViewDetails={() => toast({ title: "En cours", description: "Détails de la formation bientôt disponibles." })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center h-64 shadow-sm">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune formation trouvée</h3>
              <p className="text-slate-500 mb-6 max-w-md text-sm sm:text-base">
                Nous n'avons pas trouvé de formation correspondant à vos critères de recherche. Essayez d'élargir vos secteurs ou votre localisation.
              </p>
              <Button onClick={clearAll} variant="outline" className="shadow-sm">Réinitialiser les filtres</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}