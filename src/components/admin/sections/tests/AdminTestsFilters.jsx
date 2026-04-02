import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const AdminTestsFilters = ({ filters, setFilters, onReset }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const activeFiltersCount = [
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    filters.minScore > 0,
    filters.status !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
          
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-36"
              aria-label="Date de début"
            />
            <span className="text-slate-400">-</span>
            <Input 
              type="date" 
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-36"
              aria-label="Date de fin"
            />
          </div>

          {/* Toggle Advanced Filters Button */}
          <Button 
            variant={showAdvancedFilters ? "secondary" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2 relative min-w-[100px]"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-slate-900 text-white text-[10px] ml-1">
                {activeFiltersCount}
              </Badge>
            )}
            {showAdvancedFilters ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </Button>

          {/* Reset */}
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="icon" onClick={onReset} title="Réinitialiser">
              <RotateCcw className="h-4 w-4 text-slate-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Inline Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Score minimum</Label>
                  <span className="text-sm text-slate-500 font-medium">{filters.minScore}%</span>
                </div>
                <Slider
                  defaultValue={[filters.minScore]}
                  value={[filters.minScore]}
                  max={100}
                  step={5}
                  onValueChange={(vals) => setFilters(prev => ({ ...prev, minScore: vals[0] }))}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Statut du test</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="completed">Complété</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="failed">Abandonné/Échoué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestsFilters;