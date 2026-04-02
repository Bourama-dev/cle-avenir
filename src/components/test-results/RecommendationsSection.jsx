import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Briefcase, TrendingUp } from 'lucide-react';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';

const RecommendationGroup = ({ title, levelInfo, metiers, navigate }) => {
  if (!metiers || metiers.length === 0) return null;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-3 h-8 rounded-full ${levelInfo.color}`}></div>
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <Badge variant="outline" className={`${levelInfo.color} bg-opacity-10 text-slate-700 ml-2`}>
          {levelInfo.min}-{levelInfo.max}%
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metiers.map((metier, idx) => (
          <Card key={idx} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-slate-200 group">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <Badge className={`${levelInfo.color} text-white border-0 shadow-sm`}>
                  {metier.compatibility}% Match
                </Badge>
                {metier.demand && (
                   <span className="text-xs font-medium text-slate-500 flex items-center bg-slate-100 px-2 py-1 rounded-md">
                     <TrendingUp className="w-3 h-3 mr-1" /> {metier.demand}
                   </span>
                )}
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {metier.libelle || metier.title}
              </h4>
              
              <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1">
                {metier.description || "Découvrez les détails de ce métier qui correspond à votre profil."}
              </p>
              
              <div className="space-y-2 mb-6">
                 {metier.salary && (
                   <div className="text-sm text-emerald-600 font-medium flex items-center">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                     {metier.salary}
                   </div>
                 )}
                 {metier.tags && metier.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-3">
                     {metier.tags.slice(0, 3).map((tag, tIdx) => (
                       <Badge key={tIdx} variant="secondary" className="text-xs bg-slate-100 text-slate-600 font-normal">
                         {tag}
                       </Badge>
                     ))}
                   </div>
                 )}
              </div>

              <Button 
                onClick={() => navigate(`/metier/${metier.code}`)} 
                variant="outline" 
                className="w-full mt-auto group-hover:bg-slate-900 group-hover:text-white transition-colors"
              >
                Explorer ce métier <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RecommendationsSection = ({ recommendations }) => {
  const navigate = useNavigate();

  if (!recommendations) return null;

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-indigo-600" />
          Vos Métiers Sur-Mesure
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Notre algorithme avancé a analysé des centaines de métiers pour trouver ceux qui résonnent parfaitement avec votre profil RIASEC, vos valeurs et vos compétences.
        </p>
      </div>

      <RecommendationGroup 
        title="Vos Matchs Parfaits" 
        levelInfo={MATCHING_CONFIG.MATCH_SCORE_RANGES.PERFECT}
        metiers={recommendations.perfectMatches} 
        navigate={navigate} 
      />
      
      <RecommendationGroup 
        title="Excellentes Pistes" 
        levelInfo={MATCHING_CONFIG.MATCH_SCORE_RANGES.EXCELLENT}
        metiers={recommendations.excellentMatches} 
        navigate={navigate} 
      />
      
      <RecommendationGroup 
        title="Bonnes Alternatives" 
        levelInfo={MATCHING_CONFIG.MATCH_SCORE_RANGES.GOOD}
        metiers={recommendations.goodMatches} 
        navigate={navigate} 
      />
      
      {(!recommendations.perfectMatches?.length && !recommendations.excellentMatches?.length && !recommendations.goodMatches?.length) && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Aucun match direct trouvé</h3>
          <p className="text-slate-500">Nous vous conseillons d'explorer la liste complète des métiers ou de repasser le test.</p>
          <Button onClick={() => navigate('/metiers')} className="mt-4">Explorer tous les métiers</Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;