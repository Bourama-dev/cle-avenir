import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, X, Plus, Building, Check, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { verifyEstablishmentCode } from '@/services/establishmentCodeValidationService';
import { useToast } from '@/components/ui/use-toast';

const UnifiedSignupStep5 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const [skillInput, setSkillInput] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeStatus, setCodeStatus] = useState(null); // 'success', 'error', 'idle'
  const { toast } = useToast();

  useEffect(() => {
    // Reset status if user changes code manually
    if (codeStatus === 'success' && formData.establishmentCode && formData.establishmentId && !formData.establishmentName) {
         // Keep logic consistent
    }
  }, [formData.establishmentCode]);

  const addSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !(formData.skills || []).includes(cleanSkill)) {
      const newSkills = [...(formData.skills || []), cleanSkill];
      handleFieldChange('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = (formData.skills || []).filter(skill => skill !== skillToRemove);
    handleFieldChange('skills', newSkills);
  };

  const handleVerifyCode = async () => {
    const code = formData.establishmentCode;
    if (!code) return;

    setValidatingCode(true);
    setCodeStatus('validating');

    const result = await verifyEstablishmentCode(code);

    if (result.isValid) {
      setCodeStatus('success');
      handleFieldChange('establishmentId', result.institution.id);
      handleFieldChange('establishmentName', result.institution.name);
      toast({
        title: "Établissement vérifié",
        description: `Lié à : ${result.institution.name} (${result.institution.city || ''})`,
        className: "bg-green-50 border-green-200 text-green-900",
      });
    } else {
      setCodeStatus('error');
      handleFieldChange('establishmentId', null);
      handleFieldChange('establishmentName', null);
      toast({
        variant: "destructive",
        title: "Code invalide",
        description: result.message,
      });
    }
    setValidatingCode(false);
  };

  const handleCodeChange = (e) => {
    const newVal = e.target.value.toUpperCase();
    handleFieldChange('establishmentCode', newVal);
    if (codeStatus !== 'idle') setCodeStatus('idle');
    if (formData.establishmentId) handleFieldChange('establishmentId', null);
  };

  const salaryRange = Array.isArray(formData.salaryRange) && formData.salaryRange.length === 2 
    ? formData.salaryRange 
    : [30, 60];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Compétences & Objectifs</h2>
        <p className="text-slate-500">Définissez vos attentes professionnelles.</p>
      </div>

      <div className="space-y-6">
        {/* Skills Section */}
        <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
            <Label className="text-base font-semibold text-slate-700">Compétences clés</Label>
            <div className="flex gap-2">
                <Input 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
                    placeholder="Ex: Python, Gestion de projet, Anglais..."
                    className="flex-1 border-slate-200 bg-slate-50/50"
                />
                <Button onClick={addSkill} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-sm">
                    <Plus className="w-5 h-5" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] mt-2">
                {(formData.skills || []).length === 0 && (
                    <span className="text-sm text-slate-400 italic">Aucune compétence ajoutée</span>
                )}
                {(formData.skills || []).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 pr-1 pl-3 py-1.5 transition-all shadow-sm">
                        {skill}
                        <button 
                           onClick={() => removeSkill(skill)} 
                           className="ml-2 hover:bg-white hover:text-red-500 p-0.5 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>

        {/* Career Goals */}
        <div className="space-y-2 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
            <Label htmlFor="careerGoals" className="text-base font-semibold text-slate-700">Objectifs professionnels</Label>
            <Textarea
                id="careerGoals"
                value={formData.careerGoals || ''}
                onChange={(e) => handleFieldChange('careerGoals', e.target.value)}
                className={`min-h-[100px] resize-none focus:ring-blue-500 bg-slate-50/50 ${errors.careerGoals ? "border-red-500" : "border-slate-200"}`}
                placeholder="Décrivez brièvement vos ambitions, le type de poste recherché..."
            />
            {errors.careerGoals && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.careerGoals}</p>}
        </div>

        {/* Salary Slider */}
        <div className="space-y-4 pt-2 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold text-slate-700">Prétentions salariales (k€/an)</Label>
                <Badge variant="outline" className="text-sm font-bold text-blue-600 bg-blue-50 border-blue-200 px-3 py-1">
                    {salaryRange[0]}k€ - {salaryRange[1]}k€
                </Badge>
            </div>
            <Slider
                defaultValue={[30, 60]}
                value={salaryRange}
                min={20}
                max={150}
                step={2}
                onValueChange={(val) => handleFieldChange('salaryRange', val)}
                className="py-4"
            />
        </div>

        {/* Establishment Code */}
        <div className="space-y-3 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1.5 bg-indigo-100 rounded-lg">
                   <Building className="w-5 h-5 text-indigo-600" />
               </div>
               <Label htmlFor="establishmentCode" className="text-base font-bold text-indigo-900">Code d'établissement (Optionnel)</Label>
            </div>
            
            <p className="text-sm text-indigo-700/80 mb-3 leading-relaxed">
               Si vous rejoignez via une école ou une entreprise, saisissez le code fourni pour lier votre compte.
            </p>

            <div className="flex gap-2 relative">
                <Input 
                   id="establishmentCode"
                   value={formData.establishmentCode || ''}
                   onChange={handleCodeChange}
                   placeholder="Ex: EST-2024-ABC"
                   className={`bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200 text-indigo-900 font-mono tracking-wide shadow-sm h-11 ${
                       codeStatus === 'success' ? 'border-green-400 ring-green-100' : 
                       codeStatus === 'error' ? 'border-red-400 ring-red-100' : ''
                   }`}
                />
                <Button 
                   onClick={handleVerifyCode} 
                   disabled={validatingCode || !formData.establishmentCode}
                   className={`min-w-[100px] h-11 transition-all shadow-sm ${
                       codeStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                       'bg-indigo-600 hover:bg-indigo-700'
                   }`}
                >
                   {validatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                    codeStatus === 'success' ? <Check className="w-5 h-5" /> : "Vérifier"}
                </Button>
            </div>

            {codeStatus === 'success' && formData.establishmentName && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1 mt-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Lié à : <strong>{formData.establishmentName}</strong></span>
                </div>
            )}
            
            {errors.establishmentCode && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3"/> {errors.establishmentCode}
                </p>
            )}
        </div>

        {/* Relocation */}
        <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => handleFieldChange('willingToRelocate', !formData.willingToRelocate)}>
            <div className="flex-1 pr-4">
                <span className="block font-semibold text-slate-800 mb-0.5 group-hover:text-blue-700 transition-colors">Mobilité géographique</span>
                <span className="text-sm text-slate-500 font-normal">Êtes-vous prêt à déménager pour une opportunité ?</span>
            </div>
            <Switch
                id="relocation"
                checked={formData.willingToRelocate || false}
                onCheckedChange={(checked) => handleFieldChange('willingToRelocate', checked)}
                className="data-[state=checked]:bg-blue-600"
            />
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

export default UnifiedSignupStep5;