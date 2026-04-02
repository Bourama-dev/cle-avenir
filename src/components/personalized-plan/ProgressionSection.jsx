import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, CircleDot } from 'lucide-react';

const ProgressionSection = ({ planData, hasTestData }) => {
  // Determine actual progress based on real data
  const isTestCompleted = hasTestData;
  const hasMetiers = planData?.selected_metiers && planData.selected_metiers.length > 0;
  const hasFormations = planData?.selected_formations && planData.selected_formations.length > 0;
  
  // Assuming job search is step 4, never auto-completed in this view
  const hasJob = false;

  const steps = [
    { 
      id: 1, 
      title: 'Test complété', 
      desc: 'Profil RIASEC analysé', 
      completed: isTestCompleted,
      current: !hasMetiers && isTestCompleted
    },
    { 
      id: 2, 
      title: 'Choisir un métier', 
      desc: 'Cibler 1 à 3 métiers', 
      completed: hasMetiers,
      current: hasMetiers && !hasFormations
    },
    { 
      id: 3, 
      title: 'Planifier la formation', 
      desc: 'Trouver le bon parcours', 
      completed: hasFormations,
      current: hasFormations && !hasJob
    },
    { 
      id: 4, 
      title: 'Chercher des offres', 
      desc: 'Préparer votre candidature', 
      completed: hasJob,
      current: false
    }
  ];

  // Calculate progress percentage for the connecting line
  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = Math.max(0, Math.min(100, ((completedSteps - 1) / (steps.length - 1)) * 100));

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 text-white mb-10 overflow-hidden relative animate-fade-in">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
         <ArrowRight className="w-64 h-64" />
      </div>
      <CardContent className="p-8 md:p-10 relative z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Votre Parcours</h2>
        <p className="text-indigo-200 mb-10">Suivez les étapes pour concrétiser votre projet professionnel.</p>
        
        <div className="relative">
           {/* Connecting Line Background */}
           <div className="timeline-line"></div>
           {/* Connecting Line Progress */}
           <div className="timeline-line-progress" style={{ width: `${progressPercentage}%` }}></div>

           <div className="flex flex-col md:flex-row gap-8 md:gap-4 justify-between relative z-10">
             {steps.map((step) => {
                const isCompleted = step.completed;
                const isCurrent = step.current;
                
                return (
                  <div key={step.id} className="flex flex-row md:flex-col items-center md:text-center gap-4 group">
                     <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-300 shadow-lg
                        ${isCompleted ? 'bg-emerald-500 border-emerald-400 text-white scale-110' : 
                          isCurrent ? 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30' : 
                          'bg-slate-800 border-slate-600 text-slate-400'}
                     `}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" /> : 
                         isCurrent ? <CircleDot className="w-6 h-6 md:w-7 md:h-7 animate-pulse-subtle" /> : 
                         <span className="font-bold text-lg">{step.id}</span>}
                     </div>
                     <div>
                        <h3 className={`font-bold text-sm md:text-base mb-1 transition-colors
                           ${isCompleted ? 'text-emerald-400' : 
                             isCurrent ? 'text-white' : 'text-slate-400'}
                        `}>
                          {step.title}
                        </h3>
                        <p className={`text-xs md:text-sm ${isCurrent ? 'text-indigo-200 font-medium' : 'text-slate-500'}`}>
                          {step.desc}
                        </p>
                     </div>
                  </div>
                );
             })}
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressionSection;