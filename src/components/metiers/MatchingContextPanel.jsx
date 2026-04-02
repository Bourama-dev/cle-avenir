import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, Hexagon, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MatchingContextPanel = ({ profileType, competencies = [], sectors = [], score }) => {
  
  if (!profileType && competencies.length === 0 && sectors.length === 0) {
    return null; // Don't render if no matching data
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 shadow-sm overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <CardHeader className="pb-3 relative z-10 border-b border-indigo-100/50">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
          <Target className="w-5 h-5 text-indigo-600" /> 
          Pourquoi ce métier vous correspond ?
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-6 relative z-10">
        {/* Profile Alignment */}
        {profileType && (
          <div>
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Hexagon className="w-4 h-4 text-purple-500" /> Alignement avec votre profil
            </h4>
            <p className="text-sm text-slate-600 bg-white/60 p-3 rounded-lg border border-white">
              Ce métier mobilise fortement les caractéristiques du profil <span className="font-bold text-indigo-700">{profileType}</span>, ce qui correspond à votre manière d'aborder les défis professionnels.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Matching Skills */}
          {competencies.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                <Zap className="w-4 h-4 text-amber-500" /> Compétences partagées
              </h4>
              <div className="flex flex-wrap gap-2">
                {competencies.map((comp, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-amber-100/50 text-amber-800 border-amber-200/50 hover:bg-amber-100 flex gap-1 items-center">
                    <CheckCircle2 className="w-3 h-3" /> {comp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Matching Sectors/Environments */}
          {sectors.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                <Lightbulb className="w-4 h-4 text-emerald-500" /> Secteurs affinitaires
              </h4>
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-emerald-100/50 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100 flex gap-1 items-center">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {score && (
          <div className="mt-4 pt-4 border-t border-indigo-100/50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Score de compatibilité global</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="font-bold text-indigo-700">{score}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchingContextPanel;