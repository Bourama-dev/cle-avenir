import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, Menu, Home, ArrowLeft } from 'lucide-react';
import { debugAuth } from '@/utils/authDebug';

import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardRightSidebar from '@/components/dashboard/DashboardRightSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import '@/styles/adminButtons.css';
import '@/styles/DashboardPage.css';

const Dashboard = () => {
  const { user, userProfile, isAdmin, isInstitutionManager, loading: authLoading, subscriptionTier } = useAuth();
  const { goBack, goHome } = useNavigation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    debugAuth('DashboardMount', { userId: user?.id });
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ returnTo: '/dashboard', message: 'Veuillez vous connecter pour accéder à votre tableau de bord.' }}
        replace
      />
    );
  }

  if (isInstitutionManager) {
    const institutionId = userProfile?.institution_id;
    if (institutionId) {
      return <Navigate to={`/institution/${institutionId}/dashboard`} replace />;
    }
  }

  return (
    <div className="dashboard-page-container">
      {/* Desktop Header */}
      <header className="dashboard-header hidden md:flex items-center justify-between">
        <div className="dashboard-header-left flex-1">
          <div className="flex flex-col gap-2">
            <Breadcrumbs className="mb-0" />
            <h1>Bienvenue, {userProfile?.first_name || 'sur votre espace'} 👋</h1>
          </div>
        </div>
        <div className="dashboard-header-right flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goHome}
              className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
              title="Accueil"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          <NotificationBell />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-20 left-4 z-20 shadow-md bg-white dark:bg-slate-800"
              >
                <Menu className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <DashboardSidebar
                userProfile={userProfile || {}}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <DashboardSidebar userProfile={userProfile || {}} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 p-4 md:p-8 relative scroll-smooth">
          <div className="max-w-4xl mx-auto mt-12 md:mt-0 pb-10">
            {/* Mobile header */}
            <div className="md:hidden mb-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate pl-12">Tableau de bord</h1>
                <NotificationBell />
              </div>
              <div className="pl-2">
                <Breadcrumbs />
              </div>
            </div>

            <DashboardOverview
              user={user}
              userProfile={userProfile || {}}
              subscriptionTier={subscriptionTier}
              isAdmin={isAdmin}
              onNavigate={navigate}
              onOpenProfile={() => navigate('/profile/edit')}
            />
          </div>
        </main>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden xl:block w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 overflow-y-auto">
          <DashboardRightSidebar
            userProfile={userProfile || {}}
            user={user}
            onOpenProfile={() => navigate('/profile/edit')}
            subscriptionTier={subscriptionTier}
          />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
