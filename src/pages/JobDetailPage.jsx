import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getJobDetails, searchJobs } from '@/services/franceTravail';
import { metierService } from '@/services/metierService';
import { fetchFormations } from '@/services/parcoursup';
import { extractFormationKeywords } from '@/utils/formationKeywords';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import PageHelmet from '@/components/SEO/PageHelmet';
import { jobDetailSEO } from '@/components/SEO/seoPresets';
import JobCard from '@/components/job-explorer/JobCard';
import {
  AlertCircle, ArrowLeft, Briefcase, GraduationCap,
  ArrowRight, Clock, Building, MapPin, ChevronRight
} from 'lucide-react';
import { isValidUUID } from '@/lib/utils';

// New Components
import JobDetailHero from '@/components/job-detail/JobDetailHero';
import JobDetailSummary from '@/components/job-detail/JobDetailSummary';
import JobDetailDescription from '@/components/job-detail/JobDetailDescription';
import JobDetailCompanyInfo from '@/components/job-detail/JobDetailCompanyInfo';
import JobDetailApplication from '@/components/job-detail/JobDetailApplication';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [relatedMetier, setRelatedMetier] = useState(null);
  const [relatedFormations, setRelatedFormations] = useState([]);
  const [loadingMetier, setLoadingMetier] = useState(false);
  const [loadingFormations, setLoadingFormations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch Job Data
  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let jobData = null;

        // Determine source based on ID format
        if (isValidUUID(id)) {
          // Internal Supabase Job
          const { data, error: dbError } = await supabase
            .from('job_postings')
            .select('*, organizations(*), companies(*)')
            .eq('id', id)
            .single();
            
          if (dbError) throw dbError;
          
          jobData = {
            id: data.id,
            title: data.title,
            description: data.description || data.full_description,
            company: data.companies?.name || data.company_name || 'Entreprise Confidentielle',
            company_logo: data.companies?.logo_url,
            location: data.location || data.city,
            contract_type: data.contract_type,
            salary_range: data.salary_range,
            published_at: data.created_at,
            url: data.external_link,
            skills: data.skills_required || [],
            benefits: data.benefits ? Object.values(data.benefits) : [],
            experience: data.experience_level,
            education: data.education_level,
            source: 'internal'
          };
        } else {
          // External France Travail Job
          const result = await getJobDetails(id);
          if (!result.success) throw new Error(result.error);
          jobData = { ...result.data };
        }

        if (!jobData) throw new Error("Données de l'offre vides");
        setJob(jobData);

        // Fetch Related Jobs, Métier, and Formations in parallel
        const titleKeyword = jobData.title || '';

        const relatedRes = await searchJobs({
          query: titleKeyword.split(' ').slice(0, 3).join(' '),
          limit: 3,
        });
        if (relatedRes.success) {
          setRelatedJobs(relatedRes.results.filter(j => j.id !== id));
        }

        // Métier associé — try romeCode from raw data first, then text search
        fetchRelatedMetier(jobData);
        // Pass full job title so extractFormationKeywords can analyse it
        fetchRelatedFormations(titleKeyword);

        // Check if saved
        if (user) {
          const { data: savedData } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .maybeSingle();
          setIsSaved(!!savedData);
        }

      } catch (err) {
        console.error("Error loading job:", err);
        setError("Cette offre semble provenir d'une source externe ou n'est plus disponible.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
    window.scrollTo(0, 0);
  }, [id, user]);

  /* ── Find the closest matching ROME métier for this job ──────────────── */
  const fetchRelatedMetier = async (jobData) => {
    setLoadingMetier(true);
    try {
      // 1. Direct ROME code (France Travail jobs expose codeRome or romeCode)
      const romeCode = jobData.codeRome || jobData.romeCode || jobData.rome_code;
      if (romeCode) {
        const { data } = await supabase
          .from('rome_metiers')
          .select('code, libelle, description, salaire, debouches, niveau_etudes')
          .eq('code', romeCode)
          .maybeSingle();
        if (data) { setRelatedMetier(data); return; }
      }

      // 2. Text search: derive a meaningful keyword from the full job title
      const { metierKeyword } = extractFormationKeywords(jobData.title || '');
      const searchKw = metierKeyword || jobData.title || '';
      if (searchKw) {
        const results = await metierService.searchMetiers(searchKw);
        if (results?.length > 0) setRelatedMetier(results[0]);
      }
    } catch (err) {
      console.error('fetchRelatedMetier error:', err);
    } finally {
      setLoadingMetier(false);
    }
  };

  /* ── Fetch 3 Parcoursup formations matching the job title ─────────────── */
  const fetchRelatedFormations = async (jobTitle) => {
    if (!jobTitle) return;
    setLoadingFormations(true);
    try {
      // Use the same smart extraction we use for formations→métiers
      // but applied in reverse: job title → formation search keyword
      const { offresKeyword } = extractFormationKeywords(jobTitle);
      const keyword = offresKeyword || jobTitle;
      const response = await fetchFormations({ q: keyword, limit: 6 });
      if (response.success && response.results?.length) {
        // Normalise to a simple display shape
        const normalised = response.results.slice(0, 3).map(f => ({
          id:       f.id_formation || f.g_ea_lib_vx,
          title:    f.libelle_formation || 'Formation',
          provider: f.etablissements?.[0]?.nom || 'Établissement',
          city:     f.etablissements?.[0]?.ville || f.ville || '',
          duration: (() => {
            const t = (f.libelle_formation || '').toUpperCase();
            if (t.includes('BTS') || t.includes('BUT')) return '2-3 ans';
            if (t.includes('MASTER') || t.includes('INGÉN')) return '2 ans (bac+3 req.)';
            if (t.includes('CAP')) return '2 ans';
            return 'Variable';
          })(),
        }));
        setRelatedFormations(normalised);
      }
    } catch (err) {
      console.error('fetchRelatedFormations error:', err);
    } finally {
      setLoadingFormations(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour sauvegarder cette offre.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    setSaveLoading(true);
    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', id);
        setIsSaved(false);
        toast({ title: "Offre retirée des favoris" });
      } else {
        await supabase.from('saved_jobs').insert({
          user_id: user.id,
          job_id: id,
          job_details: job
        });
        setIsSaved(true);
        toast({ title: "Offre sauvegardée !", description: "Retrouvez-la dans votre tableau de bord." });
      }
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Erreur", description: "Impossible de modifier les favoris.", variant: "destructive" });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Regarde cette offre d'emploi : ${job?.title}`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({ title: "Lien copié !", description: "Le lien a été copié dans votre presse-papiers." });
    } else {
      // Implement social sharing logic if needed
      toast({ title: "Fonctionnalité à venir" });
    }
  };

  const handleApply = () => {
    if (job?.url) {
      window.open(job.url, '_blank');
      toast({
        title: "Redirection en cours",
        description: "Vous allez être redirigé vers le site du recruteur.",
      });
    } else {
      toast({
        title: "Candidature simplifiée",
        description: "Cette fonctionnalité sera bientôt disponible.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="bg-white border-b border-slate-200 py-12">
          <div className="container mx-auto px-4 max-w-5xl space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
               <Skeleton className="h-12 w-3/4" />
               <div className="flex gap-4">
                 <Skeleton className="h-8 w-32" />
                 <Skeleton className="h-8 w-32" />
               </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
           </div>
           <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
           </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <PageHelmet
          title="Offre introuvable - CléAvenir"
          description="La page que vous recherchez n'existe pas ou n'est plus disponible."
          keywords="offre emploi, erreur, introuvable"
        />
        <Card className="max-w-md w-full text-center p-8 shadow-lg border-red-100 bg-white rounded-2xl">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-3">Offre indisponible</h1>
           <p className="text-slate-600 mb-8 leading-relaxed">
             {error || "Cette offre semble provenir d'une source externe ou n'est plus disponible."}
           </p>
           <Button onClick={() => navigate('/offres-emploi')} className="w-full bg-slate-900 hover:bg-slate-800">
             <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux offres
           </Button>
        </Card>
      </div>
    );
  }

  // Adapt job data structure for SEO preset
  const adaptedJobData = {
    title: job.title,
    description: job.description,
    company: job.company,
    city: job.location,
    type: job.contract_type || 'FULL_TIME',
    salary: job.salary_range,
    image: job.company_logo || 'https://cleavenir.com/og-image.jpg',
    id: job.id,
    expiresAt: job.published_at
  };
  const jobSEOProps = jobDetailSEO(adaptedJobData);

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHelmet {...jobSEOProps} />

      {/* 1. Hero Section */}
      <JobDetailHero 
        job={job} 
        isSaved={isSaved} 
        onToggleSave={handleToggleSave} 
        onShare={handleShare}
        saveLoading={saveLoading}
      />

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* 2. Key Info Summary Grid */}
        <JobDetailSummary job={job} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <JobDetailDescription job={job} />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <JobDetailApplication job={job} onApply={handleApply} />
            <JobDetailCompanyInfo job={job} />

            {/* ── Métier associé ──────────────────────────────────────── */}
            <Card className="border-indigo-100 shadow-sm">
              <CardHeader className="pb-3 bg-indigo-50/60 rounded-t-xl border-b border-indigo-100">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-900">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Métier associé
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {loadingMetier ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                ) : relatedMetier ? (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">{relatedMetier.libelle}</p>
                    {relatedMetier.salaire && (
                      <p className="text-xs text-slate-500 mb-1">💶 {relatedMetier.salaire}</p>
                    )}
                    {relatedMetier.debouches && (
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{relatedMetier.debouches}</p>
                    )}
                    <Button
                      size="sm"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                      onClick={() => navigate(`/metier/${relatedMetier.code}`)}
                    >
                      Voir le métier <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-slate-500 mb-3">Explorez les métiers liés à ce poste</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-indigo-200 text-indigo-700"
                      onClick={() => navigate(`/metiers?q=${encodeURIComponent(job.title || '')}`)}
                    >
                      Rechercher le métier <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Formations rapides ──────────────────────────────────── */}
            <Card className="border-pink-100 shadow-sm">
              <CardHeader className="pb-3 bg-pink-50/60 rounded-t-xl border-b border-pink-100">
                <CardTitle className="text-base flex items-center gap-2 text-pink-900">
                  <GraduationCap className="w-4 h-4 text-pink-600" />
                  Se former pour ce poste
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {loadingFormations ? (
                  <>
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </>
                ) : relatedFormations.length > 0 ? (
                  <>
                    {relatedFormations.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/formations?q=${encodeURIComponent(f.title)}`)}
                      >
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1">{f.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Building className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{f.provider}</span>
                        </div>
                        {f.city && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span>{f.city}</span>
                            <Clock className="w-3 h-3 flex-shrink-0 ml-1" />
                            <span>{f.duration}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-pink-200 text-pink-700 hover:bg-pink-50"
                      onClick={() => navigate(`/formations?q=${encodeURIComponent(job.title || '')}`)}
                    >
                      Voir toutes les formations <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-slate-500 mb-3">Trouvez une formation pour ce poste</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-pink-200 text-pink-700"
                      onClick={() => navigate(`/formations?q=${encodeURIComponent(job.title || '')}`)}
                    >
                      Chercher une formation <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <div className="bg-white border-t border-slate-200 py-16 mt-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Offres similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {relatedJobs.map((relatedJob) => (
                    <JobCard 
                      key={relatedJob.id} 
                      job={relatedJob} 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(`/job/${relatedJob.id}`);
                      }}
                      onViewOffer={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(`/job/${relatedJob.id}`);
                      }}
                    />
                 ))}
              </div>
              <div className="text-center mt-10">
                 <Button variant="outline" size="lg" onClick={() => navigate('/offres-emploi')}>
                    Voir toutes les offres similaires
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;