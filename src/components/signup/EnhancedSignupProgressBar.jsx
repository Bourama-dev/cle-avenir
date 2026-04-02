import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const EnhancedSignupProgressBar = ({ currentStep, totalSteps = 12 }) => {
  return (
    <div className="w-full mb-8 px-2">
      <div className="flex justify-between items-center relative">
        {/* Connection Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full" />
        
        {/* Connection Line Progress */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -z-10 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={index} className="relative flex flex-col items-center group">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white scale-110 shadow-lg shadow-purple-200' 
                    : isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'bg-white border-slate-300 text-slate-400'
                  }
                `}
                initial={false}
                animate={{ scale: isActive ? 1.2 : 1 }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </motion.div>
              
              {/* Tooltip for step number on hover (optional enhancement) */}
              <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Étape {stepNum}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-4 text-sm font-medium text-slate-500">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );
};

export default EnhancedSignupProgressBar;