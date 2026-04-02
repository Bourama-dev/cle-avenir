import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GeneralSettings({ settings, onChange }) {
  const handleChange = (e) => {
    onChange('general', { ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-3xl">
      <div className="space-y-2 w-full">
        <Label htmlFor="siteName" className="text-sm md:text-base">Nom du site</Label>
        <Input 
          id="siteName" 
          name="siteName" 
          value={settings.siteName || ''} 
          onChange={handleChange} 
          placeholder="Ex: CléAvenir"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2 w-full">
        <Label htmlFor="logo_url" className="text-sm md:text-base">URL du Logo</Label>
        <Input 
          id="logo_url" 
          name="logo_url" 
          value={settings.logo_url || ''} 
          onChange={handleChange} 
          placeholder="https://..."
          className="w-full"
        />
        {settings.logo_url && (
          <div className="mt-2 p-4 border rounded-lg bg-slate-50 flex items-center justify-center h-24 md:h-32 w-full max-w-sm">
            <img src={settings.logo_url} alt="Logo Preview" className="max-h-full object-contain" />
          </div>
        )}
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="favicon_url" className="text-sm md:text-base">URL du Favicon</Label>
        <Input 
          id="favicon_url" 
          name="favicon_url" 
          value={settings.favicon_url || ''} 
          onChange={handleChange} 
          placeholder="/favicon.svg"
          className="w-full"
        />
      </div>
    </div>
  );
}