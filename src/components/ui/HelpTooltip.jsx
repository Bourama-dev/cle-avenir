import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpTooltip = ({ 
  content, 
  isVisible, 
  onClose, 
  position = 'bottom-right',
  className 
}) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!content) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 w-72 md:w-80 p-4 rounded-lg shadow-xl border border-slate-700/50",
            "bg-slate-800 text-white text-sm leading-relaxed",
            "backdrop-blur-sm",
            position === 'bottom-right' && "top-full left-0 mt-2",
            position === 'bottom-left' && "top-full right-0 mt-2",
            position === 'top-right' && "bottom-full left-0 mb-2",
            position === 'top-left' && "bottom-full right-0 mb-2",
            className
          )}
          role="tooltip"
        >
          {/* Arrow */}
          <div 
            className={cn(
              "absolute w-3 h-3 bg-slate-800 border-l border-t border-slate-700/50 transform rotate-45",
              position.includes('bottom') ? "-top-1.5" : "-bottom-1.5",
              position.includes('left') ? "right-4" : "left-4"
            )} 
          />

          {/* Header */}
          <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-2">
            <h4 className="font-semibold text-base text-white tracking-wide">
              {content.title}
            </h4>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-slate-400 hover:text-white transition-colors ml-2 -mr-1 -mt-1 p-1 rounded-full hover:bg-slate-700"
              aria-label="Fermer l'aide"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-slate-300">
              {content.description}
            </p>
            
            {content.utility && (
              <div className="bg-slate-900/50 p-2 rounded border-l-2 border-purple-500">
                <p className="text-xs text-slate-400 font-medium mb-1">Utilité :</p>
                <p className="text-slate-300">{content.utility}</p>
              </div>
            )}

            {content.actions && content.actions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Actions disponibles</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 marker:text-purple-500">
                  {content.actions.map((action, idx) => (
                    <li key={idx} className="text-xs">{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {content.tips && (
              <div className="flex gap-2 items-start mt-2 pt-2 border-t border-slate-700/50">
                <span className="text-yellow-500 text-xs">💡</span>
                <p className="text-xs text-slate-400 italic">
                  {content.tips}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpTooltip;