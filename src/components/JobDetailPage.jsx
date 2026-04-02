import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Euro, Building, Clock, 
  Briefcase, CheckCircle2, Share2, Bookmark, AlertCircle,
  GraduationCap, Laptop, FileText, ExternalLink,
  Mail, Phone, Globe, Calendar, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ContractBadge, ExperienceBadge } from '@/components/job-explorer/JobBadges';
import SEOHead from '@/components/SEOHead';
// Removed local Footer and Breadcrumbs imports

const JobDetailPage = ({ onNavigate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Optimistically use state passed from navigation
    if (location.state?.job) {
       setJob(location.state.job);
       setLoading(false);
    } else {
       // Fallback fetch if direct link (simulation)
       // In production, this would fetch from Supabase by ID
       setLoading(true);
       setTimeout(() => {
         setLoading(false);
         // Simulate error/not found for now if no state
         // setJob(null); 
       }, 1000);
    }
  }, [id, location.state]);

  const handleApply = () => {
    if (job?.url) {
      window.open(job.url, '_blank');
    } else {
      toast({ title: "Candidature", description: "Lien de candidature non disponible." });
    }
  };

  if (loading) return (
     <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
           </div>
           <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
     </div>
  );

  if (!job) return (
     <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Offre introuvable</h2>
        <p className="text-slate-500 mb-8">Cette offre n'est plus disponible ou a expiré.</p>
        <Button onClick={() => navigate('/offres-emploi')}>Retour aux offres</Button>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <SEOHead 
        title={`${job.title} - ${job.company}`} 
        description={`Offre d'emploi ${job.title} chez ${job.company}.`} 
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        {/* Breadcrumbs are global in App.jsx, removed from here */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="flex gap-6 items-start">
                  <div className="w-20 h-20 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                     {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1" />
                     ) : (
                        <span className="text-2xl font-bold text-slate-300">{job.company?.charAt(0)}</span>
                     )}
                  </div>
                  <div>
                     <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">{job.title}</h1>
                     <div className="flex items-center gap-2 text-lg text-slate-600 font-medium mb-4">
                        <Building className="w-5 h-5" /> {job.company}
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {job.contract_type && <ContractBadge type={job.contract_type} />}
                        {job.experience_level && <ExperienceBadge level={job.experience_level} />}
                        {job.location && (
                           <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 gap-1.5 px-2.5 py-0.5">
                              <MapPin className="w-3.5 h-3.5" /> {job.location}
                           </Badge>
                        )}
                        {job.salary_range && (
                           <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 gap-1.5 px-2.5 py-0.5">
                              <Euro className="w-3.5 h-3.5" /> {job.salary_range}
                           </Badge>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" /> Description du poste
               </h2>
               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.description}
               </div>

               {job.skills && job.skills.length > 0 && (
                  <>
                     <div className="h-px bg-slate-100 my-8" />
                     <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-indigo-500" /> Compétences requises
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                           <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 px-3 py-1">
                              {skill}
                           </Badge>
                        ))}
                     </div>
                  </>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="border-t-4 border-t-rose-500 shadow-md sticky top-24">
                <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                   <CardTitle className="text-lg">Candidature</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <Button size="lg" className="w-full bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-200" onClick={handleApply}>
                      Postuler maintenant <ExternalLink className="ml-2 w-4 h-4" />
                   </Button>
                   <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full" onClick={() => setIsSaved(!isSaved)}>
                         <Bookmark className={cn("mr-2 h-4 w-4", isSaved ? "fill-current text-rose-500" : "")} /> 
                         {isSaved ? "Sauvé" : "Sauver"}
                      </Button>
                      <Button variant="outline" className="w-full">
                         <Share2 className="mr-2 h-4 w-4" /> Partager
                      </Button>
                   </div>
                   
                   <div className="pt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                         <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Publié le</span>
                         <span className="font-medium text-slate-900">{new Date(job.published_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                         <span className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Candidats</span>
                         <span className="font-medium text-slate-900">{job.applicant_count || 0}</span>
                      </div>
                   </div>
                </CardContent>
             </Card>

             {/* Company Contact Info (Mock) */}
             <Card className="shadow-sm">
                <CardHeader className="pb-3">
                   <CardTitle className="text-base">Contact Entreprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a href="#" className="hover:text-rose-600 hover:underline">Site web de l'entreprise</a>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>rh@{job.company?.toLowerCase().replace(/\s/g, '')}.com</span>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
      {/* Footer Removed - Handled in App.jsx */}
    </div>
  );
};

export default JobDetailPage;