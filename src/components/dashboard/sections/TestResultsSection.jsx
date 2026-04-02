import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, Activity } from 'lucide-react';
import { getTopDimensions } from '@/utils/riasecMatchingAlgorithm';
import { RIASEC_DESCRIPTIONS } from '@/data/riasecDescriptions';

const TestResultsSection = ({ testData }) => {
  const navigate = useNavigate();

  if (!testData || !testData.results) {
    return (
      <Card className="shadow-sm border-slate-200">
        <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-full">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Aucun résultat d'orientation</h3>
          <p className="text-slate-500 mb-6 max-w-md">Passez notre test d'orientation adaptatif pour découvrir les métiers faits pour vous.</p>
          <Button onClick={() => navigate('/test-orientation')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Commencer le test
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Parse results safely
  const topCareers = testData.top_3_careers || [];
  
  // Try to get normalized user vector (from V2 logic)
  const normalizedProfile = topCareers[0]?.userProfile || testData.profile_result?.normalized100 || null;
  const topDims = normalizedProfile ? getTopDimensions(normalizedProfile, 3) : [];

  return (
    <Card className="shadow-sm border-slate-200 flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center text-slate-800">
            <Target className="w-5 h-5 mr-2 text-indigo-600" />
            Votre Profil d'Orientation
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/test-results')} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            Voir détails <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        
        {/* Dominant Badges */}
        {topDims.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dimensions Dominantes</p>
            <div className="flex flex-wrap gap-2">
              {topDims.map(dim => {
                const desc = RIASEC_DESCRIPTIONS[dim];
                return (
                  <div key={dim} className="px-3 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-2"
                       style={{ borderColor: `${desc.color}40`, backgroundColor: `${desc.color}10`, color: desc.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: desc.color }}></span>
                    {desc.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-2">Top Correspondances</p>
        
        <div className="space-y-3 flex-1">
          {topCareers.slice(0, 3).map((career, idx) => (
            <div key={idx} onClick={() => navigate(`/metiers/${career.code}`)} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors line-clamp-1">{career.libelle || career.name}</span>
                <span className="text-xs text-slate-500 font-mono">ROME: {career.code}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-black text-indigo-600">
                  {career.matchScore || Math.round((career.final_score || 0) * 100)}%
                </div>
              </div>
            </div>
          ))}
          {topCareers.length === 0 && (
             <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <span className="text-sm text-slate-500 flex items-center"><Activity className="w-4 h-4 mr-2" /> Résultats en cours de calcul...</span>
             </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Button variant="outline" className="w-full text-slate-600" onClick={() => navigate('/test-orientation')}>
            Refaire le test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultsSection;