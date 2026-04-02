import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MousePointerClick, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const getRankStyles = (rank) => {
  switch (rank) {
    case 1:
      return {
        badge: '🥇',
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-900',
        shadow: 'shadow-amber-200/50'
      };
    case 2:
      return {
        badge: '🥈',
        bg: 'bg-gradient-to-br from-slate-50 to-slate-200',
        border: 'border-slate-300',
        text: 'text-slate-800',
        shadow: 'shadow-slate-200/50'
      };
    case 3:
      return {
        badge: '🥉',
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        border: 'border-orange-300',
        text: 'text-orange-900',
        shadow: 'shadow-orange-200/50'
      };
    default:
      return {
        badge: '🎖️',
        bg: 'bg-white',
        border: 'border-slate-200',
        text: 'text-slate-800',
        shadow: 'shadow-slate-100'
      };
  }
};

const RIASEC_COLORS = {
  R: 'bg-red-100 text-red-800 border-red-200',
  I: 'bg-blue-100 text-blue-800 border-blue-200',
  A: 'bg-purple-100 text-purple-800 border-purple-200',
  S: 'bg-green-100 text-green-800 border-green-200',
  E: 'bg-orange-100 text-orange-800 border-orange-200',
  C: 'bg-slate-100 text-slate-800 border-slate-200'
};

const CareerCard = ({ career, rank, onView, onLike, onChoose, isLiked, isChosen }) => {
  const styles = getRankStyles(rank);
  const score = (career.final_score * 10).toFixed(1);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className={`relative rounded-2xl border-2 p-6 md:p-8 ${styles.bg} ${styles.border} shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-6`}
    >
      {/* Rank Badge */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md border border-slate-100 z-10">
        {styles.badge}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${styles.text}`}>
                {career.libelle}
              </h2>
            </div>
            <p className="text-sm font-mono text-slate-500 bg-white/50 px-2 py-1 rounded inline-block">
              ROME: {career.code}
            </p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-center border border-slate-100 shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match</div>
            <div className={`text-2xl md:text-3xl font-black ${styles.text}`}>
              {score}%
            </div>
          </div>
        </div>

        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {career.description || 'Description non disponible pour ce métier.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {career.riasecMajeur && (
            <Badge variant="outline" className={`${RIASEC_COLORS[career.riasecMajeur]} px-3 py-1 font-semibold`}>
              Majeur: {career.riasecMajeur}
            </Badge>
          )}
          {career.riasecMineur && (
            <Badge variant="outline" className={`${RIASEC_COLORS[career.riasecMineur]} px-3 py-1`}>
              Mineur: {career.riasecMineur}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 md:w-48 shrink-0">
        <Button 
          variant="outline" 
          className="w-full bg-white/80 hover:bg-white border-slate-200"
          onClick={() => onView(career)}
        >
          <MousePointerClick className="mr-2 h-4 w-4" /> Voir la fiche
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className={`bg-white/80 hover:bg-white border-slate-200 ${isLiked ? 'text-pink-600 border-pink-200 bg-pink-50' : ''}`}
            onClick={() => onLike(career.code)}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </Button>
          <Button 
            className={`flex-1 ${isChosen ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            onClick={() => onChoose(career)}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> {isChosen ? 'Choisi' : 'Choisir'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerCard;