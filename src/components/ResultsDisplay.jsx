import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  TrendingUp, 
  Briefcase,
  GraduationCap,
  FileText,
  Target,
  Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ScoreCard = ({ label, score, colorClass }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-100">
    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 text-center">{label}</span>
    <div className={`text-xl font-bold ${colorClass}`}>
      {score}%
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 font-medium truncate">{title}</p>
      <p className="text-sm font-bold text-slate-800 line-clamp-2" title={value}>{value}</p>
    </div>
  </div>
);

const getScoreColor = (score) => {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 55) return 'text-orange-500';
  return 'text-red-500';
};

const getScoreBg = (score) => {
  if (score >= 85) return 'from-green-400 to-green-500';
  if (score >= 70) return 'from-yellow-400 to-yellow-500';
  if (score >= 55) return 'from-orange-400 to-orange-500';
  return 'from-red-400 to-red-500';
};

const ResultsDisplay = ({ results }) => {
  const [expandedId, setExpandedId] = useState(results.length > 0 ? results[0].metierCode : null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!results || results.length === 0) return null;

  // Take top 10 results for display
  const displayResults = results.slice(0, 10);

  return (
    <div className="space-y-6">
      {displayResults.map((result) => {
        const isExpanded = expandedId === result.metierCode;
        const confidence = result.confidence || { color: 'bg-slate-500', label: 'Inconnu' };
        const scoreColorClass = getScoreColor(result.finalScore);
        const scoreBgClass = getScoreBg(result.finalScore);

        return (
          <Card key={result.metierCode} className="overflow-hidden shadow-sm border-slate-200 transition-all duration-300 hover:shadow-md">
            <div 
              className="p-5 cursor-pointer bg-white flex flex-col md:flex-row items-center justify-between gap-4"
              onClick={() => toggleExpand(result.metierCode)}
            >
              <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                <div className="text-3xl bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm shrink-0">
                  {result.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 truncate" title={result.name}>{result.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {result.metierCode}
                    </span>
                    {result.details?.riasecMajeur && (
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px]">
                        Majeur: {result.details.riasecMajeur}
                      </Badge>
                    )}
                    {result.details?.riasecMineur && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 text-[10px]">
                        Mineur: {result.details.riasecMineur}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
                  <span className={`text-3xl font-extrabold ${scoreColorClass}`}>{result.finalScore}%</span>
                </div>
                <div className="text-slate-400 p-2 rounded-full hover:bg-slate-100 transition-colors">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100">
              <div 
                className={`h-full bg-gradient-to-r ${scoreBgClass} transition-all duration-1000`}
                style={{ width: `${result.finalScore}%` }}
              />
            </div>

            {/* Expanded Content */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <CardContent className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-8">
                
                <div className="bg-white border border-blue-100 shadow-sm p-4 rounded-xl flex gap-4 items-start">
                  <div className="text-2xl mt-1">✨</div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Pourquoi ce métier ?</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide flex items-center gap-2">
                    <Award className="w-4 h-4" /> Détail de l'Algorithme
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <ScoreCard label="RIASEC" score={result.riasecScore} colorClass="text-indigo-600" />
                    <ScoreCard label="Hybride" score={result.hybridScore} colorClass="text-purple-600" />
                    <ScoreCard label="Stabilité" score={result.stabilityScore} colorClass="text-emerald-600" />
                    <ScoreCard label="Croissance" score={result.growthScore} colorClass="text-blue-600" />
                    <ScoreCard label="Demande" score={result.demandScore} colorClass="text-rose-600" />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Informations Métier (ROME)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoCard icon={DollarSign} title="Salaire" value={result.details?.salaryRange || "Non renseigné"} />
                    <InfoCard icon={TrendingUp} title="Débouchés" value={result.details?.debouches || "Non renseigné"} />
                    <InfoCard icon={GraduationCap} title="Niveau d'études" value={result.details?.niveau_etudes || "Non renseigné"} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  {result.advice && result.advice.length > 0 && (
                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                      <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4" /> Nos Conseils
                      </h4>
                      <ul className="space-y-2">
                        {result.advice.map((adv, idx) => (
                          <li key={idx} className="text-sm text-emerald-700 leading-relaxed flex gap-2">
                            <span className="text-emerald-400">•</span>
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.nextSteps && result.nextSteps.length > 0 && (
                    <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                      <h4 className="text-indigo-800 font-bold mb-3 flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4" /> Prochaines Étapes
                      </h4>
                      <ul className="space-y-3">
                        {result.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-indigo-700">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="mt-0.5 leading-snug">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ResultsDisplay;