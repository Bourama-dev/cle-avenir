import React, { useState } from 'react';
import { CheckCircle2, CircleDot, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getStatusContext } from '@/utils/educationUtils';

const SUBTITLES = {
  lyceen: 'Ton plan d\'orientation post-bac, étape par étape.',
  etudiant: 'Ton plan pour décrocher ton premier emploi.',
  en_emploi: 'Votre plan de montée en compétences et d\'évolution.',
  en_recherche: 'Votre plan pour décrocher votre prochain poste.',
  reconversion: 'Votre plan de reconversion professionnelle.',
};

const ProgressionSection = ({ planData, hasTestData, userProfile }) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const userStatus = userProfile?.user_status || null;
  const ctx = getStatusContext(userStatus);

  const isTestCompleted = hasTestData;
  const hasMetiers    = (planData?.selected_metiers?.length    ?? 0) > 0;
  const hasFormations = (planData?.selected_formations?.length ?? 0) > 0;
  const hasJob        = false;

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
  const progressPercentage = steps.length > 0
    ? Math.round((completedSteps / steps.length) * 100)
    : 0;
  const currentStep = steps.find(s => s.current) || steps.find(s => !s.completed);

  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <section className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full min-h-[44px] flex items-center gap-4 p-5 md:p-6 text-left"
      >
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
            <motion.circle
              cx="32" cy="32" r={R} fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: reduce ? C * (1 - progressPercentage / 100) : C }}
              animate={{ strokeDashoffset: C * (1 - progressPercentage / 100) }}
              transition={{ duration: reduce ? 0 : 0.8, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {progressPercentage}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Votre parcours</p>
          <h2 className="text-lg md:text-xl font-bold leading-tight truncate">
            {currentStep ? currentStep.title : 'Parcours terminé'}
          </h2>
          <p className="text-xs text-indigo-200 mt-0.5">{completedSteps}/{steps.length} étapes</p>
        </div>
        <ChevronDown className={`w-5 h-5 shrink-0 text-indigo-200 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className="px-5 md:px-6 pb-4 flex gap-1.5" aria-hidden="true">
        {steps.map(s => (
          <span
            key={s.id}
            className={`h-1.5 flex-1 rounded-full ${s.completed ? 'bg-emerald-400' : s.current ? 'bg-indigo-300' : 'bg-white/15'}`}
          />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 space-y-3">
              <p className="text-sm text-indigo-200">
                {SUBTITLES[userStatus] || 'Suivez les étapes pour concrétiser votre projet professionnel.'}
              </p>
              <ol className="space-y-2">
                {steps.map(step => (
                  <li key={step.id} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed ? 'bg-emerald-500' : step.current ? 'bg-indigo-500 ring-2 ring-indigo-300/50' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {step.completed
                        ? <CheckCircle2 className="w-5 h-5" />
                        : step.current
                        ? <CircleDot className="w-5 h-5" />
                        : <span className="text-sm font-bold">{step.id}</span>}
                    </span>
                    <div className="min-w-0">
                      <h3 className={`text-sm font-semibold ${step.completed ? 'text-emerald-300' : step.current ? 'text-white' : 'text-slate-300'}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-indigo-200/80">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProgressionSection;
