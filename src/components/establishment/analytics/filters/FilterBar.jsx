import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const FilterBar = ({ filters, onRemove, onClear, resultCount, onTogglePanel }) => {
  const activeKeys = Object.keys(filters).filter(k => filters[k] && (!Array.isArray(filters[k]) || filters[k].length > 0));

  if (activeKeys.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-white/70 backdrop-blur-md rounded-xl border border-slate-200/50 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Filtres actifs:</span>
      </div>
      
      {activeKeys.map(key => {
        const val = filters[key];
        const displayVal = Array.isArray(val) ? val.join(', ') : val;
        
        return (
          <Badge key={key} variant="secondary" className="px-3 py-1 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700">
            <span className="capitalize">{key}:</span> <span className="font-semibold">{displayVal}</span>
            <button onClick={() => onRemove(key)} className="ml-1 hover:text-red-500 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-500">{resultCount} résultats</span>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-500 hover:text-red-600">
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};