import React from 'react';

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-900 text-right max-w-[60%]">{value || '-'}</span>
  </div>
);

const SignupStep7 = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Récapitulatif</h2>
        <p className="text-slate-600">Vérifiez vos informations avant de finaliser.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-2">
        <SummaryRow label="Email" value={data.email} />
        <SummaryRow label="Nom" value={`${data.first_name} ${data.last_name}`} />
        <SummaryRow label="Localisation" value={`${data.city}, ${data.region}`} />
        <SummaryRow label="Âge" value={`${data.age} ans`} />
        <SummaryRow label="Statut" value={data.current_status} />
        <SummaryRow 
          label="Niveau" 
          value={data.education_level === 'Terminal' ? `Terminal (${data.education_specialty})` : data.education_level} 
        />
        <SummaryRow label="Études longues" value={data.wants_long_studies} />
        
        <div className="py-3 border-b border-slate-100">
          <span className="block text-slate-500 mb-2">Domaines d'intérêt</span>
          <div className="flex flex-wrap gap-2">
            {(data.interests || []).map(i => (
              <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md">{i}</span>
            ))}
          </div>
        </div>

        <div className="py-3">
          <span className="block text-slate-500 mb-2">Préférences / Contraintes</span>
          <div className="flex flex-wrap gap-2">
            {(!data.constraints || data.constraints.length === 0) ? (
              <span className="text-slate-400 text-sm">Aucune spécifiée</span>
            ) : (
              data.constraints.map(c => (
                <span key={c} className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-md">{c}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupStep7;