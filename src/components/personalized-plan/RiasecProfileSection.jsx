import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
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
  if (!riasecProfile || Object.keys(riasecProfile).length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm mb-8 animate-fade-in">
        <CardContent className="p-8 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Aucune donnée de profil RIASEC disponible.</p>
          <p className="text-sm text-slate-400 mt-2">Passez le test d'orientation pour découvrir votre profil.</p>
        </CardContent>
      </Card>
    );
  }

  // Normalize and sort data
  const entries = Object.entries(riasecProfile)
    .filter(([k]) => ['R','I','A','S','E','C'].includes(k))
    .map(([letter, score]) => ({
      letter,
      score: Math.round(Number(score) || 0),
      ...DIMENSION_LABELS[letter]
    }))
    .sort((a, b) => b.score - a.score);
  
  const strengths = entries.slice(0, 3);
  const toDevelop = entries.slice(-3).reverse(); // Lowest first

  const dominantType = strengths[0]?.letter;

  return (
    <Card className="border-slate-200 shadow-sm mb-10 overflow-hidden animate-fade-in">
      <CardHeader className="bg-slate-50/80 border-b border-slate-100">
        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
          Analyse de votre Empreinte RIASEC
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* Progress Bars Column */}
          <div>
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Toutes vos dimensions</h3>
             <div className="space-y-5">
                {entries.map(dim => (
                   <div key={dim.letter} className="group">
                      <div className="flex justify-between items-end mb-1">
                         <div>
                           <span className={`font-bold ${dim.textColor} text-sm uppercase`}>{dim.name}</span>
                           <span className="text-xs text-slate-400 ml-2 hidden sm:inline-block">{dim.desc}</span>
                         </div>
                         <span className="text-slate-700 font-bold">{dim.score}%</span>
                      </div>
                      <Progress 
                        value={dim.score} 
                        className="h-2.5 bg-slate-100 rounded-full overflow-hidden" 
                        indicatorClassName={`${dim.color} transition-all duration-1000 ease-out`} 
                      />
                   </div>
                ))}
             </div>
          </div>

          {/* Strengths & Development Column */}
          <div className="flex flex-col gap-6">
             {dominantType && MATCHING_CONFIG?.PROFILE_DESCRIPTIONS?.[dominantType] && (
                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50">
                  <h4 className="text-sm font-bold text-indigo-800 uppercase mb-2">Profil Dominant : {DIMENSION_LABELS[dominantType].name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {MATCHING_CONFIG.PROFILE_DESCRIPTIONS[dominantType]}
                  </p>
                </div>
             )}

             <div className="grid sm:grid-cols-2 gap-6 h-full">
               <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 flex flex-col">
                  <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2 pb-2 border-b border-emerald-200/50">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Vos Forces
                  </h4>
                  <ul className="space-y-3 flex-1">
                     {strengths.map(dim => (
                       <li key={dim.letter} className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full ${dim.color} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}>
                            {dim.letter}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{dim.name}</div>
                            <div className="text-xs text-emerald-700">{dim.score}% de correspondance</div>
                          </div>
                       </li>
                     ))}
                  </ul>
               </div>
               
               <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 flex flex-col">
                  <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 pb-2 border-b border-amber-200/50">
                     <Target className="w-5 h-5 text-amber-600" /> À Développer
                  </h4>
                  <ul className="space-y-3 flex-1">
                     {toDevelop.map(dim => (
                       <li key={dim.letter} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                          <span className={`w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-300 shrink-0`}>
                            {dim.letter}
                          </span>
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

        </div>
      </CardContent>
    </Card>
  );
};

export default RiasecProfileSection;