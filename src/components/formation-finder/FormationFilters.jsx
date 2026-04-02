import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import SectorFilterEnhanced from './SectorFilterEnhanced';
import { MapPin, GraduationCap, MonitorPlay, Award, Star, Euro, Clock, Layers } from 'lucide-react';

export default function FormationFilters({ filters, updateFilter, toggleArrayFilter, formations = [] }) {
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6 sticky top-24">
      <div>
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          Affiner la recherche
        </h3>
      </div>

      <div className="space-y-4">
        {/* Localisation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Localisation
          </label>
          <CityAutocomplete 
            value={filters.ville} 
            onCitySelect={(name, data) => {
              updateFilter('ville', data ? data.Ville : '');
              updateFilter('codePostal', data ? data['Code Postal'] : '');
            }}
            placeholder="Saisir une ville..."
            className="w-full"
          />
        </div>

        <Accordion type="multiple" defaultValue={["sectors", "niveau", "modality"]} className="w-full">
          
          {/* Secteurs (New Enhanced Filter) */}
          <AccordionItem value="sectors" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-400" /> Secteurs d'activité</div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <SectorFilterEnhanced 
                filters={filters} 
                toggleArrayFilter={toggleArrayFilter} 
                updateFilter={updateFilter}
                formations={formations}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Niveau */}
          <AccordionItem value="niveau" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-slate-400" /> Niveau d'études</div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <Select value={filters.niveau || "all"} onValueChange={(val) => updateFilter('niveau', val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="3">CAP / BEP</SelectItem>
                  <SelectItem value="4">Bac / Bac Pro</SelectItem>
                  <SelectItem value="5">Bac +2 (BTS, DUT)</SelectItem>
                  <SelectItem value="6">Bac +3 (Licence, Bachelor)</SelectItem>
                  <SelectItem value="7">Bac +5 (Master, Ingénieur)</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Modalité */}
          <AccordionItem value="modality" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-slate-400" /> Modalité</div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              {['Présentiel', 'Distanciel', 'Hybride'].map(mod => (
                <div key={mod} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mod-${mod}`} 
                    checked={(filters.modality || []).includes(mod)}
                    onCheckedChange={() => toggleArrayFilter('modality', mod)}
                  />
                  <label htmlFor={`mod-${mod}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {mod}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Type & Certif */}
          <AccordionItem value="type" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" /> Certification & Type</div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Formation certifiante</label>
                <Switch 
                  checked={filters.certification} 
                  onCheckedChange={(val) => updateFilter('certification', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Places disponibles</label>
                <Switch 
                  checked={filters.availablePlaces} 
                  onCheckedChange={(val) => updateFilter('availablePlaces', val)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rating & Price */}
          <AccordionItem value="range" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-slate-400" /> Critères avancés</div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-6 pt-2">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">Note minimale</label>
                  <span className="text-sm font-bold text-amber-500">{filters.minRating} ★</span>
                </div>
                <Slider 
                  value={[filters.minRating]} 
                  max={5} step={0.5} 
                  onValueChange={([val]) => updateFilter('minRating', val)} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">Prix maximum</label>
                  <span className="text-sm font-bold text-slate-900">{filters.maxPrice === 10000 ? '10 000€+' : `${filters.maxPrice}€`}</span>
                </div>
                <Slider 
                  value={[filters.maxPrice]} 
                  max={10000} step={100} 
                  onValueChange={([val]) => updateFilter('maxPrice', val)} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}