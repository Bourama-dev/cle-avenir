import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Search, X, CheckSquare, Square } from 'lucide-react';
import { SECTORS, SECTOR_CATEGORIES } from '@/constants/sectors';
import { getSectorIcon, getSectorColor, getFormationCountBySector } from '@/utils/sectorUtils';

export default function SectorFilterEnhanced({ filters, toggleArrayFilter, updateFilter, formations = [] }) {
  const [search, setSearch] = useState('');
  
  const filteredSectors = useMemo(() => {
    if (!search.trim()) return SECTORS;
    const term = search.toLowerCase();
    return SECTORS.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.description.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  }, [search]);

  const sectorsByCategory = useMemo(() => {
    const grouped = {};
    SECTOR_CATEGORIES.forEach(cat => {
      grouped[cat] = filteredSectors.filter(s => s.category === cat);
    });
    return grouped;
  }, [filteredSectors]);

  const selectedSectors = filters.sectors || [];
  
  const handleSelectAll = () => {
    updateFilter('sectors', SECTORS.map(s => s.id));
  };

  const handleClearAll = () => {
    updateFilter('sectors', []);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <Input 
          placeholder="Rechercher un secteur..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center px-1">
        <Badge variant="secondary">{selectedSectors.length} sélectionné(s)</Badge>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-7 text-xs px-2">
            <CheckSquare className="w-3 h-3 mr-1" /> Tous
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-7 text-xs px-2 text-slate-500 hover:text-red-600">
            <Square className="w-3 h-3 mr-1" /> Aucun
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-3 -mr-3">
        <Accordion type="multiple" defaultValue={SECTOR_CATEGORIES} className="space-y-2">
          {SECTOR_CATEGORIES.map(category => {
            const catSectors = sectorsByCategory[category];
            if (!catSectors || catSectors.length === 0) return null;
            
            const selectedCount = catSectors.filter(s => selectedSectors.includes(s.id)).length;

            return (
              <AccordionItem key={category} value={category} className="border rounded-lg px-3 bg-white shadow-sm">
                <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold text-slate-800">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span>{category}</span>
                    {selectedCount > 0 && (
                      <Badge variant="default" className="ml-2 h-5 bg-blue-600">{selectedCount}</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3 space-y-2">
                  {catSectors.map(sector => {
                    const isSelected = selectedSectors.includes(sector.id);
                    const count = getFormationCountBySector(formations, sector.id);
                    
                    return (
                      <div 
                        key={sector.id} 
                        className={`flex items-start space-x-3 p-2 rounded-md transition-colors hover:bg-slate-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                      >
                        <Checkbox 
                          id={`sector-${sector.id}`} 
                          checked={isSelected}
                          onCheckedChange={() => toggleArrayFilter('sectors', sector.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 cursor-pointer" onClick={() => toggleArrayFilter('sectors', sector.id)}>
                          <label htmlFor={`sector-${sector.id}`} className="text-sm font-medium leading-none cursor-pointer flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {getSectorIcon(sector.id, `w-4 h-4 ${sector.color}`)}
                              {sector.name}
                            </span>
                            {count > 0 && <span className="text-xs text-slate-400 font-normal">{count}</span>}
                          </label>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{sector.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}