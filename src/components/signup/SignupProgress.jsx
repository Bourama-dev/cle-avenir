import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, name: 'Compte' },
  { id: 2, name: 'Identité' },
  { id: 3, name: 'Lieu' },
  { id: 4, name: 'Profil' },
  { id: 5, name: 'Objectifs' },
  { id: 6, name: 'Préférences' },
  { id: 7, name: 'Fin' }
];

const SignupProgress = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full" />
        
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#4f46e5' : '#ffffff',
                  borderColor: isCompleted || isCurrent ? '#4f46e5' : '#e2e8f0',
                  scale: isCurrent ? 1.2 : 1
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                  isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{step.id}</span>
                )}
              </motion.div>
              <span className={`absolute -bottom-6 text-xs whitespace-nowrap font-medium transition-colors duration-300 ${
                isCurrent ? 'text-indigo-600' : 'text-slate-500'
              } hidden sm:block`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-8 sm:hidden text-sm font-medium text-slate-600">
        Étape {currentStep} sur {steps.length} : {steps[currentStep - 1].name}
      </div>
    </div>
  );
};

export default SignupProgress;