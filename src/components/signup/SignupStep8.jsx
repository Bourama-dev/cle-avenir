import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SignupStep8 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      const newSkills = [...(formData.skills || []), skillInput.trim()];
      handleFieldChange('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = formData.skills.filter(skill => skill !== skillToRemove);
    handleFieldChange('skills', newSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Vos compétences</h2>
        <p className="text-slate-500">Quels sont vos savoir-faire actuels ?</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Gestion de projet, Python, Anglais..."
            className="flex-1"
          />
          <Button onClick={addSkill} variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 rounded-xl border border-slate-200">
          {(!formData.skills || formData.skills.length === 0) && (
            <p className="text-slate-400 text-sm italic w-full text-center py-4">
              Aucune compétence ajoutée pour le moment
            </p>
          )}
          {formData.skills?.map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="bg-white border border-blue-200 text-blue-700 py-1.5 px-3">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
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

export default SignupStep8;