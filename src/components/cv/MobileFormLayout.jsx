import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AccordionSection = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl mb-4 bg-white overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors touch-target focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-purple-600" />}
          <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileFormLayout = ({ children, className }) => {
  return (
    <div className={cn("w-full max-w-2xl mx-auto pb-24 md:pb-8", className)}>
      {children}
    </div>
  );
};

export default MobileFormLayout;