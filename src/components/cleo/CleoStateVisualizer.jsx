import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Brain, Zap, Heart, Search, AlertCircle } from 'lucide-react';

const MODES = {
  neutral:  { icon: Brain,       color: 'text-violet-500', bg: 'bg-violet-100',  ring: 'bg-violet-300',  label: 'En attente' },
  thinking: { icon: Search,      color: 'text-blue-500',   bg: 'bg-blue-100',    ring: 'bg-blue-300',    label: 'Analyse...' },
  action:   { icon: Zap,         color: 'text-amber-500',  bg: 'bg-amber-100',   ring: 'bg-amber-300',   label: 'Mode Action' },
  empathy:  { icon: Heart,       color: 'text-pink-500',   bg: 'bg-pink-100',    ring: 'bg-pink-300',    label: 'Écoute' },
  alert:    { icon: AlertCircle, color: 'text-red-500',    bg: 'bg-red-100',     ring: 'bg-red-300',     label: 'Alerte' },
};

const CleoStateVisualizer = ({ mode = 'neutral', className }) => {
  const shouldReduceMotion = useReducedMotion();
  const current = MODES[mode] || MODES.neutral;
  const Icon = current.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon container with animated bg color transition */}
      <motion.div
        className={`relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden`}
        animate={{ backgroundColor: 'transparent' }}
        style={{ background: 'transparent' }}
      >
        {/* Animated background layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${mode}`}
            className={`absolute inset-0 rounded-full ${current.bg}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </AnimatePresence>

        {/* Pulse ring for active states */}
        {mode !== 'neutral' && !shouldReduceMotion && (
          <motion.div
            key={`ring-${mode}`}
            className={`absolute inset-0 rounded-full ${current.ring}`}
            animate={{ scale: [1, 1.8], opacity: [0.45, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
          />
        )}

        {/* Icon with flip-in animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`icon-${mode}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="relative z-10"
          >
            <Icon size={16} className={current.color} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Label with slide-up transition */}
      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">État</span>
        <div className="relative overflow-hidden h-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={`label-${mode}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`absolute text-xs font-bold ${current.color}`}
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CleoStateVisualizer;