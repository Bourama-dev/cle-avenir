import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConversionCTA = ({ onUpgrade, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 23, minutes: 59 });

  // Simple countdown logic simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="conversion-cta text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
            <Clock className="w-3 h-3" />
            OFFRE LIMITÉE
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ne laissez pas votre avenir au hasard
          </h2>
          
          <p className="text-slate-300">
            Obtenez une feuille de route détaillée pour atteindre vos objectifs professionnels. 
            Rejoignez les 85% d'utilisateurs qui ont trouvé leur voie grâce à Premium.
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
           <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center mb-2">
              <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Temps restant</div>
              <div className="flex justify-center gap-2 text-2xl font-mono font-bold text-white">
                 <span className="bg-slate-900/50 px-2 rounded">{timeLeft.days}j</span>
                 <span>:</span>
                 <span className="bg-slate-900/50 px-2 rounded">{timeLeft.hours}h</span>
                 <span>:</span>
                 <span className="bg-slate-900/50 px-2 rounded">{timeLeft.minutes}m</span>
              </div>
           </div>

           <Button 
             onClick={onUpgrade}
             className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg rounded-xl"
           >
             Débloquer Premium
           </Button>
           
           <Button 
             variant="outline" 
             onClick={onSkip}
             className="w-full border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl"
           >
             Continuer gratuitement
           </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversionCTA;