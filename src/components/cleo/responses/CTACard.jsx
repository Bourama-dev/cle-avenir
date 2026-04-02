import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CTACard = ({ data, onAction }) => {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-4 text-white shadow-lg my-2 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Sparkles size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight">{data.title}</h3>
          {data.xp && (
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Sparkles size={10} className="text-yellow-300" /> +{data.xp} XP
            </span>
          )}
        </div>
        
        <p className="text-indigo-100 text-sm mb-4">{data.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-indigo-200 flex items-center gap-1">
             ⏱️ {data.duration}
          </span>
          <Button 
            onClick={() => onAction && onAction(data.action)}
            size="sm" 
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 font-semibold shadow-md"
          >
            {data.actionLabel} <Play size={12} className="ml-2 fill-current" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CTACard;