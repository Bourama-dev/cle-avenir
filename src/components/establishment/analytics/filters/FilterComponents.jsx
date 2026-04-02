import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FilterBar = ({ onApply }) => (
  <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200 mb-6 items-end">
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500">Période</label>
      <Select defaultValue="month">
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Période" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Ce mois</SelectItem>
          <SelectItem value="quarter">Ce trimestre</SelectItem>
          <SelectItem value="year">Cette année</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500">Niveau</label>
      <Select defaultValue="all">
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Niveau" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les niveaux</SelectItem>
          <SelectItem value="seconde">Seconde</SelectItem>
          <SelectItem value="premiere">Première</SelectItem>
          <SelectItem value="terminale">Terminale</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button onClick={onApply} className="ml-auto">Appliquer les filtres</Button>
  </div>
);