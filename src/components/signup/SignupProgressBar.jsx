import React from 'react';
import { motion } from 'framer-motion';

const SignupProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Identité" },
    { number: 2, title: "Profil & Objectifs" }
  ];

  const progress = currentStep === 1 ? 50 : 100;

  return (
    <div className="w-full mb-8">
      {/* Visual Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Steps Text */}
      <div className="flex justify-between px-2">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`flex flex-col items-center transition-colors duration-300 ${currentStep >= step.number ? 'text-purple-700' : 'text-slate-400'}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider mb-1">
              Étape {step.number}
            </span>
            <span className="text-sm font-medium">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignupProgressBar;