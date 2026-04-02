import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { profilingService } from '@/services/profilingService';

const CleoProfileWidget = ({ userProfile, onEnrichClick }) => {
  const completion = profilingService.calculateCompletion(userProfile);
  const missingFields = profilingService.getMissingFields(userProfile);
  
  if (completion === 100) return null; // Hide if complete

  // Get the next most important missing field to display
  const nextTask = missingFields.length > 0 ? missingFields[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-100 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-gradient-to-r from-violet-50/50 to-white"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
           <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs border-2 border-white shadow-sm">
             {completion}%
           </div>
           {completion < 50 && (
             <div className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
             </div>
           )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1">
             <Sparkles size={10} className="text-amber-500" />
             Profil en construction
          </span>
          {nextTask ? (
             <span className="text-sm text-slate-600 truncate">
               Cléo ne connaît pas encore votre <strong>{nextTask.label.toLowerCase()}</strong>.
             </span>
          ) : (
             <span className="text-sm text-slate-600">Enrichissez votre profil pour de meilleures réponses.</span>
          )}
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center gap-3">
        <div className="hidden md:block w-32">
           <Progress value={completion} className="h-2" />
        </div>
        <Button 
           size="sm" 
           variant="outline" 
           onClick={onEnrichClick}
           className="w-full md:w-auto text-xs h-8 bg-white border-violet-200 text-violet-700 hover:bg-violet-50"
        >
           Compléter mon profil <ArrowRight size={12} className="ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CleoProfileWidget;