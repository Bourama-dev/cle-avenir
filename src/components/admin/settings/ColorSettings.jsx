import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ColorSettings({ settings, onChange }) {
  const handleChange = (e) => {
    onChange('colors', { ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="primary" className="text-sm md:text-base">Couleur Primaire</Label>
          <div className="flex gap-2 w-full">
            <Input 
              type="color" 
              id="primary-picker" 
              name="primary" 
              value={settings.primary || '#4f46e5'} 
              onChange={handleChange} 
              className="w-14 h-12 md:h-10 p-1 cursor-pointer shrink-0"
            />
            <Input 
              type="text" 
              id="primary" 
              name="primary" 
              value={settings.primary || '#4f46e5'} 
              onChange={handleChange} 
              className="flex-1 uppercase font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="secondary" className="text-sm md:text-base">Couleur Secondaire</Label>
          <div className="flex gap-2 w-full">
            <Input 
              type="color" 
              id="secondary-picker" 
              name="secondary" 
              value={settings.secondary || '#f3f4f6'} 
              onChange={handleChange} 
              className="w-14 h-12 md:h-10 p-1 cursor-pointer shrink-0"
            />
            <Input 
              type="text" 
              id="secondary" 
              name="secondary" 
              value={settings.secondary || '#f3f4f6'} 
              onChange={handleChange} 
              className="flex-1 uppercase font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="accent" className="text-sm md:text-base">Couleur d'Accent</Label>
          <div className="flex gap-2 w-full">
            <Input 
              type="color" 
              id="accent-picker" 
              name="accent" 
              value={settings.accent || '#ec4899'} 
              onChange={handleChange} 
              className="w-14 h-12 md:h-10 p-1 cursor-pointer shrink-0"
            />
            <Input 
              type="text" 
              id="accent" 
              name="accent" 
              value={settings.accent || '#ec4899'} 
              onChange={handleChange} 
              className="flex-1 uppercase font-mono text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 border rounded-xl mt-6 bg-[var(--bg-primary)] w-full overflow-hidden">
        <h3 className="font-medium mb-4 text-base md:text-lg">Aperçu en temps réel</h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 w-full">
          <div 
            className="px-4 md:px-6 py-2.5 md:py-2 rounded-lg text-white font-medium shadow-sm flex items-center justify-center min-h-[44px] sm:min-h-[40px] flex-1 sm:flex-none text-center transition-colors" 
            style={{ backgroundColor: settings.primary || '#4f46e5' }}
          >
            Primaire
          </div>
          <div 
            className="px-4 md:px-6 py-2.5 md:py-2 rounded-lg text-slate-800 font-medium shadow-sm border flex items-center justify-center min-h-[44px] sm:min-h-[40px] flex-1 sm:flex-none text-center transition-colors" 
            style={{ backgroundColor: settings.secondary || '#f3f4f6' }}
          >
            Secondaire
          </div>
          <div 
            className="px-4 md:px-6 py-2.5 md:py-2 rounded-lg text-white font-medium shadow-sm flex items-center justify-center min-h-[44px] sm:min-h-[40px] flex-1 sm:flex-none text-center transition-colors" 
            style={{ backgroundColor: settings.accent || '#ec4899' }}
          >
            Accent
          </div>
        </div>
      </div>
    </div>
  );
}