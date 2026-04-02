import React from 'react';
import { Briefcase } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const EXPERIENCE_LEVELS = [
  { label: 'Débutant', value: '0' },
  { label: '1-3 ans', value: '1' },
  { label: '3-5 ans', value: '2' },
  { label: '5-10 ans', value: '3' },
  { label: 'Senior', value: '4' },
];

const ExperienceFilter = ({ selectedLevels = [], onChange }) => {
  const handleToggle = (value) => {
    if (selectedLevels.includes(value)) {
      onChange(selectedLevels.filter((v) => v !== value));
    } else {
      onChange([...selectedLevels, value]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
        <Briefcase className="w-4 h-4 text-slate-500" />
        Expérience
      </label>
      <div className="space-y-2">
        {EXPERIENCE_LEVELS.map((level) => (
          <div key={level.value} className="flex items-center space-x-2 group">
            <Checkbox
              id={`exp-${level.value}`}
              checked={selectedLevels.includes(level.value)}
              onCheckedChange={() => handleToggle(level.value)}
              className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 border-slate-300"
            />
            <Label
              htmlFor={`exp-${level.value}`}
              className="text-sm text-slate-600 cursor-pointer group-hover:text-slate-900 transition-colors"
            >
              {level.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceFilter;