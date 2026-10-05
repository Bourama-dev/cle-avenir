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

// Defined outside the parent component so React never treats it as a new type
// on re-render — avoids unmounting LocationFilter (and losing its state) whenever
// any filter changes.
const FilterPanel = ({
  filters,
  onFilterChange,
  resetFilters,
  onSearch,
  handleLocationChange,
  isLocationValid,
}) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <LocationFilter
        value={filters.location}
        onLocationChange={handleLocationChange}
      />

      <RadiusFilter
        radius={filters.radius}
        onChange={(val) => onFilterChange({ radius: val })}
        disabled={!isLocationValid}
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

const EnhancedJobFilters = ({ filters, onFilterChange, resetFilters, onSearch, className }) => {

  const activeFiltersCount =
    (filters.location ? 1 : 0) +
    (filters.radius !== null && filters.location ? 1 : 0) +
    (filters.teletravauxOnly ? 1 : 0) +
    (filters.contractTypes?.length || 0) +
    (filters.experiences?.length || 0);

  const handleLocationChange = (loc) => {
    if (loc && typeof loc === 'object') {
      if (loc.lat) loc.lat = Number(loc.lat);
      if (loc.lon) loc.lon = Number(loc.lon);
    }

    const updates = { location: loc };
    if (loc && filters.radius === null) {
      updates.radius = 25;
    }

    onFilterChange(updates);
  };

  // Valid if location has an inseeCode (sufficient for the France Travail API)
  // or has non-NaN coordinates for the client-side distance calculation.
  const isLocationValid =
    !!filters.location?.inseeCode ||
    (!isNaN(Number(filters.location?.lat)) && !isNaN(Number(filters.location?.lon)) && filters.location != null);

  const panelProps = {
    filters,
    onFilterChange,
    resetFilters,
    onSearch,
    handleLocationChange,
    isLocationValid,
  };

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
          <FilterPanel {...panelProps} />
        </div>
      </div>

      {/* Mobile trigger: floating pill + bottom sheet */}
      <div className="lg:hidden fixed right-4 z-30 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)]">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-12 rounded-full px-5 gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-xl dark:bg-white dark:text-slate-900">
              <Filter className="w-4 h-4" /> Filtres
              {activeFiltersCount > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[88dvh] p-0 flex flex-col">
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-slate-300 shrink-0" />
            <SheetHeader className="px-5 pt-3 text-left">
              <SheetTitle className="text-xl font-bold text-slate-900">Filtres</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 min-h-0 px-5 pt-4 pb-safe">
              <div className="pb-6"><FilterPanel {...panelProps} /></div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default EnhancedJobFilters;
