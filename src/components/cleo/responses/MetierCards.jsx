import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';

const MetierCards = ({ data }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
      {data.metiers.map((metier, idx) => (
        <motion.div
          key={idx}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1, type: "spring", stiffness: 300, damping: 25 }}
          whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: "0 12px 40px rgba(99, 102, 241, 0.15)" }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          className="min-w-[220px] max-w-[220px] bg-white rounded-xl border border-slate-200 shadow-sm p-4 snap-center flex flex-col group cursor-pointer"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 text-indigo-600">
            <Briefcase size={20} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{metier.libelle}</h4>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{metier.description}</p>

          <div className="mt-auto pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-8 justify-between hover:bg-indigo-50 hover:text-indigo-600 p-0 px-2 text-slate-400 group-hover:text-indigo-600 transition-all duration-200 translate-y-1 group-hover:translate-y-0 opacity-60 group-hover:opacity-100"
              asChild
            >
              <a href={`/metier/${metier.code}`}>
                En savoir plus <ArrowRight size={12} />
              </a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetierCards;