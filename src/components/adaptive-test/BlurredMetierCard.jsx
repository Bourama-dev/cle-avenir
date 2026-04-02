import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BlurredMetierCard = ({ metier }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group">
      {/* Blurred background content */}
      <div className="p-6 filter blur-sm opacity-60 pointer-events-none select-none transition-all duration-300 group-hover:blur-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-200"></div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{metier.libelle || "Métier Masqué"}</h3>
            <div className="h-4 w-24 bg-slate-200 rounded mt-2"></div>
          </div>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2">
          {metier.description || "Description détaillée du métier, incluant les compétences requises, le salaire moyen et les débouchés..."}
        </p>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 p-6 text-center z-10">
        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-3 text-violet-600 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900 mb-1">Match Premium</h4>
        <p className="text-xs text-slate-600 mb-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          See full details with Premium
        </p>
        <Button 
          onClick={() => navigate('/tarifs')}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-md rounded-xl"
          size="sm"
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

export default BlurredMetierCard;