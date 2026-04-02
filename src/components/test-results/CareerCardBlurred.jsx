import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CareerCardBlurred = ({ career, rank, onUnlock }) => {
  const score = (career.final_score * 10).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden group hover:border-indigo-200 transition-colors"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-slate-100 text-slate-500">#{rank}</Badge>
          <div className="text-lg font-bold text-slate-800 opacity-60 blur-[2px] select-none transition-all group-hover:blur-[1px]">
            {career.libelle.substring(0, 15)}...
          </div>
        </div>
        <div className="font-bold text-indigo-600">
          {score}%
        </div>
      </div>

      <div className="text-sm text-slate-500 opacity-40 blur-[3px] select-none mb-4 line-clamp-2">
        {career.description || 'Description générique pour ce poste qui est floutée...'}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-4 opacity-100 transition-opacity">
        <Button 
          onClick={() => onUnlock(career)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg transform transition-transform hover:scale-105"
        >
          <Eye className="mr-2 h-4 w-4" /> Découvrir ce métier
        </Button>
      </div>
    </motion.div>
  );
};

export default CareerCardBlurred;