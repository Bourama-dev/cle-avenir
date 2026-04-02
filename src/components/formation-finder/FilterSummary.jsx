import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterSummary({ filters, onRemove, onClear, totalResults }) {
  const activeChips = [];

  if (filters.ville) activeChips.push({ key: 'ville', label: `Ville: ${filters.ville}` });
  if (filters.niveau && filters.niveau !== 'all') activeChips.push({ key: 'niveau', label: `Niveau: ${filters.niveau}` });
  if (filters.format && filters.format !== 'all') activeChips.push({ key: 'format', label: `Format: ${filters.format}` });
  if (filters.certification) activeChips.push({ key: 'certification', label: 'Certifiante' });
  if (filters.availablePlaces) activeChips.push({ key: 'availablePlaces', label: 'Places dispo.' });
  if (filters.minRating > 0) activeChips.push({ key: 'minRating', label: `Note ≥ ${filters.minRating}★` });
  if (filters.maxPrice < 10000) activeChips.push({ key: 'maxPrice', label: `Prix ≤ ${filters.maxPrice}€` });
  
  filters.modality?.forEach(mod => {
    activeChips.push({ key: 'modality', val: mod, label: `Modalité: ${mod}` });
  });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filtres actifs ({activeChips.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {activeChips.map((chip, idx) => (
              <motion.div
                key={`${chip.key}-${chip.val || idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="secondary" className="pl-3 pr-1 py-1 bg-white border-slate-300 shadow-sm text-slate-700 flex items-center gap-1">
                  {chip.label}
                  <button
                    onClick={() => chip.val ? onRemove(chip.key, chip.val) : onRemove(chip.key)}
                    className="hover:bg-slate-200 p-0.5 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
        <div className="text-sm text-slate-600 font-medium">
          <span className="text-primary font-bold">{totalResults}</span> résultats
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-500 hover:text-red-600 h-8">
          Effacer tout
        </Button>
      </div>
    </div>
  );
}