import React from 'react';
import { Label } from '@/components/ui/label';

const domains = [
  'Commerce/Vente', 'Informatique', 'Santé', 'Éducation', 
  'Ingénierie', 'Droit', 'Ressources Humaines', 'Marketing', 
  'Finance', 'Autre'
];

const SignupStep5 = ({ data, onChange, errors }) => {
  const handleToggle = (domain) => {
    const current = data.interests || [];
    if (current.includes(domain)) {
      onChange('interests', current.filter(d => d !== domain));
    } else {
      onChange('interests', [...current, domain]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Vos Objectifs</h2>
        <p className="text-slate-600">Sélectionnez les domaines qui vous attirent (au moins 1).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {domains.map(domain => {
          const isSelected = (data.interests || []).includes(domain);
          return (
            <label 
              key={domain} 
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <input 
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => handleToggle(domain)}
              />
              <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
              }`}>
                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                {domain}
              </span>
            </label>
          );
        })}
      </div>
      {errors?.interests && <p className="text-sm text-red-500 font-medium text-center">{errors.interests}</p>}
    </div>
  );
};

export default SignupStep5;