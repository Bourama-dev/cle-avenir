import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const QuickActions = ({ data, onAction }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {data.actions.map((action, idx) => (
        <motion.button
          key={idx}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05, type: "spring", stiffness: 300, damping: 22 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          className="rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 text-xs h-8 px-3 font-medium transition-colors"
          onClick={() => onAction(action.query || action.action, action.action ? 'action' : 'query')}
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;