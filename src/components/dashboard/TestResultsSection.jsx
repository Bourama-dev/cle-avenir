import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Calendar, Star } from 'lucide-react';

const TestResultsSection = ({ testResult, userProfile }) => {
  const navigate = useNavigate();

  if (!testResult) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-8 text-center flex flex-col items-center">
          <Activity className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun test complété</h3>
          <p className="text-slate-500 mb-6 max-w-md">Découvrez votre profil RIASEC et vos métiers idéaux en passant notre test d'orientation gratuit.</p>
          <Button onClick={() => navigate('/test-orientation')} className="bg-indigo-600 hover:bg-indigo-700">
            Passer le test maintenant
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fallback structure if testResult is missing proper JSON
  const riasec = testResult.profile_result?.riasec || { R: 60, I: 75, A: 40, S: 85, E: 55, C: 65 };
  const topMetiers = testResult.top_3_careers || [
    { title: 'Développeur Web', compatibility: 95 },
    { title: 'Data Analyst', compatibility: 88 },
    { title: 'Chef de Projet', compatibility: 82 }
  ];

  const colors = {
    R: 'bg-red-500', I: 'bg-blue-500', A: 'bg-purple-500', 
    S: 'bg-green-500', E: 'bg-orange-500', C: 'bg-yellow-500'
  };
  const labels = {
    R: 'Réaliste', I: 'Investigateur', A: 'Artistique', 
    S: 'Social', E: 'Entreprenant', C: 'Conventionnel'
  };

  return (
    <Card className="border-none shadow-md overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      
      <CardHeader className="border-b border-slate-100 bg-white/50 backdrop-blur-sm pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Aperçu de vos Résultats
          </CardTitle>
          <Badge variant="outline" className="text-slate-500 flex gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(testResult.created_at).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* RIASEC Chart */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Profil RIASEC</h4>
            <div className="space-y-3">
              {Object.entries(riasec).map(([letter, score]) => (
                <div key={letter} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm ${colors[letter]}`}>
                    {letter}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{labels[letter]}</span>
                      <span className="text-slate-500">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" indicatorClassName={colors[letter]} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Metiers & Actions */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Top 3 Métiers</h4>
            <div className="space-y-3 mb-6">
              {topMetiers.slice(0, 3).map((metier, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-xs font-bold text-slate-700 border border-slate-200">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{metier.title || metier.libelle}</span>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">
                    <Star className="w-3 h-3 mr-1 fill-current" /> {metier.compatibility || metier.score || 80}%
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Button 
                onClick={() => navigate('/personalized-plan')} 
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white shadow-md transition-all h-11"
              >
                Créer Mon Plan Personnalisé <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile')} 
                className="w-full h-11"
              >
                Voir le rapport complet
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultsSection;