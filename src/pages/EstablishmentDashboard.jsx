import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, GraduationCap, Settings, Building2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsGrid } from '@/components/cleo/charts/CleoChartLibrary';

const EstablishmentDashboard = () => {
  const { currentEstablishment, logout } = useEstablishmentAuth();
  const navigate = useNavigate();

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
                    {currentEstablishment?.name || 'Mon Établissement'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    UAI: {currentEstablishment?.uai || 'N/A'}
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h2>
            <p className="text-slate-500 mt-1">Gérez vos étudiants et suivez leur progression.</p>
          </div>

          {/* Quick Stats */}
          <StatsGrid
            stats={[
              {
                label: 'Étudiants Inscrits',
                value: '--',
                trend: 'neutral',
                subtitle: '+0% depuis le mois dernier'
              },
              {
                label: 'Tests Complétés',
                value: '--',
                trend: 'neutral',
                subtitle: 'Taux de participation: --%'
              },
              {
                label: 'Offres de Formation',
                value: '--',
                trend: 'neutral',
                subtitle: 'Programmes actifs'
              }
            ]}
          />
          <div className="mb-8"></div>

          {/* Quick Actions Grid */}
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Accès Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all" onClick={() => navigate('/establishment/students')}>
                <Users className="h-6 w-6" />
                <span>Gérer les Étudiants</span>
             </Button>
             
             <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-all" onClick={() => navigate('/establishment/formations')}>
                <GraduationCap className="h-6 w-6" />
                <span>Nos Formations</span>
             </Button>
             
             <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all" onClick={() => navigate('/establishment/settings')}>
                <Settings className="h-6 w-6" />
                <span>Paramètres</span>
             </Button>
             
             <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all" onClick={() => window.open('https://cleavenir.com/support', '_blank')}>
                <Building2 className="h-6 w-6" />
                <span>Support Académique</span>
             </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default EstablishmentDashboard;