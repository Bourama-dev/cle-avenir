import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { extractRomeCode } from '@/utils/metierHelper';

const TopMatches = ({ matches = [] }) => {
  const navigate = useNavigate();
  // Ensure we only show top 2
  const topMatches = matches.slice(0, 2);

  const handleDetailClick = (match) => {
    const romeCode = extractRomeCode(match, 'TopMatches');
    
    if (!romeCode) {
      console.error("[TopMatches] Cannot navigate to metier detail: missing code", match);
      return;
    }
    
    if (romeCode === ':code') {
      console.error("[TopMatches] Invalid ROME code value ':code'.");
      return;
    }

    console.log(`[TopMatches] Navigation vers: /metier/${romeCode}`);
    navigate(`/metier/${romeCode}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Vos meilleures correspondances</h2>
        <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          {matches.length} métiers trouvés
        </span>
      </div>

      <div className="grid gap-6">
        {topMatches.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="match-card p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon & Rank */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-sm border border-slate-100">
                  {match.icon || '🚀'}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{match.title || match.libelle}</h3>
                      {index === 0 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-yellow-200">
                          <Star className="w-3 h-3 fill-current" /> Top Match
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="w-32 md:w-48 match-score-bar">
                          <div 
                             className="match-score-fill" 
                             style={{ width: `${match.score || match.match_score || 95}%` }}
                          />
                       </div>
                       <span className="text-sm font-bold text-violet-600">{match.score || match.match_score || 95}%</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-violet-600 -mt-2 -mr-2">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  {match.description || "Un métier passionnant qui combine vos intérêts pour la technologie et l'innovation, offrant d'excellentes perspectives d'évolution."}
                </p>

                <div className="pt-2 flex items-center justify-between">
                   <button className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors">
                      Plus de détails <span className="text-xs">▼</span>
                   </button>
                   
                   <Button 
                      onClick={() => handleDetailClick(match)}
                      className="bg-slate-900 hover:bg-violet-700 text-white rounded-lg px-6 shadow-md transition-all hover:shadow-lg"
                   >
                      Fiche métier détaillée <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopMatches;