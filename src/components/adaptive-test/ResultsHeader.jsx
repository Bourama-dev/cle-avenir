import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Sparkles } from 'lucide-react';

const ResultsHeader = ({ profileType, percentile = 92, questionCount = 18 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="results-header relative"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4 max-w-lg relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/30 text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Analyse terminée</span>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Votre profil est <span className="text-yellow-300">{profileType || "Explorateur"}</span>
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Nous avons analysé vos réponses et identifié des opportunités de carrière uniques adaptées à vos valeurs et ambitions.
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto relative z-10">
          <div className="stat-box flex-1 md:flex-initial min-w-[100px]">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
            <div className="text-2xl font-bold text-white">Top {100 - percentile}%</div>
            <div className="text-xs text-blue-100 uppercase tracking-wide">Potentiel</div>
          </div>
          
          <div className="stat-box flex-1 md:flex-initial min-w-[100px]">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-200" />
            <div className="text-2xl font-bold text-white">{questionCount}</div>
            <div className="text-xs text-blue-100 uppercase tracking-wide">Questions</div>
          </div>
        </div>
      </div>
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
    </motion.div>
  );
};

export default ResultsHeader;