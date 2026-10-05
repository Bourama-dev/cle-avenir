import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, Home, ArrowLeft } from 'lucide-react';
import { debugAuth } from '@/utils/authDebug';

import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardRightSidebar from '@/components/dashboard/DashboardRightSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

import { Button } from '@/components/ui/button';

import '@/styles/adminButtons.css';
import '@/styles/DashboardPage.css';

const Dashboard = () => {
  const { user, userProfile, isAdmin, isInstitutionManager, loading: authLoading, subscriptionTier } = useAuth();
  const { goBack, goHome } = useNavigation();
  const navigate = useNavigate();

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
    <div className="dashboard-page-container !h-auto md:!h-screen !bg-none bg-slate-50 dark:bg-slate-950 md:!bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)] !overflow-visible md:!overflow-hidden">
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

      <div className="flex flex-1 md:overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <DashboardSidebar userProfile={userProfile || {}} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 px-4 pt-3 pb-6 md:p-8 relative scroll-smooth min-w-0">
          <div className="max-w-4xl mx-auto md:pb-10">
            <div className="md:hidden -mx-4 mb-4">
              <div className="flex items-center justify-between px-4 pb-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">Mon espace</h1>
                <NotificationBell />
              </div>
              <DashboardSidebar variant="chips" userProfile={userProfile || {}} />
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
          />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
