import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowRight, Briefcase, GraduationCap, Trophy, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateMatches } from '@/lib/matchingAlgorithm';

const CareerMatchCard = ({ career, onClick }) => {
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-slate-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {career.matchPercentage}% Compatible
              </Badge>
              {career.outlook === 'Très favorable' && (
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  Top Tendance
                </Badge>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
              {career.title}
            </h3>
            
            <p className="text-slate-600 line-clamp-2 text-sm">
              {career.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 pt-2">
              {Object.keys(career.tags).slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
             <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
             </div>
             <div className="text-right text-xs text-slate-400 font-medium">
               {career.salary}
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || {};

  const matches = useMemo(() => {
    if (!answers) return [];
    return calculateMatches(answers);
  }, [answers]);

  if (!answers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Aucun résultat</CardTitle>
            <CardDescription>
              Veuillez compléter le test pour voir vos recommandations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/test')} className="w-full">
              Commencer le test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topMatches = matches.slice(0, 3);
  const otherMatches = matches.slice(3, 7);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2">Analyse Terminée</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Vos Carrières Idéales
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Basé sur votre profil, nous avons identifié les métiers qui correspondent le mieux à votre personnalité et vos ambitions.
          </p>
        </div>

        {/* Top Matches Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          {topMatches.map((career, index) => (
             <div key={career.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border-none px-3 py-1 shadow-sm flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> #1 Match
                    </Badge>
                  </div>
                )}
                <div className={`h-full ${index === 0 ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}>
                   <CareerMatchCard 
                     career={career} 
                     onClick={() => navigate(`/metiers`, { state: { highlightedJob: career.title } })} 
                   />
                </div>
             </div>
          ))}
        </div>

        {/* Secondary Matches List */}
        <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            D'autres pistes intéressantes
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
             {otherMatches.map(career => (
                <div 
                   key={career.id}
                   className="bg-white p-4 rounded-lg border border-slate-200 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between group"
                   onClick={() => navigate(`/metiers`, { state: { highlightedJob: career.title } })}
                >
                   <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-800">{career.title}</div>
                      <Badge variant="outline" className="text-xs text-slate-500 font-normal">
                         {career.matchPercentage}%
                      </Badge>
                   </div>
                   <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
             ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
           <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h3 className="text-2xl font-bold mb-4">Ces résultats ne sont qu'un début</h3>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                 Explorez ces métiers en détail, découvrez les formations pour y accéder et consultez les offres d'emploi disponibles près de chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button 
                    size="lg" 
                    variant="default" 
                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold"
                    onClick={() => navigate('/metiers')}
                 >
                    <Briefcase className="mr-2 h-4 w-4" /> Explorer le catalogue
                 </Button>
                 <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                    onClick={() => navigate('/formations')}
                 >
                    <GraduationCap className="mr-2 h-4 w-4" /> Trouver une formation
                 </Button>
                 <Button 
                    size="lg" 
                    variant="ghost" 
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={() => navigate('/test')}
                 >
                    <RefreshCw className="mr-2 h-4 w-4" /> Refaire le test
                 </Button>
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default QuizResults;