import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Briefcase, ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TestResultsService } from '@/services/testResultsService';
import { TestHistoryService } from '@/services/testHistoryService';
import { openaiService } from '@/services/openaiService';

const MetierMatcher = ({ userProfile }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let answers = null;
        
        // 1. Try DB History
        if (userProfile?.id) {
           const history = await TestHistoryService.getTestHistory(userProfile.id);
           if (history && history.length > 0) {
             answers = history[0].answers;
           }
        }
        
        // 2. Fallback to LocalStorage (guest mode or recent test)
        if (!answers) {
            const local = localStorage.getItem('cleavenir_profile_test_results');
            if (local) {
               try {
                  // Handle both raw answers and new structure
                  const parsed = JSON.parse(local);
                  answers = parsed.answers || parsed; 
               } catch (e) {
                  console.error("Failed to parse local test results");
               }
            }
        }

        if (answers) {
          // Use the Service which includes the fallback logic (so we never get 0 matches if input is valid)
          const results = TestResultsService.generateResults(answers);
          setMatches(results.matchedCareers || []);
        } else {
            setMatches([]);
        }
      } catch (e) {
        console.error("Error loading matches:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userProfile]);

  const handleAiAnalysis = async () => {
    if (analyzing || matches.length === 0) return;
    setAnalyzing(true);
    
    // Pass top match + user profile context
    const topMatch = matches[0];
    const analysis = await openaiService.analyzeProfile(
        { top_career: topMatch.career.title, score: topMatch.percentage }, 
        userProfile
    );
    
    if (analysis) setAiAnalysis(analysis);
    setAnalyzing(false);
  };

  if (loading) {
      return (
          <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5"/> Vos Métiers Compatibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1,2].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>)}
              </div>
          </div>
      );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Aucune analyse disponible</h2>
        <p className="text-slate-500 mb-6">Passez le test d'orientation pour découvrir vos métiers compatibles.</p>
        <Button onClick={() => navigate('/test')} className="bg-primary text-white">
           Lancer le test
        </Button>
      </div>
    );
  }

  // Show top 4
  const topMatches = matches.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="text-primary w-6 h-6" /> Vos Métiers Compatibles
            </h2>
            <p className="text-slate-500 text-sm">
                {matches[0]?.isFallback 
                    ? "Voici les carrières les plus proches (score strict faible)" 
                    : `Basé sur une analyse de ${matches.length} métiers potentiels.`}
            </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/test-results')} className="hidden sm:flex">
            Voir tout le classement <ArrowRight className="ml-2 w-4 h-4"/>
        </Button>
      </div>

      {/* AI Insight Box */}
      {aiAnalysis ? (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 animate-in fade-in">
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-purple-600"><Sparkles className="w-5 h-5"/></div>
                  <div>
                      <h4 className="font-bold text-purple-900 mb-1">L'Analyse de Cléo</h4>
                      <p className="text-sm text-purple-800 mb-3"><strong>Super-pouvoir :</strong> {aiAnalysis.superpower}</p>
                      <p className="text-sm text-slate-600 italic">" {aiAnalysis.advice} "</p>
                  </div>
              </div>
          </div>
      ) : (
         <div className="flex justify-end">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAiAnalysis} 
                disabled={analyzing}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
             >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <BrainCircuit className="w-4 h-4 mr-2"/>}
                {analyzing ? 'Analyse en cours...' : 'Obtenir une analyse IA'}
             </Button>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topMatches.map((item, idx) => {
            const job = item.career;
            return (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-slate-200 group cursor-pointer overflow-hidden relative" onClick={() => navigate(job.code ? `/metier/${job.code}` : '#')}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx === 0 ? 'bg-green-500' : 'bg-primary'}`}></div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center gap-3">
                         <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{job.emoji}</span>
                         <div>
                             <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                             <div className="flex gap-2 mt-1">
                                 <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600">{job.demand}</Badge>
                             </div>
                         </div>
                     </div>
                     <div className="text-right">
                         <span className={`text-xl font-bold ${idx === 0 ? 'text-green-600' : 'text-primary'}`}>{Math.round(item.percentage)}%</span>
                     </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{job.description}</p>
                  
                  <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                          <span>Compatibilité</span>
                          <span>{Math.round(item.percentage)}/100</span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" indicatorClassName={idx === 0 ? 'bg-green-500' : 'bg-primary'} />
                  </div>
                </CardContent>
              </Card>
            );
        })}
      </div>
      
      <div className="sm:hidden">
         <Button variant="outline" className="w-full" onClick={() => navigate('/test-results')}>
            Voir tous les résultats
         </Button>
      </div>
    </div>
  );
};

export default MetierMatcher;