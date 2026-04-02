import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Brain, Search, Sparkles } from 'lucide-react';

const steps = [
  { text: "Analyse de vos réponses...", icon: Brain },
  { text: "Recherche de correspondances...", icon: Search },
  { text: "Génération des insights...", icon: Sparkles }
];

const ResultsLoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <motion.div 
        key={currentStep}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="mb-8 p-6 bg-white rounded-full shadow-xl shadow-violet-100"
      >
        <ActiveIcon className="w-12 h-12 text-violet-600 animate-pulse" />
      </motion.div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        {steps[currentStep].text}
      </h2>
      
      <p className="text-slate-500 mb-8 text-center max-w-xs">
        Cela prend généralement quelques secondes. Merci de patienter.
      </p>

      <div className="flex gap-2 mb-4">
        {steps.map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 w-12 rounded-full transition-colors duration-500 ${
              idx <= currentStep ? 'bg-violet-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsLoadingState;