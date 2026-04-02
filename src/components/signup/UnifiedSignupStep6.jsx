import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Laptop, Bell, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UnifiedSignupStep6 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const updateWorkPref = (key, value) => {
    handleFieldChange('workPreferences', { ...formData.workPreferences, [key]: value });
  };
  
  const updateCommPref = (key, value) => {
    handleFieldChange('communicationPreferences', { ...formData.communicationPreferences, [key]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Préférences</h2>
        <p className="text-slate-500">Personnalisez votre environnement de travail.</p>
      </div>

      <div className="space-y-6">
        {/* Work Mode - FIXED: Added RadioGroup Wrapper */}
        <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Laptop className="w-5 h-5 text-blue-500"/> Mode de travail
            </Label>
            
            <RadioGroup
                value={formData.workPreferences?.remote}
                onValueChange={(val) => updateWorkPref('remote', val)}
                className="grid grid-cols-3 gap-3"
            >
                {['remote', 'hybrid', 'office'].map((mode) => (
                    <div key={mode}>
                        <RadioGroupItem 
                            value={mode} 
                            id={mode} 
                            className="sr-only peer"
                        />
                        <Label
                            htmlFor={mode}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all h-24 shadow-sm
                                ${formData.workPreferences?.remote === mode 
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-md ring-1 ring-blue-200' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className="capitalize text-sm text-center">
                                {mode === 'office' ? 'Présentiel' : mode === 'remote' ? 'Télétravail' : 'Hybride'}
                            </span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            {errors.remote && <p className="text-xs text-red-500 font-medium">{errors.remote}</p>}
        </div>

        {/* Work Pace */}
        <div className="space-y-2">
            <Label className="font-semibold text-slate-700">Rythme de travail souhaité</Label>
            <Select 
                value={formData.workPreferences?.pace} 
                onValueChange={(val) => updateWorkPref('pace', val)}
            >
                <SelectTrigger className="bg-white border-slate-200 h-11">
                    <SelectValue placeholder="Sélectionner un rythme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="flexible">Flexible / Horaires libres</SelectItem>
                    <SelectItem value="structured">Structuré / Horaires fixes</SelectItem>
                    <SelectItem value="intensive">Intensif / Start-up</SelectItem>
                    <SelectItem value="balanced">Équilibré / Vie pro-perso</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Communication */}
        <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
             <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-orange-100 transition-colors">
                <div className="space-y-0.5">
                    <Label className="text-base font-semibold flex items-center gap-2 text-slate-800">
                        <Bell className="w-5 h-5 text-orange-500"/> Notifications
                    </Label>
                    <p className="text-sm text-slate-500">Alertes jobs et messages importants</p>
                </div>
                <Switch 
                    checked={formData.communicationPreferences?.notifications !== false}
                    onCheckedChange={(c) => updateCommPref('notifications', c)}
                    className="data-[state=checked]:bg-orange-500"
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-purple-100 transition-colors">
                <div className="space-y-0.5">
                    <Label className="text-base font-semibold flex items-center gap-2 text-slate-800">
                        <Mail className="w-5 h-5 text-purple-500"/> Newsletter
                    </Label>
                    <p className="text-sm text-slate-500">Conseils carrière hebdo et actus</p>
                </div>
                <Switch 
                    checked={formData.communicationPreferences?.newsletter || false}
                    onCheckedChange={(c) => updateCommPref('newsletter', c)}
                    className="data-[state=checked]:bg-purple-600"
                />
            </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={onPrev} className="flex-1 border-slate-200 hover:bg-slate-50 h-12 rounded-xl">
          <ArrowLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-200 h-12 rounded-xl transition-all hover:-translate-y-0.5">
          Suivant <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UnifiedSignupStep6;