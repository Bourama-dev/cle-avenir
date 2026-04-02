import { useState, useEffect, useCallback } from 'react';
import { FilterService } from '@/services/analytics/FilterService';

export const useFilters = (contextKey, initialData = []) => {
  const [filters, setFilters] = useState(() => FilterService.loadFiltersFromLocalStorage(contextKey));
  const [filteredData, setFilteredData] = useState(initialData);

  // Auto-save on change
  useEffect(() => {
    FilterService.saveFiltersToLocalStorage(contextKey, filters);
  }, [filters, contextKey]);

  // Apply filters when data or filters change
  useEffect(() => {
    setFilteredData(FilterService.applyFilters(initialData, filters));
  }, [initialData, filters]);

  const addFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilterCount = Object.keys(filters).filter(k => {
    const v = filters[k];
    return v && (!Array.isArray(v) || v.length > 0);
  }).length;

  return {
    filters,
    filteredData,
    addFilter,
    removeFilter,
    clearFilters,
    activeFilterCount
  };
};