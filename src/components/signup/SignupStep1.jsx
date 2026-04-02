import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignupStep1 = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Créez votre compte</h2>
        <p className="text-slate-600">Commençons par vos identifiants de connexion.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jean.dupont@exemple.com"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className={errors?.email ? 'border-red-500' : ''}
          />
          {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={data.password || ''}
            onChange={(e) => onChange('password', e.target.value)}
            className={errors?.password ? 'border-red-500' : ''}
          />
          <p className="text-xs text-slate-500">8 caractères minimum</p>
          {errors?.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={data.confirmPassword || ''}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className={errors?.confirmPassword ? 'border-red-500' : ''}
          />
          {errors?.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupStep1;