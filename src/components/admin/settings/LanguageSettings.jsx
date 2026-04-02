import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LanguageSettings({ settings, onChange }) {
  const handleValueChange = (value) => {
    onChange('language', { ...settings, default: value });
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-2xl">
      <div className="space-y-2 w-full">
        <Label className="text-sm md:text-base">Langue par défaut du système</Label>
        <Select value={settings.default || 'fr'} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full md:w-[320px] bg-[var(--bg-primary)] h-12 md:h-10 text-base md:text-sm">
            <SelectValue placeholder="Sélectionnez une langue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr" className="min-h-[40px]">Français (FR)</SelectItem>
            <SelectItem value="en" className="min-h-[40px]">English (EN)</SelectItem>
            <SelectItem value="es" className="min-h-[40px]">Español (ES)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
          Cette langue sera utilisée comme fallback si la langue du navigateur de l'utilisateur n'est pas supportée.
        </p>
      </div>
    </div>
  );
}