import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import { MapPin, Briefcase, GraduationCap, Layers, MapIcon, Wifi } from 'lucide-react';

const EnhancedFormationFilters = ({
  searchTerm,
  cityInputValue,
  selectedCityData,
  sectorFilter,
  levelFilter,
  formationTypeFilter,
  distanceFilter,
  remoteFilter,
  onSearchTermChange,
  onCityChange,
  onSectorChange,
  onLevelChange,
  onFormationTypeChange,
  onDistanceChange,
  onRemoteChange,
  onSearch,
  onReset,
  className
}) => {

  // Calculate active filters count
  const activeFiltersCount =
    (selectedCityData ? 1 : 0) +
    (selectedCityData && distanceFilter !== '100' ? 1 : 0) +
    (remoteFilter ? 1 : 0) +
    (sectorFilter !== 'all' ? 1 : 0) +
    (levelFilter !== 'all' ? 1 : 0) +
    (formationTypeFilter !== 'all' ? 1 : 0);

  const availableLevels = ['BAC+2', 'BAC+3', 'BAC+5', 'AUTRE'];
  const availableTypes = ['Initial', 'Alternance'];
  const availableSectors = [
    { value: 'commerce', label: 'Commerce & Vente' },
    { value: 'informatique', label: 'Informatique & Numérique' },
    { value: 'sante', label: 'Santé & Social' },
  ];
  const availableDistances = [
    { value: '10', label: '10 km' },
    { value: '30', label: '30 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-slate-500" />
            Localisation
          </label>
          <CityAutocomplete
            value={cityInputValue}
            onCitySelect={onCityChange}
            placeholder="Ville..."
            className="w-full"
          />
        </div>

        {selectedCityData && (
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <MapIcon className="w-4 h-4 text-slate-500" />
              Rayon de recherche
            </label>
            <Select value={distanceFilter} onValueChange={onDistanceChange}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDistances.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Briefcase className="w-4 h-4 text-slate-500" />
          Secteur
        </label>
        <Select value={sectorFilter} onValueChange={onSectorChange}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous secteurs</SelectItem>
            {availableSectors.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <GraduationCap className="w-4 h-4 text-slate-500" />
          Niveau
        </label>
        <Select value={levelFilter} onValueChange={onLevelChange}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous niveaux</SelectItem>
            {availableLevels.map(l => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Layers className="w-4 h-4 text-slate-500" />
          Format
        </label>
        <Select value={formationTypeFilter} onValueChange={onFormationTypeChange}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous formats</SelectItem>
            {availableTypes.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Wifi className="w-4 h-4 text-slate-500" />
          Distance
        </label>
        <Button
          onClick={() => onRemoteChange(!remoteFilter)}
          variant={remoteFilter ? "default" : "outline"}
          className={`w-full justify-start ${remoteFilter ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-white border-slate-200'}`}
        >
          <input
            type="checkbox"
            checked={remoteFilter}
            onChange={() => onRemoteChange(!remoteFilter)}
            className="mr-2"
          />
          Formation à distance
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      <div className="flex flex-col gap-3">
        <Button
          onClick={onSearch}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md font-bold"
        >
          Appliquer les filtres
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Réinitialiser
        </Button>
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
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors">
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
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 ml-2">
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

export default EnhancedFormationFilters;
