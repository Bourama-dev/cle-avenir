import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Quick Choice Buttons
export const ChoiceGroup = ({ options, onSelect }) => (
  <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2">
    {options.map((opt, i) => (
      <Button
        key={i}
        variant={opt.variant || "outline"}
        onClick={() => onSelect(opt.value)}
        className={cn(
          "rounded-full transition-all hover:scale-105 active:scale-95",
          opt.isPrimary ? "bg-violet-600 text-white hover:bg-violet-700 border-transparent shadow-md" : "bg-white hover:bg-slate-50 text-slate-700"
        )}
      >
        {opt.icon && <span className="mr-2">{opt.icon}</span>}
        {opt.label}
      </Button>
    ))}
  </div>
);

// Comparison Card (Career A vs Career B)
export const ComparisonCard = ({ title, metricA, metricB, labelA, labelB }) => (
  <Card className="w-full my-3 border-slate-200 bg-white/50 overflow-hidden">
    <div className="p-3 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
      {title}
    </div>
    <CardContent className="p-4 grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-slate-400 mb-1">{labelA}</div>
        <div className="text-lg font-bold text-slate-800">{metricA}</div>
      </div>
      <div className="border-l border-slate-100 pl-4">
        <div className="text-xs text-slate-400 mb-1">{labelB}</div>
        <div className="text-lg font-bold text-violet-600">{metricB}</div>
      </div>
    </CardContent>
  </Card>
);

// Reality Check Gauge
export const RealityCheck = ({ score, message }) => {
  let color = 'bg-red-500';
  if (score > 40) color = 'bg-amber-500';
  if (score > 70) color = 'bg-emerald-500';

  return (
    <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
          <TrendingUp size={12} /> Réalisme Marché
        </span>
        <span className="text-sm font-bold">{score}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${color}`} 
        />
      </div>
      <p className="text-xs text-slate-600 italic">{message}</p>
    </div>
  );
};

// Risk Alert
export const RiskAlert = ({ risk }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="my-3 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 items-start"
  >
    <div className="p-1.5 bg-amber-100 rounded-full text-amber-600 mt-0.5">
      <AlertTriangle size={14} />
    </div>
    <div>
      <h4 className="text-xs font-bold text-amber-800 uppercase mb-0.5">Point de vigilance</h4>
      <p className="text-sm text-amber-900">{risk.label}</p>
    </div>
  </motion.div>
);