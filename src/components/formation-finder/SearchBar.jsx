import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sliders, Sparkles } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onAdvancedClick,
  loading,
  resultCount,
  totalCount
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Rechercher une formation
        </h2>
        {totalCount > 0 && (
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            {resultCount > 0 
              ? `${resultCount} résultats affichés`
              : 'Aucun résultat'
            }
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className={`flex-1 relative transition-all duration-200 ${isFocused ? 'scale-[1.005]' : ''}`}>
          <Search 
            size={20} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${isFocused ? 'text-primary' : 'text-slate-400'}`}
          />
          <Input
            placeholder="Recherchez par nom, domaine, école..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            className="pl-10 h-12 text-base border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
          />
        </div>
        <Button
          onClick={onSearch}
          disabled={loading}
          className="h-12 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-md transition-all active:scale-95 rounded-lg font-semibold"
        >
          {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          onClick={onAdvancedClick}
          variant="outline"
          className="flex items-center gap-2 h-9 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
        >
          <Sliders size={16} />
          Filtres avancés
        </Button>
        
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {[
             { label: 'Informatique', icon: '💻' }, 
             { label: 'Santé', icon: '🏥' }, 
             { label: 'Commerce', icon: '💼' }, 
             { label: 'Ingénieur', icon: '🔧' },
             { label: 'Droit', icon: '⚖️' }
          ].map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => {
                onSearchChange(suggestion.label);
                // We delay search slightly to allow state update
                setTimeout(onSearch, 50);
              }}
              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-full text-xs font-medium text-slate-600 transition-all active:scale-95"
            >
              <span>{suggestion.icon}</span> {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}