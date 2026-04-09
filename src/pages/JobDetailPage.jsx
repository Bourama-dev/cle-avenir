import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getJobDetails, searchJobs } from '@/services/franceTravail';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import PageHelmet from '@/components/SEO/PageHelmet';
import { jobDetailSEO } from '@/components/SEO/seoPresets';
import JobCard from '@/components/job-explorer/JobCard';
import { AlertCircle, ArrowLeft } from 'lucide-react';
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
        
        // Fetch Related Jobs
        if (jobData.title) {
          const related = await searchJobs({ 
            query: jobData.title.split(' ').slice(0, 2).join(' '),
            limit: 3 
          });
          if (related.success) {
            setRelatedJobs(related.results.filter(j => j.id !== id));
          }
        }

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