import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { validatePassword } from '@/utils/SignupFormValidation';

const UnifiedSignupStep1 = ({ formData, handleFieldChange, errors, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (formData.password) {
      setStrength(validatePassword(formData.password).strength);
    }
  }, [formData.password]);

  const getStrengthLabel = () => {
    if (strength < 40) return { text: "Faible", color: "bg-red-500" };
    if (strength < 80) return { text: "Moyen", color: "bg-yellow-500" };
    return { text: "Fort", color: "bg-green-500" };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Bienvenue sur CléAvenir
        </h2>
        <p className="text-slate-500 text-lg">
          Créez vos identifiants sécurisés pour commencer
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel ou personnel</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={errors.email ? "border-red-500 bg-red-50" : ""}
            placeholder="jean.dupont@exemple.com"
          />
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              className={`pr-10 ${errors.password ? "border-red-500 bg-red-50" : ""}`}
              placeholder="8+ caractères, majuscule, chiffre"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {formData.password && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${strengthInfo.color}`} 
                  style={{ width: `${strength}%` }} 
                />
              </div>
              <p className="text-xs text-right mt-1 text-slate-500 font-medium">Force: {strengthInfo.text}</p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">Confirmer le mot de passe</Label>
          <Input
            id="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => handleFieldChange('passwordConfirm', e.target.value)}
            className={errors.passwordConfirm ? "border-red-500 bg-red-50" : ""}
            placeholder="Répétez votre mot de passe"
          />
          {errors.passwordConfirm && <p className="text-xs text-red-500 font-medium">{errors.passwordConfirm}</p>}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={onNext} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Continuer <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default UnifiedSignupStep1;