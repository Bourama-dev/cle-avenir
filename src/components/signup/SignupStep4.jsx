import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const educationLevels = ['Collège', 'Seconde', 'Première', 'Terminal', 'Bac+1', 'Bac+2', 'Bac+3+'];
const terminalSpecialties = ['Générale', 'STMG', 'STI2D', 'ST2S', 'Autre'];
const statusOptions = ['Élève', 'Étudiant', 'En recherche d\'emploi', 'Salarié', 'Autre'];

const SignupStep4 = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Votre situation</h2>
        <p className="text-slate-600">Aidez-nous à cibler votre niveau actuel.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="80"
              placeholder="Ex: 18"
              value={data.age || ''}
              onChange={(e) => onChange('age', e.target.value)}
              className={errors?.age ? 'border-red-500 bg-white text-slate-900' : 'bg-white text-slate-900'}
            />
            {errors?.age && <p className="text-sm text-red-500">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_status">Statut actuel</Label>
            <select
              id="current_status"
              className={`flex h-10 w-full items-center justify-between rounded-md border bg-white text-slate-900 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${errors?.current_status ? 'border-red-500' : 'border-slate-200'}`}
              value={data.current_status || ''}
              onChange={(e) => onChange('current_status', e.target.value)}
            >
              <option value="" disabled>Choisir...</option>
              {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors?.current_status && <p className="text-sm text-red-500">{errors.current_status}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education_level">Niveau d'études</Label>
          <select
            id="education_level"
            className={`flex h-10 w-full items-center justify-between rounded-md border bg-white text-slate-900 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${errors?.education_level ? 'border-red-500' : 'border-slate-200'}`}
            value={data.education_level || ''}
            onChange={(e) => {
              onChange('education_level', e.target.value);
              if (e.target.value !== 'Terminal') onChange('education_specialty', '');
            }}
          >
            <option value="" disabled>Niveau actuel ou validé...</option>
            {educationLevels.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors?.education_level && <p className="text-sm text-red-500">{errors.education_level}</p>}
        </div>

        {data.education_level === 'Terminal' && (
          <div className="space-y-2">
            <Label htmlFor="education_specialty">Filière / Spécialité</Label>
            <select
              id="education_specialty"
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              value={data.education_specialty || ''}
              onChange={(e) => onChange('education_specialty', e.target.value)}
            >
              <option value="" disabled>Sélectionnez la spécialité...</option>
              {terminalSpecialties.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Label className="font-semibold text-slate-800">Envisagez-vous des études longues (Bac+5 ou plus) ?</Label>
          <div className="flex gap-6">
            {['Oui', 'Non', 'Indécis'].map(opt => (
              <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="wants_long_studies" 
                  value={opt}
                  checked={data.wants_long_studies === opt}
                  onChange={(e) => onChange('wants_long_studies', e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600"
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
          {errors?.wants_long_studies && <p className="text-sm text-red-500">{errors.wants_long_studies}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupStep4;