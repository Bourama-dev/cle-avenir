import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, MapPin, Building2, TrendingUp, DollarSign, BrainCircuit, Users, 
  BookOpen, GraduationCap, Briefcase, Award, Target, Star, Share2, Printer
} from 'lucide-react';
import { romeService } from '@/services/romeService';
import FeatureGate from '@/components/FeatureGate';
import { FEATURES, TIERS } from '@/constants/subscriptionTiers';
import { motion } from 'framer-motion';

const CareerDetailPage = () => {
  const { slug } = useParams(); // Using slug (or code) from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [career, setCareer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true);
      setError(null);
      try {
        // We assume the slug might be the code or we have a way to resolve it.
        // For now, let's treat the slug as the code for romeService call 
        // OR add logic in romeService to handle slugs if implemented.
        const data = await romeService.getCareerDetails(slug);
        
        if (!data) throw new Error("Métier non trouvé");
        setCareer(data);
      } catch (err) {
        console.error('Error fetching career:', err);
        setError("Impossible de charger les détails du métier.");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchCareer();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="h-64 bg-slate-200 animate-pulse" />
        <main className="container mx-auto px-4 py-8 -mt-20 flex-1">
          <div className="bg-white rounded-2xl p-8 shadow-lg h-96 animate-pulse" />
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 space-y-6">
               <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
               <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
         <h2 className="text-2xl font-bold text-slate-800">Oups !</h2>
         <p className="text-slate-600">{error || "Métier introuvable."}</p>
         <Button onClick={() => navigate(-1)} variant="outline">Retour</Button>
      </div>
    );
  }

  // Helper for demand level color
  const getDemandColor = (level) => {
     switch(level?.toLowerCase()) {
        case 'high': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'low': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-blue-600 bg-blue-50 border-blue-200';
     }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white pb-32 pt-24 relative overflow-hidden">
         {/* Decorative blobs */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

         <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <Button 
               variant="ghost" 
               className="text-blue-200 hover:text-white hover:bg-white/10 mb-6 pl-0 transition-all" 
               onClick={() => navigate(-1)}
            >
               <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux résultats
            </Button>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
               <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                     <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-md px-3 py-1">
                           Code ROME: {career.code}
                        </Badge>
                        {career.domaine && (
                           <Badge variant="outline" className="text-indigo-200 border-indigo-400/30">
                              {career.domaine}
                           </Badge>
                        )}
                     </div>
                     <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                        {career.libelle}
                     </h1>
                     <div className="flex flex-wrap gap-4 text-sm text-blue-100/80">
                        {career.salary_range && (
                           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                              <span>{career.salary_range}</span>
                           </div>
                        )}
                        {career.perspectives && (
                           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                              <TrendingUp className="w-4 h-4 text-blue-400" />
                              <span>Demande: {career.perspectives}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <Button size="icon" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                        <Share2 className="w-5 h-5" />
                     </Button>
                     <Button size="icon" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                        <Printer className="w-5 h-5" />
                     </Button>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl -mt-20 relative z-20 pb-16 flex-1">
         <div className="grid md:grid-cols-3 gap-8">
            
            {/* LEFT MAIN CONTENT */}
            <div className="md:col-span-2 space-y-8">
               
               {/* Description Card */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }}
               >
                  <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                     <CardHeader className="bg-white border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                           <BookOpen className="h-5 w-5 text-blue-600" /> Description du métier
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6">
                        <p className="text-lg text-slate-600 leading-relaxed">
                           {career.definition}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                           {career.contextesTravail?.slice(0, 4).map((ctx, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                 <Building2 className="w-4 h-4 text-slate-400 mt-1" />
                                 <span className="text-sm text-slate-700">{ctx.libelle}</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Competencies */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
               >
                  <Card className="border-none shadow-xl shadow-slate-200/50">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                           <Target className="h-5 w-5 text-indigo-600" /> Compétences requises
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="mb-6">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Savoir-faire</h4>
                           <div className="flex flex-wrap gap-2">
                              {career.competences?.savoirFaire?.slice(0, 10).map((skill, idx) => (
                                 <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 py-1.5 px-3">
                                    {skill.libelle}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                        
                        <div>
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Savoir-être</h4>
                           <div className="flex flex-wrap gap-2">
                              {career.competences?.savoirEtre?.map((skill, idx) => (
                                 <Badge key={idx} variant="outline" className="border-slate-200 text-slate-600 py-1 px-3">
                                    {skill.libelle}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Premium Market Data */}
               <FeatureGate 
                  feature={FEATURES.MARKET_TRENDS} 
                  requiredTier={TIERS.PREMIUM} 
                  title="Données Salariales & Marché" 
                  description="Accédez aux grilles de salaires détaillées et aux tendances de recrutement en temps réel."
               >
                  <Card className="border-emerald-100 bg-emerald-50/20 shadow-lg">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-800">
                           <TrendingUp className="h-5 w-5 text-emerald-600" /> Analyse du Marché
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                              <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                                 <DollarSign className="w-4 h-4" /> Salaire Moyen
                              </p>
                              <div className="flex items-end gap-2">
                                 <span className="text-3xl font-bold text-slate-900">32k€</span>
                                 <span className="text-sm text-slate-500 mb-1">/an</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                                 <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                              </div>
                              <div className="flex justify-between text-xs text-slate-400 mt-1">
                                 <span>Junior: 24k€</span>
                                 <span>Senior: 45k€+</span>
                              </div>
                           </div>

                           <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                              <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                                 <Briefcase className="w-4 h-4" /> Offres actives
                              </p>
                              <div className="flex items-end gap-2">
                                 <span className="text-3xl font-bold text-slate-900">1,240</span>
                                 <span className="text-sm text-emerald-600 font-bold mb-1 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                                 </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                 Forte demande en Île-de-France et Auvergne-Rhône-Alpes ce mois-ci.
                              </p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </FeatureGate>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
               
               {/* Accessibility Info */}
               <Card className="shadow-lg border-none bg-white">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" /> Accès & Formation
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="mb-4">
                        <span className="text-sm font-bold text-slate-700 block mb-1">Niveau requis</span>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                           Bac + 2 à Bac + 5
                        </Badge>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed">
                        L'accès à ce métier se fait généralement par des formations supérieures spécialisées (BUT, Licence Pro, Master).
                     </p>
                  </CardContent>
               </Card>

               {/* Similar Careers */}
               <Card className="shadow-lg border-none bg-white">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" /> Métiers proches
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {career.metiersProches?.slice(0, 5).map((metier, idx) => (
                        <div 
                           key={idx} 
                           className="group flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                           onClick={() => navigate(`/metiers/${metier.code}`)} // Assuming code works for navigation
                        >
                           <span className="text-sm text-slate-700 font-medium group-hover:text-purple-700 transition-colors">
                              {metier.libelle}
                           </span>
                           <ArrowLeft className="w-3 h-3 text-slate-300 rotate-180 group-hover:text-purple-500 transition-all group-hover:translate-x-1" />
                        </div>
                     ))}
                     {(!career.metiersProches || career.metiersProches.length === 0) && (
                        <p className="text-sm text-slate-400 italic">Aucun métier proche identifié.</p>
                     )}
                  </CardContent>
               </Card>

               {/* AI Coach CTA */}
               <FeatureGate 
                  feature={FEATURES.AI_COACHING} 
                  requiredTier={TIERS.PREMIUM_PLUS} 
                  title="Votre Coach IA" 
                  description="Préparez vos entretiens pour ce poste avec Cléo."
                  blur={false}
               >
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-xl">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                           <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">Coach Carrière</h3>
                     </div>
                     <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                        "Je peux vous entraîner pour un entretien de <strong>{career.libelle}</strong> ou vous aider à adapter votre CV."
                     </p>
                     <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold border-none">
                        Parler à Cléo
                     </Button>
                  </div>
               </FeatureGate>

            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerDetailPage;