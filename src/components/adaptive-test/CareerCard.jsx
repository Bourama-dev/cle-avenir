import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CareerDetails from './CareerDetails';

const CareerCard = ({ career, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock emojis based on rank if not provided
  const mockEmoji = rank === 1 ? "🚀" : rank === 2 ? "🌟" : "💼";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-3xl shadow-inner">
              {career.emoji || mockEmoji}
            </div>
            
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{career.title}</h3>
                  {rank === 1 && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Top Match
                      </span>
                  )}
               </div>
               <div className="flex items-center gap-3">
                   <div className="w-32">
                       <Progress value={career.match} className="h-2" indicatorClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                   </div>
                   <span className="text-sm font-bold text-violet-600">{career.match}%</span>
               </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl"
                onClick={() => setSaved(!saved)}
            >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-violet-600 text-violet-600' : ''}`} />
            </Button>
          </div>
        </div>
        
        <p className="mt-4 text-slate-600 text-sm leading-relaxed line-clamp-2">
            {career.description || "Un métier passionnant qui combine vos intérêts pour la technologie et l'innovation."}
        </p>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
            <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-slate-500 hover:text-violet-600 font-medium px-0 hover:bg-transparent"
            >
                {expanded ? (
                    <>Moins de détails <ChevronUp className="ml-1 w-4 h-4" /></>
                ) : (
                    <>Plus de détails <ChevronDown className="ml-1 w-4 h-4" /></>
                )}
            </Button>
            
            <Button 
                size="sm" 
                className="bg-slate-900 hover:bg-violet-600 text-white rounded-xl shadow-md transition-colors"
                onClick={() => window.open(`https://www.google.com/search?q=métier+${career.title}`, '_blank')}
            >
                Explorer
            </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-50/50 border-t border-slate-100 px-6 pb-6 overflow-hidden"
            >
                <CareerDetails career={career} />
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CareerCard;