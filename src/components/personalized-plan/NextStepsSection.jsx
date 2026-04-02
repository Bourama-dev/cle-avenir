import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const NextStepsSection = ({ plan }) => {
  const hasMetiers = plan?.selected_metiers && plan.selected_metiers.length > 0;
  const hasFormations = plan?.selected_formations && plan.selected_formations.length > 0;

  const steps = [
    { id: 1, title: 'Test complété', desc: 'Profil RIASEC analysé', completed: true },
    { id: 2, title: 'Choisir un métier', desc: 'Cibler 1 à 3 métiers', completed: hasMetiers },
    { id: 3, title: 'Planifier la formation', desc: 'Trouver le bon parcours', completed: hasFormations },
    { id: 4, title: 'Chercher des offres', desc: 'Préparer votre candidature', completed: false }
  ];

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-900 to-slate-900 text-white mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
         <ArrowRight className="w-64 h-64" />
      </div>
      <CardContent className="p-8 relative z-10">
        <h2 className="text-2xl font-bold mb-8">Votre Progression</h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between relative">
           
           <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-indigo-800/50 z-0"></div>

           {steps.map((step) => (
              <div key={step.id} className="flex flex-row md:flex-col items-center md:text-center gap-4 relative z-10">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors ${step.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-indigo-500/30 text-indigo-400'}`}>
                    {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{step.id}</span>}
                 </div>
                 <div>
                    <h3 className={`font-bold ${step.completed ? 'text-emerald-400' : 'text-white'}`}>{step.title}</h3>
                    <p className="text-sm text-indigo-200 mt-1">{step.desc}</p>
                 </div>
              </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsSection;