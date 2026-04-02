import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const QuickActions = ({ data, onAction }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {data.actions.map((action, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 text-xs h-8"
            onClick={() => onAction(action.query || action.action, action.action ? 'action' : 'query')}
          >
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;