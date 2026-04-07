import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import {
  Search, MapPin, Building, ChevronLeft, ChevronRight, AlertCircle,
  GraduationCap, Layers, Clock, BookOpen, Award, Star, Globe,
  CheckCircle2, FileText, MonitorPlay, Briefcase, Map as MapIcon, Laptop, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FEATURES } from '@/constants/subscriptionTiers';
import { fetchFormations } from '@/services/parcoursup';
import UpgradeModal from '@/components/UpgradeModal';
import FormationDetailsPanel from '@/components/FormationDetailsPanel';

// Constants
const API_BATCH_SIZE = 100;
const UI_PAGE_SIZE = 20;

const FormationsPage = ({ setAllFormations }) => {
  // --- State: Data ---
  const [allFetchedFormations, setAllFetchedFormations] = useState([]);
  const [serverTotalCount, setServerTotalCount] = useState(0);

  // --- State: UI Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingBatch, setIsFetchingBatch] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // --- State: Selection ---
  const [selectedFormation, setSelectedFormation] = useState(null);

  // --- State: Filters ---
  const [searchTerm, setSearchTerm] = useState('');

  // City Filter States
  const [cityInputValue, setCityInputValue] = useState('');
  const [selectedCityData, setSelectedCityData] = useState(null);

  const [sectorFilter, setSectorFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [formationTypeFilter, setFormationTypeFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('100');
  const [remoteFilter, setRemoteFilter] = useState(false);

  // Active search params (snapshot used for actual fetching)
  const [activeSearchParams, setActiveSearchParams] = useState({
    q: '',
    ville: '',
    codePostal: '',
    latitude: null,
    longitude: null,
    radius: '100'
  });

  // --- Refs ---
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();
  const { hasAccess } = useSubscriptionAccess();
  const hasPremiumAccess = hasAccess(FEATURES.FORMATION_DETAILS);

  // --- Helpers for Enrichment ---
  const getPseudoRandom = (seed) => {
    let hash = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getFormationLevel = (formation) => {
    const text = (formation.libelle_formation || '').toUpperCase();
    if (text.includes('BTS')) return 'BAC+2';
    if (text.includes('BUT')) return 'BAC+3';
    if (text.includes('LICENCE')) return 'BAC+3';
    if (text.includes('MASTER')) return 'BAC+5';
    if (text.includes('INGÉNIEUR')) return 'BAC+5';
    if (text.includes('CAP')) return 'CAP';
    if (text.includes('BAC')) return 'BAC';
    return 'Non spécifié';
  };

  const getDifficultyLevel = (level) => {
    if (['CAP', 'BAC'].includes(level)) return 'Débutant';
    if (['BAC+2', 'BAC+3'].includes(level)) return 'Intermédiaire';
    if (['BAC+5'].includes(level)) return 'Avancé';
    return 'Tous niveaux';
  };

  const enrichFormationData = (f) => {
    const seed = f.id_formation || f.libelle_formation || "default";
    const rand = getPseudoRandom(seed);
    const level = getFormationLevel(f);

    // Deterministic mock data for UI demo purposes
    const rating = (4 + (rand % 10) / 10).toFixed(1);
    const reviews = 20 + (rand % 150);
    const modules = 5 + (rand % 10);
    const hours = 400 + (rand % 1000);

    let duration = "Variable";
    if (level === 'BAC+2') duration = "2 ans";
    if (level === 'BAC+3') duration = "3 ans";
    if (level === 'BAC+5') duration = "5 ans";
    if (level === 'CAP') duration = "2 ans";

    const isApprentissage = (f.libelle_formation || '').toLowerCase().includes('apprentissage');

    return {
      ...f,
      ui_details: {
        duration: duration,
        level_label: level,
        difficulty: getDifficultyLevel(level),
        modules_count: modules,
        certificate: "Diplôme d'État / RNCP",
        prerequisites: level === 'BAC' ? "Brevet des collèges" : "Baccalauréat ou équivalent",
        instructor: f.etablissements?.[0]?.nom || "Équipe pédagogique qualifiée",
        rating: rating,
        reviews_count: reviews,
        access_duration: "Accès illimité ressources",
        outcomes: [
          "Compétences techniques métier",
          "Gestion de projet",
          "Communication professionnelle"
        ],
        format: isApprentissage ? "Alternance" : "Présentiel / Hybride",
        language: "Français",
        total_hours: `${hours}h`,
        cost: "Gratuit (Financé)" // added for details panel
      }
    };
  };

  // --- 1. Fetching Logic ---
  const fetchBatch = useCallback(async (offset = 0, reset = false) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      if (reset) {
        setInitialLoading(true);
      } else {
        setIsFetchingBatch(true);
      }
      setError(null);

      const params = {
        limit: API_BATCH_SIZE,
        offset: offset,
        q: activeSearchParams.q || undefined,
        ville: activeSearchParams.ville || undefined,
        codePostal: activeSearchParams.codePostal || undefined,
        latitude: activeSearchParams.latitude || undefined,
        longitude: activeSearchParams.longitude || undefined,
        radius: activeSearchParams.radius || undefined,
      };

      const response = await fetchFormations(params);

      if (response.success) {
        const newResults = response.results || [];
        const total = response.total || 0;

        const normalizedResults = newResults.map(f => ({
          ...f,
          libelle_formation: f.libelle_formation || "Formation (Nom non disponible)"
        }));

        setServerTotalCount(total);

        setAllFetchedFormations(prev => {
          if (reset) return normalizedResults;
          const existingIds = new Set(prev.map(p => p.id_formation || p.g_ea_lib_vx));
          const uniqueNew = normalizedResults.filter(f => !existingIds.has(f.id_formation || f.g_ea_lib_vx));
          return [...prev, ...uniqueNew];
        });

        if (setAllFormations) {
          setAllFormations(prev => reset ? normalizedResults : [...prev, ...normalizedResults]);
        }

        offsetRef.current = offset + newResults.length;

      } else {
        throw new Error(response.error || "Erreur de chargement");
      }
    } catch (err) {
      console.error("[FormationsPage] Error:", err);
      setError(err.message || "Impossible de charger les formations.");
      if (reset) {
        setAllFetchedFormations([]);
      }
    } finally {
      isFetchingRef.current = false;
      setInitialLoading(false);
      setIsFetchingBatch(false);
    }
  }, [activeSearchParams, setAllFormations]);

  // --- 2. Effects ---
  useEffect(() => {
    setCurrentPage(1);
    offsetRef.current = 0;
    fetchBatch(0, true);
  }, [fetchBatch]);

  // --- 3. Client-Side Processing ---
  const filteredFetchedData = useMemo(() => {
    let data = allFetchedFormations;

    if (sectorFilter && sectorFilter !== 'all') {
      data = data.filter(f => {
        // Mock filter logic based on title matching
        if (sectorFilter === 'sante') return f.libelle_formation.toLowerCase().includes('infirmier') || f.libelle_formation.toLowerCase().includes('santé');
        if (sectorFilter === 'commerce') return f.libelle_formation.toLowerCase().includes('commerce') || f.libelle_formation.toLowerCase().includes('vente');
        if (sectorFilter === 'informatique') return f.libelle_formation.toLowerCase().includes('informatique') || f.libelle_formation.toLowerCase().includes('numérique') || f.libelle_formation.toLowerCase().includes('web');
        return true;
      });
    }

    if (levelFilter && levelFilter !== 'all') {
      data = data.filter(f => getFormationLevel(f) === levelFilter);
    }

    if (formationTypeFilter && formationTypeFilter !== 'all') {
      data = data.filter(f => {
        const title = (f.libelle_formation || '').toLowerCase();
        const tags = (f.tags || []).join(' ').toLowerCase();
        if (formationTypeFilter === 'Alternance') {
          return title.includes('apprentissage') || title.includes('alternance') || tags.includes('apprentissage');
        }
        if (formationTypeFilter === 'Initial') {
          return !title.includes('apprentissage') && !title.includes('alternance');
        }
        return true;
      });
    }

    if (remoteFilter) {
      data = data.filter(f => (f.libelle_formation || '').toLowerCase().includes('distance') || Math.random() > 0.85);
    }

    return data;
  }, [allFetchedFormations, sectorFilter, levelFilter, formationTypeFilter, remoteFilter]);

  const totalPagesInFetched = Math.ceil(filteredFetchedData.length / UI_PAGE_SIZE);

  const displayedFormations = useMemo(() => {
    const startIndex = (currentPage - 1) * UI_PAGE_SIZE;
    const endIndex = startIndex + UI_PAGE_SIZE;
    return filteredFetchedData.slice(startIndex, endIndex).map(enrichFormationData);
  }, [filteredFetchedData, currentPage]);


  // --- 4. Handlers ---
  const handleCityChange = (text, data) => {
    setCityInputValue(text);
    setSelectedCityData(data);
  };

  const handleSearchSubmit = () => {
    const zip = selectedCityData ? String(selectedCityData['Code Postal']) : '';
    const lat = selectedCityData ? selectedCityData.latitude : null;
    const lon = selectedCityData ? selectedCityData.longitude : null;

    setActiveSearchParams({
      q: searchTerm,
      ville: cityInputValue,
      codePostal: zip,
      latitude: lat,
      longitude: lon,
      radius: distanceFilter
    });

    setCurrentPage(1);
    offsetRef.current = 0;
    setSelectedFormation(null); // Close panel on new search
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const pagesRemaining = totalPagesInFetched - newPage;
    if (pagesRemaining < 2 && allFetchedFormations.length < serverTotalCount && !isFetchingBatch) {
      await fetchBatch(offsetRef.current, false);
    }
  };

  const handleFormationClick = (formation) => {
    if (hasPremiumAccess) {
      // Instead of navigating, set the selected formation to show the panel
      setSelectedFormation(formation);
      // Scroll to the panel
      setTimeout(() => {
        document.getElementById('details-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleClosePanel = () => {
    setSelectedFormation(null);
  };

  const availableLevels = ['BAC+2', 'BAC+3', 'BAC+5', 'AUTRE'];
  const availableTypes = ['Initial', 'Alternance'];
  const availableSectors = [
    { value: 'commerce', label: 'Commerce & Vente' },
    { value: 'informatique', label: 'Informatique & Numérique' },
    { value: 'sante', label: 'Santé & Social' },
  ];
  const availableDistances = [
    { value: '10', label: '10 km' },
    { value: '30', label: '30 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Helmet>
        <title>Formations - Trouver sa formation en France | CléAvenir</title>
        <meta name="description" content="Explorez des milliers de formations en France : BTS, licence, master, CAP, bachelor et plus. Trouvez la formation qui correspond à votre projet professionnel." />
        <link rel="canonical" href="https://cleavenir.com/formations" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Catalogue des formations - CléAvenir",
          "description": "Explorez des milliers de formations en France.",
          "url": "https://cleavenir.com/formations",
          "publisher": {
            "@type": "Organization",
            "name": "CléAvenir",
            "url": "https://cleavenir.com"
          }
        })}</script>
      </Helmet>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        defaultTier="premium"
      />

      <main className="container mx-auto px-4 py-12 max-w-7xl flex-grow">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Catalogue des Formations</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Explorez nos programmes éducatifs détaillés.
          </p>
        </div>

        {/* --- Search & Filters Bar --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-[2] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Métier, compétences..."
                className="pl-10 h-12 text-base bg-white border-slate-200 focus:ring-violet-500 rounded-lg shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>

            <div className="flex-1 lg:min-w-[300px]">
              <CityAutocomplete
                value={cityInputValue}
                onCitySelect={handleCityChange}
                placeholder="Ville..."
                className="w-full"
              />
            </div>

            <Button
              className="h-12 px-8 bg-[#E5007D] hover:bg-[#C4006B] text-white font-semibold rounded-lg shrink-0 transition-colors shadow-sm lg:w-auto w-full"
              onClick={handleSearchSubmit}
            >
              Rechercher
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="h-10 w-auto min-w-[160px] bg-slate-50 border-slate-200 rounded-lg shadow-sm">
                <Briefcase className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Tous secteurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous secteurs</SelectItem>
                {availableSectors.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="h-10 w-auto min-w-[160px] bg-slate-50 border-slate-200 rounded-lg shadow-sm">
                <GraduationCap className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Tous niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous niveaux</SelectItem>
                {availableLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={formationTypeFilter} onValueChange={setFormationTypeFilter}>
              <SelectTrigger className="h-10 w-auto min-w-[160px] bg-slate-50 border-slate-200 rounded-lg shadow-sm">
                <Layers className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Tous formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous formats</SelectItem>
                {availableTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="h-10 w-auto min-w-[120px] bg-slate-50 border-slate-200 rounded-lg shadow-sm">
                <MapIcon className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                {availableDistances.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500 font-medium hidden xl:block">
              {serverTotalCount > 0 ? `${serverTotalCount} formations` : 'Aucun résultat'}
            </div>
          </div>
        </div>

        {/* --- Details Panel (Conditionally Rendered) --- */}
        {selectedFormation && (
          <FormationDetailsPanel
            formationId={selectedFormation.id_formation || selectedFormation.g_ea_lib_vx}
            formationData={selectedFormation}
            onClose={handleClosePanel}
          />
        )}

        {/* --- Results List --- */}
        <div className="grid grid-cols-1 gap-6">
          {initialLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-slate-100 rounded-t-xl" />
                <CardContent className="h-40 bg-slate-50" />
              </Card>
            ))
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium">{error}</p>
              <Button onClick={() => fetchBatch(0, true)} variant="outline" className="mt-4 border-red-200 text-red-700">Réessayer</Button>
            </div>
          ) : displayedFormations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Aucune formation trouvée</h3>
              <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            displayedFormations.map((formation, idx) => {
              const { ui_details } = formation;
              const primaryEtab = formation.etablissements?.[0] || {};
              const isSelected = selectedFormation && (formation.id_formation === selectedFormation.id_formation);

              return (
                <Card
                  key={`${formation.id_formation}-${idx}`}
                  className={`group overflow-hidden hover:shadow-lg transition-all border-slate-200 hover:border-violet-200 ${isSelected ? 'ring-2 ring-violet-500 border-violet-500' : ''}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                            {ui_details.level_label}
                          </Badge>
                          <Badge variant="outline" className="text-slate-600 border-slate-200">
                            {ui_details.format}
                          </Badge>
                          {ui_details.rating && (
                            <div className="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                              <Star className="h-3 w-3 fill-amber-500" />
                              <span>{ui_details.rating}</span>
                              <span className="text-slate-400 font-normal text-xs">({ui_details.reviews_count})</span>
                            </div>
                          )}
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors leading-tight">
                          {formation.libelle_formation}
                        </h2>

                        <div className="flex items-center gap-2 text-slate-600 mb-4 text-sm font-medium">
                          <Building className="h-4 w-4 text-slate-400" />
                          <span>{ui_details.instructor}</span>
                          <span className="text-slate-300">•</span>
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{primaryEtab.ville || formation.ville}</span>
                        </div>

                        <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                          {formation.description || "Formation complète pour acquérir les compétences clés."}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium uppercase mb-1">Durée</span>
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Clock className="h-4 w-4 text-violet-500" />
                              {ui_details.duration}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium uppercase mb-1">Modules</span>
                            <div className="flex items-center gap-1.5 font-semibold">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              {ui_details.modules_count} leçons
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium uppercase mb-1">Langue</span>
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Globe className="h-4 w-4 text-emerald-500" />
                              {ui_details.language}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium uppercase mb-1">Difficulté</span>
                            <div className="flex items-center gap-1.5 font-semibold">
                              <MonitorPlay className="h-4 w-4 text-orange-500" />
                              {ui_details.difficulty}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-80 bg-slate-50/50 p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between">
                      <div className="space-y-4 mb-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <Award className="h-4 w-4 text-violet-600" />
                            Certification
                          </h4>
                          <p className="text-sm text-slate-600 pl-6">{ui_details.certificate}</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-violet-600" />
                            Compétences clés
                          </h4>
                          <ul className="text-sm text-slate-600 pl-6 list-disc space-y-1">
                            {ui_details.outcomes.slice(0, 2).map((outcome, i) => (
                              <li key={i}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <Button
                          className={`w-full ${hasPremiumAccess ? 'bg-violet-600 hover:bg-violet-700' : 'bg-slate-800 hover:bg-slate-700'} text-white shadow-sm`}
                          onClick={() => handleFormationClick(formation)}
                        >
                          {hasPremiumAccess ? "Accéder à la formation" : (
                            <>
                              <Lock size={14} className="mr-2" /> Voir le détail complet
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="mt-12 flex justify-center items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-600">
            Page {currentPage} sur {Math.max(totalPagesInFetched, 1)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPagesInFetched && allFetchedFormations.length >= serverTotalCount}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormationsPage;