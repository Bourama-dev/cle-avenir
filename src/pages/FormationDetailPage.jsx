import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { formationService } from '@/services/formationService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import SEOHead from '@/components/SEOHead';
import { 
  ArrowLeft, School, MapPin, Loader2, Share2, Bookmark, 
  Euro, Briefcase, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy loaded components (Tasks 1-5)
const FormationProgramme = lazy(() => import('@/components/formation/FormationProgramme'));
const FormationDebouches = lazy(() => import('@/components/formation/FormationDebouches'));
const FormationOffres = lazy(() => import('@/components/formation/FormationOffres'));
const FormationStatistiques = lazy(() => import('@/components/formation/FormationStatistiques'));
const FormationCertification = lazy(() => import('@/components/formation/FormationCertification'));

const SectionSkeleton = () => (
  <div className="space-y-4 py-8">
    <Skeleton className="h-8 w-1/3 mb-6" />
    <Skeleton className="h-40 w-full rounded-2xl" />
  </div>
);

const FormationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, subscriptionTier, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formation, setFormation] = useState(null);
  const [careers, setCareers] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isPremium = subscriptionTier === 'premium' || subscriptionTier === 'premium_plus';

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch main formation details
      const formationData = await formationService.getFormationWithDetails(id);
      if (!formationData) throw new Error("Formation introuvable");
      setFormation(formationData);

      // Check if saved
      if (user) {
        const { data: savedData } = await supabase
          .from('saved_formations')
          .select('id')
          .eq('user_id', user.id)
          .eq('formation_id', String(id))
          .maybeSingle();
        setIsSaved(!!savedData);
      }

      // 2. Fetch Linked Careers
      const linkedCareers = await formationService.getLinkedCareers(formationData);
      setCareers(linkedCareers);

      // 3. Fetch Job Offers & Stats concurrently if careers exist
      if (linkedCareers.length > 0) {
        const careerCodes = linkedCareers.map(c => c.code).filter(Boolean);
        const [offersData, statsData] = await Promise.all([
          formationService.getCareerJobOffers(careerCodes),
          formationService.getCareerStatistics(linkedCareers)
        ]);
        setJobOffers(offersData);
        setStats(statsData);
      }

    } catch (err) {
      console.error("Error fetching formation details:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth', { 
        state: { 
          from: location.pathname,
          message: "Connectez-vous pour voir les détails de cette formation." 
        } 
      });
      return;
    }
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, authLoading, navigate, location.pathname]);

  const handleSaveFormation = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await supabase.from('saved_formations').delete().eq('user_id', user.id).eq('formation_id', String(id));
        setIsSaved(false);
        toast({ title: "Retiré", description: "Formation retirée de vos favoris." });
      } else {
        await supabase.from('saved_formations').insert({
          user_id: user.id,
          formation_id: String(id),
          formation_details: formation
        });
        setIsSaved(true);
        toast({ title: "Sauvegardé", description: "Formation ajoutée à vos favoris !" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de modifier les favoris." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Lien copié", description: "Le lien vers la formation a été copié." });
  };

  // Render Loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-slate-100">
          <div className="mx-auto bg-red-50 p-4 rounded-full w-fit mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Impossible de charger la formation</h2>
          <p className="text-slate-600 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={fetchAllData} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base">
              <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
            </Button>
            <Button variant="outline" onClick={() => navigate('/formations')} className="w-full h-12 text-base">
              Retour au catalogue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SEOHead 
        title={`${formation.title || formation.nom} - CléAvenir`} 
        description={`Découvrez la formation ${formation.title || formation.nom} proposée par ${formation.provider_name || formation.provider}.`}
      />
      
      {/* Hero Section */}
      <div className="relative bg-white border-b border-slate-200 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 pointer-events-none" />
         <div className="container relative mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-5 flex-1">
                 <Button 
                    variant="ghost" 
                    onClick={() => navigate('/formations')} 
                    className="pl-0 text-slate-500 hover:text-indigo-600 hover:bg-transparent -ml-2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4"/> Retour aux formations
                 </Button>
                 
                 <div className="flex flex-wrap gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none font-medium px-3 py-1">
                      {formation.level || formation.required_education_level || 'Formation qualifiante'}
                    </Badge>
                    {formation.modality && (
                      <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 px-3 py-1">
                        {formation.modality}
                      </Badge>
                    )}
                 </div>

                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                   {formation.title || formation.nom}
                 </h1>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                       {formation.provider_logo_url ? (
                         <img src={formation.provider_logo_url} alt="Logo" className="w-8 h-8 rounded-full object-contain bg-white border" />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                           <School className="w-4 h-4" />
                         </div>
                       )}
                       <span className="text-lg text-slate-900">{formation.provider_name || formation.provider || formation.organisme?.nom}</span>
                    </div>
                    {(formation.location_city || formation.location) && (
                      <>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{formation.location_city || formation.location}</span>
                        </div>
                      </>
                    )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-row md:flex-col gap-3 min-w-[200px] mt-4 md:mt-0">
                 <Button 
                   onClick={handleSaveFormation} 
                   variant="outline" 
                   className={cn("flex-1 md:w-full h-11 justify-center md:justify-start rounded-xl border-slate-200 hover:bg-slate-50 transition-all", isSaved && "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100")}
                 >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bookmark className={cn("mr-2 h-4 w-4", isSaved && "fill-indigo-700")} />}
                    {isSaved ? "Sauvegardé" : "Sauvegarder"}
                 </Button>
                 <Button onClick={handleShare} variant="ghost" className="flex-1 md:w-full h-11 justify-center md:justify-start rounded-xl text-slate-600 hover:bg-slate-100">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                 </Button>
              </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Main Content Sections */}
         <div className="lg:col-span-8 space-y-12">
            
            {/* Programme & Info */}
            <section id="programme">
               <h2 className="formation-section-title">Le programme de formation</h2>
               <Suspense fallback={<SectionSkeleton />}>
                 <FormationProgramme formation={formation} />
               </Suspense>
            </section>

            <hr className="border-slate-200" />

            {/* Certification */}
            <section id="certification">
               <h2 className="formation-section-title">Certification & Reconnaissance</h2>
               <Suspense fallback={<SectionSkeleton />}>
                 <FormationCertification formation={formation} />
               </Suspense>
            </section>

            <hr className="border-slate-200" />

            {/* Débouchés */}
            <section id="debouches">
               <h2 className="formation-section-title">Métiers ciblés & Débouchés</h2>
               <p className="text-slate-600 mb-6 text-lg">Cette formation vous prépare directement aux métiers suivants :</p>
               <Suspense fallback={<SectionSkeleton />}>
                 <FormationDebouches careers={careers} />
               </Suspense>
            </section>

            {/* Statistiques (Premium Feature Mock) */}
            <section id="statistiques" className="relative">
               <h2 className="formation-section-title">Statistiques d'insertion</h2>
               {!isPremium ? (
                 <div className="relative">
                   <div className="blur-sm pointer-events-none opacity-50">
                     <SectionSkeleton />
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center z-10">
                     <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl text-center max-w-md border border-indigo-100">
                        <div className="mx-auto bg-indigo-50 p-3 rounded-full w-fit mb-4">
                          <Briefcase className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Données Premium</h3>
                        <p className="text-slate-600 mb-6">Passez à un compte Premium pour visualiser les statistiques de salaire et d'insertion détaillées.</p>
                        <Button onClick={() => navigate('/tarifs')} className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                          Découvrir Premium
                        </Button>
                     </div>
                   </div>
                 </div>
               ) : (
                 <Suspense fallback={<SectionSkeleton />}>
                   <FormationStatistiques stats={stats} careers={careers} />
                 </Suspense>
               )}
            </section>

            <hr className="border-slate-200" />

            {/* Offres d'emploi */}
            <section id="offres">
               <h2 className="formation-section-title">Offres d'emploi actuelles</h2>
               <p className="text-slate-600 mb-6 text-lg">Opportunités professionnelles correspondant à cette formation, en direct sur le marché :</p>
               <Suspense fallback={<SectionSkeleton />}>
                 <FormationOffres offers={jobOffers} />
               </Suspense>
            </section>

         </div>

         {/* Sidebar */}
         <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <Card className="border-t-4 border-t-indigo-600 shadow-xl overflow-hidden formation-card-shadow rounded-2xl">
                 <CardContent className="p-0">
                    <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
                       <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Coût indicatif</p>
                       <div className="text-4xl font-black text-slate-900 flex items-center justify-center gap-1">
                          {formation.cost ? (
                             <>
                                {formation.cost.toLocaleString('fr-FR')} <Euro className="w-7 h-7 text-slate-400" />
                             </>
                          ) : (
                             <span className="text-2xl text-slate-700">Sur devis</span>
                          )}
                       </div>
                       {formation.financing_options && (
                          <div className="mt-3 text-xs text-emerald-700 font-bold bg-emerald-100 inline-block px-3 py-1.5 rounded-full uppercase tracking-wide">
                             Éligible financements
                          </div>
                       )}
                    </div>
                    
                    <div className="p-8 space-y-6 bg-white">
                       <Button className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all rounded-xl">
                          Demander la brochure
                       </Button>
                       <Button variant="outline" className="w-full h-14 text-base font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl">
                          Contacter l'organisme
                       </Button>
                    </div>
                 </CardContent>
              </Card>

              {/* Organisme mini card */}
              <a 
                href={formation.provider_url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="block bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                 <div className="flex items-center gap-4">
                    {formation.provider_logo_url ? (
                       <img src={formation.provider_logo_url} alt="Logo" className="w-12 h-12 object-contain" />
                    ) : (
                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <School className="w-6 h-6" />
                       </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                       <div className="text-xs text-slate-400 font-semibold uppercase mb-0.5 tracking-wider">L'organisme</div>
                       <div className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                         {formation.provider_name || formation.provider || 'Non spécifié'}
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                 </div>
              </a>
              
            </div>
         </div>
      </div>
    </div>
  );
};

export default FormationDetailPage;