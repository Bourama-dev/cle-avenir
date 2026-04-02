import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { debugMetierNavigation } from '@/utils/metierNavigationDebug';

const BlurredMetierCard = ({ metier, onUpgrade }) => {
  const navigate = useNavigate();
  
  // Use generic or real data that is blurred
  const title = metier?.libelle || metier?.title || "Métier Compatible (Premium)";
  const description = metier?.description || "Ce métier correspond très fortement à vos compétences et à vos aspirations professionnelles. Découvrez-en plus avec Premium.";
  const romeCode = debugMetierNavigation('BlurredMetierCard', metier);

  const handleDetailClick = () => {
    if (!romeCode) {
      console.error("[BlurredMetierCard] Cannot navigate: missing ROME code", metier);
      // Fallback to upgrade if no code available
      if (onUpgrade) onUpgrade();
      return;
    }
    console.log(`[BlurredMetierCard] Navigation vers: /metier/${romeCode}`);
    navigate(`/metier/${romeCode}`);
  };

  return (
    <Card className="relative overflow-hidden h-full group border-slate-200 bg-white shadow-md">
      {/* Blurred Background Content */}
      <div className="p-6 h-full flex flex-col filter blur-[6px] opacity-40 select-none pointer-events-none transition-all duration-500 group-hover:blur-md">
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
          <div>
            <div className="h-6 w-48 bg-slate-300 rounded mb-2"></div>
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
              <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="h-12 bg-slate-100 rounded-xl"></div>
          <div className="h-12 bg-slate-100 rounded-xl"></div>
        </div>
        
        <div className="h-11 w-full bg-slate-200 rounded-xl mt-6"></div>
      </div>

      {/* Interactive Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-white/90 via-white/70 to-white/30 backdrop-blur-[1px]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-500/30">
          <Lock className="w-6 h-6" />
        </div>
        
        <Badge variant="outline" className="mb-3 bg-violet-50 text-violet-700 border-violet-200 px-3 py-1 font-bold">
          <Sparkles className="w-3 h-3 mr-1.5" /> Match Premium
        </Badge>
        
        <h4 className="font-bold text-slate-900 text-lg mb-2">Découvrez ce métier</h4>
        <p className="text-sm text-slate-600 mb-6 max-w-[250px]">
          Ce métier a un fort taux de compatibilité avec votre profil. Débloquez-le pour voir les détails.
        </p>
        
        <div className="flex flex-col gap-2 w-full max-w-[220px]">
          <Button 
            onClick={onUpgrade}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 rounded-xl w-full"
          >
            Débloquer Premium
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleDetailClick}
            className="text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-xl w-full text-xs"
          >
            Voir la fiche publique
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlurredMetierCard;