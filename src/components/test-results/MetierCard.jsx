import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RIASEC_NAMES = {
  R: 'Réaliste',
  I: 'Investigateur',
  A: 'Artistique',
  S: 'Social',
  E: 'Entreprenant',
  C: 'Conventionnel'
};

const getCompatibilityLabel = (score) => {
  if (score >= 80) return { label: '🟢 Excellent Match', color: 'text-green-700' };
  if (score >= 70) return { label: '🟢 Très Bon Match', color: 'text-green-600' };
  if (score >= 60) return { label: '🟡 Bon Match', color: 'text-blue-600' };
  if (score >= 50) return { label: '🟡 Match Possible', color: 'text-yellow-600' };
  return { label: '🔴 Faible Match', color: 'text-red-600' };
};

const generateMatchExplanation = (userProfile, metier) => {
  if (!userProfile || !metier) return [];

  const explanations = [];
  const profileEntries = Object.entries(userProfile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Check which RIASEC dimensions match
  profileEntries.forEach(([dim, score]) => {
    if (metier.riasecScore >= 70) {
      explanations.push(`${RIASEC_NAMES[dim]} : ${Math.round(score)}%`);
    }
  });

  if (explanations.length === 0) {
    explanations.push('Profil unique');
  }

  return explanations.slice(0, 2);
};

const MetierCard = ({ metier, isBlurred, isTopThree, userProfile, onNavigate, onCreatePlan }) => {
  const compatibility = getCompatibilityLabel(metier.finalScore);
  const matchExplanation = generateMatchExplanation(userProfile, metier);
  const cardContent = (
    <Card 
      className={`flex flex-col h-full transition-all duration-300 border-slate-200
        ${!isBlurred ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
        ${isTopThree ? 'border-amber-200 shadow-md ring-1 ring-amber-100' : ''}
      `}
      tabIndex={isBlurred ? -1 : 0}
      aria-hidden={isBlurred}
    >
      <CardHeader className="pb-4 relative">
        {isTopThree && !isBlurred && (
          <div className="absolute -top-3 -right-3 bg-premium-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3" /> Top Match
          </div>
        )}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight mb-2">
              {metier.name}
            </CardTitle>
            <div className={`text-xs font-bold mb-2 ${compatibility.color}`}>
              {compatibility.label}
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg font-extrabold text-sm shrink-0 whitespace-nowrap shadow-sm
            ${metier.finalScore >= 80 ? 'bg-green-100 text-green-800 border border-green-200' :
              metier.finalScore >= 70 ? 'bg-green-50 text-green-700 border border-green-200' :
              metier.finalScore >= 60 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}
          >
            {metier.finalScore}%
          </div>
        </div>

        {/* Why This Job Matches */}
        {matchExplanation.length > 0 && (
          <div className="mt-3 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-indigo-900 mb-1">Pourquoi ce métier:</p>
                <p className="text-indigo-700">{matchExplanation.join(' + ')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs font-mono text-slate-400 mt-2">ROME: {metier.metierCode}</div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-slate-600 text-sm line-clamp-4 leading-relaxed">
          {metier.rawMetier?.description || metier.rawMetier?.definition || "Aucune description détaillée n'est disponible pour ce métier."}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl mt-auto">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="default"
            disabled={isBlurred}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md"
            onClick={() => !isBlurred && onNavigate(metier.metierCode)}
            aria-label={`Voir les détails du métier ${metier.name}`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Voir les détails
          </Button>
          
          <Button
            variant="secondary"
            disabled={isBlurred}
            className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 shadow-md"
            onClick={() => !isBlurred && onCreatePlan(metier)}
            aria-label={`Créer un plan personnalisé pour ${metier.name}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Créer un plan
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  if (!isBlurred) {
    return cardContent;
  }

  return (
    <div className="relative h-full select-none" aria-label="Résultat verrouillé">
      <div className="h-full blur-[6px] opacity-60 pointer-events-none transition-all duration-500">
        {cardContent}
      </div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-white/10 backdrop-blur-[1px] rounded-xl">
        <div className="bg-slate-900/80 text-white p-4 rounded-full mb-3 shadow-xl backdrop-blur-md">
          <Lock className="w-8 h-8" />
        </div>
        <p className="font-bold text-slate-900 text-lg shadow-white drop-shadow-md">
          Déverrouillé avec Premium
        </p>
      </div>
    </div>
  );
};

export default MetierCard;