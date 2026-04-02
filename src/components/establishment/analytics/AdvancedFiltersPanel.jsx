import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Save, RotateCcw } from 'lucide-react';

const AdvancedFiltersPanel = ({ filters, onFilterChange }) => {
  return (
    <Card className="shadow-sm border-slate-200 bg-white mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtres Avancés
          </h3>
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onFilterChange({})}><RotateCcw className="h-3 w-3 mr-1" /> Réinitialiser</Button>
            <Button variant="outline" size="sm"><Save className="h-3 w-3 mr-1" /> Sauvegarder</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Période</label>
            <Select value={filters.period || 'all'} onValueChange={(val) => onFilterChange({...filters, period: val})}>
              <SelectTrigger><SelectValue placeholder="Toutes les périodes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Classe</label>
            <Select value={filters.class || 'all'} onValueChange={(val) => onFilterChange({...filters, class: val})}>
              <SelectTrigger><SelectValue placeholder="Toutes les classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                <SelectItem value="Terminal S">Terminal S</SelectItem>
                <SelectItem value="Terminal ES">Terminal ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-500">Profil Dominant</label>
            <Select value={filters.profile || 'all'} onValueChange={(val) => onFilterChange({...filters, profile: val})}>
              <SelectTrigger><SelectValue placeholder="Tous les profils" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les profils</SelectItem>
                <SelectItem value="Analytique">Analytique</SelectItem>
                <SelectItem value="Créatif">Créatif</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-500">Statut</label>
            <Select value={filters.status || 'all'} onValueChange={(val) => onFilterChange({...filters, status: val})}>
              <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFiltersPanel;