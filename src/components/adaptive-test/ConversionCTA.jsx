import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConversionCTA = ({ onUpgrade, onSkip }) => {
  return (
    <div className="conversion-cta text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
            <Sparkles className="w-3 h-3" />
            100 % GRATUIT
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ne laisse pas ton avenir au hasard
          </h2>
          
          <p className="text-slate-300">
            Obtiens une feuille de route détaillée pour atteindre tes objectifs professionnels. 
            Tout est gratuit sur CléAvenir.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
             {["Plan d'action personnalisé", "Accès illimité aux métiers", "Coaching IA"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                   <CheckCircle2 className="w-4 h-4 text-green-400" /> {item}
                </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto min-w-[250px]">
           <Button 
             onClick={onUpgrade}
             className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg rounded-xl"
           >
             Voir ma feuille de route
           </Button>
           
           <Button 
             variant="outline" 
             onClick={onSkip}
             className="w-full border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl"
           >
             Continuer
           </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversionCTA;