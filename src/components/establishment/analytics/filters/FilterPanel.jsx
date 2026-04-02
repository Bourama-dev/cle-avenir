import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export const FilterPanel = ({ filters, onAddFilter, onClear }) => {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Filtres appliqués",
      description: "Les données ont été mises à jour selon vos critères.",
      duration: 3000,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/50 backdrop-blur-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres Avancés
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filtres d'Analyse</SheetTitle>
          <SheetDescription>Affinez les données par période, niveau ou statut.</SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Période</label>
            <Select value={filters.period || "all"} onValueChange={(val) => onAddFilter('period', val === 'all' ? null : val)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner une période" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Niveau d'étude</label>
            <Select value={filters.level || "all"} onValueChange={(val) => onAddFilter('level', val === 'all' ? null : val)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un niveau" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="seconde">Seconde</SelectItem>
                <SelectItem value="premiere">Première</SelectItem>
                <SelectItem value="terminale">Terminale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
             <label className="text-sm font-medium">Statut d'engagement</label>
             <Select value={filters.status || "all"} onValueChange={(val) => onAddFilter('status', val === 'all' ? null : val)}>
              <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="at_risk">À risque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6 flex gap-3">
            <Button className="flex-1" onClick={handleApply}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Appliquer
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClear}>
              Réinitialiser
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};