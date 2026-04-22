import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metierService } from '@/services/metierService';
import { calculateAdvancedMatching } from '@/services/matchingAlgorithm';
import { contextualRecommendationService } from '@/services/contextualRecommendationService';
import { adaptiveQuestionPool } from '@/data/adaptiveQuestions';
import { usePlanLimitation } from '@/contexts/PlanLimitationContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Search, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';
import { motion } from 'framer-motion';

import MetierCard from '@/components/test-results/MetierCard';
import UpgradePromptSection from '@/components/test-results/UpgradePromptSection';
import PlanAccessMessage from '@/components/test-results/PlanAccessMessage';
import MetierLoadingSpinner from '@/components/MetierLoadingSpinner';
import MetierErrorState from '@/components/MetierErrorState';
import SectorDiscoveryModule from '@/components/test-results/SectorDiscoveryModule';
import MetierFilterPanel from '@/components/test-results/MetierFilterPanel';

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
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [currentSort, setCurrentSort] = useState('score');
  const [currentTab, setCurrentTab] = useState('all');

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

      // Apply RIASEC matching
      const advancedMatches = dbMetiers
        .map(metier => calculateAdvancedMatching(loadedProfile, metier))
        .filter(m => m !== null);

      // Retrieve test context data for contextual recommendations
      const testStateStr = localStorage.getItem('test_riasec_state');
      const testState = testStateStr ? JSON.parse(testStateStr) : { answers: {}, asked: [] };

      // Detect dominant RIASEC axis
      const dominantAxis = contextualRecommendationService.detectDominantRIASECAxis(loadedProfile);

      // Analyze sector preference from test answers
      const sectorScores = contextualRecommendationService.analyzeSectorPreference(
        testState.answers,
        adaptiveQuestionPool
      );

      // Identify primary sector
      const primarySector = contextualRecommendationService.identifyPrimarySector(sectorScores);

      // Build contextual mapping
      const contextualMapping = contextualRecommendationService.buildContextualMapping(
        dominantAxis,
        primarySector
      );

      // Rank métiers by contextual relevance
      const contextualMatches = contextualRecommendationService.rankMetiersByContext(
        advancedMatches,
        contextualMapping,
        loadedProfile
      );

      // Sort by contextual score and get top 15
      const goodMatches = contextualMatches
        .filter(m => m.contextualScore >= 40)
        .slice(0, 15);

      const allMatches = [...goodMatches];

      // Store contextual info in state for display
      localStorage.setItem('test_riasec_context', JSON.stringify({
        dominantAxis,
        primarySector,
        contextRationale: contextualRecommendationService.getRecommendationRationale(
          dominantAxis,
          primarySector,
          contextualMapping
        ),
      }));

      setMatches(allMatches);

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

  // Filter and sort logic
  useEffect(() => {
    if (matches.length === 0) {
      setFilteredMatches([]);
      return;
    }

    let filtered = [...matches];

    // Tab filtering
    if (currentTab === 'excellent') {
      filtered = filtered.filter(m => m.finalScore >= 80);
    } else if (currentTab === 'good') {
      filtered = filtered.filter(m => m.finalScore >= 60 && m.finalScore < 80);
    } else if (currentTab === 'explore') {
      filtered = filtered.filter(m => m.finalScore < 60);
    }

    // Sorting
    switch (currentSort) {
      case 'demand':
        filtered.sort((a, b) => (b.demandScore || 0) - (a.demandScore || 0));
        break;
      case 'growth':
        filtered.sort((a, b) => (b.growthScore || 0) - (a.growthScore || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'score':
      default:
        filtered.sort((a, b) => b.finalScore - a.finalScore);
    }

    setFilteredMatches(filtered);
  }, [matches, currentSort, currentTab]);

  const handleFilterChange = ({ sort, tab, reset }) => {
    if (reset) {
      setCurrentSort('score');
      setCurrentTab('all');
    }
    if (sort) setCurrentSort(sort);
    if (tab) setCurrentTab(tab);
  };

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
        
        {/* RIASEC Profile Card - Enhanced */}
        <Card className="shadow-xl border-slate-200 rounded-2xl overflow-hidden animate-fade-in bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-200">
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <BarChart3 className="w-6 h-6" /> Votre Profil RIASEC Détaillé
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8 bg-white">

            {/* Main Scores Grid */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Scores par dimension</h3>
              {profileEntries.map(([dim, score]) => {
                const info = DIMENSION_LABELS[dim] || { name: dim, color: 'bg-slate-500' };
                const isTop = profileEntries.slice(0, 3).some(([d]) => d === dim);
                return (
                  <div key={dim} className={`p-3 rounded-lg transition-all ${isTop ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}>
                    <div className="flex justify-between text-sm mb-3 font-bold text-slate-700">
                      <span className="uppercase tracking-wider">{info.name} {isTop && '⭐'}</span>
                      <span className="text-lg text-indigo-600 font-black">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2.5 rounded-full" indicatorClassName={info.color} />
                  </div>
                );
              })}
            </div>

            {/* Profile Insights */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Vos Forces</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {profileEntries.slice(0, 3).map(([dim, score]) => {
                  const info = DIMENSION_LABELS[dim] || { name: dim, color: 'bg-slate-500' };
                  return (
                    <div key={dim} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 text-center">
                      <div className="text-2xl mb-2">⭐</div>
                      <p className="text-sm font-bold text-indigo-900 mb-1">{info.name}</p>
                      <p className="text-2xl font-black text-indigo-600">{score}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile Description */}
            <div className="border-t border-slate-200 pt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-indigo-100">
              <h4 className="text-sm font-bold text-indigo-900 uppercase mb-3 tracking-wider">
                Profil: {profileCode}
              </h4>
              <p className="text-slate-700 text-base leading-relaxed font-medium">
                {MATCHING_CONFIG?.PROFILE_DESCRIPTIONS?.[topType] || "Votre profil détermine votre façon naturelle d'aborder le travail et de résoudre les problèmes."}
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-indigo-500">
                <p className="text-xs text-slate-600">
                  💡 <strong>Conseil :</strong> Cherchez des métiers qui valorisent vos talents naturels et offrent des environnements alignés à votre profil.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Plan Access Banner */}
        <PlanAccessMessage />

        {/* Results Section */}
        <section className="py-4">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
             <span className="text-4xl">🎯</span> Vos Meilleures Correspondances ({filteredMatches.length})
          </h2>

          {/* Filter Panel */}
          <MetierFilterPanel
            matches={matches}
            onFilterChange={handleFilterChange}
            currentSort={currentSort}
            currentTab={currentTab}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMatches.map((match, index) => {
              const isBlurred = index >= visibleCount;
              const isTopThree = index < 3;

              return (
                <motion.div key={match.metierCode} variants={itemVariants} className="h-full">
                  <MetierCard
                    metier={match}
                    isBlurred={isBlurred}
                    isTopThree={isTopThree}
                    userProfile={profile}
                    onNavigate={handleNavigateDetail}
                    onCreatePlan={handleCreatePlan}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {!canViewAllResults() && filteredMatches.length > visibleCount && (
            <UpgradePromptSection />
          )}
        </section>

        {/* Sector Discovery Module */}
        <section className="py-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <SectorDiscoveryModule profile={profile} />
        </section>

        {/* CTAs Section */}
        <section className="py-8 space-y-6">
          {/* Go to Dashboard */}
          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-10 rounded-3xl shadow-lg text-center text-white animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold mb-4">
              Retour à votre Dashboard
            </h3>
            <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
              Accédez à votre espace personnel pour explorer vos résultats en détail et créer votre plan d'action.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-white text-indigo-600 hover:bg-slate-50 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white text-base px-8 h-14"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Aller au Dashboard
            </Button>
          </div>

          {/* Explore Professions */}
          <div className="bg-white p-10 rounded-3xl shadow-md border border-slate-200 text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-4">
              Pas d'accord avec ces résultats ?
            </h3>
            <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto">
              Explorez notre base de données complète pour découvrir tous les métiers disponibles.
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