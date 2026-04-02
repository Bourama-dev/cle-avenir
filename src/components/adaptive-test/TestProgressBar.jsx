import React from 'react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const TestProgressBar = ({ currentIndex, total }) => {
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex justify-between items-center text-sm font-medium text-slate-500">
        <motion.span 
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Question {currentIndex + 1} of {total}
        </motion.span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default TestProgressBar;