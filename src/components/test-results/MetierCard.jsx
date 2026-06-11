import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Lock, ChevronDown, ChevronUp, TrendingUp, Users, GraduationCap, Euro } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RIASEC_NAMES = {
  R: 'Réaliste', I: 'Investigateur', A: 'Artistique',
  S: 'Social',   E: 'Entreprenant', C: 'Conventionnel',
};

const DEMAND_LABELS = {
  très_élevée: { label: 'Très forte', color: 'text-green-700 bg-green-50 border-green-200' },
  élevée:      { label: 'Forte',      color: 'text-green-600 bg-green-50 border-green-200' },
  moyenne:     { label: 'Moyenne',    color: 'text-amber-600 bg-amber-50 border-amber-200'  },
  faible:      { label: 'Faible',     color: 'text-red-600 bg-red-50 border-red-200'        },
};

const GROWTH_LABELS = {
  croissant:   { label: '↑ En hausse', color: 'text-green-700' },
  stable:      { label: '→ Stable',    color: 'text-slate-600' },
  décroissant: { label: '↓ En baisse', color: 'text-red-600'   },
};

const getCompatibilityLabel = (score) => {
  if (score >= 80) return { label: 'Excellent match',  bg: 'bg-green-100 text-green-800 border-green-200' };
  if (score >= 70) return { label: 'Très bon match',   bg: 'bg-green-50 text-green-700 border-green-200'  };
  if (score >= 60) return { label: 'Bon match',        bg: 'bg-blue-100 text-blue-800 border-blue-200'    };
  if (score >= 50) return { label: 'Match possible',   bg: 'bg-amber-50 text-amber-700 border-amber-200'  };
  return               { label: 'À explorer',      bg: 'bg-slate-100 text-slate-600 border-slate-200'  };
};

/** Explication réelle : quelles dimensions user correspondent aux dimensions métier */
const generateMatchExplanation = (userProfile, metier) => {
  if (!userProfile || !metier) return 'Profil analysé par IA';

  const userTop = Object.entries(userProfile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([d]) => d);

  const metierRiasec = metier.details?.riasecMajeur
    ? [metier.details.riasecMajeur, metier.details.riasecMineur].filter(Boolean).join('')
    : '';
  const metierTop = metierRiasec
    ? [...metierRiasec].filter(c => RIASEC_NAMES[c])
    : [];

  const shared = userTop.filter(d => metierTop.includes(d));

  if (shared.length >= 2)
    return `Tes profils ${shared.map(d => RIASEC_NAMES[d]).join(' & ')} correspondent aux exigences clés de ce métier.`;
  if (shared.length === 1)
    return `Ton profil ${RIASEC_NAMES[shared[0]]} s'aligne avec la dimension principale de ce métier.`;
  if (metier.riasecScore >= 60)
    return `Tes dimensions ${userTop.slice(0, 2).map(d => RIASEC_NAMES[d]).join(' & ')} offrent une bonne complémentarité.`;
  return `Ce métier peut être un défi enrichissant selon ton profil ${userTop[0] ? RIASEC_NAMES[userTop[0]] : ''}.`;
};

/** Mini score bar avec label */
const ScoreBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const MetierCard = ({ metier, isBlurred, isTopThree, userProfile, onNavigate, onCreatePlan }) => {
  const [expanded, setExpanded] = useState(false);
  const compatibility = getCompatibilityLabel(metier.finalScore);
  const explanation   = generateMatchExplanation(userProfile, metier);
  const demand        = DEMAND_LABELS[metier.details?.demandLevel] || null;
  const growth        = GROWTH_LABELS[metier.details?.growthTrend] || null;

  const cardContent = (
    <Card
      className={`flex flex-col h-full transition-all duration-300 border-slate-200
        ${!isBlurred ? 'hover:shadow-xl hover:-translate-y-0.5' : ''}
        ${isTopThree ? 'border-amber-200 shadow-md ring-1 ring-amber-100' : ''}
      `}
      tabIndex={isBlurred ? -1 : 0}
      aria-hidden={isBlurred}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <CardHeader className="pb-3 relative">
        {isTopThree && !isBlurred && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3" /> Top Match
          </div>
        )}

        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Emoji + nom */}
            <div className="flex items-center gap-2 mb-1.5">
              {metier.emoji && <span className="text-2xl">{metier.emoji}</span>}
              <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight">
                {metier.name}
              </CardTitle>
            </div>
            {/* Secteur */}
            {metier.sector && (
              <span className="text-xs text-slate-400 font-medium">{metier.sector}</span>
            )}
          </div>

          {/* Score badge */}
          <div className={`px-3 py-2 rounded-xl font-black text-base shrink-0 border ${compatibility.bg}`}>
            {metier.finalScore}%
          </div>
        </div>

        {/* Label compatibilité */}
        <div className={`inline-block text-xs font-bold mt-2 px-2.5 py-1 rounded-full border ${compatibility.bg}`}>
          {compatibility.label}
        </div>

        {/* Explication du match */}
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="text-xs text-indigo-800 leading-relaxed">{explanation}</p>
        </div>
      </CardHeader>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <CardContent className="flex-grow space-y-4 pb-0">
        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {metier.rawMetier?.description || metier.rawMetier?.definition
            || 'Aucune description disponible pour ce métier.'}
        </p>

        {/* Recommandation IA */}
        {metier.recommendation && (
          <p className="text-xs text-slate-500 italic">{metier.recommendation}</p>
        )}

        {/* Infos rapides : salaire / demande / croissance */}
        <div className="flex flex-wrap gap-2">
          {metier.details?.salaryRange && (
            <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
              <Euro className="w-3 h-3" />
              {metier.details.salaryRange}
            </span>
          )}
          {demand && (
            <span className={`flex items-center gap-1 text-xs font-medium border px-2 py-1 rounded-full ${demand.color}`}>
              <Users className="w-3 h-3" />
              Demande : {demand.label}
            </span>
          )}
          {growth && (
            <span className={`flex items-center gap-1 text-xs font-medium ${growth.color}`}>
              <TrendingUp className="w-3 h-3" />
              {growth.label}
            </span>
          )}
          {metier.details?.niveau_etudes && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <GraduationCap className="w-3 h-3" />
              {metier.details.niveau_etudes}
            </span>
          )}
        </div>

        {/* Panneau détails dépliable */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-3">
                {/* Décomposition du score */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Décomposition du score</p>
                  <ScoreBar label="Profil RIASEC"    value={metier.riasecScore  || 0} color="bg-indigo-500" />
                  <ScoreBar label="Profil hybride"   value={metier.hybridScore  || 0} color="bg-violet-400" />
                  <ScoreBar label="Demande marché"   value={metier.demandScore  || 0} color="bg-emerald-500"/>
                  <ScoreBar label="Tendance secteur" value={metier.growthScore  || 0} color="bg-cyan-500"   />
                </div>

                {/* Conseil IA */}
                {metier.advice?.[0] && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800 mb-1">💡 Conseil Cléo</p>
                    <p className="text-xs text-amber-700 leading-relaxed">{metier.advice[0]}</p>
                  </div>
                )}

                {/* Prochaine étape */}
                {metier.nextSteps?.[0] && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-xs font-semibold text-green-800 mb-1">🎯 Prochaine étape</p>
                    <p className="text-xs text-green-700 leading-relaxed">{metier.nextSteps[0]}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle détails */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors py-1"
          disabled={isBlurred}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Masquer les détails' : 'Voir score détaillé + conseils'}
        </button>
      </CardContent>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <CardFooter className="flex gap-2 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl mt-auto">
        <Button
          variant="default"
          disabled={isBlurred}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
          onClick={() => !isBlurred && onNavigate(metier.metierCode)}
        >
          <BookOpen className="w-3.5 h-3.5 mr-1.5" />
          Détails
        </Button>
        <Button
          variant="secondary"
          disabled={isBlurred}
          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm"
          onClick={() => !isBlurred && onCreatePlan(metier)}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Mon plan
        </Button>
      </CardFooter>
    </Card>
  );

  if (!isBlurred) return cardContent;

  return (
    <div className="relative h-full select-none" aria-label="Résultat verrouillé">
      <div className="h-full blur-[6px] opacity-60 pointer-events-none">{cardContent}</div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center rounded-xl bg-white/10 backdrop-blur-[1px]">
        <div className="bg-slate-900/80 text-white p-4 rounded-full mb-3 shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <p className="font-bold text-slate-900 text-lg drop-shadow-md">Déverrouillé avec Premium</p>
      </div>
    </div>
  );
};

export default MetierCard;
