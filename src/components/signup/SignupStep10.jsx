import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Monitor, Wallet, FileText } from 'lucide-react';

const SignupStep10 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const updatePreference = (key, value) => {
    handleFieldChange('workPreferences', {
      ...(formData.workPreferences || {}),
      [key]: value
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Vos préférences</h2>
        <p className="text-slate-500">Quel environnement de travail recherchez-vous ?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
           <Label className="flex items-center gap-2"><Monitor className="w-4 h-4"/> Mode de travail</Label>
           <Select 
             value={formData.workPreferences?.remote} 
             onValueChange={(val) => updatePreference('remote', val)}
           >
             <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="office">Présentiel</SelectItem>
               <SelectItem value="hybrid">Hybride</SelectItem>
               <SelectItem value="remote">Full Remote</SelectItem>
               <SelectItem value="any">Peu importe</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <div className="space-y-2">
           <Label className="flex items-center gap-2"><FileText className="w-4 h-4"/> Type de contrat</Label>
           <Select 
             value={formData.workPreferences?.contract} 
             onValueChange={(val) => updatePreference('contract', val)}
           >
             <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="cdi">CDI</SelectItem>
               <SelectItem value="cdd">CDD</SelectItem>
               <SelectItem value="freelance">Freelance</SelectItem>
               <SelectItem value="alternance">Alternance</SelectItem>
               <SelectItem value="internship">Stage</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <div className="space-y-2">
           <Label className="flex items-center gap-2"><Wallet className="w-4 h-4"/> Prétentions salariales (Annuelles)</Label>
           <Select 
             value={formData.workPreferences?.salary} 
             onValueChange={(val) => updatePreference('salary', val)}
           >
             <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="<30k">&lt; 30k€</SelectItem>
               <SelectItem value="30-45k">30k€ - 45k€</SelectItem>
               <SelectItem value="45-60k">45k€ - 60k€</SelectItem>
               <SelectItem value="60k+">&gt; 60k€</SelectItem>
             </SelectContent>
           </Select>
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

export default SignupStep10;