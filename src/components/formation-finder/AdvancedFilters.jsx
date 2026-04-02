import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ChevronDown, Check } from 'lucide-react';

const TYPES_FORMATION = [
  'BTS', 'BUT', 'Licence', 'Master', 'Diplôme d\'ingénieur', 'École de commerce', 'CPGE', 'Diplôme d\'État'
];

const REGIONS = [
  'Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Provence-Alpes-Côte d\'Azur',
  'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France',
  'Normandie', 'Pays de la Loire'
];

const DOMAINES = [
  'Informatique', 'Santé', 'Commerce', 'Ingénierie', 'Droit', 'Sciences', 'Lettres', 'Arts',
  'Tourisme', 'Hôtellerie', 'Transport', 'Environnement'
];

export default function AdvancedFilters({
  isOpen, onClose, filters, onFiltersChange, onApply
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    localisation: true, formation: true, domaine: false
  });

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      q: '', ville: '', codePostal: '', type: '', niveau: '', selectivite: '', region: '', domaine: ''
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(localFilters).filter(v => v).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center z-10 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">🔍 Filtres avancés</h2>
            {activeFiltersCount > 0 && (
              <p className="text-primary text-sm font-medium">{activeFiltersCount} filtre(s) actif(s)</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Section Localisation */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => toggleSection('localisation')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">📍 Localisation</h3>
              <ChevronDown size={20} className={`transition-transform duration-300 text-slate-500 ${expandedSections.localisation ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSections.localisation && (
              <div className="border-t border-slate-200 p-4 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville</label>
                    <Input placeholder="Ex: Paris" value={localFilters.ville} onChange={(e) => handleChange('ville', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Code postal</label>
                    <Input placeholder="Ex: 75001" value={localFilters.codePostal} onChange={(e) => handleChange('codePostal', e.target.value)} maxLength="5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Région</label>
                  <Select value={localFilters.region} onValueChange={(val) => handleChange('region', val === 'all' ? '' : val)}>
                    <SelectTrigger><SelectValue placeholder="Toutes les régions" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {REGIONS.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Section Formation */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => toggleSection('formation')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">🎓 Formation</h3>
              <ChevronDown size={20} className={`transition-transform duration-300 text-slate-500 ${expandedSections.formation ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSections.formation && (
              <div className="border-t border-slate-200 p-4 space-y-4 bg-white">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">Mots-clés</label>
                   <Input placeholder="Nom de la formation..." value={localFilters.q} onChange={(e) => handleChange('q', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de formation</label>
                    <Select value={localFilters.type} onValueChange={(val) => handleChange('type', val === 'all' ? '' : val)}>
                      <SelectTrigger><SelectValue placeholder="Tous les types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {TYPES_FORMATION.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
              </div>
            )}
          </div>

          {/* Section Domaine */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => toggleSection('domaine')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">📚 Domaine</h3>
              <ChevronDown size={20} className={`transition-transform duration-300 text-slate-500 ${expandedSections.domaine ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSections.domaine && (
              <div className="border-t border-slate-200 p-4 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  {DOMAINES.map(domaine => (
                    <label key={domaine} className={`flex items-center gap-2 cursor-pointer p-2 rounded transition border ${localFilters.domaine === domaine ? 'bg-primary/5 border-primary text-primary' : 'border-transparent hover:bg-slate-50'}`}>
                      <input type="radio" name="domaine" checked={localFilters.domaine === domaine} onChange={() => handleChange('domaine', domaine)} className="sr-only" />
                      {localFilters.domaine === domaine && <Check size={14} />}
                      <span className="text-sm font-medium">{domaine}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded transition border hover:bg-slate-50 col-span-2 justify-center text-slate-500 text-sm">
                      <input type="radio" name="domaine" checked={localFilters.domaine === ''} onChange={() => handleChange('domaine', '')} className="sr-only" />
                      Tout afficher
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-5 flex gap-3 justify-end rounded-b-xl z-10">
          <Button onClick={handleReset} variant="outline" className="text-slate-600">Réinitialiser</Button>
          <Button onClick={handleApply} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
}