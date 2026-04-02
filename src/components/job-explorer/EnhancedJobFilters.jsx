import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import LocationFilter from './filters/LocationFilter';
import RadiusFilter from './filters/RadiusFilter';
import ContractTypeFilter from './filters/ContractTypeFilter';
import ExperienceFilter from './filters/ExperienceFilter';
import RemoteWorkFilter from './filters/RemoteWorkFilter';
import ResetFiltersButton from './filters/ResetFiltersButton';

const EnhancedJobFilters = ({ filters, onFilterChange, resetFilters, onSearch, className }) => {
  
  // Calculate active filters count for the mobile badge
  const activeFiltersCount = 
    (filters.location ? 1 : 0) +
    (filters.radius !== null && filters.location ? 1 : 0) + 
    (filters.teletravauxOnly ? 1 : 0) +
    (filters.contractTypes?.length || 0) + 
    (filters.experiences?.length || 0);

  const handleLocationChange = (loc) => {
    // Ensure we are passing valid data structure
    if (loc && typeof loc === 'object') {
        if (loc.lat) loc.lat = Number(loc.lat);
        if (loc.lon) loc.lon = Number(loc.lon);
    }
    
    // Batch update: set location AND potentially radius if not set
    const updates = { location: loc };
    if (loc && filters.radius === null) {
      updates.radius = 25; // Default radius
    }
    
    onFilterChange(updates);
  };

  // Helper to check if location is valid for radius filter
  const isLocationValid = () => {
      if (!filters.location) return false;
      const lat = Number(filters.location.lat);
      const lon = Number(filters.location.lon);
      return !isNaN(lat) && !isNaN(lon);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <LocationFilter 
          value={filters.location} 
          onLocationChange={handleLocationChange} 
        />
        
        <RadiusFilter 
          radius={filters.radius} 
          onChange={(val) => onFilterChange({ radius: val })}
          disabled={!isLocationValid()}
        />
      </div>

      <RemoteWorkFilter 
        isRemote={filters.teletravauxOnly} 
        onChange={(val) => onFilterChange({ teletravauxOnly: val })}
      />

      <Separator className="bg-slate-100" />

      <ContractTypeFilter 
        selectedTypes={filters.contractTypes} 
        onChange={(types) => onFilterChange({ contractTypes: types })}
      />

      <Separator className="bg-slate-100" />

      <ExperienceFilter 
        selectedLevels={filters.experiences} 
        onChange={(levels) => onFilterChange({ experiences: levels })}
      />

      <Separator className="bg-slate-100" />

      <div className="flex flex-col gap-3">
         <Button 
            onClick={onSearch} 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-md font-bold"
         >
            Appliquer les filtres
         </Button>
         
         <ResetFiltersButton onReset={resetFilters} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-72 shrink-0 ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900">Filtres</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors">
                {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Trigger */}
      <div className="lg:hidden w-full mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-white border-slate-200 shadow-sm h-12">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <Filter className="w-4 h-4" /> Filtres
              </span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-rose-100 text-rose-700 ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-slate-900">Filtres de recherche</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)] pr-4 mt-6">
              <FilterContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default EnhancedJobFilters;