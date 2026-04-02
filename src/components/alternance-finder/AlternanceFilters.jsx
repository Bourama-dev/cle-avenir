import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const jobCategories = [
  { id: 'all', label: 'Tous secteurs' },
  { id: 'technology', label: 'Tech & Digital' },
  { id: 'business', label: 'Commerce & Marketing' },
  { id: 'health', label: 'Santé & Social' },
  { id: 'education', label: 'Éducation' },
];

const levels = [
  { id: 'all', label: 'Tous niveaux' },
  { id: 'Bac+2', label: 'Bac+2' },
  { id: 'Bac+3', label: 'Bac+3' },
  { id: 'Bac+4/5', label: 'Bac+4/5' },
];

const locations = [
  { id: 'all', label: 'Toute la France' },
  { id: 'Paris', label: 'Paris' },
  { id: 'Lyon', label: 'Lyon' },
  { id: 'Télétravail', label: 'Télétravail' },
];

const AlternanceFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (filterName) => (value) => {
    setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? '' : value }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Select onValueChange={handleFilterChange('jobCategory')} value={filters.jobCategory || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Secteur" /></SelectTrigger>
        <SelectContent>
          {jobCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={handleFilterChange('level')} value={filters.level || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Niveau d'études" /></SelectTrigger>
        <SelectContent>
          {levels.map(l => <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={handleFilterChange('location')} value={filters.location || 'all'}>
        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Localisation" /></SelectTrigger>
        <SelectContent>
          {locations.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AlternanceFilters;