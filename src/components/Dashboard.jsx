import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { Loader2, Menu, UserCircle, FileText, ArrowRight, ShieldCheck, Home, ArrowLeft, Settings } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { debugAuth } from '@/utils/authDebug';

// Components
import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardRightSidebar from '@/components/dashboard/DashboardRightSidebar';
import SubscriptionDebugPanel from '@/components/SubscriptionDebugPanel';
import Breadcrumbs from '@/components/Breadcrumbs';

// Sections
import DashboardOverview from '@/components/dashboard/DashboardOverview';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { getDisplayPlanName } from '@/lib/subscriptionUtils';

import '@/styles/adminButtons.css';
import '@/styles/DashboardPage.css';

const Dashboard = ({ onNavigate }) => {
  const { user, userProfile, isAdmin, isInstitutionManager, loading: authLoading, subscriptionTier } = useAuth();
  const { navigateToAdmin } = useAdminNavigation();
  const { goBack, goHome } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Test Results State
  const [latestTestResult, setLatestTestResult] = useState(null);
  const [loadingTest, setLoadingTest] = useState(true);

  // Debug on mount
  useEffect(() => {
    debugAuth('DashboardMount', { userId: user?.id });
  }, [user]);

  // Handle section from navigation state
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  // Fetch latest test result
  useEffect(() => {
    const fetchLatestTest = async () => {
      if (!user?.id) {
        setLoadingTest(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching test results:', error);
        }
        setLatestTestResult(data);
      } catch (err) {
        console.error('Exception fetching test results:', err);
      } finally {
        setLoadingTest(false);
      }
    };
    
    if (user) {
        fetchLatestTest();
    } else if (!authLoading && !user) {
        setLoadingTest(false);
    }
  }, [user, authLoading]);

  // --- ACCESS CONTROL ---
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ returnTo: '/dashboard', message: "Veuillez vous connecter pour accéder à votre tableau de bord." }} replace />;
  }

  if (isInstitutionManager) {
     const institutionId = userProfile?.institution_id;
     if (institutionId) {
        return <Navigate to={`/institution/${institutionId}/dashboard`} replace />;
     }
  }

  const handleOpenProfileEditor = () => {
    navigate('/profile/edit');
  };

  const renderContent = () => {
    const commonProps = {
      userProfile: userProfile || {}, 
      subscriptionTier: subscriptionTier,
      onNavigate: (path) => {
        if (path === 'profile' || path === 'results') {
           navigate('/profile');
        } else if (path === 'recommendations') {
           navigate('/recommendations');
        } else if (path === 'jobs' || path === 'trainings') {
           navigate('/offers-formations');
        } else if (path === 'account' || path === 'settings') {
           navigate('/account');
        } else if (onNavigate) {
          onNavigate(path);
        } else {
            navigate(path);
        }
      },
      onOpenProfile: handleOpenProfileEditor
    };

    return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Profile Card */}
              <Card className="dashboard-card border-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Mon Profil</CardTitle>
                  <UserCircle className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">
                      {userProfile?.first_name || 'Utilisateur'} {userProfile?.last_name || ''}
                    </div>
                    <div className="text-sm text-slate-500">{user?.email}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        Membre
                      </Badge>
                      {subscriptionTier && subscriptionTier !== 'free' && (
                        <Badge variant="outline" className="border-purple-200 text-purple-700 capitalize">
                          {getDisplayPlanName(subscriptionTier)}
                        </Badge>
                      )}
                      {isAdmin && (
                         <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">
                           Admin
                         </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Results Card */}
              <Card className="dashboard-card border-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Dernier Test</CardTitle>
                  <FileText className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  {loadingTest ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
                    </div>
                  ) : latestTestResult ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-bold text-slate-800">
                        Test complété le {new Date(latestTestResult.created_at).toLocaleDateString()}
                      </div>
                      <Link 
                        to="/profile" 
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mt-1"
                      >
                        Voir les résultats détaillés <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-slate-500">Aucun test effectué pour le moment.</p>
                      <Button 
                        size="sm" 
                        onClick={() => navigate('/test-orientation')}
                        className="w-fit bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Commencer un test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin Access Card */}
              {isAdmin && (
                <Card className="dashboard-card border-purple-200 bg-purple-50 col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-purple-900 flex items-center gap-2">
                       <ShieldCheck className="h-5 w-5" />
                       Espace Administrateur
                    </CardTitle>
                    <CardDescription className="text-purple-700">
                       Accédez au panneau de contrôle pour gérer les utilisateurs, le contenu et les paramètres.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                       <Button 
                         onClick={navigateToAdmin}
                         className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                       >
                         Dashboard Analytics <ArrowRight className="ml-2 h-4 w-4" />
                       </Button>
                       
                       <Link to="/admin">
                         <Button 
                           variant="default"
                           className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium transition-all duration-200 flex items-center gap-2"
                         >
                           <Settings className="h-4 w-4" />
                           Gestion de contenu
                         </Button>
                       </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DashboardOverview {...commonProps} />
          </div>
    );
  };

  return (
    <div className="dashboard-page-container">
      {/* Desktop Header */}
      <header className="dashboard-header hidden md:flex items-center justify-between">
        <div className="dashboard-header-left flex-1">
          <div className="flex flex-col gap-2">
             <Breadcrumbs className="mb-0" />
             <div className="flex items-center justify-between">
                <h1>
                  Bienvenue, {userProfile?.first_name || 'sur votre espace'} 👋
                </h1>
             </div>
          </div>
        </div>
        <div className="dashboard-header-right flex items-center gap-4">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={goHome} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50" title="Accueil">
                <Home className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={goBack} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50" title="Retour">
                <ArrowLeft className="w-5 h-5" />
             </Button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
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
                className="absolute top-20 left-4 z-20 shadow-md bg-white"
              >
                <Menu className="h-4 w-4 text-slate-700" />
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
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
          <DashboardSidebar 
            userProfile={userProfile || {}}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 relative scroll-smooth">
          <div className="max-w-6xl mx-auto mt-12 md:mt-0 pb-10">
            {/* Header Mobile */}
            <div className="md:hidden mb-6 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-900 truncate pl-12">Tableau de bord</h1>
                  <div className="flex items-center gap-2">
                     <NotificationBell />
                  </div>
               </div>
               <div className="pl-2">
                  <Breadcrumbs />
               </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden xl:block w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto">
          <DashboardRightSidebar 
            userProfile={userProfile || {}} 
            onOpenProfile={handleOpenProfileEditor}
            subscriptionTier={subscriptionTier}
          />
        </aside>
      </div>
      
      {/* DEBUG PANEL */}
      <SubscriptionDebugPanel />
    </div>
  );
};

export default Dashboard;