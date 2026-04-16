import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, CircleDot } from 'lucide-react';
import { getStatusContext } from '@/utils/educationUtils';

const ProgressionSection = ({ planData, hasTestData, userProfile }) => {
  const userStatus = userProfile?.user_status || null;
  const ctx = getStatusContext(userStatus);

  // Determine progress from real data
  const isTestCompleted = hasTestData;
  const hasMetiers    = (planData?.selected_metiers?.length    ?? 0) > 0;
  const hasFormations = (planData?.selected_formations?.length ?? 0) > 0;
  const hasJob        = false; // last step — never auto-completed here

  const steps = ctx.stepLabels.map((label, idx) => {
    let completed = false;
    let current = false;
    if (idx === 0) { completed = isTestCompleted; current = !hasMetiers && isTestCompleted; }
    if (idx === 1) { completed = hasMetiers;       current = hasMetiers && !hasFormations; }
    if (idx === 2) { completed = hasFormations;    current = hasFormations && !hasJob; }
    if (idx === 3) { completed = hasJob;           current = false; }
    return { id: idx + 1, ...label, completed, current };
  });

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = Math.max(0, Math.min(100, ((completedSteps - 1) / (steps.length - 1)) * 100));

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 text-white mb-10 overflow-hidden relative animate-fade-in">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ArrowRight className="w-64 h-64" />
      </div>
      <CardContent className="p-8 md:p-10 relative z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">Votre Parcours</h2>
        <p className="text-indigo-200 mb-10 text-sm">
          {userStatus === 'lyceen'       && 'Ton plan d\'orientation post-bac, étape par étape.'}
          {userStatus === 'etudiant'     && 'Ton plan pour décrocher ton premier emploi.'}
          {userStatus === 'en_emploi'    && 'Votre plan de montée en compétences et d\'évolution.'}
          {userStatus === 'en_recherche' && 'Votre plan pour décrocher votre prochain poste.'}
          {userStatus === 'reconversion' && 'Votre plan de reconversion professionnelle.'}
          {!userStatus                   && 'Suivez les étapes pour concrétiser votre projet professionnel.'}
        </p>

        <div className="relative">
          {/* Connecting line */}
          <div className="timeline-line" />
          <div className="timeline-line-progress" style={{ width: `${progressPercentage}%` }} />

          <div className="flex flex-col md:flex-row gap-8 md:gap-4 justify-between relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-row md:flex-col items-center md:text-center gap-4 group">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-300 shadow-lg
                  ${step.completed
                    ? 'bg-emerald-500 border-emerald-400 text-white scale-110'
                    : step.current
                    ? 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}
                >
                  {step.completed
                    ? <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
                    : step.current
                    ? <CircleDot className="w-6 h-6 md:w-7 md:h-7 animate-pulse-subtle" />
                    : <span className="font-bold text-lg">{step.id}</span>
                  }
                </div>
                <div>
                  <h3 className={`font-bold text-sm md:text-base mb-1 transition-colors
                    ${step.completed ? 'text-emerald-400' : step.current ? 'text-white' : 'text-slate-400'}`}
                  >
                    {step.title}
                  </h3>
                  <p className={`text-xs md:text-sm ${step.current ? 'text-indigo-200 font-medium' : 'text-slate-500'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressionSection;
