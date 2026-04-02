import { useState, useCallback, useMemo, useEffect } from 'react';

const DEFAULT_FILTERS = {
  query: '',
  ville: '',
  codePostal: '',
  niveau: '',
  format: '',
  modality: [],
  sectors: [],
  certification: false,
  availablePlaces: false,
  minRating: 0,
  maxPrice: 10000,
  maxDuration: 24, // months
  languages: [],
};

export function useFormationFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('formation_filters');
    return saved ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) } : { ...DEFAULT_FILTERS, ...initialFilters };
  });

  useEffect(() => {
    localStorage.setItem('formation_filters', JSON.stringify(filters));
  }, [filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, query: filters.query }); // keep search query
  }, [filters.query]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.ville) count++;
    if (filters.niveau && filters.niveau !== 'all') count++;
    if (filters.format && filters.format !== 'all') count++;
    if (filters.modality?.length > 0) count += filters.modality.length;
    if (filters.sectors?.length > 0) count += filters.sectors.length;
    if (filters.certification) count++;
    if (filters.availablePlaces) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxPrice < 10000) count++;
    if (filters.languages?.length > 0) count += filters.languages.length;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleArrayFilter,
    removeFilter,
    clearAll,
    activeFilterCount,
    setFilters
  };
}