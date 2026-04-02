import React from 'react';

const constraintOptions = [
  'Mobilité géographique limitée', 
  'Salaire minimum important', 
  'Télétravail souhaité', 
  'Horaires flexibles', 
  'Travail en équipe', 
  'Autonomie', 
  'Pas de contrainte'
];

const SignupStep6 = ({ data, onChange }) => {
  const handleToggle = (constraint) => {
    const current = data.constraints || [];
    
    if (constraint === 'Pas de contrainte') {
      onChange('constraints', ['Pas de contrainte']);
      return;
    }

    let newConstraints = current.filter(c => c !== 'Pas de contrainte');
    
    if (newConstraints.includes(constraint)) {
      newConstraints = newConstraints.filter(c => c !== constraint);
    } else {
      newConstraints = [...newConstraints, constraint];
    }
    
    onChange('constraints', newConstraints);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Vos Préférences</h2>
        <p className="text-slate-600">Quelles sont vos conditions de travail idéales ?</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {constraintOptions.map(constraint => {
          const isSelected = (data.constraints || []).includes(constraint);
          return (
            <button
              key={constraint}
              type="button"
              onClick={() => handleToggle(constraint)}
              className={`px-4 py-3 rounded-full border text-sm font-medium transition-all duration-200 ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              {constraint}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SignupStep6;