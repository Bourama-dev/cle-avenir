import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Info } from 'lucide-react';
import { getConfidenceLevel, getConfidenceRecommendation } from '@/utils/matchingUtils';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';

const ConfidenceIndicator = ({ score, patterns }) => {
  const level = getConfidenceLevel(score);
  const recommendation = getConfidenceRecommendation(score);
  
  let colorClass = "text-red-500";
  let bgClass = "bg-red-500";
  let lightBgClass = "bg-red-50";
  
  if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.VERY_HIGH) {
    colorClass = "text-emerald-500";
    bgClass = "bg-emerald-500";
    lightBgClass = "bg-emerald-50";
  } else if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.HIGH) {
    colorClass = "text-green-500";
    bgClass = "bg-green-500";
    lightBgClass = "bg-green-50";
  } else if (score >= MATCHING_CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) {
    colorClass = "text-amber-500";
    bgClass = "bg-amber-500";
    lightBgClass = "bg-amber-50";
  }

  return (
    <Card className="shadow-sm border-slate-200 mb-8 overflow-hidden">
      <CardContent className="p-0 flex flex-col md:flex-row">
        <div className={`p-8 md:w-1/3 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 ${lightBgClass}`}>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
              <circle 
                cx="64" cy="64" r="56" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="351.85" 
                strokeDashoffset={351.85 - (351.85 * score) / 100} 
                className={`${colorClass} transition-all duration-1000 ease-out`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold ${colorClass}`}>{score}%</span>
            </div>
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Fiabilité {level}</h3>
        </div>
        
        <div className="p-8 md:w-2/3 flex flex-col justify-center bg-white">
          <div className="flex items-start gap-3 mb-6">
            <ShieldCheck className={`w-6 h-6 mt-1 shrink-0 ${colorClass}`} />
            <div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Qu'est-ce que cela signifie ?</h4>
              <p className="text-slate-600 leading-relaxed">{recommendation}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1 font-semibold flex items-center gap-1">
                Cohérence <Info className="w-3 h-3" />
              </div>
              <Progress value={patterns?.consistency || 80} className="h-1.5" indicatorClassName="bg-blue-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1 font-semibold">Contradictions</div>
              <Progress value={100 - (patterns?.contradictions * 20 || 0)} className="h-1.5" indicatorClassName="bg-amber-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1 font-semibold">Clarté</div>
              <Progress value={100 - (patterns?.randomness || 0)} className="h-1.5" indicatorClassName="bg-indigo-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceIndicator;