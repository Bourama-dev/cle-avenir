import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import {
  Search, MapPin, Building, ChevronLeft, ChevronRight, AlertCircle,
  Users, Award,
  CheckCircle2, FileText, MonitorPlay, Briefcase, ArrowRight,
  School, GraduationCap, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { extractFormationKeywords } from '@/utils/formationKeywords';
import { fetchFormations } from '@/services/parcoursup';
import FormationDetailsPanel from '@/components/FormationDetailsPanel';
import { calculateDistance } from '@/services/LocationFilterService';
import EnhancedFormationFilters from '@/components/formation-explorer/EnhancedFormationFilters';
import { normalizeStr } from '@/utils/stringUtils';

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

  // --- State: Selection ---
  const [selectedFormation, setSelectedFormation] = useState(null);

  // --- State: Filters ---
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('q') || '');

  // City Filter States
  const [cityInputValue, setCityInputValue] = useState('');
  const [selectedCityData, setSelectedCityData] = useState(null);

  const [sectorFilter, setSectorFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [formationTypeFilter, setFormationTypeFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('100');
  const [remoteFilter, setRemoteFilter] = useState(false);

  // Active search params (snapshot used for actual fetching) — pre-fill from ?q= URL param
  const [activeSearchParams, setActiveSearchParams] = useState(() => ({
    q: new URLSearchParams(window.location.search).get('q') || '',
    ville: '',
    latitude: null,
    longitude: null,
    radius: '100',
  }));

  // --- Refs ---
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // --- Helpers for Enrichment ---
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

  const enrichFormationData = (f) => {
    // Use niveau from API when available, fall back to title-based detection
    const level = f.niveau || getFormationLevel(f);

    // Detect alternance from source field or tags (reliable for Catalogue Apprentissage data)
    const isAlternance =
      f.source === 'apprentissage' ||
      (f.tags || []).some(t => ['Apprentissage', 'Alternance'].includes(t)) ||
      (f.libelle_formation || '').toLowerCase().includes('alternance') ||
      (f.libelle_formation || '').toLowerCase().includes('apprentissage');

    return {
      ...f,
      ui_details: {
        level_label: level,
        format: isAlternance ? 'Alternance' : null,
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
        ville: activeSearchParams.ville || undefined
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
        const title = normalizeStr(f.libelle_formation);
        const fili = normalizeStr(f.fili || '');
        if (sectorFilter === 'informatique') return title.includes('informatique') || title.includes('numerique') || title.includes('web') || title.includes('developpeur') || title.includes('systeme') || title.includes('reseau') || fili.includes('informatique');
        if (sectorFilter === 'sante') return title.includes('infirmier') || title.includes('sante') || title.includes('medecin') || title.includes('pharmacie') || title.includes('kinesitherapeute') || title.includes('aide soignant') || fili.includes('sante');
        if (sectorFilter === 'commerce') return title.includes('commerce') || title.includes('vente') || title.includes('marketing') || title.includes('gestion') || title.includes('management') || title.includes('comptabilite') || fili.includes('commerce');
        if (sectorFilter === 'sciences') return title.includes('science') || title.includes('chimie') || title.includes('physique') || title.includes('ingenieur') || title.includes('mathematique') || fili.includes('ing') || fili.includes('science');
        if (sectorFilter === 'droit') return title.includes('droit') || title.includes('juridique') || title.includes('notaire') || title.includes('politique') || fili.includes('droit');
        if (sectorFilter === 'arts') return title.includes('art') || title.includes('design') || title.includes('communication') || title.includes('graphisme') || title.includes('audiovisuel') || fili.includes('art');
        if (sectorFilter === 'education') return title.includes('education') || title.includes('enseignement') || title.includes('professeur') || title.includes('pedagogie') || fili.includes('education');
        if (sectorFilter === 'tourisme') return title.includes('tourisme') || title.includes('hotel') || title.includes('restauration') || title.includes('cuisinier') || fili.includes('tourisme');
        return true;
      });
    }

    if (levelFilter && levelFilter !== 'all') {
      // Use niveau from API when available, otherwise derive from title
      data = data.filter(f => (f.niveau || getFormationLevel(f)) === levelFilter);
    }

    if (formationTypeFilter && formationTypeFilter !== 'all') {
      data = data.filter(f => {
        const title = normalizeStr(f.libelle_formation);
        const tags = (f.tags || []).map(t => normalizeStr(t));
        const isAlternance = f.source === 'apprentissage' || tags.some(t => t.includes('alternance') || t.includes('apprentissage')) || title.includes('apprentissage') || title.includes('alternance');
        if (formationTypeFilter === 'Alternance') return isAlternance;
        if (formationTypeFilter === 'Parcoursup') return f.source === 'parcoursup';
        if (formationTypeFilter === 'Initial') return !isAlternance;
        return true;
      });
    }

    if (remoteFilter) {
      data = data.filter(f => {
        const title = normalizeStr(f.libelle_formation);
        const tags = normalizeStr((f.tags || []).join(' '));
        return title.includes('distance') || title.includes('e-learning') || title.includes('distanciel') || tags.includes('distance') || tags.includes('distanciel');
      });
    }

    // Parcoursup data has no GPS coordinates, so client-side radius filtering is
    // not possible. Location filtering is handled server-side by the ville parameter
    // (via handleSearchSubmit → fetchBatch). No client-side location filter needed.

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
    const lat = selectedCityData ? selectedCityData.latitude : null;
    const lon = selectedCityData ? selectedCityData.longitude : null;

    setActiveSearchParams({
      q: searchTerm,
      ville: cityInputValue,
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
    // Show the details panel instead of navigating
    setSelectedFormation(formation);
    setTimeout(() => {
      document.getElementById('details-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClosePanel = () => {
    setSelectedFormation(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCityInputValue('');
    setSelectedCityData(null);
    setSectorFilter('all');
    setLevelFilter('all');
    setFormationTypeFilter('all');
    setDistanceFilter('100');
    setRemoteFilter(false);
    setCurrentPage(1);
    offsetRef.current = 0;
    setSelectedFormation(null);
    setActiveSearchParams({
      q: '',
      ville: '',
      latitude: null,
      longitude: null,
      radius: '100'
    });
  };

  // SEO Configuration
  const formationsSEO = categoryPageSEO({
    title: "Formations en France - BTS, Licences, Masters | CléAvenir",
    description: "Explorez des milliers de formations en France : BTS, licence, master, CAP, bachelor et plus. Trouvez la formation qui correspond à votre projet professionnel.",
    keywords: "formations, recherche formation, BTS, licence, master, CAP, bachelor, alternance, apprentissage, Parcoursup, école, université, formation professionnelle, parcours professionnel, orientation après bac, formation en ligne, CFA, quelles études choisir",
    category: "Formations",
    categoryPath: "/formations"
  });

  const typeChips = [
    { value: 'all', label: 'Tout' },
    { value: 'Parcoursup', label: 'Parcoursup' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Initial', label: 'Initial' },
  ];
  const levelChips = [{ value: 'all', label: 'Tous niveaux' }, ...['CAP/BEP', 'BAC', 'BAC+2', 'BAC+3', 'BAC+5'].map(v => ({ value: v, label: v }))];
  const chipCls = (active) =>
    `shrink-0 h-11 px-4 rounded-full text-sm font-semibold border transition-colors ${
      active
        ? 'bg-violet-600 text-white border-violet-600'
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col">
      <PageHelmet {...formationsSEO} />

      {/* Sticky search + chips */}
      <div className="sticky top-14 md:top-16 lg:top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <Input
                placeholder="Formation, métier, école"
                className="pl-11 h-12 rounded-2xl text-base bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:text-white dark:placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
            <MagneticButton>
              <Button
                className="h-12 w-12 md:w-auto md:px-8 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
                onClick={handleSearchSubmit}
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5 md:hidden" />
                <span className="hidden md:inline">Rechercher</span>
              </Button>
            </MagneticButton>
          </div>

          <div className="snap-feed flex gap-2 overflow-x-auto -mx-4 px-4 mt-3">
            {typeChips.map(c => (
              <button key={c.value} className={chipCls(formationTypeFilter === c.value)} onClick={() => setFormationTypeFilter(c.value)}>
                {c.label}
              </button>
            ))}
            <span className="shrink-0 w-px bg-slate-200 dark:bg-slate-700 my-2" />
            {levelChips.map(c => (
              <button key={c.value} className={chipCls(levelFilter === c.value)} onClick={() => setLevelFilter(c.value)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-4 md:py-8 flex-grow pb-24 md:pb-8">
        {/* Niveau selector */}
        <div className="flex gap-2 mb-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-1.5 text-white">
          <button
            onClick={() => navigate('/lycees')}
            className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            <School className="w-4 h-4 shrink-0" /> Collégien <ArrowRight className="w-3.5 h-3.5 hidden sm:block" /> <span className="hidden sm:inline">Lycée</span>
          </button>
          <div className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-white text-violet-700 px-3 text-sm font-bold cursor-default">
            <GraduationCap className="w-4 h-4 shrink-0" /> Post-bac
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <EnhancedFormationFilters
            searchTerm={searchTerm}
            cityInputValue={cityInputValue}
            selectedCityData={selectedCityData}
            sectorFilter={sectorFilter}
            levelFilter={levelFilter}
            formationTypeFilter={formationTypeFilter}
            distanceFilter={distanceFilter}
            remoteFilter={remoteFilter}
            onSearchTermChange={setSearchTerm}
            onCityChange={handleCityChange}
            onSectorChange={setSectorFilter}
            onLevelChange={setLevelFilter}
            onFormationTypeChange={setFormationTypeFilter}
            onDistanceChange={setDistanceFilter}
            onRemoteChange={setRemoteFilter}
            onSearch={handleSearchSubmit}
            onReset={handleResetFilters}
          />

          <div className="flex-1 min-w-0">

        {selectedFormation && (
          <FormationDetailsPanel
            formationId={selectedFormation.id_formation || selectedFormation.g_ea_lib_vx}
            formationData={selectedFormation}
            onClose={handleClosePanel}
          />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-5">
          {initialLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-200/70 dark:bg-slate-800 animate-pulse" />
            ))
          ) : error ? (
            <div className="xl:col-span-2 text-center py-12 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-100">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium px-4">{error}</p>
              <Button onClick={() => fetchBatch(0, true)} variant="outline" className="mt-4 h-11 border-red-200 text-red-700">Réessayer</Button>
            </div>
          ) : displayedFormations.length === 0 ? (
            <div className="xl:col-span-2 text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune formation trouvée</h3>
              <p className="text-slate-500 dark:text-slate-400">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            displayedFormations.map((formation, idx) => {
              const { ui_details } = formation;
              const primaryEtab = formation.etablissements?.[0] || {};
              const isSelected = selectedFormation && (formation.id_formation === selectedFormation.id_formation);
              const { metierKeyword, offresKeyword } = extractFormationKeywords(formation.libelle_formation || '');

              return (
                <motion.div
                  key={`${formation.id_formation}-${idx}`}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 md:p-5 md:hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-violet-500 border-violet-500' : ''}`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {formation.source === 'parcoursup' && (
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold">Parcoursup</Badge>
                    )}
                    {formation.source === 'apprentissage' && (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">Alternance</Badge>
                    )}
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700">{ui_details.level_label}</Badge>
                    {formation.parcoursup?.selectivite && (
                      <span className="ml-auto text-xs font-medium text-slate-500">{formation.parcoursup.selectivite}</span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-3 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {formation.libelle_formation}
                  </h2>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 mt-1.5 text-sm min-w-0">
                    <Building className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{primaryEtab.nom}</span>
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
                    <span className="truncate shrink-0 max-w-[40%]">{primaryEtab.ville || formation.ville}</span>
                  </div>

                  {(formation.parcoursup || ui_details.format) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {formation.parcoursup?.capacite != null && (
                        <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-violet-500" />{formation.parcoursup.capacite} places</span>
                      )}
                      {formation.parcoursup?.taux_acces != null && (
                        <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-violet-500" />{Math.round(formation.parcoursup.taux_acces)} % d'accès</span>
                      )}
                      {ui_details.format && (
                        <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-emerald-500" />{ui_details.format}</span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={() => handleFormationClick(formation)}
                    >
                      Voir la formation
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 w-11 p-0 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => navigate(`/metiers?q=${encodeURIComponent(metierKeyword)}`)}
                      title={`Métiers : ${metierKeyword}`}
                      aria-label="Voir les métiers liés"
                    >
                      <Briefcase className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 w-11 p-0 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => navigate(`/offres-emploi?q=${encodeURIComponent(offresKeyword)}`)}
                      title={`Offres : ${offresKeyword}`}
                      aria-label="Voir les offres liées"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="mt-8 flex justify-center items-center gap-5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full h-11 w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Page {currentPage} sur {Math.max(totalPagesInFetched, 1)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPagesInFetched && allFetchedFormations.length >= serverTotalCount}
            className="rounded-full h-11 w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormationsPage;
