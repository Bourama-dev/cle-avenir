import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const MetierCards = ({ data }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
      {data.metiers.map((metier, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="min-w-[220px] max-w-[220px] bg-white rounded-xl border border-slate-200 shadow-sm p-4 snap-center flex flex-col"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 text-indigo-600">
            <Briefcase size={20} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{metier.title}</h4>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{metier.description}</p>
          
          <div className="mt-auto pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" className="w-full text-xs h-8 justify-between hover:bg-indigo-50 hover:text-indigo-600 p-0 px-2" asChild>
              <a href={`/metier/${metier.slug}`}>
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