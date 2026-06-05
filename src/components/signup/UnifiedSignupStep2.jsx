import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const UnifiedSignupStep2 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Qui êtes-vous ?</h2>
        <p className="text-slate-500">Ces informations nous permettent de personnaliser votre expérience.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.first_name}
              onChange={(e) => handleFieldChange('first_name', e.target.value)}
              className={errors.first_name ? "border-red-500 bg-red-50" : ""}
              placeholder="Jean"
            />
            {errors.first_name && <p className="text-xs text-red-500 font-medium">{errors.first_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.last_name}
              onChange={(e) => handleFieldChange('last_name', e.target.value)}
              className={errors.last_name ? "border-red-500 bg-red-50" : ""}
              placeholder="Dupont"
            />
            {errors.last_name && <p className="text-xs text-red-500 font-medium">{errors.last_name}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de naissance</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? "border-red-500 bg-red-50" : ""}
          />
          {errors.dateOfBirth && <p className="text-xs text-red-500 font-medium">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={errors.phone ? "border-red-500 bg-red-50" : ""}
            placeholder="+33 6 12 34 56 78"
          />
          <p className="text-xs text-slate-400">Utilisé uniquement pour la sécurité de votre compte.</p>
          {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={onPrev} className="flex-1 border-slate-200 hover:bg-slate-50 h-12">
          <ArrowLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg h-12">
          Suivant <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UnifiedSignupStep2;