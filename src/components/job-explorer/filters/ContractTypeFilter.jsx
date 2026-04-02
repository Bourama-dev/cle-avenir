import React from 'react';
import { FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CONTRACT_TYPES = ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance', 'Intérim'];

const ContractTypeFilter = ({ selectedTypes = [], onChange }) => {
  const handleToggle = (type) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
        <FileText className="w-4 h-4 text-slate-500" />
        Type de contrat
      </label>
      <div className="space-y-2">
        {CONTRACT_TYPES.map((type) => (
          <div key={type} className="flex items-center space-x-2 group">
            <Checkbox
              id={`contract-${type}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleToggle(type)}
              className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 border-slate-300"
            />
            <Label
              htmlFor={`contract-${type}`}
              className="text-sm text-slate-600 cursor-pointer group-hover:text-slate-900 transition-colors"
            >
              {type}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTypeFilter;