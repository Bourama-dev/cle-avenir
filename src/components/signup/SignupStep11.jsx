import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Bell, Mail } from 'lucide-react';

const SignupStep11 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const updatePreference = (key, value) => {
    handleFieldChange('communicationPreferences', {
      ...(formData.communicationPreferences || {}),
      [key]: value
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Communication</h2>
        <p className="text-slate-500">Restons en contact</p>
      </div>

      <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2"><Bell className="w-4 h-4"/> Notifications</Label>
                <p className="text-xs text-slate-500">Alertes en temps réel sur l'app</p>
            </div>
            <Switch 
                checked={formData.communicationPreferences?.notifications !== false} // Default true
                onCheckedChange={(c) => updatePreference('notifications', c)}
            />
        </div>

        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2"><Mail className="w-4 h-4"/> Newsletter</Label>
                <p className="text-xs text-slate-500">Conseils carrière & actus (Hebdomadaire)</p>
            </div>
            <Switch 
                checked={formData.communicationPreferences?.newsletter || false}
                onCheckedChange={(c) => updatePreference('newsletter', c)}
            />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1 border-slate-200">
          <ArrowLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          Suivant <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SignupStep11;