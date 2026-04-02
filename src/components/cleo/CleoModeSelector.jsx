import React from 'react';
import { GraduationCap, Briefcase, UserCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  {
    id: 'learning_coach',
    label: 'Coach Apprentissage',
    icon: GraduationCap,
    desc: 'Révisions, concepts, exercices'
  },
  {
    id: 'career_advisor',
    label: 'Conseiller Carrière',
    icon: Briefcase,
    desc: 'Orientation, stratégies, marché'
  },
  {
    id: 'interview_coach',
    label: 'Prépa Entretien',
    icon: UserCheck,
    desc: 'Simulations, feedback réaliste'
  },
  {
    id: 'progress_tracker',
    label: 'Suivi & Objectifs',
    icon: Activity,
    desc: 'KPIs, délais, motivation'
  }
];

const CleoModeSelector = ({ currentMode, onSelect }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4 px-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={cn(
              "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
              isActive 
                ? "bg-violet-50 border-violet-200 shadow-sm" 
                : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg mb-2",
              isActive ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"
            )}>
              <Icon size={16} />
            </div>
            <div className={cn("font-semibold text-xs", isActive ? "text-violet-900" : "text-slate-700")}>
              {mode.label}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              {mode.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CleoModeSelector;