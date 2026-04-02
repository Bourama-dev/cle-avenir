import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Heart, Search, AlertCircle } from 'lucide-react';

const MODES = {
  neutral: { icon: Brain, color: 'text-violet-500', bg: 'bg-violet-100', label: 'En attente' },
  thinking: { icon: Search, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Analyse...' },
  action: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Mode Action' },
  empathy: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100', label: 'Écoute' },
  alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Alerte' }
};

const CleoStateVisualizer = ({ mode = 'neutral', className }) => {
  const current = MODES[mode] || MODES.neutral;
  const Icon = current.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative w-8 h-8 rounded-full ${current.bg} flex items-center justify-center transition-colors duration-500`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon size={16} className={current.color} />
          </motion.div>
        </AnimatePresence>
        
        {/* Pulse Effect for active modes */}
        {mode !== 'neutral' && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`absolute inset-0 rounded-full ${current.bg}`}
          />
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">État</span>
        <span className={`text-xs font-bold transition-colors duration-300 ${current.color}`}>
          {current.label}
        </span>
      </div>
    </div>
  );
};

export default CleoStateVisualizer;