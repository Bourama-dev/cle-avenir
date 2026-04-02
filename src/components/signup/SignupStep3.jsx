import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const regions = [
  "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", 
  "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", 
  "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", 
  "Pays de la Loire", "Provence-Alpes-Côte d'Azur", "Outre-Mer"
];

const SignupStep3 = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Où habitez-vous ?</h2>
        <p className="text-slate-600">Pour vous proposer des formations et offres locales.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="region">Région</Label>
          <select
            id="region"
            className={`flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors?.region ? 'border-red-500' : 'border-slate-200'}`}
            value={data.region || ''}
            onChange={(e) => onChange('region', e.target.value)}
          >
            <option value="" disabled>Sélectionnez une région</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors?.region && <p className="text-sm text-red-500">{errors.region}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            type="text"
            placeholder="Ex: Lyon, Paris, Toulouse..."
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            className={errors?.city ? 'border-red-500' : ''}
          />
          {errors?.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupStep3;