import React from 'react';
import { Ruler } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const RADIUS_OPTIONS = [
  { value: '0', label: 'Localisation exacte (0 km)' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' },
  { value: '100', label: '100 km' },
  { value: '150', label: '150 km' },
  { value: 'null', label: 'Sans limite' } // 'null' string for Select value handling
];

const RadiusFilter = ({ radius, onChange, disabled }) => {
  
  const handleValueChange = (val) => {
    // Convert string 'null' back to actual null, or string number to integer
    const actualValue = val === 'null' ? null : parseInt(val, 10);
    onChange(actualValue);
  };

  // Convert current radius to string for Select component
  const currentValue = radius === null ? 'null' : radius.toString();

  return (
    <div className={cn("space-y-3 radius-filter", disabled && "opacity-60")}>
      <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
        <Ruler className="w-4 h-4 text-slate-500" />
        <span className="radius-info">Rayon de recherche</span>
      </label>
      
      <Select 
        value={currentValue} 
        onValueChange={handleValueChange} 
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white border-slate-200 focus:ring-rose-500/20">
          <SelectValue placeholder="Sélectionner un rayon" />
        </SelectTrigger>
        <SelectContent>
          {RADIUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {disabled && (
        <p className="text-xs text-slate-400 italic">
          Sélectionnez d'abord une ville pour activer le rayon.
        </p>
      )}
    </div>
  );
};

export default RadiusFilter;