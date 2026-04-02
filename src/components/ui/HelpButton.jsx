import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import HelpIcon from './HelpIcon';
import HelpTooltip from './HelpTooltip';
import { HELP_SECTIONS } from '@/components/admin/help/helpContent';

const HelpButton = ({ 
  section, 
  className,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = HELP_SECTIONS[section];

  if (!content) {
    console.warn(`HelpButton: Section "${section}" not found in helpContent.js`);
    return null;
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200 outline-none",
          "hover:bg-slate-100 focus:bg-slate-100 focus:ring-2 focus:ring-purple-200",
          isOpen ? "bg-purple-50 text-purple-600" : "text-slate-400"
        )}
        aria-label={`Aide pour ${content.title}`}
        aria-expanded={isOpen}
      >
        <HelpIcon 
          size={18} 
          className={cn(isOpen && "text-purple-600")} 
        />
      </button>

      <HelpTooltip 
        content={content}
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        position={position}
      />
    </div>
  );
};

export default HelpButton;