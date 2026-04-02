import React from 'react';
import { usePlanLimitation } from '@/contexts/PlanLimitationContext';
import { Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PlanAccessMessage = () => {
  const { userPlan } = usePlanLimitation();
  const navigate = useNavigate();

  if (userPlan === 'Découverte') {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Plan Découverte : Vous voyez les 3 meilleures correspondances</p>
            <p className="text-sm">Débloquez tous vos résultats avec un plan Premium.</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/plans')} 
          className="bg-[#D4AF37] hover:bg-[#B8860B] text-white border-none whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Découvrir Premium
        </Button>
      </div>
    );
  }

  if (userPlan === 'Premium') {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-3 text-blue-800">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold">Plan Premium actif</p>
            <p className="text-sm">Vous avez accès à tous vos résultats d'orientation.</p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate('/plans#premium-plus')} 
          className="border-blue-300 text-blue-700 hover:bg-blue-100 whitespace-nowrap"
        >
          Découvrir Premium+
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3 text-purple-800 animate-fade-in">
      <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
      <div>
        <p className="font-semibold">Plan Premium+ actif</p>
        <p className="text-sm">Vous avez accès à tous les résultats + un accompagnement personnalisé.</p>
      </div>
    </div>
  );
};

export default PlanAccessMessage;