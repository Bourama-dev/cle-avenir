import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Target, AlertCircle, ChevronDown } from 'lucide-react';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';

const DIMENSION_LABELS = {
  R: { name: 'Réaliste', desc: 'Pratique, technique, concret', color: 'bg-riasec-r', textColor: 'text-riasec-r' },
  I: { name: 'Investigateur', desc: 'Analytique, intellectuel, curieux', color: 'bg-riasec-i', textColor: 'text-riasec-i' },
  A: { name: 'Artistique', desc: 'Créatif, expressif, original', color: 'bg-riasec-a', textColor: 'text-riasec-a' },
  S: { name: 'Social', desc: 'Empathique, coopératif, aidant', color: 'bg-riasec-s', textColor: 'text-riasec-s' },
  E: { name: 'Entreprenant', desc: 'Persuasif, leader, ambitieux', color: 'bg-riasec-e', textColor: 'text-riasec-e' },
  C: { name: 'Conventionnel', desc: 'Organisé, méthodique, rigoureux', color: 'bg-riasec-c', textColor: 'text-riasec-c' },
};

const RiasecProfileSection = ({ riasecProfile }) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  if (!riasecProfile || Object.keys(riasecProfile).length === 0) {
    return (
      <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 text-center flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-600 font-medium">Aucune donnée de profil RIASEC disponible.</p>
        <p className="text-sm text-slate-400 mt-1">Passez le test d'orientation pour découvrir votre profil.</p>
      </section>
    );
  }

  const rawScores = Object.entries(riasecProfile)
    .filter(([k]) => ['R','I','A','S','E','C'].includes(k))
    .map(([, v]) => Number(v) || 0);
  const maxScore = Math.max(...rawScores, 1);

  const entries = Object.entries(riasecProfile)
    .filter(([k]) => ['R','I','A','S','E','C'].includes(k))
    .map(([letter, score]) => ({
      letter,
      score: maxScore <= 100
        ? Math.min(100, Math.round(Number(score) || 0))
        : Math.round((Number(score) || 0) / maxScore * 100),
      ...DIMENSION_LABELS[letter],
    }))
    .sort((a, b) => b.score - a.score);

  const strengths = entries.slice(0, 3);
  const toDevelop = entries.slice(-3).reverse();
  const dominantType = strengths[0]?.letter;
  const dominantDesc = dominantType && MATCHING_CONFIG?.PROFILE_DESCRIPTIONS?.[dominantType];

  return (
    <section className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 md:p-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Votre empreinte RIASEC</p>

        <div className="flex gap-2 mb-4">
          {strengths.map((dim, i) => (
            <div
              key={dim.letter}
              className={`flex-1 rounded-2xl p-3 flex flex-col items-center text-center ${i === 0 ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}
            >
              <span className={`w-10 h-10 rounded-full ${dim.color} text-white flex items-center justify-center font-bold shadow-sm`}>
                {dim.letter}
              </span>
              <span className="text-xs font-bold text-slate-800 mt-2 leading-tight">{dim.name}</span>
              <span className="text-xs text-slate-500">{dim.score}%</span>
            </div>
          ))}
        </div>

        {dominantDesc && (
          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4">
            <h3 className="text-xs font-bold text-indigo-800 uppercase mb-1">
              Profil dominant : {DIMENSION_LABELS[dominantType].name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 md:line-clamp-none">{dominantDesc}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full min-h-[48px] flex items-center justify-between px-5 md:px-6 border-t border-slate-100 text-sm font-semibold text-indigo-700 active:bg-indigo-50"
      >
        {open ? 'Masquer le détail' : 'Voir les 6 dimensions'}
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 md:p-6 pt-4 space-y-4 border-t border-slate-100">
              {entries.map(dim => (
                <div key={dim.letter}>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="min-w-0">
                      <span className={`font-bold text-sm uppercase ${dim.textColor}`}>{dim.name}</span>
                      <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{dim.desc}</span>
                    </div>
                    <span className="text-slate-700 font-bold text-sm">{dim.score}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${dim.color}`}
                      initial={{ width: reduce ? `${dim.score}%` : 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ duration: reduce ? 0 : 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Vos forces
                  </h4>
                  <ul className="space-y-2">
                    {strengths.map(dim => (
                      <li key={dim.letter} className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full ${dim.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>{dim.letter}</span>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{dim.name}</div>
                          <div className="text-xs text-emerald-700">{dim.score}% de correspondance</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-4">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" /> À développer
                  </h4>
                  <ul className="space-y-2">
                    {toDevelop.map(dim => (
                      <li key={dim.letter} className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 border border-slate-300 flex items-center justify-center font-bold text-sm shrink-0">{dim.letter}</span>
                        <div>
                          <div className="text-sm font-bold text-slate-700">{dim.name}</div>
                          <div className="text-xs text-amber-700">{dim.score}% de correspondance</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RiasecProfileSection;
