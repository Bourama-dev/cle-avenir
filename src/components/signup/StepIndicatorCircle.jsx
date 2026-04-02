import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming generic utility exists, else standard template literal

const StepIndicatorCircle = ({ 
  stepNumber, 
  isActive, 
  isCompleted, 
  onClick,
  title,
  shortTitle
}) => {
  return (
    <div className="flex flex-col items-center gap-2 relative z-10 min-w-[60px] md:min-w-[80px]">
      <button
        onClick={onClick}
        className={cn(
          "step-circle relative flex items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300",
          // Sizing
          "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12",
          // Colors based on state
          isActive 
            ? "step-circle-active bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white scale-110" 
            : isCompleted 
              ? "bg-green-500 border-green-500 text-white" 
              : "bg-white border-slate-200 text-slate-400 hover:border-blue-300",
          // Disabled state for future steps logic handled by parent usually, but style here
          !isCompleted && !isActive ? "cursor-default" : "cursor-pointer"
        )}
        aria-label={`Étape ${stepNumber}: ${title}`}
        aria-current={isActive ? "step" : undefined}
        tabIndex={0}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        ) : (
          <span>{stepNumber}</span>
        )}
      </button>
      
      {/* Short title for mobile/tablet, full title for desktop maybe, but keeping it clean with short title */}
      <span className={cn(
        "hidden md:block text-[10px] md:text-xs font-medium transition-colors duration-300 text-center absolute -bottom-6 w-24 left-1/2 -translate-x-1/2 whitespace-nowrap",
        isActive ? "text-purple-700 font-bold" : isCompleted ? "text-green-600" : "text-slate-400"
      )}>
        {shortTitle}
      </span>
    </div>
  );
};

export default StepIndicatorCircle;