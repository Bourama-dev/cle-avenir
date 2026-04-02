import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const QuestionChoice = ({ choice, onClick, selected = false }) => {
  return (
    <motion.button
      onClick={() => onClick(choice)}
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full h-full min-h-[5rem] p-4 text-left rounded-xl transition-all duration-300 border-2 group",
        "flex items-center justify-between gap-3 shadow-sm hover:shadow-md",
        selected 
          ? "bg-violet-50 border-violet-500 shadow-violet-100" 
          : "bg-white border-slate-100 hover:border-violet-300 hover:bg-slate-50"
      )}
    >
      <span className={cn(
        "text-base md:text-lg font-medium leading-snug",
        selected ? "text-violet-900" : "text-slate-700 group-hover:text-slate-900"
      )}>
        {choice.text}
      </span>
      
      {selected && (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 text-violet-600"
        >
            <CheckCircle2 className="w-6 h-6" />
        </motion.div>
      )}
      
      {/* Decorative gradient blob on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  );
};

export default QuestionChoice;