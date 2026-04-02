import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, Euro, GraduationCap, ArrowRight, Building, AlertCircle, School, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchFormations as fetchFormationsFT } from '@/services/franceTravail';
import { fetchFormations as fetchFormationsPS } from '@/services/parcoursup';

// Mapping table for broader search categories (Job Families)
const JOB_FAMILIES = {
  // Tech & Digital
  'developpeur': 'Informatique',
  'développeur': 'Informatique',
  'data': 'Data Science',
  'web': 'Informatique',
  'tech': 'Informatique',
  'logiciel': 'Informatique',
  'réseau': 'Systèmes et Réseaux',
  'cyber': 'Cybersécurité',
  
  // Business & Sales
  'commercial': 'Commerce',
  'vente': 'Commerce',
  'business': 'Commerce',
  'marketing': 'Marketing',
  'communication': 'Communication',
  
  // Health
  'infirmier': 'Santé',
  'soin': 'Santé',
  'médical': 'Santé',
  'santé': 'Santé',
  'aide-soignant': 'Santé',
  
  // Others
  'rh': 'Ressources Humaines',
  'gestion': 'Gestion',
  'comptable': 'Comptabilité',
  'design': 'Design',
  'graphiste': 'Arts Graphiques',
  'cuisine': 'Hôtellerie Restauration'
};

const getJobFamily = (title) => {
  if (!title) return "Formation";
  const lowerTitle = title.toLowerCase();
  
  for (const [key, family] of Object.entries(JOB_FAMILIES)) {
    if (lowerTitle.includes(key)) return family;
  }
  return title; // Fallback to original title if no family found
};

const TrainingsSection = ({ userProfile, match }) => {
  const navigate = useNavigate();
  const plan = userProfile?.subscription_tier || 'free';
  const isPremium = plan !== 'free';
  
  // Determine search parameters
  const exactTitle = match?.title || userProfile?.main_goal || "";
  const jobFamily = getJobFamily(exactTitle);
  const userLocation = userProfile?.location || userProfile?.city || "";

  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedSearchTerm, setUsedSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadFormations = async () => {
      setLoading(true);
      setError(null);

      try {
        // Strategy: Try searching with the broader "Job Family" first to ensure results
        // If the exact title is very specific (e.g., "Développeur React Junior"), exact search often fails.
        // Searching "Informatique" or "Développement" yields better results for orientation.
        
        const searchQuery = jobFamily !== "Formation" ? jobFamily : exactTitle;
        setUsedSearchTerm(searchQuery);
        
        // Parallel fetching from both sources
        // Note: 'distance' param is not standardized across these APIs, so we rely on city matching primarily
        const [ftResult, psResult] = await Promise.allSettled([
          fetchFormationsFT({ q: searchQuery, ville: userLocation, limit: 6 }), // Fetch more to filter later if needed
          fetchFormationsPS({ q: searchQuery, ville: userLocation, limit: 6 })
        ]);

        if (!isMounted) return;

        let combinedResults = [];

        // Process France Travail Results
        if (ftResult.status === 'fulfilled' && ftResult.value.success) {
          const mappedFT = ftResult.value.results.map(f => ({
            id: f.id,
            source: 'france-travail',
            title: f.intitule,
            company: f.entreprise?.nom || f.organisme?.nom || "Organisme de formation",
            location: f.lieuTravail?.libelle || f.ville || "France",
            duration: f.duree || "Durée variable",
            price: f.salaire?.libelle || f.cout || null,
            tags: f.competences || [],
            raw: f
          }));
          combinedResults = [...combinedResults, ...mappedFT];
        }

        // Process Parcoursup Results
        if (psResult.status === 'fulfilled' && psResult.value.success) {
          const mappedPS = psResult.value.results.map(f => ({
            id: f.g_ea_cod_nie || Math.random().toString(36).substr(2, 9),
            source: 'parcoursup',
            title: f.lib_for_voe_ins || f.formation_lib_voe || "Formation Supérieure",
            company: f.g_ea_lib_vx || f.etablissement_nom || "Établissement d'Enseignement Supérieur",
            location: f.ville_etab || f.commune || "France",
            duration: "Cursus Scolaire", // Parcoursup is usually academic years
            price: "Public/Privé", // Often hidden or standard fees
            tags: [],
            raw: f
          }));
          combinedResults = [...combinedResults, ...mappedPS];
        }

        // Filter and Sort Relevance
        // 1. If we have a location, prioritize formations in that location
        if (userLocation) {
          combinedResults.sort((a, b) => {
            const aLoc = (a.location || "").toLowerCase();
            const bLoc = (b.location || "").toLowerCase();
            const userLoc = userLocation.toLowerCase();
            
            const aMatch = aLoc.includes(userLoc);
            const bMatch = bLoc.includes(userLoc);
            
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          });
        }

        // Interleave results to show variety (1 FT, 1 PS, 1 FT...)
        const displayLimit = 3;
        const interleaved = [];
        
        const ftItems = combinedResults.filter(r => r.source === 'france-travail');
        const psItems = combinedResults.filter(r => r.source === 'parcoursup');
        
        let ftIndex = 0;
        let psIndex = 0;
        
        while (interleaved.length < displayLimit && (ftIndex < ftItems.length || psIndex < psItems.length)) {
             // Prioritize exact location matches if possible, but the sort above handled that mostly.
             // We alternate sources to show breadth of catalogue.
             if (ftIndex < ftItems.length) interleaved.push(ftItems[ftIndex++]);
             if (interleaved.length < displayLimit && psIndex < psItems.length) interleaved.push(psItems[psIndex++]);
        }

        setFormations(interleaved);

      } catch (err) {
        console.error("Critical error loading dashboard formations:", err);
        if (isMounted) setError("Impossible de charger les formations pour le moment.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFormations();

    return () => {
      isMounted = false;
    };
  }, [match, userProfile, jobFamily, exactTitle, userLocation]);

  // Helper to determine badge type based on keywords
  const getBadgeType = (formation) => {
    const title = formation.title?.toLowerCase() || "";
    
    // Parcoursup specific logic
    if (formation.source === 'parcoursup') {
        if (title.includes('bts')) return "BTS";
        if (title.includes('but') || title.includes('bachelor')) return "Bachelor";
        if (title.includes('licence')) return "Licence";
        if (title.includes('master') || title.includes('ingénieur')) return "Master/Ingé";
        if (title.includes('prép')) return "Prépa";
        return "Diplôme État";
    }

    // France Travail specific logic
    if (title.includes("master") || title.includes("licence") || title.includes("bts")) return "Diplôme État";
    if (title.includes("bootcamp") || title.includes("intensif")) return "Bootcamp";
    if (title.includes("titre pro") || title.includes("tp")) return "Titre Pro";
    return "Certifiant";
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "Diplôme État": 
      case "Licence":
      case "Master/Ingé":
      case "BTS":
      case "Bachelor":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Bootcamp": 
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Titre Pro": 
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Prépa":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatPrice = (price) => {
    if (!price || price === "Public/Privé") return price || "Non spécifié";
    return isNaN(price) ? price : `${price}€`;
  };

  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="space-y-3 mb-6 p-3 bg-slate-50 rounded-lg">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">
                Formations : {jobFamily}
             </h2>
             <p className="text-slate-500">
                Sélection {jobFamily !== exactTitle ? `élargie "${jobFamily}"` : 'personnalisée'} {userLocation && `autour de ${userLocation}`}.
             </p>
          </div>
          <Button 
            onClick={() => navigate('/formations', { state: { searchQuery: usedSearchTerm || exactTitle } })} 
            className="shrink-0 group"
          >
             Voir tout le catalogue 
             <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"/>
          </Button>
       </div>

       {loading ? (
         <LoadingSkeleton />
       ) : error ? (
         <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="link" onClick={() => window.location.reload()} className="mt-2 text-red-700 underline">
              Réessayer
            </Button>
         </div>
       ) : formations.length > 0 ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((formation, idx) => {
               const type = getBadgeType(formation);
               const isPS = formation.source === 'parcoursup';
               
               return (
                 <Card 
                    key={`${formation.id}-${idx}`} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-slate-200 flex flex-col h-full bg-white relative overflow-hidden" 
                    onClick={() => navigate(`/formation/${formation.id}`, { state: { formation: formation.raw, source: formation.source } })}
                 >
                    {/* Source Indicator Stripe */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${isPS ? 'bg-indigo-400' : 'bg-orange-400'}`} />
                    
                    <CardContent className="p-6 pl-8 flex flex-col h-full">
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isPS ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                             {isPS ? <School size={22} /> : <GraduationCap size={22} />}
                          </div>
                          <Badge variant="outline" className={`${getBadgeColor(type)} border font-medium`}>
                             {type}
                          </Badge>
                       </div>
                       
                       <h3 className="font-bold text-lg mb-2 leading-snug text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                          {formation.title}
                       </h3>
                       
                       <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                          <Building className="w-3.5 h-3.5" />
                          <span className="truncate">{formation.company}</span>
                       </div>
                       
                       <div className="mt-auto space-y-3 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0"/> 
                            <span className="truncate">{formation.duration}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0"/> 
                            <span className="truncate">{formation.location}</span>
                          </div>
                          
                          {/* Price Display Logic */}
                          <div className="flex items-center gap-2.5 font-medium text-slate-900">
                             <Euro className="w-4 h-4 text-slate-400 shrink-0"/> 
                             {formation.price && formation.price !== "Non spécifié" ? (
                               isPremium || !isPS ? formatPrice(formation.price) : <span className="blur-sm select-none bg-slate-200 px-1.5 rounded text-transparent">0000€</span>
                             ) : (
                               <span className="text-slate-500 font-normal italic">{isPS ? "Sur dossier" : "Sur devis / CPF"}</span>
                             )}
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between mt-auto pt-2">
                           <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                               Via {isPS ? "Parcoursup" : "France Travail"}
                           </span>
                           <Button size="sm" variant="ghost" className="hover:bg-violet-50 hover:text-violet-700 p-0 h-auto font-medium">
                             Détails <ArrowRight className="ml-1 w-3 h-3" />
                           </Button>
                       </div>
                    </CardContent>
                 </Card>
               );
            })}
         </div>
       ) : (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto mb-4">
               <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Aucune formation trouvée</h3>
            <p className="text-slate-500 mb-4 max-w-md mx-auto">
               Nous n'avons pas trouvé de formations pour "{usedSearchTerm}" {userLocation ? `à ${userLocation}` : ''}.
               Essayez d'élargir votre zone de recherche.
            </p>
            <Button onClick={() => navigate('/formations', { state: { searchQuery: usedSearchTerm } })} variant="outline">
               Explorer tout le catalogue
            </Button>
         </div>
       )}
    </div>
  );
};

export default TrainingsSection;