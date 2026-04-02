import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metierService } from '@/services/metierService';
import { calculateAdvancedMatching } from '@/services/matchingAlgorithm';
import ResultsDisplay from '@/components/ResultsDisplay';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Loader2, AlertCircle, RefreshCw, Clock } from 'lucide-react';

const DIMENSION_LABELS = {
  R: { name: 'Réaliste', color: 'bg-red-500' },
  I: { name: 'Investigateur', color: 'bg-blue-500' },
  A: { name: 'Artistique', color: 'bg-purple-500' },
  S: { name: 'Social', color: 'bg-green-500' },
  E: { name: 'Entreprenant', color: 'bg-orange-500' },
  C: { name: 'Conventionnel', color: 'bg-yellow-500' },
};

const TestResults = () => {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  const processData = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Load data from localStorage
      const storedProfileStr = localStorage.getItem('test_riasec_profile');
      const storedDuration = localStorage.getItem('test_duration');
      
      if (storedDuration) setDuration(parseInt(storedDuration, 10));

      if (!storedProfileStr) {
        navigate('/test-orientation');
        return;
      }

      const loadedProfile = JSON.parse(storedProfileStr);
      setProfile(loadedProfile);

      // Fetch metiers
      const dbMetiers = await metierService.getAllMetiersForMatching();

      if (!dbMetiers || dbMetiers.length === 0) {
        throw new Error("Aucun métier trouvé dans la base de données.");
      }

      // Calculate matches
      const advancedMatches = dbMetiers
        .map(metier => calculateAdvancedMatching(loadedProfile, metier))
        .filter(m => m !== null)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 10); // Take top 10

      setMatches(advancedMatches);

    } catch (err) {
      console.error("Error processing results:", err);
      setError(err.message || "Impossible de calculer vos résultats.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processData();
  }, [navigate]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s} sec`;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyse de votre profil...</h2>
        <p className="text-slate-500 font-medium animate-pulse">Recherche des meilleures correspondances métiers</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oups, une erreur est survenue</h2>
        <p className="text-slate-600 mb-6 max-w-md">{error}</p>
        <Button onClick={processData} className="bg-indigo-600 hover:bg-indigo-700">
          <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
        </Button>
      </div>
    );
  }

  if (!profile) return null;

  // Get Top 3 dimensions
  const topDimensions = Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Votre Profil Professionnel
            </h1>
            <div className="flex items-center justify-center gap-2 text-indigo-200 bg-slate-800/50 w-fit mx-auto px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Temps de complétion : {formatDuration(duration)}</span>
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 space-y-8">
        
        {/* Top 3 Profile Card */}
        <Card className="shadow-xl border-slate-200 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-white border-b border-slate-100 pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
              <BarChart3 className="w-6 h-6 text-indigo-600" /> Vos 3 Dimensions Dominantes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6 max-w-2xl mx-auto">
              {topDimensions.map(([dim, score], index) => {
                const info = DIMENSION_LABELS[dim];
                return (
                  <div key={dim} className="space-y-2">
                    <div className="flex justify-between items-end text-sm font-bold text-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">
                          {index + 1}
                        </span>
                        <span className="text-base uppercase tracking-wider">{info.name}</span>
                      </div>
                      <span className="text-xl">{score}%</span>
                    </div>
                    <Progress value={score} className="h-4" indicatorClassName={info.color} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             🎯 Top 10 des Métiers Compatibles
          </h2>
          <ResultsDisplay results={matches} />
        </div>

      </div>
    </div>
  );
};

export default TestResults;