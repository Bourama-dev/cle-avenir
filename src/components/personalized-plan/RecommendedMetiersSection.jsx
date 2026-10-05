import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, ArrowRight, Plus, Star, Euro, TrendingUp, Search, GraduationCap, ChevronDown,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserEducationLevel, EDUCATION_ORDER, EDUCATION_LABELS } from '@/utils/educationUtils';
import { getMetierSalary } from '@/utils/salaryUtils';

/**
 * Compute an "education gap" label for a metier.
 *  ✓ Accessible   — user's level already meets requirement
 *  ⬆ +1 an etc.  — user needs to study N more years
 */
const getEducationGap = (metier, userProfile) => {
  if (!userProfile?.education_level) return null;
  const userLevel = getUserEducationLevel(userProfile);

  const rawReq = metier.niveau_etudes || metier.educationLevel || null;
  if (!rawReq) return null;

  const reqLevel = EDUCATION_ORDER[rawReq] ??
    EDUCATION_ORDER[String(rawReq).toLowerCase().replace(/\s/g, '')] ?? null;

  if (reqLevel === null) return null;

  if (userLevel >= reqLevel) {
    return { accessible: true, label: 'Accessible', diff: 0 };
  }

  const LEVEL_NAMES = Object.entries(EDUCATION_ORDER)
    .find(([, v]) => v === reqLevel)?.[0] || rawReq;

  return {
    accessible: false,
    label: `Requis : ${EDUCATION_LABELS[LEVEL_NAMES] || LEVEL_NAMES}`,
    diff: reqLevel - userLevel,
  };
};

const RIASEC_LABEL = { R:'manuel', I:'analytique', A:'créatif', S:'social', E:'entrepreneurial', C:'rigoureux' };

const Title = ({ children, sub }) => (
  <div className="mb-3 px-1">
    <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
      <Briefcase className="w-5 h-5 text-indigo-600" /> {children}
    </h2>
    {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
  </div>
);

const MetierCard = ({ metier, idx, userProfile, onAddMetier, navigate }) => {
  const [open, setOpen] = useState(false);
  const educationGap = getEducationGap(metier, userProfile);
  const code = metier.code || metier.metierCode;
  const score = Math.round(metier.match_score || metier.compatibility || metier.finalScore || 85);

  return (
    <article className="relative flex flex-col h-full rounded-3xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center border border-indigo-100">
            #{idx + 1}
          </span>
          {idx === 0 && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Meilleur match
            </span>
          )}
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none whitespace-nowrap">
          <Star className="w-3 h-3 mr-1 fill-current" />{score}%
        </Badge>
      </div>

      <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.75rem]">
        {metier.libelle || metier.name || metier.title}
      </h3>

      <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
        <div className="flex items-center text-sm text-slate-700 font-medium">
          <Euro className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          <span className="truncate">{getMetierSalary(metier)}</span>
        </div>
        <div className="flex items-center text-sm text-slate-700 font-medium">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
          <span className="truncate">{metier.debouches || metier.demandLevel || 'Opportunités variables'}</span>
        </div>
      </div>

      {educationGap && (
        <div className="mt-3">
          {educationGap.accessible ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1.5">
              <GraduationCap className="w-3 h-3" /> Niveau atteint
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1.5">
              <GraduationCap className="w-3 h-3" /> {educationGap.label}
            </Badge>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="mt-3 min-h-[44px] flex items-center justify-between text-sm font-semibold text-indigo-700"
      >
        {open ? 'Moins de détails' : 'Plus de détails'}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-2 pb-2">
          <p className="text-sm text-slate-600">
            {metier.description || metier.definition || 'Découvrez ce métier qui correspond à votre profil RIASEC.'}
          </p>
          <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
            ROME: {code || 'N/A'}
          </span>
          {metier.hybridProfile && metier.hybridProfile.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {metier.hybridProfile.map((prof, pIdx) => (
                <Badge key={pIdx} variant="outline" className="text-xs text-indigo-700 border-indigo-200 bg-indigo-50">
                  Profil {prof}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-11 rounded-xl border-slate-300 text-slate-700"
          onClick={() => navigate(`/metier/${code}`)}
        >
          Détails <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button
          className="h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => onAddMetier && onAddMetier(metier)}
        >
          <Plus className="w-4 h-4 mr-1" /> Cibler
        </Button>
      </div>
    </article>
  );
};

const RecommendedMetiersSection = ({ metiers, onAddMetier, isLoading, userProfile, plan }) => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  if (isLoading) {
    return (
      <section>
        <Title>Métiers recommandés</Title>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2].map(i => (
            <div key={i} className="w-[82%] shrink-0 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
              <Skeleton className="h-9 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!metiers || metiers.length === 0) {
    return (
      <section>
        <Title>Métiers recommandés</Title>
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center flex flex-col items-center text-slate-500">
          <Search className="w-10 h-10 text-slate-300 mb-3" />
          <p className="mb-1 font-medium">Aucun métier recommandé trouvé pour le moment.</p>
          <p className="text-sm text-slate-400 mb-4">
            Passez le test d'orientation pour obtenir des recommandations personnalisées.
          </p>
          <Button onClick={() => navigate('/test-orientation')} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700">
            Passer le test
          </Button>
        </div>
      </section>
    );
  }

  const riasecProfile = plan?.riasec_profile || null;
  const riasecTop = riasecProfile
    ? Object.entries(riasecProfile)
        .filter(([k]) => ['R','I','A','S','E','C'].includes(k))
        .sort(([, a], [, b]) => b - a)[0]?.[0]
    : null;
  const profileHint = riasecTop ? ` adaptés à ton profil ${RIASEC_LABEL[riasecTop] || ''}` : '';
  const sub = profileHint
    ? `Métiers${profileHint}${userProfile?.education_level ? `, accessibles avec ton niveau (${userProfile.education_level})` : ''}`
    : null;

  return (
    <section>
      <Title sub={sub}>Top {Math.min(metiers.length, 3)} métiers recommandés</Title>
      <div className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible">
        {metiers.slice(0, 3).map((metier, idx) => (
          <motion.div
            key={metier.code || idx}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: reduce ? 0 : idx * 0.05 }}
            className="snap-center shrink-0 w-[82%] sm:w-[60%] md:w-[46%] lg:w-auto"
          >
            <MetierCard metier={metier} idx={idx} userProfile={userProfile} onAddMetier={onAddMetier} navigate={navigate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedMetiersSection;
