import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, Share2, Heart, 
  BookOpen, Tag, Globe, LayoutGrid, Compass, Layers,
  CheckCircle2, Users, Factory, TrendingUp, Euro, Scale, Clock,
  ArrowRight, AlertCircle, ChevronUp, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import JobCard from '@/components/job-explorer/JobCard';
import FormationCard from '@/components/formation-finder/FormationCard';
import SEOHead from '@/components/SEOHead';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import MatchingContextPanel from '@/components/metiers/MatchingContextPanel';
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

const SectionHeader = ({ icon: Icon, title, colorClass = "text-primary" }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className={cn("p-2 rounded-lg bg-slate-50", colorClass.replace('text-', 'bg-').replace('500', '100').replace('600', '100'))}>
      <Icon className={cn("w-5 h-5", colorClass)} />
    </div>
    <h3 className="font-bold text-lg text-slate-900">{title}</h3>
  </div>
);

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

  const matchContext = location.state?.matchContext || null;

  const loadData = async () => {
    if (!code) return;
    try {
      const data = await fetchMetierWithErrorHandling(code);
      if (data) {
        checkIfSaved(data);
        if (data.code) {
          fetchJobs(data.code);
          fetchFormations(data.code);
        }
      }
    } catch (err) {
      // Handled by hook
    }
  };

  const fetchJobs = async (romeCode) => {
    setLoadingJobs(true);
    try {
      const { data } = await supabase.functions.invoke('get-rome-job-offers', { body: { code: romeCode, limit: 3 } });
      if (data?.data) {
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
      }
    } catch (err) { console.warn("Job fetch error", err); } 
    finally { setLoadingJobs(false); }
  };

  const fetchFormations = async (romeCode) => {
    setLoadingFormations(true);
    try {
      const { data } = await supabase.functions.invoke('get-rome-training-courses', { body: { code: romeCode } });
      if (data?.data) {
        setFormations(data.data.slice(0, 4).map(f => ({
            id: f.id || Math.random().toString(),
            intitule: f.title,
            organisme: { nom: f.company?.name },
            adresse: { libelleCommune: f.place?.city },
            url: f.url
        })));
      }
    } catch (err) { console.warn("Formation fetch error", err); } 
    finally { setLoadingFormations(false); }
  };

  useEffect(() => {
    if (code) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const checkIfSaved = async (currentMetier) => {
      if (!user || !currentMetier) return;
      const { data } = await supabase.from('saved_metiers').select('id').eq('user_id', user.id).eq('metier_code', currentMetier.code).maybeSingle();
      if (data) setIsSaved(true);
  };

  const toggleSave = async () => {
      if (!user) { navigate('/auth'); return; }
      setSaving(true);
      try {
        if (isSaved) {
            await supabase.from('saved_metiers').delete().eq('user_id', user.id).eq('metier_code', metier.code);
            setIsSaved(false);
            toast({ title: "Retiré des favoris" });
        } else {
            await supabase.from('saved_metiers').insert({
                user_id: user.id,
                metier_code: metier.code,
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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-500">
      <SEOHead 
        title={`${metier.libelle} - Fiche Métier`}
        description={`Découvrez le métier de ${metier.libelle} : missions, compétences requises et opportunités d'emploi.`}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Match Context Panel - rendered if passed from results */}
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
           <div className="absolute top-8 right-8 p-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
              <Briefcase className="w-64 h-64 text-indigo-600 rotate-12" />
           </div>
           
           <div className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                 <Badge variant="outline" className="text-slate-500 border-slate-300 font-mono bg-white shadow-sm px-3 py-1">
                    ROME {metier.code}
                 </Badge>
                 {(metier.domaine || (metier.themes && metier.themes[0]?.libelle)) && (
                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 border px-3 py-1">
                      {metier.domaine || metier.themes[0].libelle}
                    </Badge>
                 )}
                 {metier.grandDomaine && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 border px-3 py-1">
                      {metier.grandDomaine}
                    </Badge>
                 )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight max-w-4xl tracking-tight">
                 {metier.libelle}
              </h1>

              <div className="grid lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> En quoi consiste ce métier ?
                        </h2>
                        <div className="text-lg text-slate-700 leading-relaxed bg-slate-50/80 p-5 md:p-6 rounded-2xl border border-slate-100 backdrop-blur-sm shadow-sm">
                           <FormattedText text={metier.description || metier.definition || "Description non disponible."} />
                        </div>
                    </div>
                    
                    {/* Key Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group/stat">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Niveau</div>
                            <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{metier.niveau_etudes || metier.difficulty || "Variable"}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group/stat">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Demande</div>
                            <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{metier.debouches || metier.perspectives || "Stable"}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group/stat">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5"><Euro className="w-3.5 h-3.5" /> Salaire</div>
                            <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{metier.salaire || metier.salary_range || "Non précisé"}</div>
                        </div>
                         <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group/stat">
                            <div className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5"><LayoutGrid className="w-3.5 h-3.5" /> Secteur</div>
                            <div className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors" title={metier.domaine}>{metier.domaine?.split(' ')[0] || "Divers"}</div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-4 justify-center lg:border-l lg:pl-10 lg:border-slate-100">
                    <Button 
                        size="lg" 
                        className="w-full shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white border-none h-14 text-base rounded-xl transition-all hover:scale-[1.02]" 
                        onClick={() => document.getElementById('offres').scrollIntoView({ behavior: 'smooth' })}
                    >
                       <Briefcase className="mr-2 h-5 w-5" /> Voir les offres d'emploi
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg"
                        className={cn("w-full bg-white h-14 rounded-xl border-slate-200 transition-all", isSaved && "border-pink-200 bg-pink-50 text-pink-700")} 
                        onClick={toggleSave} 
                        disabled={saving}
                    >
                       <Heart className={cn("mr-2 h-5 w-5 transition-colors", isSaved ? "fill-pink-500 text-pink-500" : "text-slate-400")} />
                       {isSaved ? "Sauvegardé dans vos favoris" : "Sauvegarder ce métier"}
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full h-14 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "Lien copié dans le presse-papier" });
                    }}>
                       <Share2 className="mr-2 h-5 w-5" /> Partager cette fiche
                    </Button>
                 </div>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Main Content: Tabs */}
           <div className="lg:col-span-8 space-y-8">
              <Tabs defaultValue="competences" className="w-full">
                 <div className="sticky top-20 z-20 bg-slate-50/95 backdrop-blur py-3 -mx-2 px-2 md:static md:bg-transparent md:p-0 mb-6">
                    <TabsList className="w-full justify-start h-auto bg-white border border-slate-200/60 p-1.5 rounded-2xl shadow-sm overflow-x-auto flex-nowrap scrollbar-hide">
                        <TabsTrigger value="competences" className="px-5 py-2.5 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap text-sm font-medium transition-all">Compétences</TabsTrigger>
                        <TabsTrigger value="conditions" className="px-5 py-2.5 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap text-sm font-medium transition-all">Conditions & Environnement</TabsTrigger>
                        <TabsTrigger value="details" className="px-5 py-2.5 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap text-sm font-medium transition-all">Détails ROME</TabsTrigger>
                    </TabsList>
                 </div>

                 {/* TAB: COMPETENCES */}
                 <TabsContent value="competences" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
                    <div className="space-y-8">
                        {/* Savoir-faire */}
                        <Card className="border-0 shadow-md shadow-indigo-100/50 ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
                           <CardHeader className="bg-indigo-50/50 pb-5 border-b border-indigo-100/50">
                              <CardTitle className="flex items-center gap-3 text-xl text-indigo-900">
                                 <div className="p-2 bg-indigo-100 rounded-lg"><CheckCircle2 className="w-5 h-5 text-indigo-600" /></div>
                                 Savoir-faire requis
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="pt-6">
                              <ExpandableList 
                                 items={metier.competencesMobilisees || metier.competences?.savoirFaire || metier.competencesMobiliseesPrincipales}
                                 limit={8}
                                 emptyMessage="Détail des compétences non spécifié pour ce métier."
                                 renderItem={(skill, idx) => {
                                    const label = typeof skill === 'string' ? skill : skill.libelle;
                                    const desc = typeof skill === 'string' ? null : skill.description;
                                    return (
                                      <div key={idx} className="group flex flex-col items-start gap-1 p-4 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all w-full mb-3">
                                         <div className="flex items-center gap-3 w-full">
                                             <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-sm shadow-indigo-200" />
                                             <span className="text-slate-800 font-semibold text-[15px]">
                                                 <FormattedText text={label} />
                                             </span>
                                         </div>
                                         {desc && (
                                             <div className="ml-5 mt-2 pl-4 border-l-2 border-slate-100 text-sm text-slate-500 group-hover:border-indigo-200 transition-colors w-full">
                                                 <FormattedText text={desc} />
                                             </div>
                                         )}
                                      </div>
                                    )
                                 }}
                              />
                           </CardContent>
                        </Card>

                        {/* Savoir-être / Emerging */}
                        {(metier.competencesMobiliseesEmergentes || metier.competences?.savoirEtre) && (
                          <Card className="border-0 shadow-md shadow-pink-100/50 ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
                             <CardHeader className="bg-pink-50/50 pb-5 border-b border-pink-100/50">
                                <CardTitle className="flex items-center gap-3 text-xl text-pink-900">
                                   <div className="p-2 bg-pink-100 rounded-lg"><Users className="w-5 h-5 text-pink-600" /></div>
                                   Savoir-être & Compétences transverses
                                </CardTitle>
                             </CardHeader>
                             <CardContent className="pt-6">
                                <ExpandableList 
                                   items={metier.competencesMobiliseesEmergentes || metier.competences?.savoirEtre}
                                   limit={6}
                                   renderItem={(skill, idx) => {
                                      const label = typeof skill === 'string' ? skill : skill.libelle;
                                      return (
                                        <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all mb-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                                            <span className="text-slate-700 font-medium text-sm">
                                                <FormattedText text={label} />
                                            </span>
                                        </div>
                                      )
                                   }}
                                />
                             </CardContent>
                          </Card>
                        )}
                    </div>
                 </TabsContent>

                 {/* TAB: CONDITIONS & ENVIRONNEMENT */}
                 <TabsContent value="conditions" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
                    <Card className="border-0 shadow-md ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
                       <CardHeader className="bg-amber-50/50 pb-5 border-b border-amber-100/50">
                          <CardTitle className="flex items-center gap-3 text-xl text-amber-900">
                             <div className="p-2 bg-amber-100 rounded-lg"><Factory className="w-5 h-5 text-amber-600" /></div>
                             Environnement de travail
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="pt-6">
                          <div className="space-y-5">
                             <p className="text-slate-600 leading-relaxed">
                                Les conditions d'exercice de ce métier peuvent varier selon la structure, mais impliquent généralement les éléments suivants :
                             </p>
                             <div className="flex flex-wrap gap-2.5">
                                <ExpandableList 
                                   items={metier.contextesTravail}
                                   limit={15}
                                   renderItem={(ctx, idx) => {
                                      const label = typeof ctx === 'string' ? ctx : ctx.libelle;
                                      return (
                                        <div key={idx} className="inline-block">
                                            <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50 py-2 px-4 text-sm rounded-lg shadow-sm transition-colors">
                                               <span><FormattedText text={label} /></span>
                                            </Badge>
                                        </div>
                                      )
                                   }}
                                   emptyMessage="Aucune information spécifique sur les conditions de travail."
                                />
                             </div>
                          </div>
                       </CardContent>
                    </Card>

                    {metier.conditions_resume && (
                       <Alert className="bg-blue-50/50 border-blue-100 text-blue-900 rounded-2xl">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <AlertTitle className="font-semibold text-base mb-2">À retenir</AlertTitle>
                          <AlertDescription className="text-blue-800/80 leading-relaxed">
                             <FormattedText text={metier.conditions_resume} />
                          </AlertDescription>
                       </Alert>
                    )}
                 </TabsContent>

                 {/* TAB: DETAILS ROME */}
                 <TabsContent value="details" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-2xl">
                           <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                 <Tag className="w-5 h-5 text-indigo-500" /> Appellations courantes
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ExpandableList 
                                 items={metier.appellations} 
                                 limit={8}
                                 renderItem={(app, idx) => {
                                    const label = typeof app === 'string' ? app : app.libelle;
                                    return (
                                      <div key={idx} className="inline-block mb-2 mr-2">
                                        <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 font-normal py-1.5 px-3 rounded-lg">
                                           {label}
                                        </Badge>
                                      </div>
                                    )
                                 }}
                              />
                           </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-2xl">
                           <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                 <Layers className="w-5 h-5 text-purple-500" /> Domaines d'activité
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ExpandableList 
                                 items={metier.themes || metier.divisionsNaf || metier.secteursActivite}
                                 limit={5}
                                 renderItem={(item, idx) => {
                                    const label = typeof item === 'string' ? item : item.libelle;
                                    return (
                                      <div key={idx} className="flex items-start gap-2 mb-3">
                                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                          <span className="text-sm text-slate-700 leading-snug">
                                              <FormattedText text={label} />
                                          </span>
                                      </div>
                                    )
                                 }}
                              />
                           </CardContent>
                        </Card>
                    </div>

                    <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ArrowRight className="w-5 h-5 text-pink-500" /> Évolutions possibles (Métiers proches)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <ExpandableList 
                                    items={metier.metiersProches || metier.metiersEnProximite}
                                    limit={6}
                                    emptyMessage="Aucun métier proche identifié."
                                    renderItem={(m, i) => {
                                      const label = typeof m === 'string' ? m : m.libelle;
                                      const mCode = typeof m === 'string' ? null : m.code;
                                      return (
                                        <div 
                                           key={i} 
                                           onClick={() => mCode && navigate(`/metier/${mCode}`)}
                                           className={cn("group w-full p-4 bg-white border border-slate-200 rounded-xl transition-all flex items-center justify-between", mCode ? "hover:border-pink-300 hover:shadow-md cursor-pointer" : "")}
                                        >
                                           <div className="pr-4">
                                              <div className={cn("font-medium text-sm text-slate-700", mCode && "group-hover:text-pink-600 transition-colors")}>{label}</div>
                                              {mCode && <div className="text-[10px] text-slate-400 font-mono mt-1">ROME: {mCode}</div>}
                                           </div>
                                           {mCode && <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-pink-500 group-hover:translate-x-1 transition-all shrink-0" />}
                                        </div>
                                      )
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                 </TabsContent>
              </Tabs>
           </div>

           {/* Sidebar: External Opportunities */}
           <aside className="lg:col-span-4 space-y-8">
              <div id="offres" className="scroll-mt-32">
                  <div className="flex items-center justify-between mb-4">
                      <SectionHeader icon={Briefcase} title="Offres d'emploi" colorClass="text-indigo-600" />
                  </div>
                  
                  {loadingJobs ? (
                     <div className="flex justify-center p-4">
                        <MetierLoadingSpinner />
                     </div>
                  ) : jobs.length > 0 ? (
                     <div className="space-y-4">
                        {jobs.map(job => (
                           <JobCard 
                              key={job.id} 
                              job={job} 
                              onClick={() => navigate(`/job/${job.id}`, { state: { job: job, from: 'metier' } })} 
                              onViewOffer={() => navigate(`/job/${job.id}`, { state: { job: job, from: 'metier' } })}
                           />
                        ))}
                        <Button variant="outline" className="w-full mt-2 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-600" onClick={() => navigate('/offres-emploi', { state: { keyword: metier.libelle } })}>
                           Voir toutes les offres disponibles
                        </Button>
                     </div>
                  ) : (
                     <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Briefcase className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm mb-5">Aucune offre disponible pour le moment via notre flux direct.</p>
                        <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl" onClick={() => window.open(`https://candidat.francetravail.fr/offres/recherche?motsCles=${metier.code}`, '_blank')}>
                           Chercher sur France Travail
                        </Button>
                     </div>
                  )}
              </div>

              <div>
                  <SectionHeader icon={GraduationCap} title="Formations conseillées" colorClass="text-pink-600" />
                  
                  {loadingFormations ? (
                     <div className="flex justify-center p-4">
                        <MetierLoadingSpinner />
                     </div>
                  ) : formations.length > 0 ? (
                     <div className="space-y-4">
                        {formations.map((f, idx) => (
                           <FormationCard key={idx} formation={f} />
                        ))}
                        <Button variant="outline" className="w-full mt-2 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-600" onClick={() => navigate('/formations', { state: { keyword: metier.libelle } })}>
                           Trouver d'autres formations
                        </Button>
                     </div>
                  ) : (
                     <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <GraduationCap className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm mb-5">Découvrez les parcours de formation menant à ce métier.</p>
                        <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50" onClick={() => navigate('/formations', { state: { keyword: metier.libelle } })}>
                           Rechercher une formation
                        </Button>
                     </div>
                  )}
              </div>
           </aside>

        </div>
      </main>
    </div>
  );
};

export default MetierDetailPage;