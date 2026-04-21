import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, GraduationCap, Settings, Building2, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthorizedEmails from '@/components/admin/sections/AuthorizedEmails';
import { establishmentDashboardService } from '@/services/establishmentDashboardService';
import { useSafeToast } from '@/hooks/useSafeToast';

const EstablishmentDashboard = () => {
  const { establishment, logout } = useEstablishmentAuth();
  const navigate = useNavigate();
  const { toast } = useSafeToast();

  const [loading, setLoading] = useState(true);
  const [studentsCount, setStudentsCount] = useState(0);
  const [testsStats, setTestsStats] = useState({ completedTests: 0, participationRate: 0 });
  const [formationsCount, setFormationsCount] = useState(0);
  const [engagementMetrics, setEngagementMetrics] = useState({ totalStudents: 0, activeStudents: 0, engagementRate: 0 });

  useEffect(() => {
    if (establishment?.id) {
      loadDashboardData();
    }
  }, [establishment?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [students, tests, formations, engagement] = await Promise.all([
        establishmentDashboardService.getStudentsCount(establishment.id),
        establishmentDashboardService.getTestsStatistics(establishment.id),
        establishmentDashboardService.getFormationsCount(establishment.id),
        establishmentDashboardService.getEngagementMetrics(establishment.id)
      ]);

      setStudentsCount(students);
      setTestsStats(tests);
      setFormationsCount(formations);
      setEngagementMetrics(engagement);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les données du tableau de bord'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/establishment/login');
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord Établissement | CléAvenir</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-none">
                    {establishment?.name || 'Mon Établissement'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    UAI: {establishment?.uai || 'N/A'}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h2>
              <p className="text-slate-500 mt-1">Gérez vos étudiants et suivez leur progression.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" /> Paramètres
               </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Étudiants Inscrits</CardTitle>
                <Users className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '-' : (studentsCount === 0 ? '0' : studentsCount)}</div>
                <p className="text-xs text-slate-500">
                  {studentsCount === 0 ? 'Aucun étudiant' : `Total: ${studentsCount} étudiant${studentsCount > 1 ? 's' : ''}`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Complétés</CardTitle>
                <BookOpen className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '-' : testsStats.completedTests}</div>
                <p className="text-xs text-slate-500">Taux de participation: {loading ? '-' : testsStats.participationRate}%</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offres de Formation</CardTitle>
                <GraduationCap className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '-' : formationsCount}</div>
                <p className="text-xs text-slate-500">
                  {formationsCount === 0 ? 'Aucune formation' : `Programmes actifs`}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Engagement Metrics */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-teal-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{engagementMetrics.activeStudents}</div>
                    <div className="text-xs text-slate-500">/ {engagementMetrics.totalStudents}</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Taux d'engagement: {engagementMetrics.engagementRate}%</p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-orange-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Statut de l'établissement</CardTitle>
                  <AlertCircle className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-slate-900">Actif</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Configuration: {establishment?.email ? '✓ Complète' : '⚠ Incomplète'}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Students Alert */}
          {!loading && studentsCount === 0 && (
            <Card className="border-l-4 border-l-amber-500 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Aucun étudiant inscrit</h4>
                    <p className="text-sm text-amber-800 mt-1">
                      Aucun étudiant n'est actuellement associé à votre établissement. Partagez un code d'accès avec vos étudiants pour qu'ils puissent s'inscrire.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Actions Column */}
              <div className="lg:col-span-2 space-y-8">
                 <h3 className="text-lg font-semibold text-slate-900">Accès Rapide</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2 items-center justify-center hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all bg-white shadow-sm"
                      onClick={() => {
                        if (studentsCount === 0) {
                          toast({
                            title: 'Aucun étudiant',
                            description: 'Aucun étudiant n\'est actuellement inscrit à votre établissement.'
                          });
                        } else {
                          toast({
                            title: 'En développement',
                            description: 'La gestion des étudiants sera bientôt disponible.'
                          });
                        }
                      }}
                    >
                        <Users className="h-6 w-6" />
                        <span>Gérer les Étudiants</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2 items-center justify-center hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-all bg-white shadow-sm"
                      onClick={() => {
                        toast({
                          title: 'Bientôt disponible',
                          description: 'La gestion des formations sera disponible prochainement.'
                        });
                      }}
                    >
                        <GraduationCap className="h-6 w-6" />
                        <span>Nos Formations</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2 items-center justify-center hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all bg-white shadow-sm"
                      onClick={() => window.open('https://cleavenir.com/support', '_blank')}
                    >
                        <Building2 className="h-6 w-6" />
                        <span>Support Académique</span>
                    </Button>
                 </div>
              </div>

              {/* Sidebar / Tools Column */}
              <div className="space-y-6">
                 {/* Authorized Emails Component */}
                 {establishment?.id && (
                    <AuthorizedEmails establishmentId={establishment.id} />
                 )}
              </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default EstablishmentDashboard;