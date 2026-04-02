import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MetierCardIcon, { getMetierIconConfig } from './MetierCardIcon';
import { CircularProgress, DifficultyStars, TrendIndicator } from './MetierCardIndicators';
import { SectorBadge, SalaryBadge, RomeBadge } from './MetierCardBadges';
import { useNavigate } from 'react-router-dom';
import { extractRomeCode } from '@/utils/metierHelper';

const EnhancedMetierCard = ({ metier, onClick }) => {
  const navigate = useNavigate();
  
  if (!metier) return null;

  const romeCode = extractRomeCode(metier, 'EnhancedMetierCard');
  const config = getMetierIconConfig(romeCode);
  const score = metier.match_score || metier.score || metier.relevance || 0;
  const description = metier.description || "Découvrez ce métier passionnant...";
  const title = metier.libelle || metier.title || "Métier Inconnu";
  const sector = metier.domaine || metier.sector || (metier.sectors && metier.sectors[0]) || "Général";
  
  const handleDetailClick = () => {
    if (!romeCode) {
      console.error("[EnhancedMetierCard] Navigation échouée : code ROME manquant pour le métier", metier);
      return;
    }
    
    if (romeCode === ':code') {
      console.error("[EnhancedMetierCard] Invalid ROME code value ':code'.");
      return;
    }

    console.log(`[EnhancedMetierCard] Navigation vers: /metier/${romeCode}`);
    
    // Call onClick if provided (for backwards compatibility), otherwise navigate directly
    if (onClick) {
      onClick(romeCode);
    } else {
      navigate(`/metier/${romeCode}`);
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden p-6 transition-all duration-300",
        "bg-white/70 backdrop-blur-xl border border-white/50",
        "hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 group flex flex-col h-full",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-30 before:-z-10",
        config.gradient
      )}
    >
      {/* Header: Icon, Titles, Score */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex gap-4">
          <MetierCardIcon romeCode={romeCode} />
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <RomeBadge code={romeCode} />
              <SectorBadge sector={sector} />
            </div>
          </div>
        </div>
        
        {score > 0 && (
          <div className="shrink-0 flex flex-col items-center">
            <CircularProgress value={score} size={42} strokeWidth={4} />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
        {description}
      </p>

      {/* Stats Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Accessibilité</span>
          <DifficultyStars difficulty={metier.niveau_etudes || metier.difficulty} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Marché</span>
          <TrendIndicator trend={metier.debouches || metier.demand || metier.perspectives} />
        </div>
        {metier.salaire || metier.salary_range ? (
          <div className="col-span-2 pt-2 mt-1 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rémunération</span>
              <SalaryBadge salary={metier.salaire || metier.salary_range} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <Button 
        onClick={handleDetailClick}
        className="w-full mt-auto bg-slate-900 hover:bg-primary text-white shadow-md hover:shadow-lg transition-all rounded-xl h-11"
      >
        Fiche métier détaillée <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Card>
  );
};

export default EnhancedMetierCard;