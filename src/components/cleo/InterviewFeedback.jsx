import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, TrendingUp, Award, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const InterviewFeedback = ({ feedback, score, history }) => {
  if (!feedback) return null;

  // Calculate trends based on history if available
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length) 
    : score;

  const getScoreColor = (s) => {
    if (s >= 80) return "text-green-500";
    if (s >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  const getScoreBg = (s) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900/50 backdrop-blur-md border-l border-white/10 p-6 h-full flex flex-col gap-6 text-white w-full max-w-sm"
    >
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap size={14} className="text-violet-400" /> Analyse en temps réel
        </h3>
        
        {/* Score Card */}
        <div className="bg-black/40 rounded-xl p-4 border border-white/10 mb-4 relative overflow-hidden">
          <div className="flex justify-between items-end mb-2 relative z-10">
             <span className="text-sm text-slate-400 font-medium">Pertinence</span>
             <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
          <Progress value={score} className="h-1.5 bg-white/10" indicatorClassName={getScoreBg(score)} />
          
          {/* Subtle background glow based on score */}
          <div className={`absolute top-0 right-0 w-24 h-24 ${getScoreBg(score)} blur-[60px] opacity-20 pointer-events-none`}></div>
        </div>

        {/* Feedback Text */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
           <div className="absolute -left-1 top-6 w-1 h-8 bg-violet-500 rounded-r-full"></div>
           <p className="text-sm leading-relaxed text-slate-200">
             "{feedback}"
           </p>
        </div>
      </div>

      {/* Session Stats */}
      <div className="mt-auto space-y-4">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <TrendingUp size={14} /> Progression Session
         </h3>
         
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
               <div className="text-xs text-slate-500 mb-1">Moyenne</div>
               <div className="font-bold text-lg">{averageScore}%</div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
               <div className="text-xs text-slate-500 mb-1">Questions</div>
               <div className="font-bold text-lg">{history.length}</div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default InterviewFeedback;