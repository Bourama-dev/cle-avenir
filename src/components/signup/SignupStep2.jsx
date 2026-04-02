import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignupStep2 = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Qui êtes-vous ?</h2>
        <p className="text-slate-600">Dites-nous comment vous appeler.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            type="text"
            placeholder="Jean"
            value={data.first_name || ''}
            onChange={(e) => onChange('first_name', e.target.value)}
            className={errors?.first_name ? 'border-red-500' : ''}
          />
          {errors?.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            type="text"
            placeholder="Dupont"
            value={data.last_name || ''}
            onChange={(e) => onChange('last_name', e.target.value)}
            className={errors?.last_name ? 'border-red-500' : ''}
          />
          {errors?.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupStep2;