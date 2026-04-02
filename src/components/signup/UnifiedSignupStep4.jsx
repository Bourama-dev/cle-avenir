import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, GraduationCap, Briefcase, Search, User, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UnifiedSignupStep4 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const statuses = [
    { id: 'student', label: 'Étudiant', icon: GraduationCap },
    { id: 'job_seeker', label: 'Recherche d\'emploi', icon: Search },
    { id: 'employed', label: 'En poste', icon: Briefcase },
    { id: 'other', label: 'Autre', icon: User },
  ];

  const levels = [
    "Collège", "Lycée", "Bac", "Bac +2", "Bac +3", "Bac +5", "Doctorat"
  ];

  const INTERESTS_LIST = [
    "Technologie", "Santé", "Business", "Art & Design", 
    "Sciences", "Social", "Environnement", "Education"
  ];

  const toggleInterest = (interest) => {
    const current = formData.interests || [];
    const newInterests = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    handleFieldChange('interests', newInterests);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Profil Professionnel</h2>
        <p className="text-slate-500">Aidez-nous à comprendre votre parcours.</p>
      </div>

      <div className="space-y-6">
        {/* Status Selection - Wrapped in RadioGroup */}
        <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-700">Situation actuelle</Label>
            <RadioGroup
                value={formData.status}
                onValueChange={(val) => handleFieldChange('status', val)}
                className="grid grid-cols-2 gap-3"
            >
                {statuses.map((status) => (
                    <div key={status.id}>
                        <RadioGroupItem value={status.id} id={status.id} className="peer sr-only" />
                        <Label
                            htmlFor={status.id}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 h-24 shadow-sm
                            ${formData.status === status.id 
                                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md ring-1 ring-blue-200' 
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }
                            `}
                        >
                            <status.icon className={`w-6 h-6 mb-2 ${formData.status === status.id ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="font-medium text-sm text-center">{status.label}</span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            {errors.status && <p className="text-xs text-red-500 font-medium">{errors.status}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Niveau d'études</Label>
                <Select 
                    value={formData.educationLevel} 
                    onValueChange={(val) => handleFieldChange('educationLevel', val)}
                >
                    <SelectTrigger className={`bg-white border-slate-200 ${errors.educationLevel ? "border-red-500 ring-red-100" : ""}`}>
                        <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.educationLevel && <p className="text-xs text-red-500 font-medium">{errors.educationLevel}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="fieldOfStudy" className="font-semibold text-slate-700">Domaine d'activité / Études</Label>
                <Input
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy || ''}
                    onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value)}
                    placeholder="Ex: Informatique, Commerce..."
                    className="bg-white border-slate-200"
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label className="font-semibold text-slate-700">Centres d'intérêt principaux</Label>
            <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(interest => (
                    <Badge 
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all rounded-lg select-none
                            ${formData.interests?.includes(interest) 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                            }
                        `}
                    >
                        {interest}
                        {formData.interests?.includes(interest) && <Check className="ml-1.5 w-3.5 h-3.5" />}
                    </Badge>
                ))}
            </div>
            {errors.interests && <p className="text-xs text-red-500 font-medium">{errors.interests}</p>}
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

export default UnifiedSignupStep4;