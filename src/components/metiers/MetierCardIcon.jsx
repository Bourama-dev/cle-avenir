import React from 'react';
import { 
  Briefcase, Hammer, Palette, Code, Stethoscope, 
  BookOpen, Calculator, ChefHat, Wrench, Sprout,
  Car, Shield, HeartPulse, Building, Lightbulb, Hexagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const getMetierIconConfig = (romeCode) => {
  const code = (romeCode || '').toUpperCase();
  
  if (code.startsWith('M18')) return { icon: Code, color: 'text-blue-600', bg: 'bg-blue-100/80', shadow: 'shadow-blue-500/20', gradient: 'from-blue-500/10 to-cyan-500/10' };
  if (code.startsWith('J')) return { icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-100/80', shadow: 'shadow-rose-500/20', gradient: 'from-rose-500/10 to-pink-500/10' };
  if (code.startsWith('D') || code.startsWith('M16') || code.startsWith('M17')) return { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100/80', shadow: 'shadow-indigo-500/20', gradient: 'from-indigo-500/10 to-purple-500/10' };
  if (code.startsWith('B') || code.startsWith('E') || code.startsWith('L')) return { icon: Palette, color: 'text-purple-600', bg: 'bg-purple-100/80', shadow: 'shadow-purple-500/20', gradient: 'from-purple-500/10 to-fuchsia-500/10' };
  if (code.startsWith('F')) return { icon: Hammer, color: 'text-orange-600', bg: 'bg-orange-100/80', shadow: 'shadow-orange-500/20', gradient: 'from-orange-500/10 to-amber-500/10' };
  if (code.startsWith('K')) return { icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-100/80', shadow: 'shadow-emerald-500/20', gradient: 'from-emerald-500/10 to-teal-500/10' };
  if (code.startsWith('G')) return { icon: ChefHat, color: 'text-amber-600', bg: 'bg-amber-100/80', shadow: 'shadow-amber-500/20', gradient: 'from-amber-500/10 to-yellow-500/10' };
  if (code.startsWith('H')) return { icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-100/80', shadow: 'shadow-slate-500/20', gradient: 'from-slate-500/10 to-gray-500/10' };
  if (code.startsWith('A')) return { icon: Sprout, color: 'text-lime-600', bg: 'bg-lime-100/80', shadow: 'shadow-lime-500/20', gradient: 'from-lime-500/10 to-green-500/10' };
  if (code.startsWith('N')) return { icon: Car, color: 'text-sky-600', bg: 'bg-sky-100/80', shadow: 'shadow-sky-500/20', gradient: 'from-sky-500/10 to-blue-500/10' };

  return { icon: Hexagon, color: 'text-violet-600', bg: 'bg-violet-100/80', shadow: 'shadow-violet-500/20', gradient: 'from-violet-500/10 to-indigo-500/10' };
};

const MetierCardIcon = ({ romeCode, className }) => {
  const config = getMetierIconConfig(romeCode);
  const Icon = config.icon;

  return (
    <div className={cn("p-3 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 duration-300", config.bg, config.shadow, className)}>
      <Icon className={cn("w-6 h-6", config.color)} />
    </div>
  );
};

export default MetierCardIcon;