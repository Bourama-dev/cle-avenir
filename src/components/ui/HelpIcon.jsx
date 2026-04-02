import React from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const HelpIcon = ({ 
  className, 
  size = 18, 
  variant = 'default' 
}) => {
  const Icon = variant === 'info' ? Info : HelpCircle;
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full transition-colors duration-200",
        "text-slate-400 hover:text-slate-600 focus:text-purple-600",
        className
      )}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={2} />
    </div>
  );
};

export default HelpIcon;