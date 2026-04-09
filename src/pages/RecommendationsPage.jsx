import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, TrendingUp, DollarSign, ArrowRight, Home, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { metierRecommendationService } from '@/services/metierRecommendationService';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsGrid } from '@/components/cleo/charts/CleoChartLibrary';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { goBack, goHome } = useNavigation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [careers, setCareers] = useState([]);
  
  const fetchRecommendations = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const recommendations = await metierRecommendationService.getRecommendationsForUser(user.id);
      setCareers(recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Impossible de charger les recommandations.');
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les recommandations.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const toggleFavorite = (career) => {
    toast({
      title: "Action non disponible",
      description: `La sauvegarde de ${career.libelle || 'ce métier'} n'est pas encore implémentée sur cette page.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      {/* Navigation Header */}
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Recommandations Métiers</h1>
           <p className="text-slate-500 mt-1">Métiers sélectionnés selon votre profil et vos résultats.</p>
        </div>
      </div>

      {!loading && !error && careers.length > 0 && (
        <StatsGrid
          stats={[
            {
              label: 'Recommandations',
              value: careers.length,
              trend: careers.length > 5 ? 'up' : 'neutral',
              subtitle: `basées sur votre profil`
            },
            {
              label: 'Match moyen',
              value: `${Math.round(careers.reduce((sum, c) => sum + (c.matchScore || c.match_score || 0), 0) / careers.length)}%`,
              trend: 'neutral',
              subtitle: 'avec vos compétences'
            },
            {
              label: 'Meilleur match',
              value: `${Math.max(...careers.map(c => c.matchScore || c.match_score || 0))}%`,
              trend: 'up',
              subtitle: careers[0]?.libelle?.split(' ').slice(0, 2).join(' ') || 'Top recommandation'
            },
            {
              label: 'Forte demande',
              value: careers.filter(c => c.debouches === 'forte' || c.debouches === 'Forte').length,
              trend: 'up',
              subtitle: `métiers en croissance`
            }
          ]}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="flex flex-col overflow-hidden">
               <CardHeader className="pb-2">
                 <div className="flex justify-between items-start">
                   <Skeleton className="h-6 w-16" />
                   <Skeleton className="h-8 w-8 rounded-full" />
                 </div>
                 <Skeleton className="h-6 w-3/4 mt-2" />
               </CardHeader>
               <CardContent className="space-y-4 flex-grow">
                 <div className="grid grid-cols-2 gap-4">
                   <Skeleton className="h-10 w-full" />
                   <Skeleton className="h-10 w-full" />
                 </div>
                 <Skeleton className="h-16 w-full" />
               </CardContent>
               <CardFooter>
                 <Skeleton className="h-10 w-full" />
               </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col h-[40vh] w-full items-center justify-center gap-4 bg-slate-50 rounded-2xl border border-slate-200">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-slate-800 font-medium text-lg">Une erreur est survenue</p>
          <p className="text-slate-500 text-center max-w-md">{error}</p>
          <Button onClick={fetchRecommendations} variant="outline" className="mt-4">
            Réessayer
          </Button>
        </div>
      ) : careers.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-600 text-lg mb-6">Nous n'avons pas encore de recommandations basées sur vos résultats.</p>
          <Button onClick={() => navigate('/test-orientation')} size="lg" className="bg-purple-600 hover:bg-purple-700">
             Passer le test d'orientation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career, index) => (
            <Card key={career.code || index} className="flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                   <Badge className={index < 3 ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                      {career.matchScore || career.match_score || 85}% Match
                   </Badge>
                   <Button variant="ghost" size="icon" onClick={() => toggleFavorite(career)}>
                      <Heart className="h-5 w-5 text-slate-400 hover:text-red-500 hover:fill-red-500" />
                   </Button>
                </div>
                <CardTitle className="mt-2 text-xl line-clamp-2">{career.libelle || "Métier Inconnu"}</CardTitle>
                <CardDescription className="flex items-center gap-2 font-mono text-xs mt-1">
                   ROME {career.code}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg">
                    <div className="space-y-1">
                       <span className="text-slate-400 flex items-center gap-1 text-xs"><DollarSign className="w-3 h-3" /> Salaire</span>
                       <span className="font-medium text-slate-700 line-clamp-1" title={career.salaire}>{career.salaire || "Variable"}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="text-slate-400 flex items-center gap-1 text-xs"><TrendingUp className="w-3 h-3" /> Demande</span>
                       <span className="font-medium text-slate-700 capitalize line-clamp-1" title={career.debouches}>
                          {career.debouches || "Stable"}
                       </span>
                    </div>
                 </div>
                 
                 {career.description && (
                   <p className="text-sm text-slate-600 line-clamp-3">
                      {career.description}
                   </p>
                 )}
              </CardContent>
              <CardFooter className="pt-2">
                 <Button className="w-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:text-purple-700" onClick={() => navigate(`/metier/${career.code}`)}>
                    Voir la fiche <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;