import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metierService } from '@/services/metierService';
import { calculateAdvancedMatching } from '@/services/matchingAlgorithm';
import { contextualRecommendationService } from '@/services/contextualRecommendationService';
import { userProfileService } from '@/services/userProfileService';
import { adaptiveQuestionPool } from '@/data/adaptiveQuestions';
import { usePlanLimitation } from '@/contexts/PlanLimitationContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Search, LayoutDashboard, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

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

      // Fetch user profile criteria for personalized score adjustments (education, salary, status)
      const userCriteria = await userProfileService.getUserRecommendationCriteria();

      // Apply RIASEC matching with user criteria
      const advancedMatches = dbMetiers
        .map(metier => calculateAdvancedMatching(loadedProfile, metier, userCriteria))
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

      // Rank métiers by contextual relevance + user criteria
      const contextualMatches = contextualRecommendationService.rankMetiersByContext(
        advancedMatches,
        contextualMapping,
        loadedProfile,
        userCriteria
      );

      // Sort by contextual score and get top 15
      const goodMatches = contextualMatches
        .filter(m => m.contextualScore >= 40)
        .slice(0, 15);

      const allMatches = [...goodMatches];

      // Sauvegarder les résultats pour PersonalizedPlanPage (getTestDataFromSource)
      localStorage.setItem('latest_test_results', JSON.stringify({
        riasecProfile: loadedProfile,
        topCareers: allMatches.slice(0, 10).map(m => ({
          code:        m.metierCode,
          libelle:     m.name,
          name:        m.name,
          match_score: m.finalScore,
          score:       m.finalScore,
          sector:      m.sector,
          emoji:       m.emoji,
        })),
      }));

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

  // Métadonnées de clarté calculées à l'étape du test
  const profileMeta = (() => {
    try { return JSON.parse(localStorage.getItem('test_riasec_profile_meta') || '{}'); }
    catch { return {}; }
  })();
  const clarityConfig = {
    élevée:  { label: 'Profil clair',   badge: 'bg-green-100 text-green-800 border-green-200',  tip: 'Tes dimensions dominantes se distinguent nettement — les recommandations sont très fiables.' },
    modérée: { label: 'Profil équilibré', badge: 'bg-blue-100 text-blue-800 border-blue-200',   tip: 'Ton profil montre plusieurs dimensions fortes — tu as de la polyvalence.' },
    diffuse: { label: 'Profil polyvalent', badge: 'bg-amber-100 text-amber-800 border-amber-200', tip: 'Tes intérêts sont variés — explore plusieurs pistes pour affiner ton orientation.' },
  }[profileMeta.clarity || 'modérée'];

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
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-36 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_50%,#6366f1,transparent_60%),radial-gradient(circle_at_70%_50%,#ec4899,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Tes Résultats d'Orientation
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base mb-8">
            Voici les métiers qui résonnent avec ton profil naturel.
          </p>

          {/* Badge code + clarté */}
          <div className="inline-flex flex-col items-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-8 py-5 gap-2">
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-widest">
              Code RIASEC
            </span>
            <span className="text-5xl font-black tracking-widest text-white">{profileCode}</span>
            <span className="text-slate-300 text-sm font-medium">
              Dominant · {DIMENSION_LABELS[topType]?.name}
            </span>
            {clarityConfig && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border mt-1 ${clarityConfig.badge}`}>
                {clarityConfig.label}
                {profileMeta.engagement != null && ` · Engagement ${profileMeta.engagement}%`}
              </span>
            )}
          </div>
          {clarityConfig && (
            <p className="text-slate-400 text-xs mt-4 max-w-sm mx-auto">{clarityConfig.tip}</p>
          )}
        </motion.div>
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
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Scores par dimension</h3>
              {profileEntries.map(([dim, score], idx) => {
                const info = DIMENSION_LABELS[dim] || { name: dim, color: 'bg-slate-500' };
                const meta = RIASEC_META[dim];
                const isTop = idx < 3;
                return (
                  <div key={dim} className={`p-3 rounded-xl transition-all ${isTop ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isTop ? 'text-indigo-800' : 'text-slate-500'}`}>
                          {info.name}
                        </span>
                        {idx === 0 && <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Dominant</span>}
                        {idx > 0 && idx < 3 && <span className="text-[10px] font-semibold text-indigo-500">Top {idx + 1}</span>}
                      </div>
                      <span className={`text-base font-black ${isTop ? 'text-indigo-600' : 'text-slate-400'}`}>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2 rounded-full" indicatorClassName={isTop ? info.color : 'bg-slate-300'} />
                    {isTop && meta?.description && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{meta.description}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Top 3 Forces */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Tes 3 forces</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {profileEntries.slice(0, 3).map(([dim, score], idx) => {
                  const meta = RIASEC_META[dim];
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={dim} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="text-2xl mb-1">{medals[idx]}</div>
                      <p className="text-sm font-bold text-indigo-900">{DIMENSION_LABELS[dim]?.name}</p>
                      <p className="text-2xl font-black text-indigo-600 mb-1">{score}%</p>
                      {meta?.description && (
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-3">{meta.description}</p>
                      )}
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

          {/* ── Top 3 — toujours visibles ────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMatches.slice(0, visibleCount).map((match, index) => (
              <motion.div key={match.metierCode} variants={itemVariants} className="h-full">
                <MetierCard
                  metier={match}
                  isBlurred={false}
                  isTopThree={index < 3}
                  userProfile={profile}
                  onNavigate={handleNavigateDetail}
                  onCreatePlan={handleCreatePlan}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* ── Mur Premium — si résultats verrouillés ───────────────────── */}
          {!canViewAllResults() && filteredMatches.length > visibleCount && (
            <>
              {/* Séparateur visuel avec compteur */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 px-5 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-500 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {filteredMatches.length - visibleCount} autres métiers compatibles verrouillés
                  </span>
                </div>
              </div>

              {/* Aperçu flouté des cartes suivantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-none select-none">
                {filteredMatches.slice(visibleCount, visibleCount + 3).map((match, index) => (
                  <div key={match.metierCode} className="h-full relative">
                    <div className="h-full blur-[6px] opacity-50">
                      <MetierCard
                        metier={match}
                        isBlurred={true}
                        isTopThree={false}
                        userProfile={profile}
                        onNavigate={() => {}}
                        onCreatePlan={() => {}}
                      />
                    </div>
                    {index === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-amber-200 text-center max-w-[200px]">
                          <Lock className="w-7 h-7 text-amber-500 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-800 leading-tight">Premium pour voir tous tes résultats</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <UpgradePromptSection />
            </>
          )}

          {/* ── Résultats complets (Premium) ─────────────────────────────── */}
          {canViewAllResults() && filteredMatches.length > visibleCount && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {filteredMatches.slice(visibleCount).map((match, index) => (
                <motion.div key={match.metierCode} variants={itemVariants} className="h-full">
                  <MetierCard
                    metier={match}
                    isBlurred={false}
                    isTopThree={false}
                    userProfile={profile}
                    onNavigate={handleNavigateDetail}
                    onCreatePlan={handleCreatePlan}
                  />
                </motion.div>
              ))}
            </motion.div>
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
            <MagneticButton>
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-white text-indigo-600 hover:bg-slate-50 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white text-base px-8 h-14"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Aller au Dashboard
              </Button>
            </MagneticButton>
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
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/metiers')}
                className="text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 text-base px-8 h-14"
              >
                <Search className="w-5 h-5 mr-2" />
                Voir tous les métiers
              </Button>
            </MagneticButton>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TestResultsPage;