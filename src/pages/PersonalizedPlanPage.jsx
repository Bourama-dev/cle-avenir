import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { planService } from '@/services/planService';
import { supabase } from '@/lib/customSupabaseClient';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getTestDataFromSource } from '@/utils/testDataExtractor';
import { getUserEducationLevel, EDUCATION_ORDER } from '@/utils/educationUtils';
import { fetchFormations } from '@/services/parcoursup';

import Breadcrumbs from '@/components/Breadcrumbs';
import { LayoutDashboard, Target } from 'lucide-react';
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

  // ── User profile ────────────────────────────────────────────────────────
  const { profile: userProfile, loading: profileLoading } = useUserProfile();

  // ── Plan data ────────────────────────────────────────────────────────────
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

  /* ── Initialise plan ───────────────────────────────────────────────────── */
  const initializePlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const testData = getTestDataFromSource(location);
      if (isMounted.current) setRawTestData(testData);

      let plan = await planService.getPlanByUserId(user.id);

      if (!plan && testData.hasValidData) {
        plan = await planService.createPlan(user.id, {
          riasec_profile:      testData.profile,
          recommended_metiers: testData.recommendedMetiers?.slice(0, 5) || [],
          selected_metiers:    testData.selectedMetiers || [],
        });
        toast({ title: 'Plan initialisé', description: 'Votre espace a été configuré avec vos résultats.' });
      } else if (plan && testData.selectedMetiers?.length > 0) {
        const existingSelected = plan.selected_metiers || [];
        const newSelections = testData.selectedMetiers.filter(
          newM => !existingSelected.some(exM => exM.code === newM.code || exM.metierCode === newM.code)
        );
        if (newSelections.length > 0) {
          plan = await planService.updatePlan(user.id, {
            selected_metiers: [...existingSelected, ...newSelections],
          });
          toast({ title: 'Métier ajouté', description: 'Vos cibles ont été mises à jour.' });
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
      console.error('[PersonalizedPlanPage] Initialization Error:', err);
      if (isMounted.current) {
        setError(err);
        setLoading(false);
      }
    }
  };

  /* ── Enrich metiers from ROME DB ───────────────────────────────────────── */
  const fetchEnrichedMetiers = async (plan) => {
    setMetiersLoading(true);
    setError(null);
    try {
      const baseMetiers = [
        ...(plan?.selected_metiers    || []),
        ...(plan?.recommended_metiers || []),
      ];

      const uniqueCodes = new Set();
      const metiersToFetch = baseMetiers
        .filter(m => {
          const code = m.code || m.metierCode;
          if (!code || uniqueCodes.has(code)) return false;
          uniqueCodes.add(code);
          return true;
        })
        .slice(0, 6);

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
            description: details?.description || details?.definition || baseMetier.description,
          };
        } catch (e) {
          if (e.status === 429) throw e;
          return baseMetier;
        }
      });

      const results = await Promise.all(enrichedPromises);

      if (isMounted.current) {
        setEnrichedMetiers(results);
        // Pass userProfile so formations can be filtered by education level
        fetchFormationsForMetiers(results, userProfile);
      }
    } catch (err) {
      console.error('Error enriching metiers:', err);
      if (isMounted.current) setError(err);
    } finally {
      if (isMounted.current) {
        setMetiersLoading(false);
        setLoading(false);
      }
    }
  };

  /* ── Fetch formations — from Parcoursup API (same source as /formations) ── */
  const fetchFormationsForMetiers = async (metiers, profile) => {
    setFormationsLoading(true);
    try {
      // Build a search keyword from the first recommended metier's label
      const keyword = metiers[0]?.libelle || metiers[0]?.name || '';

      const response = await fetchFormations({ q: keyword, limit: 20 });

      if (!response.success || !response.results?.length) {
        if (isMounted.current) setFormations([]);
        return;
      }

      // Normalise Parcoursup shape → FormationPathSection shape
      const normalised = response.results.map(f => {
        const primaryEtab = f.etablissements?.[0] || {};

        // Derive required_education_level from formation title (same logic as FormationsPage)
        const title = (f.libelle_formation || '').toUpperCase();
        let reqLevel = 'bac'; // default
        if (title.includes('CAP') || title.includes('BEP')) reqLevel = 'cap_bep';
        else if (title.includes('BTS') || title.includes('BUT') && !title.includes('BUT3'))
          reqLevel = 'bac+2';
        else if (title.includes('BUT') || title.includes('LICENCE') || title.includes('BACHELOR'))
          reqLevel = 'bac+3';
        else if (title.includes('MASTER') || title.includes('INGÉNIEUR') || title.includes('INGENIEUR'))
          reqLevel = 'bac+5';
        else if (title.includes('DOCTORAT')) reqLevel = 'doctorat';

        // Duration label
        const durationMap = { 'cap_bep': '2 ans', 'bac': '3 ans', 'bac+2': '2 ans', 'bac+3': '3 ans', 'bac+5': '2 ans', 'doctorat': '3 ans' };

        return {
          // FormationPathSection keys
          id:                      f.id_formation || f.g_ea_lib_vx,
          title:                   f.libelle_formation || 'Formation',
          provider:                primaryEtab.nom || f.etablissement || 'Établissement',
          provider_name:           primaryEtab.nom || f.etablissement || 'Établissement',
          required_education_level: reqLevel,
          duration:                durationMap[reqLevel] || 'Variable',
          location_city:           primaryEtab.ville || f.ville || '',
          region:                  primaryEtab.region || f.region || '',
          description:             f.description || null,
          // Keep original data for detail navigation
          _raw: f,
        };
      });

      const filtered = filterAndSortFormations(normalised, profile);
      if (isMounted.current) setFormations(filtered);
    } catch (err) {
      console.error('Error fetching formations:', err);
      if (isMounted.current) setFormations([]);
    } finally {
      if (isMounted.current) setFormationsLoading(false);
    }
  };

  /**
   * Filters formations by user education level (don't show those requiring
   * a level the user hasn't reached yet) and sorts accessible ones first.
   */
  const filterAndSortFormations = (formations, profile) => {
    if (!profile?.education_level) return formations.slice(0, 6);

    const userLevel = getUserEducationLevel(profile);

    return formations
      .map(f => {
        // Compute the required level for this formation
        const raw = f.required_education_level || f.minimum_education || f.level || null;
        let reqLevel = 0;
        if (raw) {
          reqLevel = EDUCATION_ORDER[raw] ??
            EDUCATION_ORDER[String(raw).toLowerCase().replace(/\s/g, '')] ?? 0;
        }
        return { ...f, _reqLevel: reqLevel, _accessible: userLevel >= reqLevel };
      })
      // Sort: accessible first, then by level proximity
      .sort((a, b) => {
        if (a._accessible && !b._accessible) return -1;
        if (!a._accessible && b._accessible) return 1;
        // Within accessible: prefer formations just above the user's level
        return Math.abs(a._reqLevel - (getUserEducationLevel(profile) + 1)) -
               Math.abs(b._reqLevel - (getUserEducationLevel(profile) + 1));
      })
      .slice(0, 6);
  };

  /* ── Add metier to plan ─────────────────────────────────────────────────── */
  const handleAddMetier = async (metier) => {
    if (!planData) return;
    try {
      const newMetier = {
        code:        metier.code || metier.metierCode,
        libelle:     metier.libelle || metier.name,
        match_score: metier.match_score || metier.compatibility || 0,
      };

      const existing = planData.selected_metiers || [];
      if (existing.some(m => m.code === newMetier.code)) {
        toast({ title: 'Déjà ajouté', description: 'Ce métier est déjà dans vos cibles.' });
        return;
      }

      const updatedPlan = await planService.updatePlan(user.id, {
        selected_metiers: [...existing, newMetier],
      });
      setPlanData(updatedPlan);
      toast({ title: 'Métier ajouté', description: `${newMetier.libelle} a été ajouté à vos cibles.` });
      fetchEnrichedMetiers(updatedPlan);
    } catch (err) {
      console.error('Add metier error:', err);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'ajouter ce métier." });
    }
  };

  /* ── Effects ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { state: { returnTo: location.pathname + location.search } });
      return;
    }
    initializePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, navigate, retryCount, location.search]);

  /* ── Re-fetch formations when profile loads (initial render may be async) ── */
  useEffect(() => {
    if (!profileLoading && userProfile && enrichedMetiers.length > 0) {
      fetchFormationsForMetiers(enrichedMetiers, userProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, userProfile]);

  /* ── Render states ──────────────────────────────────────────────────────── */
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

  /* ── Main render ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Sticky breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-3 flex items-center justify-between gap-4">
          <Breadcrumbs />
          {userProfile?.first_name && (
            <span className="text-sm text-slate-500 hidden sm:block">
              Plan de <strong className="text-slate-700">{userProfile.first_name}</strong>
              {userProfile.user_status && (
                <span className="ml-1 text-slate-400">
                  · {
                    { lyceen: 'lycéen·ne', etudiant: 'étudiant·e', en_emploi: 'en emploi',
                      en_recherche: 'en recherche', reconversion: 'en reconversion' }
                    [userProfile.user_status] || userProfile.user_status
                  }
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-indigo-50 to-slate-50 py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-6 shadow-sm border border-indigo-200/50">
              <Target className="w-8 h-8 text-indigo-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
              {userProfile?.first_name
                ? `${userProfile.first_name}, votre Plan `
                : 'Votre Plan '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Personnalisé
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Votre feuille de route sur-mesure basée sur votre profil RIASEC
              {userProfile?.education_level && (
                <span> et votre niveau d'études</span>
              )}
              {userProfile?.region && (
                <span>, adaptée à votre région</span>
              )}
              .
            </p>

            {/* Profile info chips */}
            {userProfile && (
              <div className="flex flex-wrap gap-2 mt-5">
                {userProfile.education_level && (
                  <span className="text-xs bg-white border border-indigo-100 text-indigo-700 font-medium px-3 py-1.5 rounded-full shadow-sm">
                    🎓 {
                      { sans_diplome: 'Sans diplôme', cap_bep: 'CAP/BEP', bac: 'Bac',
                        'bac+2': 'Bac+2', 'bac+3': 'Bac+3', 'bac+5': 'Bac+5', doctorat: 'Doctorat' }
                      [userProfile.education_level] || userProfile.education_level
                    }
                  </span>
                )}
                {userProfile.region && (
                  <span className="text-xs bg-white border border-green-100 text-green-700 font-medium px-3 py-1.5 rounded-full shadow-sm">
                    📍 {userProfile.region}
                  </span>
                )}
                {userProfile.user_status && (
                  <span className="text-xs bg-white border border-amber-100 text-amber-700 font-medium px-3 py-1.5 rounded-full shadow-sm">
                    💼 {
                      { lyceen: 'Lycéen·ne', etudiant: 'Étudiant·e', en_emploi: 'En emploi',
                        en_recherche: 'En recherche', reconversion: 'En reconversion' }
                      [userProfile.user_status] || userProfile.user_status
                    }
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left column — main sections */}
          <div className="lg:col-span-8 space-y-2">
            <ProgressionSection
              planData={planData}
              hasTestData={hasTestData}
              userProfile={userProfile}
            />
            <RiasecProfileSection riasecProfile={profileData} />

            {metiersLoading ? (
              <div className="mb-10"><MetierLoadingSpinner /></div>
            ) : (
              <RecommendedMetiersSection
                metiers={enrichedMetiers}
                onAddMetier={handleAddMetier}
                isLoading={false}
                userProfile={userProfile}
              />
            )}

            <FormationPathSection
              formations={formations}
              isLoading={formationsLoading}
              userProfile={userProfile}
            />

            {/* Dashboard CTA — bottom of page */}
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

          {/* Right column — sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                  ⚡ Actions Rapides
                </h3>
                <RecommendedActionsSection userProfile={userProfile} />
              </div>

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
