import React from 'react';
import { X, Check } from 'lucide-react';
import DiplomaSearch from './DiplomaSearch';
import { formatDiplomaLevel, getDiplomaColor } from '@/utils/diplomaUtils';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const DiplomaSelector = ({ selectedDiplomas = [], onChange }) => {
  
  const handleAdd = (diploma) => {
    // Prevent duplicates
    if (selectedDiplomas.some(d => d.id === diploma.id)) return;
    onChange([...selectedDiplomas, { ...diploma, status: 'obtained' }]);
  };

  const handleRemove = (id) => {
    onChange(selectedDiplomas.filter(d => d.id !== id));
  };

  const toggleStatus = (id) => {
    onChange(selectedDiplomas.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'obtained' ? 'in_progress' : 'obtained' };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Rechercher et ajouter vos diplômes</Label>
        <DiplomaSearch onSelect={handleAdd} placeholder="Ex: Baccalauréat Scientifique..." />
      </div>

      {selectedDiplomas.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500 uppercase tracking-wide">
            Diplômes sélectionnés ({selectedDiplomas.length})
          </Label>
          <div className="flex flex-col gap-2">
            {selectedDiplomas.map((diploma) => (
              <div 
                key={diploma.id}
                className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
              >
                <div>
                  <div className="font-medium text-sm text-slate-900">{diploma.name}</div>
                  <div className="flex gap-2 mt-1">
                     <Badge variant="outline" className={`text-[10px] font-normal ${getDiplomaColor(diploma.level)}`}>
                        {formatDiplomaLevel(diploma.level)}
                     </Badge>
                     {diploma.sector && (
                        <span className="text-[10px] text-slate-400 flex items-center">{diploma.sector}</span>
                     )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStatus(diploma.id)}
                    className={`
                      text-xs px-2 py-1 rounded-full border transition-colors
                      ${diploma.status === 'obtained' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'}
                    `}
                  >
                    {diploma.status === 'obtained' ? 'Obtenu' : 'En cours'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(diploma.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiplomaSelector;