export const FilterService = {
  getStorageKey: (context) => `cleavenir_filters_${context}`,

  saveFiltersToLocalStorage: (context, filters) => {
    try {
      localStorage.setItem(FilterService.getStorageKey(context), JSON.stringify(filters));
    } catch (e) {
      console.error('Error saving filters', e);
    }
  },

  loadFiltersFromLocalStorage: (context) => {
    try {
      const stored = localStorage.getItem(FilterService.getStorageKey(context));
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error loading filters', e);
      return {};
    }
  },

  applyFilters: (data, filters) => {
    if (!data || !Array.isArray(data)) return [];
    if (!filters || Object.keys(filters).length === 0) return data;

    return data.filter(item => {
      // AND logic: all active filters must match
      for (const [key, value] of Object.entries(filters)) {
        if (!value || (Array.isArray(value) && value.length === 0)) continue;
        
        // Search filter (text match across object)
        if (key === 'search' && typeof value === 'string') {
          const searchLower = value.toLowerCase();
          const matchesSearch = Object.values(item).some(val => 
            String(val).toLowerCase().includes(searchLower)
          );
          if (!matchesSearch) return false;
          continue;
        }

        // Array inclusion (e.g., classes: ['Terminale', 'Première'])
        if (Array.isArray(value)) {
          if (!value.includes(item[key])) return false;
        } 
        // Direct match
        else if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
};