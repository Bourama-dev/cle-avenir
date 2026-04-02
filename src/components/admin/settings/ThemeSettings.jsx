import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ThemeSettings({ settings, onChange }) {
  const handleValueChange = (value) => {
    onChange('theme', { ...settings, mode: value });
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-3xl">
      <div className="space-y-4 w-full">
        <Label className="text-sm md:text-base">Mode du Thème par défaut</Label>
        <RadioGroup value={settings.mode || 'light'} onValueChange={handleValueChange} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
          <div className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors min-h-[60px]">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="cursor-pointer flex-1 text-sm md:text-base">Clair</Label>
          </div>
          <div className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors min-h-[60px]">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="cursor-pointer flex-1 text-sm md:text-base">Sombre</Label>
          </div>
          <div className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors min-h-[60px] sm:col-span-2 md:col-span-1">
            <RadioGroupItem value="auto" id="theme-auto" />
            <Label htmlFor="theme-auto" className="cursor-pointer flex-1 text-sm md:text-base">Auto (Système)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}