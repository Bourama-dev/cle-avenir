import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metierService } from '@/services/metierService';
import { calculateAdvancedMatching } from '@/services/matchingAlgorithm';
import { usePlanLimitation } from '@/contexts/PlanLimitationContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';
import { motion } from 'framer-motion';

import MetierCard from '@/components/test-results/MetierCard';
import UpgradePromptSection from '@/components/test-results/UpgradePromptSection';
import PlanAccessMessage from '@/components/test-results/PlanAccessMessage';
import MetierLoadingSpinner from '@/components/MetierLoadingSpinner';
import MetierErrorState from '@/components/MetierErrorState';

import { RIASEC_META } from '@/data/optimizedQuestions';

const DIMENSION_LABELS = Object.fromEntries(
  Object.entries(RIASEC_META).map(([k, v]) => [k, { name: v.label, color: v.color }])
);

const TestResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canViewAllResults, getVisibleMetierCount } = usePlanLimitation();
  
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  const processData = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const storedProfileStr = localStorage.getItem('test_riasec_profile');
      if (!storedProfileStr) {
        navigate('/test-orientation');
        return;
      }

      const loadedProfile = JSON.parse(storedProfileStr);
      // Recompute profile code if not stored (backward compat)
      const storedCode = localStorage.getItem('test_riasec_profile_code');
      if (!storedCode) {
        const code = Object.entries(loadedProfile)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([l]) => l)
          .join('');
        localStorage.setItem('test_riasec_profile_code', code);
      }
      setProfile(loadedProfile);

      const dbMetiers = await metierService.getAllMetiersForMatching();

      if (!dbMetiers || dbMetiers.length === 0) {
        throw new Error("Aucun métier trouvé dans la base de données.");
      }

      const advancedMatches = dbMetiers
        .map(metier => calculateAdvancedMatching(loadedProfile, metier))
        .filter(m => m !== null)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 15); // Get top 15 total to show locked ones

      setMatches(advancedMatches);

    } catch (err) {
      console.error("Error processing results:", err);
      const isRateLimit = err?.message?.includes('429') || err?.message?.includes('Trop de requêtes');
      const formattedError = new Error(isRateLimit ? "Trop de requêtes. Veuillez réessayer dans quelques secondes." : "Impossible de calculer vos résultats.");
      formattedError.status = isRateLimit ? 429 : 500;
      setError(formattedError);
      toast({ variant: "destructive", title: "Erreur", description: formattedError.message });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleCreatePlan = (match) => {
    const searchParams = new URLSearchParams({
      metierCode: match.metierCode,
      metierName: match.name,
      compatibilityScore: match.finalScore,
    });
    
    navigate(`/personalized-plan?${searchParams.toString()}`, { 
      state: { profile } 
    });
  };

  const handleNavigateDetail = (code) => {
    navigate(`/metier/${code}`);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
         <div className="w-full max-w-lg">
            <MetierLoadingSpinner />
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <MetierErrorState error={error} onRetry={processData} />
      </div>
    );
  }

  if (!profile) return null;

  const profileEntries = Object.entries(profile).sort(([, a], [, b]) => b - a);
  const topType = profileEntries[0]?.[0];
  const profileCode = localStorage.getItem('test_riasec_profile_code') ||
    profileEntries.slice(0, 3).map(([l]) => l).join('');
  const visibleCount = getVisibleMetierCount();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-16 pb-32 px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Vos Résultats d'Orientation
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-6">
              Découvrez les métiers qui correspondent parfaitement à votre ADN professionnel.
            </p>
            {/* Profile code badge */}
            <div className="inline-flex flex-col items-center bg-white/10 border border-white/20 backdrop-blur rounded-2xl px-8 py-4">
              <span className="text-slate-300 text-xs font-semibold uppercase tracking-widest mb-1">
                Code RIASEC
              </span>
              <span className="text-4xl font-black tracking-widest text-white">{profileCode}</span>
              <span className="text-slate-400 text-xs mt-1">
                Profil dominant : {DIMENSION_LABELS[topType]?.name}
              </span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 space-y-12">
        
        {/* RIASEC Profile Card */}
        <Card className="shadow-xl border-slate-200 rounded-2xl overflow-hidden animate-fade-in">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
              <BarChart3 className="w-6 h-6 text-blue-600" /> Votre Empreinte RIASEC
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 gap-10 bg-white">
            <div className="space-y-5">
              {profileEntries.map(([dim, score]) => {
                const info = DIMENSION_LABELS[dim] || { name: dim, color: 'bg-slate-500' };
                return (
                  <div key={dim}>
                    <div className="flex justify-between text-sm mb-2 font-bold text-slate-700">
                      <span className="uppercase tracking-wider">{info.name}</span>
                      <span>{score}%</span>
                    </div>
                    <Progress value={score} className="h-3 rounded-full" indicatorClassName={info.color} />
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 flex flex-col justify-center shadow-sm">
               <h4 className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wider">
                 Profil Dominant : {DIMENSION_LABELS[topType]?.name}
               </h4>
               <p className="text-slate-700 text-lg leading-relaxed font-medium">
                 {MATCHING_CONFIG?.PROFILE_DESCRIPTIONS?.[topType] || "Votre profil dominant détermine votre façon naturelle d'aborder le travail."}
               </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan Access Banner */}
        <PlanAccessMessage />

        {/* Results Section */}
        <section className="py-4">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
             <span className="text-4xl">🎯</span> Vos Meilleures Correspondances
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matches.map((match, index) => {
              const isBlurred = index >= visibleCount;
              const isTopThree = index < 3;
              
              return (
                <motion.div key={match.metierCode} variants={itemVariants} className="h-full">
                  <MetierCard 
                    metier={match}
                    isBlurred={isBlurred}
                    isTopThree={isTopThree}
                    onNavigate={handleNavigateDetail}
                    onCreatePlan={handleCreatePlan}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {!canViewAllResults() && matches.length > visibleCount && (
            <UpgradePromptSection />
          )}
        </section>

        {/* Secondary CTA Section - "Pas d'accord ?" */}
        <section className="py-8">
          <div className="bg-white p-10 rounded-3xl shadow-md border border-slate-200 text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-4">
              Pas d'accord avec ces résultats ?
            </h3>
            <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto">
              Explorez notre base de données complète pour trouver le métier qui vous fait vraiment vibrer.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/metiers')}
              className="text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 text-base px-8 h-14"
            >
              <Search className="w-5 h-5 mr-2" />
              Voir tous les métiers
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TestResultsPage;