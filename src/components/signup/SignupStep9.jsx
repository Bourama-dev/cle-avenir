import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SignupStep9 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Objectifs professionnels</h2>
        <p className="text-slate-500">Décrivez brièvement vos ambitions</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="careerGoals">Mes objectifs</Label>
          <Textarea
            id="careerGoals"
            value={formData.careerGoals}
            onChange={(e) => handleFieldChange('careerGoals', e.target.value)}
            className={`min-h-[150px] resize-none ${errors.careerGoals ? "border-red-500" : ""}`}
            placeholder="Ex: Je souhaite me reconvertir dans le développement web d'ici 6 mois, ou trouver une alternance en marketing..."
          />
          {errors.careerGoals && <p className="text-xs text-red-500">{errors.careerGoals}</p>}
        </div>
        <p className="text-xs text-slate-400">
          Cela aidera notre IA CléAvenir à personnaliser vos recommandations.
        </p>
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

export default SignupStep9;