import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, MapPin, Mail, GraduationCap, Edit, RefreshCw, Trophy, Briefcase, User, Home, ArrowLeft, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useNavigation } from '@/hooks/useNavigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTestResults } from '@/hooks/useTestResults';

const ProfileResultsPage = () => {
  const navigate = useNavigate();
  const { goBack, goHome } = useNavigation();
  
  const { profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { testResult, loading: testLoading, error: testError, refetch: refetchTest } = useTestResults();

  const loading = profileLoading || testLoading;
  const error = profileError || testError;

  if (loading) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-slate-500">Chargement de votre profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-slate-800 font-medium text-lg">Une erreur est survenue</p>
        <p className="text-slate-500 text-center max-w-md">{error}</p>
        <Button onClick={() => { refetchProfile(); refetchTest(); }} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  // Calculate profile completion
  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['first_name', 'last_name', 'email', 'phone', 'city', 'education_level', 'avatar_url'];
    const filled = fields.filter(field => profile[field]);
    return Math.round((filled.length / fields.length) * 100);
  };

  const completion = calculateCompletion();
  
  // Extract test traits securely
  const topTraits = testResult?.profile_result?.topTraits || testResult?.classifications?.traits || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
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
          <h1 className="text-3xl font-bold text-slate-900">Mon Profil & Résultats</h1>
          <p className="text-slate-500 mt-1">Gérez vos informations et consultez vos résultats d'orientation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/test-orientation')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refaire le test
          </Button>
          <Button onClick={() => navigate('/profile/edit')}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier mon profil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Profil Candidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-3 overflow-hidden border-2 border-white shadow-sm">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-purple-600">
                    {profile?.first_name?.[0] || ''}{profile?.last_name?.[0] || ''}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg">{profile?.first_name || 'Prénom'} {profile?.last_name || 'Nom'}</h3>
              <p className="text-sm text-slate-500">{profile?.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{profile?.city || 'Ville non renseignée'} {profile?.postal_code && `(${profile.postal_code})`}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span>{profile?.education_level || 'Niveau non renseigné'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{profile?.email}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm font-medium">
                <span>Complétion du profil</span>
                <span>{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
              {completion < 100 && (
                <p className="text-xs text-amber-600 mt-1">
                  Complétez votre profil pour améliorer vos recommandations.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results & Recommendations Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Test Result */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Derniers Résultats
              </CardTitle>
              <CardDescription>
                Test effectué le {testResult ? new Date(testResult.created_at).toLocaleDateString() : 'Jamais'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-2">Profil dominant</h4>
                    <p className="text-purple-700">
                       {testResult.profile_result?.type || testResult.results?.dominantProfile || "Analyse complétée"}
                    </p>
                  </div>
                  
                  {topTraits.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {topTraits.slice(0, 3).map((trait, idx) => (
                        <div key={idx} className="p-3 bg-white border rounded text-center">
                          <span className="block text-xl font-bold text-slate-700 capitalize">{trait}</span>
                          <span className="text-xs text-slate-500">
                             {idx === 0 ? 'Trait Principal' : idx === 1 ? 'Trait Secondaire' : 'Trait Tertiaire'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">Vous n'avez pas encore passé le test d'orientation.</p>
                  <Button onClick={() => navigate('/test-orientation')}>Commencer le test</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Recommendations */}
          {testResult && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  Top Recommandations
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/recommendations')}>
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                   {(testResult.top_3_careers || testResult.results?.matches || []).slice(0, 3).length > 0 ? (
                      (testResult.top_3_careers || testResult.results?.matches).slice(0, 3).map((career, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                           <div>
                              <h4 className="font-medium text-slate-900">{career.libelle || career.title || career.name || "Métier"}</h4>
                              <p className="text-xs text-slate-500">{career.match_score || career.matchScore || career.score || 85}% de compatibilité</p>
                           </div>
                           <Badge variant="secondary">Top {index + 1}</Badge>
                        </div>
                      ))
                   ) : (
                      <div className="text-center py-4 text-slate-500">
                        <p>Aucune recommandation enregistrée dans ce test.</p>
                      </div>
                   )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileResultsPage;