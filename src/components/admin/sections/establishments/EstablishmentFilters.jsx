import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const EstablishmentFilters = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    // Only trigger if value actually changed
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setSearchTerm('');
    onFilterChange({ search: '', type: 'all', region: 'all', sector: 'all', status: 'all' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Rechercher par nom..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="w-full md:w-48">
        <Select value={filters.type} onValueChange={(val) => onFilterChange({ type: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Universite">Université</SelectItem>
            <SelectItem value="Ecole d'ingenieur">École d'ingénieur</SelectItem>
            <SelectItem value="Ecole de commerce">École de commerce</SelectItem>
            <SelectItem value="Lycee">Lycée</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="w-full md:w-48">
        <Select value={filters.status} onValueChange={(val) => onFilterChange({ status: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleReset} className="shrink-0">
        <X className="h-4 w-4 mr-2" /> Réinitialiser
      </Button>
    </div>
  );
};

export default EstablishmentFilters;