import React from 'react';
import { Loader2 } from 'lucide-react';

const MetierLoadingSpinner = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px] animate-in fade-in"
      role="status"
      aria-label="Chargement des données"
    >
      <div className="p-4 bg-indigo-50 rounded-full mb-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Chargement des données...</h3>
      <p className="text-slate-500 font-medium">Veuillez patienter pendant que nous récupérons les informations.</p>
    </div>
  );
};

export default MetierLoadingSpinner;