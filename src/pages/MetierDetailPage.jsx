import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, Share2, Heart, 
  BookOpen, Tag, Globe, LayoutGrid, Compass, Layers,
  CheckCircle2, Users, Factory, TrendingUp, Euro, Scale, Clock,
  ArrowRight, AlertCircle, ChevronUp, ChevronDown, MessageSquare,
  Star, RefreshCw, FileText, ChevronLeft, BarChart, Bug, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { metierService } from '@/services/metierService';
import JobCard from '@/components/job-explorer/JobCard';
import FormationCard from '@/components/formation-finder/FormationCard';
import PageHelmet from '@/components/SEO/PageHelmet';
import { metierDetailSEO } from '@/components/SEO/seoPresets';
import { cn } from '@/lib/utils';
import MatchingContextPanel from '@/components/metiers/MatchingContextPanel';
import { Progress } from "@/components/ui/progress";

// New Components
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import FeedbackStats from '@/components/feedback/FeedbackStats';
import CreatePlanModal from '@/components/plans/CreatePlanModal';
import MetierLoadingSpinner from '@/components/MetierLoadingSpinner';
import MetierErrorState from '@/components/MetierErrorState';
import { useMetierDataFetcher } from '@/utils/metierDataFetcher';

const FormattedText = ({ text, className = "" }) => {
  if (!text) return null;
  const lines = text.toString().replace(/\\n/g, '\n').split('\n');
  
  if (lines.length === 1) return <span className={className}>{lines[0]}</span>;

  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br className="mb-1" />}
        </React.Fragment>
      ))}
    </span>
  );
};

const ExpandableList = ({ items, limit = 5, renderItem, emptyMessage = "Aucune donnée disponible." }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!items || items.length === 0) {
    return <p className="text-slate-500 italic text-sm py-2">{emptyMessage}</p>;
  }

  const displayedItems = showAll ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {displayedItems.map((item, index) => renderItem(item, index))}
      </div>
      {hasMore && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAll(!showAll)}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium flex items-center gap-1 mt-2 text-xs self-start"
        >
          {showAll ? (
            <>Voir moins <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>+{items.length - limit} autres <ChevronDown className="h-3 w-3" /></>
          )}
        </Button>
      )}
    </div>
  );
};

const getRiasecData = (metier) => {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  if (metier.riasec_vector) {
     const vector = typeof metier.riasec_vector === 'string' ? JSON.parse(metier.riasec_vector) : metier.riasec_vector;
     Object.keys(vector).forEach(k => {
        if (scores[k] !== undefined) scores[k] = Math.min(100, Math.round(vector[k] * 100));
     });
  } else if (metier.riasecMajeur) {
     scores[metier.riasecMajeur] = 95;
     if (metier.riasecMineur) {
        metier.riasecMineur.split('').forEach(letter => {
           if (scores[letter] !== undefined) scores[letter] = 65;
        });
     }
  }

  const isAllZero = Object.values(scores).every(v => v === 0);
  if (isAllZero) {
    scores.R = 40; scores.I = 50; scores.A = 20; scores.S = 30; scores.E = 60; scores.C = 70;
  }

  return [
    { letter: 'R', name: 'Réaliste', score: scores.R, color: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', bg: 'bg-red-50' },
    { letter: 'I', name: 'Investigateur', score: scores.I, color: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' },
    { letter: 'A', name: 'Artistique', score: scores.A, color: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', bg: 'bg-yellow-50' },
    { letter: 'S', name: 'Social', score: scores.S, color: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', bg: 'bg-green-50' },
    { letter: 'E', name: 'Entreprenant', score: scores.E, color: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200', bg: 'bg-orange-50' },
    { letter: 'C', name: 'Conventionnel', score: scores.C, color: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-200', bg: 'bg-purple-50' },
  ].sort((a, b) => b.score - a.score);
};

const MetierDetailPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: metier, loading, error, fetchMetierWithErrorHandling } = useMetierDataFetcher();
  
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  const [formations, setFormations] = useState([]);
  const [loadingFormations, setLoadingFormations] = useState(false);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const matchContext = location.state?.matchContext || null;

  const loadData = async () => {
    if (!code || code === ':code') return;
    try {
      const data = await fetchMetierWithErrorHandling(code);
      if (data) {
        checkIfSaved(data);
        const fetchCode = data.code || data.code_rome;
        if (fetchCode) {
           fetchJobs(fetchCode);
           fetchFormations(fetchCode);
        }
      }
    } catch (err) {
      // Error is handled by hook
    }
  };

  const fetchJobs = async (romeCode) => {
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-rome-job-offers', { body: { code: romeCode, limit: 10 } });

      if (error) {
        console.error('Edge Function Error (get-rome-job-offers):', error);
        setJobs([]);
        return;
      }

      if (data?.data && Array.isArray(data.data)) {
         setJobs(data.data.map(job => ({
            id: job.id,
            title: job.intitule,
            company: job.entreprise?.nom || 'Non spécifié',
            location: job.lieuTravail?.libelle,
            contract_type: job.typeContratLibelle,
            url: job.origineOffre?.urlOrigine,
            description: job.description,
            salary_range: job.salaire?.libelle || "Non spécifié",
            posted_at: job.dateCreation,
            requirements: job.competences?.map(c => c.libelle) || [],
            experience: job.experienceLibelle
         })));
      } else {
        console.warn('Unexpected data format from get-rome-job-offers:', data);
        setJobs([]);
      }
    } catch (err) {
      console.error("Job fetch error:", err);
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchFormations = async (romeCode) => {
    setLoadingFormations(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-rome-training-courses', { body: { code: romeCode } });

      if (error) {
        console.error('Edge Function Error (get-rome-training-courses):', error);
        setFormations([]);
        return;
      }

      if (data?.data && Array.isArray(data.data)) {
        setFormations(data.data.slice(0, 10).map(f => ({
            id: f.id || Math.random().toString(),
            intitule: f.title,
            organisme: { nom: f.company?.name },
            adresse: { libelleCommune: f.place?.city },
            url: f.url
        })));
      } else {
        console.warn('Unexpected data format from get-rome-training-courses:', data);
        setFormations([]);
      }
    } catch (err) {
      console.error("Formation fetch error:", err);
      setFormations([]);
    } finally {
      setLoadingFormations(false);
    }
  };

  useEffect(() => {
    if (code) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const checkIfSaved = async (currentMetier) => {
      if (!user || !currentMetier) return;
      const { data } = await supabase.from('saved_metiers').select('id').eq('user_id', user.id).eq('metier_code', currentMetier.code || currentMetier.code_rome).maybeSingle();
      if (data) setIsSaved(true);
  };

  const toggleSave = async () => {
      if (!user) { navigate('/login'); return; }
      setSaving(true);
      try {
        if (isSaved) {
            await supabase.from('saved_metiers').delete().eq('user_id', user.id).eq('metier_code', metier.code || metier.code_rome);
            setIsSaved(false);
            toast({ title: "Retiré des favoris" });
        } else {
            await supabase.from('saved_metiers').insert({
                user_id: user.id,
                metier_code: metier.code || metier.code_rome,
                metier_details: { libelle: metier.libelle }
            });
            setIsSaved(true);
            toast({ title: "Métier sauvegardé !" });
        }
      } catch (err) {
          toast({ variant: "destructive", title: "Erreur lors de la sauvegarde" });
      } finally {
          setSaving(false);
      }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
         <div className="w-full max-w-4xl">
            <MetierLoadingSpinner />
         </div>
      </div>
    );
  }

  if (error || !metier) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
         <div className="w-full max-w-3xl">
            <MetierErrorState error={error} onRetry={loadData} showBack={true} />
         </div>
      </div>
    );
  }

  const riasecData = getRiasecData(metier);

  const adaptedMetierData = {
    name: metier.libelle,
    description: metier.description || metier.definition || "Description non disponible.",
    category: metier.domaine || (metier.themes && metier.themes[0]?.libelle) || 'Métier',
    experience: metier.experience_level || 'Variable',
    salary: metier.salaire || metier.salary_range || 'Non précisé',
    id: metier.code || metier.code_rome,
  };
  const metierSEOProps = metierDetailSEO(adaptedMetierData);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-500">
      <PageHelmet {...metierSEOProps} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900">
            <ChevronLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </div>

        {matchContext && (
          <div className="mb-8">
            <MatchingContextPanel 
              profileType={matchContext.profileType}
              competencies={matchContext.competencies}
              sectors={matchContext.sectors}
              score={matchContext.score}
            />
          </div>
        )}

        {/* Hero Section */}
        <header className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-10 mb-8 shadow-xl shadow-slate-200/30 relative overflow-hidden group">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
           <div className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                 <Badge variant="outline" className="text-slate-500 border-slate-300 font-mono bg-white px-3 py-1">
                    ROME {metier.code || metier.code_rome}
                 </Badge>
                 {(metier.domaine || (metier.themes && metier.themes[0]?.libelle)) && (
                    <Badge className="bg-indigo-50 text-indigo-700 px-3 py-1">
                      {metier.domaine || metier.themes[0].libelle}
                    </Badge>
                 )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 max-w-4xl tracking-tight">
                 {metier.libelle}
              </h1>

              <div className="grid lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 space-y-8">
                    <div className="text-lg text-slate-700 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                       <FormattedText text={metier.description || metier.definition || "Description non disponible."} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Niveau</div>
                            <div className="font-bold text-slate-800">{metier.niveau_etudes || "Variable"}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase flex items-center gap-1"><Euro className="w-3.5 h-3.5" /> Salaire</div>
                            <div className="font-bold text-slate-800 text-sm">{metier.salaire || metier.salary_range || "Non précisé"}</div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-4 justify-center lg:border-l lg:pl-10 lg:border-slate-100">
                    <Button 
                        size="lg" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-xl" 
                        onClick={() => setIsPlanModalOpen(true)}
                    >
                       <Target className="mr-2 h-5 w-5" /> Créer mon plan d'action
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg"
                        className={cn("w-full h-14 rounded-xl border-slate-200", isSaved && "border-pink-200 bg-pink-50 text-pink-700")} 
                        onClick={toggleSave} 
                        disabled={saving}
                    >
                       <Heart className={cn("mr-2 h-5 w-5", isSaved ? "fill-pink-500 text-pink-500" : "text-slate-400")} />
                       {isSaved ? "Sauvegardé" : "Favoris"}
                    </Button>
                 </div>
              </div>
           </div>
        </header>

        {/* TABS Navigation */}
        <Tabs defaultValue="overview" className="w-full">
            <div className="sticky top-20 z-20 bg-slate-50/95 backdrop-blur py-3 mb-6">
              <TabsList className="w-full justify-start h-auto bg-white border border-slate-200/60 p-1.5 rounded-2xl shadow-sm overflow-x-auto flex-nowrap scrollbar-hide">
                  <TabsTrigger value="overview" className="px-5 py-2.5 rounded-xl">Aperçu</TabsTrigger>
                  <TabsTrigger value="feedback" className="px-5 py-2.5 rounded-xl">Avis & Retours</TabsTrigger>
                  <TabsTrigger value="pathway" className="px-5 py-2.5 rounded-xl">Parcours Professionnel</TabsTrigger>
                  <TabsTrigger value="plan" className="px-5 py-2.5 rounded-xl">Mon Plan d'Action</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: Aperçu */}
            <TabsContent value="overview" className="space-y-8 animate-in fade-in">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Savoir-faire */}
                  <Card className="border-slate-200 shadow-sm rounded-2xl">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Compétences requises
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ExpandableList 
                            items={metier.competencesMobilisees || metier.competencesMobiliseesPrincipales}
                            limit={8}
                            renderItem={(skill, idx) => {
                              const label = typeof skill === 'string' ? skill : skill.libelle;
                              return (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-slate-800 text-sm"><FormattedText text={label} /></span>
                                </div>
                              )
                            }}
                        />
                      </CardContent>
                  </Card>

                  {/* Environnement */}
                  <Card className="border-slate-200 shadow-sm rounded-2xl">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2">
                            <Factory className="w-5 h-5 text-amber-600" /> Environnement de travail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-2">
                          {metier.contextesTravail?.slice(0, 10).map((ctx, idx) => (
                            <Badge key={idx} variant="outline" className="text-slate-700 py-1.5 px-3">
                                {typeof ctx === 'string' ? ctx : ctx.libelle}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                  </Card>
                </div>

                {/* Sidebar within Overview */}
                <div className="space-y-6">
                  {/* RIASEC Profile */}
                  <Card className="border-slate-200 shadow-sm rounded-2xl">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart className="w-5 h-5 text-indigo-600" /> Profil RIASEC
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        {riasecData.map((item) => (
                            <div key={item.letter}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-700">{item.name}</span>
                                <span className="text-slate-500">{item.score}%</span>
                              </div>
                              <Progress value={item.score} className="h-2" indicatorClassName={item.color} />
                            </div>
                        ))}
                      </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB: Avis & Retours */}
            <TabsContent value="feedback" className="space-y-8 animate-in fade-in">
               <div className="max-w-4xl mx-auto space-y-8">
                  <FeedbackStats metierCode={code} />
                  <FeedbackWidget metierCode={code} testId={location.state?.testId} />
               </div>
            </TabsContent>

            {/* TAB: Parcours Professionnel - Integrated Jobs & Formations */}
            <TabsContent value="pathway" className="space-y-8 animate-in fade-in">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre parcours vers ce métier</h2>
                  <p className="text-slate-600">Découvrez les formations pour accéder à ce métier et les offres d'emploi disponibles</p>
                </div>

                {/* Step 1: Formations */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/30 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">1</div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-blue-600" /> Formations recommandées
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">Acquérir les compétences nécessaires</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingFormations ? (
                        <div className="flex justify-center p-8"><MetierLoadingSpinner /></div>
                    ) : formations.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {formations.map((f, idx) => (
                            <FormationCard key={idx} formation={f} />
                          ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-200">
                          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-600">Aucune formation trouvée pour ce métier.</p>
                        </div>
                    )}
                  </CardContent>
                </Card>

                {/* Connection Arrow */}
                <div className="flex justify-center py-2">
                  <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-slate-300 to-transparent"></div>
                    <ArrowRight className="w-5 h-5 text-indigo-500" />
                    <div className="hidden md:block w-16 h-0.5 bg-gradient-to-l from-slate-300 to-transparent"></div>
                  </div>
                </div>

                {/* Step 2: Job Offers */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50/30 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg">2</div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-emerald-600" /> Offres d'emploi
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">Trouver des opportunités professionnelles</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingJobs ? (
                        <div className="flex justify-center p-8"><MetierLoadingSpinner /></div>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => navigate('/offres-emploi', { state: { keyword: metier.libelle } })}
                          >
                            Voir toutes les offres d'emploi
                          </Button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-200">
                          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-600">Aucune offre disponible actuellement.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate('/offres-emploi', { state: { keyword: metier.libelle } })}
                          >
                            Explorer les offres
                          </Button>
                        </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Box */}
                <Card className="bg-indigo-50/50 border-indigo-200 rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-indigo-900 font-medium mb-1">Construisez votre parcours</p>
                        <p className="text-sm text-indigo-800">Utilisez les formations comme tremplin vers les offres d'emploi. Créez un plan d'action personnalisé pour structurer votre carrière.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: Plan d'Action */}
            <TabsContent value="plan" className="space-y-8 animate-in fade-in">
               <Card className="border-slate-200 shadow-sm rounded-2xl">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2">
                       <Target className="w-5 h-5 text-indigo-600" /> Structurez votre projet professionnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Créez un plan d'action personnalisé</h4>
                      <p className="text-slate-600 mb-6">
                        Nous vous aiderons à structurer votre démarche vers ce métier en définissant vos objectifs, les étapes clés, et un calendrier réaliste.
                      </p>
                      <Button onClick={() => setIsPlanModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8">
                         Démarrer mon plan
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-semibold text-slate-900 mb-4">Ce que vous allez pouvoir faire :</h4>
                      <ul className="space-y-3">
                        {[
                          "Définir vos objectifs à court, moyen et long terme",
                          "Identifier les formations clés pour ce métier",
                          "Créer une feuille de route avec des jalons",
                          "Suivre votre progression pas à pas"
                        ].map((item, idx) => (
                          <li key={idx} className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>
        </Tabs>

      </main>

      <CreatePlanModal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
        metierCode={code} 
        metierName={metier.libelle} 
      />

    </div>
  );
};

export default MetierDetailPage;