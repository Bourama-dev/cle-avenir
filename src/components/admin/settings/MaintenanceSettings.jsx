import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function MaintenanceSettings({ settings, onChange }) {
  const handleChange = (e) => {
    onChange('maintenance', { ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = (checked) => {
    onChange('maintenance', { ...settings, enabled: checked });
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 md:p-5 shadow-sm w-full bg-[var(--bg-secondary)]">
        <div className="space-y-1">
          <Label className="text-base font-medium">Mode Maintenance</Label>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Activez ce mode pour bloquer l'accès au site aux utilisateurs non-administrateurs.
          </p>
        </div>
        <div className="shrink-0 self-end sm:self-auto">
           <Switch 
             checked={settings.enabled || false} 
             onCheckedChange={handleToggle}
           />
        </div>
      </div>
      
      <div className="space-y-2 w-full">
        <Label htmlFor="message" className="text-sm md:text-base">Message de Maintenance</Label>
        <Textarea 
          id="message" 
          name="message" 
          value={settings.message || ''} 
          onChange={handleChange} 
          rows={4}
          placeholder="Le site est actuellement en maintenance..."
          className="w-full resize-y min-h-[100px]"
        />
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="eta" className="text-sm md:text-base">Temps de retour estimé (ETA)</Label>
        <Input 
          id="eta" 
          name="eta" 
          value={settings.eta || ''} 
          onChange={handleChange} 
          placeholder="Ex: Aujourd'hui à 18h00"
          className="w-full"
        />
      </div>
    </div>
  );
}