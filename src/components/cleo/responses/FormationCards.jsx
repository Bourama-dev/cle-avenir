import React from 'react';
import { GraduationCap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FormationCards = ({ data }) => {
  return (
    <div className="space-y-2 w-full">
      {data.formations.map((formation, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                {formation.type || 'Formation'}
              </span>
              <h4 className="font-medium text-slate-800 text-sm">{formation.title}</h4>
            </div>
            <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
              <GraduationCap size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Clock size={12} />
            <span>{formation.duration || 'Durée variable'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FormationCards;