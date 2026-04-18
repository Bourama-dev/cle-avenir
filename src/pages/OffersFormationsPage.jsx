import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2, Search, Briefcase, BookOpen, MapPin, Building,
  GraduationCap, Clock, Euro, ExternalLink, Home, ArrowLeft,
  Bookmark, BookmarkCheck, RefreshCw, AlertCircle, Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useNavigation } from '@/hooks/useNavigation';
import { normalizedIncludes } from '@/utils/stringUtils';
import { metierToSlug } from '@/utils/slugUtils';
import { getMetierSalary } from '@/utils/salaryUtils';

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (str) => {
  if (!str) return '';
  try { return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
  catch { return ''; }
};

const contractLabel = (type) => {
  const map = { CDI: 'CDI', CDD: 'CDD', MIS: 'Mission', SAI: 'Saisonnier',
    LIB: 'Libéral', REP: 'Reprise', TTI: 'Intérim', FRA: 'Franchise',
    CCE: 'Chef d\'entreprise', DIN: 'Contrat d\'insertion' };
  return map[type] || type || 'CDI';
};

// ── Sub-components ────────────────────────────────────────────────────────────
const JobCard = ({ job, onSave, isSaved }) => (
  <Card className="hover:shadow-md transition-shadow border-slate-200">
    <CardContent className="p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-slate-900 truncate">{job.intitule}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
            <Building className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.entreprise?.nom || 'Entreprise non précisée'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs">{contractLabel(job.typeContrat)}</Badge>
          <button onClick={() => onSave(job)} title={isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
            className="text-slate-400 hover:text-violet-600 transition-colors">
            {isSaved ? <BookmarkCheck className="h-5 w-5 text-violet-600" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
        {job.lieuTravail?.libelle && (
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.lieuTravail.libelle}</span>
        )}
        {job.salaire?.libelle && (
          <span className="flex items-center gap-1"><Euro className="h-3.5 w-3.5" />{job.salaire.libelle}</span>
        )}
        {job.dateCreation && (
          <span className="text-xs text-slate-400">Publiée le {formatDate(job.dateCreation)}</span>
        )}
      </div>

      {job.description && (
        <p className="mt-3 text-xs text-slate-500 line-clamp-2">{job.description}</p>
      )}

      <div className="mt-4 flex gap-2">
        {job.origineOffre?.urlOrigine ? (
          <Button size="sm" className="gap-1.5" asChild>
            <a href={job.origineOffre.urlOrigine} target="_blank" rel="noopener noreferrer">
              Voir l'offre <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>Offre complète non disponible</Button>
        )}
        {job.codeROME && (
          <Button size="sm" variant="outline" asChild>
            <a href={`/metier/rome-${job.codeROME?.toLowerCase()}`}>Voir le métier</a>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const FormationCard = ({ formation, onSave, isSaved }) => {
  const navigate = useNavigate();
  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 line-clamp-2">{formation.libelle_formation || formation.title}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {formation.etablissements?.[0]?.libelle_uai || formation.provider || 'Établissement non précisé'}
              </span>
            </div>
          </div>
          <button onClick={() => onSave(formation)} title={isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
            className="text-slate-400 hover:text-violet-600 transition-colors shrink-0">
            {isSaved ? <BookmarkCheck className="h-5 w-5 text-violet-600" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
          {(formation.ville || formation.etablissements?.[0]?.ville) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {formation.ville || formation.etablissements[0].ville}
            </span>
          )}
          {formation.duree && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formation.duree}</span>}
          {formation.niveau && <Badge variant="secondary" className="text-xs">{formation.niveau}</Badge>}
        </div>

        {formation.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2">{formation.description}</p>
        )}

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate(`/formation/${formation.id_formation || formation.id}`)}>
            Voir la formation
          </Button>
          {formation.lien_parcoursup && (
            <Button size="sm" className="gap-1.5" asChild>
              <a href={formation.lien_parcoursup} target="_blank" rel="noopener noreferrer">
                Parcoursup <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const OffersFormationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { goBack, goHome } = useNavigation();

  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [formations, setFormations] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedFormationIds, setSavedFormationIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [userRomeCodes, setUserRomeCodes] = useState([]);

  // ── Load real data ──────────────────────────────────────────────────────────
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Get user's recommended ROME codes
      const { data: testResult } = await supabase
        .from('test_results')
        .select('top_3_careers')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const romeCodes = (testResult?.top_3_careers || [])
        .map(c => c.code || c.metierCode)
        .filter(Boolean)
        .slice(0, 3);

      setUserRomeCodes(romeCodes);

      // 2. Fetch real jobs from France Travail API (via edge function)
      const allJobs = [];
      if (romeCodes.length > 0) {
        const jobFetches = await Promise.allSettled(
          romeCodes.map(code =>
            supabase.functions.invoke('get-rome-job-offers', { body: { code, limit: 8 } })
          )
        );
        jobFetches.forEach(result => {
          if (result.status === 'fulfilled' && result.value.data?.data) {
            allJobs.push(...result.value.data.data);
          }
        });
      }

      // Fallback: fetch generic jobs if no ROME codes
      if (allJobs.length === 0) {
        const { data: genericJobs } = await supabase.functions.invoke('get-jobs', {
          body: { limit: 20 }
        });
        if (genericJobs?.data) allJobs.push(...genericJobs.data);
      }

      setJobs(allJobs);

      // 3. Fetch saved job IDs
      const { data: savedJobs } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);
      setSavedJobIds(new Set((savedJobs || []).map(j => j.job_id)));

      // 4. Fetch formations from Parcoursup based on user's interest
      let allFormations = [];
      if (romeCodes.length > 0) {
        // Get first ROME metier name for Parcoursup search
        const { data: metierData } = await supabase
          .from('rome_metiers')
          .select('libelle')
          .in('code', romeCodes)
          .limit(1)
          .maybeSingle();

        if (metierData?.libelle) {
          try {
            const keyword = metierData.libelle.split('/')[0].trim().split(' ').slice(0, 2).join(' ');
            const parcoursupUrl = `https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records?where=libelle_formation%20like%20%22${encodeURIComponent(keyword)}%22&limit=15&select=id_formation,libelle_formation,g_ea_lib_vx,dep_lib,ville,capa_fin`;
            const pRes = await fetch(parcoursupUrl);
            if (pRes.ok) {
              const pData = await pRes.json();
              allFormations = (pData.results || []).map(f => ({
                id_formation: f.id_formation,
                libelle_formation: f.libelle_formation,
                etablissements: [{ libelle_uai: f.g_ea_lib_vx, ville: f.ville }],
                ville: f.ville,
              }));
            }
          } catch (e) {
            console.warn('Parcoursup fetch failed:', e);
          }
        }
      }

      // Fallback: load from DB saved formations
      if (allFormations.length === 0) {
        const { data: savedF } = await supabase
          .from('saved_formations')
          .select('*')
          .eq('user_id', user.id);
        if (savedF && savedF.length > 0) allFormations = savedF;
      }

      setFormations(allFormations);

      // 5. Fetch saved formation IDs
      const { data: savedFormations } = await supabase
        .from('saved_formations')
        .select('formation_id')
        .eq('user_id', user.id);
      setSavedFormationIds(new Set((savedFormations || []).map(f => f.formation_id)));

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Impossible de charger les données. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  // ── Save / unsave ─────────────────────────────────────────────────────────
  const toggleSaveJob = async (job) => {
    if (!user) { toast({ title: 'Connectez-vous pour sauvegarder', variant: 'destructive' }); return; }
    const jobId = job.id;
    if (savedJobIds.has(jobId)) {
      await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId);
      setSavedJobIds(prev => { const s = new Set(prev); s.delete(jobId); return s; });
    } else {
      await supabase.from('saved_jobs').upsert({ user_id: user.id, job_id: jobId, job_data: job });
      setSavedJobIds(prev => new Set([...prev, jobId]));
    }
  };

  const toggleSaveFormation = async (formation) => {
    if (!user) { toast({ title: 'Connectez-vous pour sauvegarder', variant: 'destructive' }); return; }
    const fId = formation.id_formation || formation.id;
    if (savedFormationIds.has(fId)) {
      await supabase.from('saved_formations').delete().eq('user_id', user.id).eq('formation_id', fId);
      setSavedFormationIds(prev => { const s = new Set(prev); s.delete(fId); return s; });
    } else {
      await supabase.from('saved_formations').upsert({ user_id: user.id, formation_id: fId, formation_data: formation });
      setSavedFormationIds(prev => new Set([...prev, fId]));
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredJobs = jobs.filter(j =>
    !searchTerm || normalizedIncludes(j.intitule, searchTerm) || normalizedIncludes(j.entreprise?.nom, searchTerm) || normalizedIncludes(j.lieuTravail?.libelle, searchTerm)
  );
  const filteredFormations = formations.filter(f =>
    !searchTerm || normalizedIncludes(f.libelle_formation || f.title, searchTerm) || normalizedIncludes(f.etablissements?.[0]?.libelle_uai || f.provider, searchTerm)
  );

  const SkeletonCards = () => (
    <div className="grid gap-4">
      {[1,2,3,4].map(i => (
        <Card key={i}><CardContent className="p-5 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></div>
          <Skeleton className="h-8 w-28" />
        </CardContent></Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between">
          <Breadcrumbs />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={goHome} className="text-slate-600 hover:text-indigo-600">
              <Home className="w-4 h-4 mr-2" /> Accueil
            </Button>
            <Button variant="ghost" size="sm" onClick={goBack} className="text-slate-600 hover:text-violet-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Offres & Formations</h1>
          <p className="text-slate-500 mt-1">
            {userRomeCodes.length > 0
              ? <>Résultats personnalisés selon vos recommandations <Badge variant="secondary" className="ml-1"><Sparkles className="w-3 h-3 mr-1 inline" />Personnalisé</Badge></>
              : 'Passez le test d\'orientation pour obtenir des offres personnalisées.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Rechercher…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" size="icon" onClick={loadData} title="Actualiser">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
          <Button size="sm" variant="outline" onClick={loadData} className="ml-auto">Réessayer</Button>
        </div>
      )}

      {userRomeCodes.length === 0 && !loading && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Sparkles className="text-violet-500 h-6 w-6 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-violet-900">Personnalisez vos résultats</p>
            <p className="text-sm text-violet-700 mt-0.5">Passez le test d'orientation pour voir des offres et formations adaptées à votre profil.</p>
          </div>
          <Button onClick={() => navigate('/test-orientation')} className="bg-violet-600 hover:bg-violet-700 shrink-0">
            Passer le test
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Offres d'Emploi
            {!loading && jobs.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{jobs.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="formations" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Formations
            {!loading && formations.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{formations.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          {loading ? <SkeletonCards /> : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-700">Aucune offre d'emploi trouvée</p>
              <p className="text-sm text-slate-500 mt-1">
                {userRomeCodes.length === 0
                  ? 'Passez le test d\'orientation pour obtenir des offres personnalisées.'
                  : 'Aucune offre disponible pour vos métiers recommandés en ce moment.'}
              </p>
              {userRomeCodes.length === 0 && (
                <Button onClick={() => navigate('/test-orientation')} className="mt-4">Passer le test</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job} onSave={toggleSaveJob} isSaved={savedJobIds.has(job.id)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="formations">
          {loading ? <SkeletonCards /> : filteredFormations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-700">Aucune formation trouvée</p>
              <p className="text-sm text-slate-500 mt-1">
                {userRomeCodes.length === 0
                  ? 'Passez le test d\'orientation pour obtenir des formations personnalisées.'
                  : 'Aucune formation disponible pour vos métiers recommandés en ce moment.'}
              </p>
              {userRomeCodes.length === 0 && (
                <Button onClick={() => navigate('/test-orientation')} className="mt-4">Passer le test</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFormations.map((f, idx) => (
                <FormationCard key={f.id_formation || f.id || idx} formation={f} onSave={toggleSaveFormation} isSaved={savedFormationIds.has(f.id_formation || f.id)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OffersFormationsPage;
