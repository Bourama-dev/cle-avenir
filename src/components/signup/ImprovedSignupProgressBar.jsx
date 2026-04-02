import React, { useEffect, useRef } from 'react';
import { SIGNUP_STEPS } from '@/data/signupSteps';
import StepIndicatorCircle from './StepIndicatorCircle';
import '@/styles/ImprovedSignupProgressBar.css';
import { motion, AnimatePresence } from 'framer-motion';

const ImprovedSignupProgressBar = ({ currentStep, totalSteps = 7 }) => {
  const scrollContainerRef = useRef(null);

  // Auto-scroll active step into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[currentStep - 1];
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentStep]);

  const currentStepData = SIGNUP_STEPS.find(s => s.id === currentStep) || SIGNUP_STEPS[0];

  return (
    <div className="w-full mb-8">
      {/* Header Info - Responsive Layout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 px-2 md:px-0 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            Étape {currentStep} sur {totalSteps}
            {currentStep === totalSteps && <span className="text-green-500 text-xs bg-green-50 px-2 py-0.5 rounded-full">Dernière étape !</span>}
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-bold text-slate-800">
                {currentStepData.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
                {currentStepData.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile Linear Bar (<640px) */}
        <div className="block sm:hidden w-full mt-2">
           <div className="linear-progress-bg h-2 w-full">
             <div 
               className="linear-progress-fill h-full" 
               style={{ width: `${(currentStep / totalSteps) * 100}%` }}
             />
           </div>
        </div>
      </div>

      {/* Circle Indicators Scrollable Container */}
      <div className="relative w-full px-2 md:px-4 py-2">
        {/* Background Line */}
        <div className="step-connector-line mx-4 md:mx-8 hidden sm:block" />
        
        {/* Active Progress Line */}
        <div 
           className="step-connector-progress mx-4 md:mx-8 hidden sm:block"
           style={{ width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - 3rem)` }} 
        />

        <div 
          ref={scrollContainerRef}
          className="steps-scroll-container flex items-center gap-4 md:gap-0 md:justify-between overflow-x-auto pb-6 pt-2 px-2 snap-x"
        >
          {SIGNUP_STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="snap-center">
                 <StepIndicatorCircle
                    stepNumber={step.id}
                    title={step.title}
                    shortTitle={step.shortTitle}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    onClick={() => {}} 
                 />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImprovedSignupProgressBar;