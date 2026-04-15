import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { planService } from '@/services/planService';
import { supabase } from '@/lib/customSupabaseClient';
import { getTestDataFromSource } from '@/utils/testDataExtractor';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Target, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import RiasecProfileSection from '@/components/personalized-plan/RiasecProfileSection';
import RecommendedMetiersSection from '@/components/personalized-plan/RecommendedMetiersSection';
import FormationPathSection from '@/components/personalized-plan/FormationPathSection';
import ProgressionSection from '@/components/personalized-plan/ProgressionSection';
import RecommendedActionsSection from '@/components/personalized-plan/RecommendedActionsSection';

import MetierLoadingSpinner from '@/components/MetierLoadingSpinner';
import MetierErrorState from '@/components/MetierErrorState';
import { useMetierDataFetcher } from '@/utils/metierDataFetcher';

const PersonalizedPlanPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [planData, setPlanData] = useState(null);
  const [rawTestData, setRawTestData] = useState(null);
  const [enrichedMetiers, setEnrichedMetiers] = useState([]);
  const [formations, setFormations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [metiersLoading, setMetiersLoading] = useState(false);
  const [formationsLoading, setFormationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { fetchMetierWithErrorHandling } = useMetierDataFetcher();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const initializePlan = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const testData = getTestDataFromSource(location);
      if (isMounted.current) {
        setRawTestData(testData);
      }

      let plan = await planService.getPlanByUserId(user.id);
      
      if (!plan && testData.hasValidData) {
        plan = await planService.createPlan(user.id, {
          riasec_profile: testData.profile,
          recommended_metiers: testData.recommendedMetiers?.slice(0, 5) || [],
          selected_metiers: testData.selectedMetiers || []
        });
        toast({ title: "Plan initialisé", description: "Votre espace a été configuré avec vos résultats." });
      } 
      else if (plan && testData.selectedMetiers.length > 0) {
         const existingSelected = plan.selected_metiers || [];
         const newSelections = testData.selectedMetiers.filter(newM => 
           !existingSelected.some(exM => exM.code === newM.code || exM.metierCode === newM.code)
         );
         
         if (newSelections.length > 0) {
             plan = await planService.updatePlan(user.id, { 
                 selected_metiers: [...existingSelected, ...newSelections] 
             });
             toast({ title: "Métier ajouté", description: "Vos cibles ont été mises à jour." });
         }
      }

      if (isMounted.current) {
        setPlanData(plan);
        if (plan) {
          fetchEnrichedMetiers(plan);
        } else {
          setLoading(false);
        }
      }

    } catch (err) {
      console.error("[PersonalizedPlanPage] Initialization Error:", err);
      if (isMounted.current) {
        setError(err);
        setLoading(false);
      }
    }
  };

  const fetchEnrichedMetiers = async (plan) => {
    setMetiersLoading(true);
    setError(null);
    try {
      const baseMetiers = [...(plan?.selected_metiers || []), ...(plan?.recommended_metiers || [])];
      
      const uniqueCodes = new Set();
      const metiersToFetch = baseMetiers.filter(m => {
        const code = m.code || m.metierCode;
        if (!code || uniqueCodes.has(code)) return false;
        uniqueCodes.add(code);
        return true;
      }).slice(0, 6);

      if (metiersToFetch.length === 0) {
        setEnrichedMetiers([]);
        setMetiersLoading(false);
        setLoading(false);
        return;
      }

      const enrichedPromises = metiersToFetch.map(async (baseMetier) => {
        const code = baseMetier.code || baseMetier.metierCode;
        try {
          const details = await fetchMetierWithErrorHandling(code);
          return {
            ...baseMetier,
            ...details,
            description: details?.description || details?.definition || baseMetier.description
          };
        } catch (e) {
          console.warn(`Could not fetch details for ${code}`, e);
          if (e.status === 429) throw e; 
          return baseMetier; 
        }
      });

      const results = await Promise.all(enrichedPromises);
      
      if (isMounted.current) {
        setEnrichedMetiers(results);
        fetchFormationsForMetiers(results);
      }
    } catch (err) {
      console.error("Error enriching metiers:", err);
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      if (isMounted.current) {
        setMetiersLoading(false);
        setLoading(false);
      }
    }
  };

  const fetchFormationsForMetiers = async (metiers) => {
    setFormationsLoading(true);
    try {
      const codes = metiers.map(m => m.code || m.metierCode).filter(Boolean);
      if (codes.length === 0) {
         setFormations([]);
         return;
      }

      const { data, error } = await supabase
        .from('formations_enriched')
        .select('*')
        .limit(6);
        
      if (error) throw error;
      
      if (isMounted.current) {
        setFormations(data || []);
      }
    } catch (err) {
      console.error("Error fetching formations:", err);
    } finally {
      if (isMounted.current) {
        setFormationsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { state: { returnTo: location.pathname + location.search } });
      return;
    }
    initializePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, navigate, retryCount, location.search]);

  const handleAddMetier = async (metier) => {
    if (!planData) return;
    try {
      const newMetier = {
         code: metier.code || metier.metierCode,
         libelle: metier.libelle || metier.name,
         match_score: metier.match_score || metier.compatibility || 0
      };
      
      const existing = planData.selected_metiers || [];
      if (existing.some(m => m.code === newMetier.code)) {
        toast({ title: "Déjà ajouté", description: "Ce métier est déjà dans vos cibles." });
        return;
      }

      const updatedPlan = await planService.updatePlan(user.id, { 
        selected_metiers: [...existing, newMetier] 
      });
      setPlanData(updatedPlan);
      toast({ title: "Métier ajouté", description: `${newMetier.libelle} a été ajouté à vos cibles.` });
      
      fetchEnrichedMetiers(updatedPlan);
    } catch (err) {
      console.error("Add metier error:", err);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'ajouter ce métier." });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <MetierLoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
         <MetierErrorState error={error} onRetry={() => setRetryCount(c => c + 1)} />
      </div>
    );
  }

  const profileData = planData?.riasec_profile || rawTestData?.profile;
  const hasTestData = !!profileData && Object.keys(profileData).length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <Breadcrumbs />
        </div>
      </div>

      <div className="bg-gradient-to-b from-indigo-50 to-slate-50 py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl animate-fade-in">
             <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-6 shadow-sm border border-indigo-200/50">
                <Target className="w-8 h-8 text-indigo-700" />
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
               Votre Plan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Personnalisé</span>
             </h1>
             <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
               Voici votre feuille de route sur-mesure pour atteindre vos objectifs professionnels, basée sur vos résultats d'orientation.
             </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-7xl py-12">
         <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-2">
               <ProgressionSection planData={planData} hasTestData={hasTestData} />
               <RiasecProfileSection riasecProfile={profileData} />

               {metiersLoading ? (
                 <div className="mb-10"><MetierLoadingSpinner /></div>
               ) : (
                 <RecommendedMetiersSection
                   metiers={enrichedMetiers}
                   onAddMetier={handleAddMetier}
                   isLoading={false}
                 />
               )}

               <FormationPathSection
                 formations={formations}
                 isLoading={formationsLoading}
               />

               {/* Dashboard navigation — always visible at the bottom of the plan */}
               <div className="mt-10 pt-8 border-t border-slate-200">
                 <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg">Votre plan est prêt !</h3>
                     <p className="text-slate-500 text-sm mt-1">
                       Retrouvez vos résultats, votre historique et vos métiers sauvegardés dans votre tableau de bord.
                     </p>
                   </div>
                   <button
                     onClick={() => navigate('/dashboard')}
                     className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap shadow-sm"
                   >
                     <LayoutDashboard className="w-5 h-5" />
                     Aller au tableau de bord
                   </button>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-4">
               <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                      ⚡ Actions Rapides
                    </h3>
                    <RecommendedActionsSection />
                  </div>

                  {/* Dashboard shortcut in sidebar too */}
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Mon tableau de bord
                  </button>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default PersonalizedPlanPage;