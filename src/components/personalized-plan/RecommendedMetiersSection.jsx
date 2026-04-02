import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Plus, Star, Euro, TrendingUp, Search, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const RecommendedMetiersSection = ({ metiers, onAddMetier, isLoading }) => {
  const navigate = useNavigate();

  const handleAdd = (metier) => {
    if(onAddMetier) onAddMetier(metier);
  };

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          Métiers Recommandés
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col h-full border-slate-200">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metiers || metiers.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          Métiers Recommandés
        </h2>
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="p-8 text-center flex flex-col items-center text-slate-500">
            <Search className="w-10 h-10 text-slate-300 mb-3" />
            <p className="mb-4 font-medium">Aucun métier recommandé trouvé pour le moment.</p>
            <p className="text-sm text-slate-400 mb-6">Passez le test d'orientation pour obtenir des recommandations personnalisées.</p>
            <Button onClick={() => navigate('/test-orientation')} className="bg-indigo-600 hover:bg-indigo-700">
              Passer le test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-indigo-600" />
        Top {Math.min(metiers.length, 3)} Métiers Recommandés
      </h2>
      <div className="grid lg:grid-cols-3 gap-6">
        {metiers.slice(0, 3).map((metier, idx) => (
          <Card key={metier.code || idx} className="flex flex-col h-full hover-lift border-slate-200 bg-white">
            <CardContent className="p-6 flex flex-col flex-1 relative">
               {idx === 0 && (
                 <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                   Meilleur Match
                 </div>
               )}
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shrink-0">
                     #{idx + 1}
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-2 py-1 shadow-sm shrink-0 whitespace-nowrap">
                     <Star className="w-3 h-3 mr-1 fill-current" /> {Math.round(metier.match_score || metier.compatibility || metier.finalScore || 85)}% Match
                  </Badge>
               </div>
               
               <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 leading-tight min-h-[3rem]">
                 {metier.libelle || metier.name || metier.title}
               </h3>
               <span className="text-xs font-mono text-slate-400 mb-4 block bg-slate-50 px-2 py-1 rounded inline-block w-fit">
                 ROME: {metier.code || metier.metierCode || 'N/A'}
               </span>
               
               <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1">
                 {metier.description || metier.definition || "Découvrez ce métier passionnant qui correspond à votre profil RIASEC."}
               </p>
               
               <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center text-sm text-slate-700 font-medium">
                     <Euro className="w-4 h-4 mr-2 text-emerald-600" /> 
                     <span className="truncate">{metier.salaire || metier.salaryRange || 'Selon expérience'}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700 font-medium">
                     <TrendingUp className="w-4 h-4 mr-2 text-blue-600" /> 
                     <span className="truncate">{metier.debouches || metier.demandLevel || 'Opportunités variables'}</span>
                  </div>
               </div>

               {metier.hybridProfile && metier.hybridProfile.length > 0 && (
                 <div className="flex flex-wrap gap-1 mb-6">
                   {metier.hybridProfile.map((prof, pIdx) => (
                      <Badge key={pIdx} variant="outline" className="text-xs text-indigo-700 border-indigo-200 bg-indigo-50">
                        Profil {prof}
                      </Badge>
                   ))}
                 </div>
               )}

               <div className="mt-auto grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-600" 
                    onClick={() => navigate(`/metier/${metier.code || metier.metierCode}`)}
                  >
                     Détails <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button 
                    className="w-full text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                    onClick={() => handleAdd(metier)}
                  >
                     <Plus className="w-3 h-3 mr-1" /> Cibler
                  </Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMetiersSection;