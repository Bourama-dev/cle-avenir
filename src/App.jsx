import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Environment Validation
import { validateEnvironment } from '@/utils/envValidator';

// Services & Utils
import { MonitoringService } from '@/services/monitoringService';
import { PerformanceMonitor } from '@/services/PerformanceMonitor';
import { checkHookRules } from '@/utils/hooksValidator';
import { initPdfWorker } from '@/utils/pdfWorkerSetup';
import { useTheme } from '@/hooks/useTheme';

// Core Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ScrollToTop from '@/components/ScrollToTop';

// Context Providers
import { useAuth } from '@/contexts/SupabaseAuthContext'; 
import { PlanLimitationProvider } from '@/contexts/PlanLimitationContext';
import { SystemSettingsProvider, useSystemSettings } from '@/contexts/SystemSettingsContext';

// Route Guards
import ProtectedRoute from '@/lib/ProtectedRoute';
import AdminRoute from '@/lib/AdminRoute'; 
import ProtectedEstablishmentRoute from '@/lib/ProtectedEstablishmentRoute';

// Widgets & Helpers
import CleoWidget from '@/components/CleoWidget';
import PageTransition from '@/components/PageTransition';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import CookieConsent from '@/components/CookieConsent';
import RGPDNotice from '@/components/RGPDNotice';
import Breadcrumbs from '@/components/Breadcrumbs';
import BugReportButton from '@/components/BugReportButton';

// SEO Components
import MetaTags from '@/components/SEO/MetaTags';
import StructuredData from '@/components/SEO/StructuredData';

// Performance Components
import LoadingFallback from '@/components/LoadingFallback';
import ProgressBar from '@/components/ui/ProgressBar';

// Immediate Load
import HomePage from '@/components/HomePage';
import MaintenancePage from '@/components/MaintenancePage';

// --- Lazy Load Pages ---
// Auth & New Flow Pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const ActionPlanPage = lazy(() => import('@/pages/ActionPlanPage'));
const TestPage = lazy(() => import('@/pages/TestPage'));

// Legacy Auth
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const EmailConfirmationPending = lazy(() => import('@/pages/EmailConfirmationPending')); 
const AuthCallback = lazy(() => import('@/pages/AuthCallback')); 
const UpdatePasswordPage = lazy(() => import('@/pages/UpdatePasswordPage'));

// Core Test Flow Components & Pages
const TestResults = lazy(() => import('@/pages/TestResults'));
const EnhancedTestPage = lazy(() => import('@/pages/AdaptiveTestPage'));
const TestGatePage = lazy(() => import('@/pages/TestGatePage'));
const TestResultsPage = lazy(() => import('@/pages/TestResultsPage')); 
const TestFormationsPage = lazy(() => import('@/pages/TestFormationsPage'));
const TestPlanPage = lazy(() => import('@/pages/TestPlanPage'));
const AllCareersPage = lazy(() => import('@/pages/AllCareersPage'));

// Other Pages
const ExploreMetiersPage = lazy(() => import('@/pages/ExploreMetiersPage'));
const MetierDetailPage = lazy(() => import('@/pages/MetierDetailPage'));
const FormationsPage = lazy(() => import('@/pages/FormationsPage'));
const FormationDetailPage = lazy(() => import('@/pages/FormationDetailPage'));
const JobOffersPage = lazy(() => import('@/pages/JobOffersPage')); 
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));
const OfferDetailPage = lazy(() => import('@/pages/OfferDetailPage'));
const JobExplorer = lazy(() => import('@/components/JobExplorer'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfileResultsPage = lazy(() => import('@/pages/ProfileResultsPage'));
const RecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const OffersFormationsPage = lazy(() => import('@/pages/OffersFormationsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const TestHistoryPage = lazy(() => import('@/pages/TestHistoryPage'));
const InterviewPage = lazy(() => import('@/pages/InterviewPage'));
const CleoPage = lazy(() => import('@/pages/CleoPage'));
const CVBuilderPage = lazy(() => import('@/pages/CVBuilderPage'));
const CoverLetterBuilderPage = lazy(() => import('@/pages/CoverLetterBuilderPage'));
const MyDocumentsPage = lazy(() => import('@/pages/MyDocumentsPage'));
const ManageSubscriptionPage = lazy(() => import('@/pages/ManageSubscriptionPage'));
const UpgradePlan = lazy(() => import('@/pages/UpgradePlan'));
const PlansPage = lazy(() => import('@/pages/PlansPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const AboutPage = lazy(() => import('@/components/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogArticlePage = lazy(() => import('@/pages/BlogArticlePage'));
const DocumentationPage = lazy(() => import('@/pages/DocumentationPage'));
const StatusPage = lazy(() => import('@/pages/StatusPage'));
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// New Personalized Plan Page
const PersonalizedPlanPage = lazy(() => import('@/pages/PersonalizedPlanPage'));

// Legal Pages - Standard RGPD
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));

// Legal Extra Pages
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/legal/TermsOfServicePage'));
const LegalNoticesPage = lazy(() => import('@/pages/legal/LegalNoticesPage'));
const CookiePolicyPage = lazy(() => import('@/pages/legal/CookiePolicyPage'));
const MentionsLegalesPage = lazy(() => import('@/pages/legal/MentionsLegalesPage'));
const GestionCookiesPage = lazy(() => import('@/pages/legal/GestionCookiesPage'));
const PreferencesRGPDPage = lazy(() => import('@/pages/legal/PreferencesRGPDPage'));

// User specific RGPD
const RgpdPage = lazy(() => import('@/pages/user/RgpdPage'));
const CookiesPreferencesPage = lazy(() => import('@/pages/user/CookiesPreferencesPage'));

// Establishment Pages
const EstablishmentLoginPage = lazy(() => import('@/pages/EstablishmentLoginPage'));
const EstablishmentForgotPasswordPage = lazy(() => import('@/pages/EstablishmentForgotPasswordPage'));
const EstablishmentDashboard = lazy(() => import('@/pages/EstablishmentDashboard'));
const InstitutionStaffLogin = lazy(() => import('@/pages/InstitutionStaffLogin'));
const InstitutionDashboard = lazy(() => import('@/components/InstitutionDashboard'));
const UserManagement = lazy(() => import('@/components/establishment/UserManagement'));

// Admin Pages
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage')); 
const AdminInstitutionsPage = lazy(() => import('@/pages/AdminInstitutionsPage'));
const AdminInstitutionCodesPage = lazy(() => import('@/pages/AdminInstitutionCodesPage'));
const AdminInstitutionStaffPage = lazy(() => import('@/pages/AdminInstitutionStaffPage'));
const AdminAnalyticsDashboard = lazy(() => import('@/pages/AdminAnalyticsDashboard'));
const AdminWeightAuditPage = lazy(() => import('@/pages/AdminWeightAuditPage'));
const EstablishmentDashboardPage = lazy(() => import('@/pages/EstablishmentDashboardPage'));
const RgpdCompliancePage = lazy(() => import('@/pages/admin/RgpdCompliancePage'));
const LegalVersionsPage = lazy(() => import('@/pages/admin/LegalVersionsPage'));
const SecurityAuditPage = lazy(() => import('@/pages/admin/SecurityAuditPage'));
const AdminMetiers = lazy(() => import('@/pages/AdminMetiers'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const RedirectWithParam = ({ to, paramName = 'id' }) => {
  const params = useParams();
  const value = params[paramName] || params.code || params.id;
  return <Navigate to={`${to}/${value}`} replace />;
};

class AppRouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 [App Route Error Boundary] caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de rendu</h2>
          <p className="text-[var(--text-secondary)] mb-6">Un problème est survenu lors du chargement de cette page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageContent = () => {
  checkHookRules('PageContent');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  useTheme();

  const authContext = useAuth();
  const authLoading = authContext?.loading || false;
  const userProfile = authContext?.userProfile;

  const { settings, loading: settingsLoading } = useSystemSettings();

  useEffect(() => {
    try {
      validateEnvironment();
      MonitoringService.init();
      PerformanceMonitor.init();
      initPdfWorker();
    } catch (e) {
      console.error("Initialization failed", e);
    }
  }, []);

  useEffect(() => {
    MonitoringService.logEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  const isMaintenanceActive = settings?.maintenance?.enabled && userProfile?.role !== 'admin';

  useEffect(() => {
    if (!settingsLoading && !authLoading) {
      if (isMaintenanceActive && location.pathname !== '/maintenance' && !location.pathname.startsWith('/auth') && !location.pathname.startsWith('/login')) {
        navigate('/maintenance', { replace: true });
      } else if (!isMaintenanceActive && location.pathname === '/maintenance') {
        navigate('/', { replace: true });
      }
    }
  }, [isMaintenanceActive, location.pathname, navigate, settingsLoading, authLoading]);

  const handleNavigate = (page, data) => {
    const path = page.startsWith('/') ? page : `/${page}`;
    navigate(path, { state: data });
  };

  const isAuthPage = ['/auth', '/login', '/signup', '/forgot-password', '/reset-password', '/email-confirmation-pending', '/auth/callback', '/institution/staff/login'].some(p => location.pathname.startsWith(p));
  const isCVBuilder = location.pathname.startsWith('/cv-builder') || location.pathname.startsWith('/cover-letter-builder');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboard = ['/dashboard', '/settings', '/profil', '/profile', '/account', '/recommendations', '/offers-formations', '/my-documents', '/user/rgpd', '/user/cookies-preferences', '/personalized-plan', '/notifications', '/results', '/action-plan'].some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isEstablishmentPortal = location.pathname.startsWith('/establishment') || location.pathname.startsWith('/institution/');
  const isTestPage = ['/test', '/test-orientation', '/interview', '/test-gate'].some(p => location.pathname.startsWith(p));
  const isErrorPage = location.pathname === '/404';
  const isCleoPage = location.pathname.startsWith('/cleo');
  const isHomePage = location.pathname === '/' || location.pathname === '/accueil';
  const isTestResults = location.pathname.startsWith('/test-results');
  const isMaintenancePage = location.pathname === '/maintenance';

  const showHeader = !isAuthPage && !isAdminPage && !isDashboard && !isTestPage && !isErrorPage && !isEstablishmentPortal && !isCleoPage && !isCVBuilder && !isTestResults && !isMaintenancePage;
  const showFooter = !isAuthPage && !isAdminPage && !isDashboard && !isTestPage && !isErrorPage && !isEstablishmentPortal && !isCleoPage && !isCVBuilder && !isMaintenancePage;
  const showBreadcrumbs = showHeader && !isHomePage;

  if (authLoading || settingsLoading) return <LoadingFallback />;

  if (isMaintenanceActive && location.pathname !== '/maintenance' && !location.pathname.startsWith('/auth') && !location.pathname.startsWith('/login')) {
    return <LoadingFallback />; 
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-[var(--bg-secondary)]">
      <ScrollToTop />
      <ProgressBar />
      
      {showHeader && <Header onNavigate={handleNavigate} />}

      {showBreadcrumbs && (
        <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)] hidden md:block">
          <div className="container mx-auto px-4 py-2 max-w-7xl">
            <Breadcrumbs />
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col relative w-full" role="main">
        <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />

        <AppRouteErrorBoundary>
          <PlanLimitationProvider>
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingFallback />}>
                <Routes location={location} key={location.pathname}>
                  {/* Maintenance Route */}
                  <Route path="/maintenance" element={<PageTransition><MaintenancePage /></PageTransition>} />

                  {/* Home & General */}
                  <Route path="/" element={<PageTransition><HomePage onNavigate={handleNavigate} /></PageTransition>} />
                  <Route path="/accueil" element={<Navigate to="/" replace />} />
                  <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                  <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                  <Route path="/blog/:slug" element={<PageTransition><BlogArticlePage /></PageTransition>} />
                  <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
                  <Route path="/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
                  <Route path="/plans" element={<PageTransition><PlansPage /></PageTransition>} />
                  <Route path="/tarifs" element={<Navigate to="/plans" replace />} />
                  <Route path="/documentation" element={<PageTransition><DocumentationPage /></PageTransition>} />
                  <Route path="/status" element={<PageTransition><StatusPage /></PageTransition>} />
                  <Route path="/roadmap" element={<PageTransition><RoadmapPage /></PageTransition>} />
                  
                  {/* New Orientation Flow */}
                  <Route path="/test" element={<PageTransition><TestPage /></PageTransition>} />
                  <Route path="/test-orientation" element={<Navigate to="/test" replace />} />
                  <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                  <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
                  
                  {/* Protected Flow Pages */}
                  <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
                  <Route path="/results" element={<PageTransition><ResultsPage /></PageTransition>} />
                  <Route path="/action-plan" element={<ProtectedRoute><PageTransition><ActionPlanPage /></PageTransition></ProtectedRoute>} />
                  
                  {/* Legacy Auth */}
                  <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
                  <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
                  <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
                  <Route path="/update-password" element={<PageTransition><UpdatePasswordPage /></PageTransition>} />
                  <Route path="/email-confirmation-pending" element={<PageTransition><EmailConfirmationPending /></PageTransition>} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Legacy Test Routes */}
                  <Route path="/test-gate" element={<PageTransition><TestGatePage /></PageTransition>} />
                  <Route path="/test-results" element={<PageTransition><TestResultsPage /></PageTransition>} />
                  <Route path="/test-formations" element={<PageTransition><TestFormationsPage /></PageTransition>} />
                  <Route path="/test-plan" element={<PageTransition><TestPlanPage /></PageTransition>} />
                  <Route path="/careers" element={<PageTransition><AllCareersPage /></PageTransition>} />
                  <Route path="/all-careers" element={<Navigate to="/careers" replace />} />

                  {/* Explorers & Detail Pages */}
                  <Route path="/metiers" element={<PageTransition><ExploreMetiersPage /></PageTransition>} />
                  <Route path="/metier/:code" element={<PageTransition><MetierDetailPage /></PageTransition>} />
                  <Route path="/metiers/:code" element={<RedirectWithParam to="/metier" paramName="code" />} />
                  <Route path="/formations" element={<PageTransition><FormationsPage /></PageTransition>} />
                  <Route path="/formation/:id" element={<PageTransition><FormationDetailPage /></PageTransition>} />
                  <Route path="/formations/:id" element={<RedirectWithParam to="/formation" paramName="id" />} />
                  <Route path="/offres-emploi" element={<PageTransition><JobExplorer onNavigate={handleNavigate} /></PageTransition>} />
                  <Route path="/job/:id" element={<PageTransition><JobDetailPage /></PageTransition>} />
                  <Route path="/offre/:id" element={<RedirectWithParam to="/job" paramName="id" />} />
                  
                  {/* Compliance / Legal Policy Pages */}
                  <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
                  <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
                  <Route path="/legal" element={<PageTransition><LegalPage /></PageTransition>} />
                  <Route path="/legal/privacy" element={<Navigate to="/privacy" replace />} />
                  <Route path="/legal/terms" element={<Navigate to="/terms" replace />} />
                  <Route path="/legal/notices" element={<Navigate to="/legal" replace />} />
                  <Route path="/legal/cookies" element={<PageTransition><CookiePolicyPage /></PageTransition>} />
                  <Route path="/mentions-legales" element={<Navigate to="/legal" replace />} />
                  <Route path="/politique-confidentialite" element={<Navigate to="/privacy" replace />} />
                  <Route path="/conditions-generales" element={<Navigate to="/terms" replace />} />
                  <Route path="/gestion-cookies" element={<PageTransition><GestionCookiesPage /></PageTransition>} />
                  <Route path="/preferences-rgpd" element={<PageTransition><PreferencesRGPDPage /></PageTransition>} />
                  
                  {/* Protected Dashboard/App Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><PageTransition><DashboardPage onNavigate={handleNavigate} /></PageTransition></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><PageTransition><NotificationsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/profile/edit" element={<ProtectedRoute><PageTransition><ProfileResultsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/recommendations" element={<ProtectedRoute><PageTransition><RecommendationsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/offers-formations" element={<ProtectedRoute><PageTransition><OffersFormationsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><PageTransition><AccountPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/test-history" element={<ProtectedRoute><PageTransition><TestHistoryPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/personalized-plan" element={<ProtectedRoute><PageTransition><PersonalizedPlanPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/plan-personnalise" element={<Navigate to="/personalized-plan" replace />} />
                  <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
                  <Route path="/cleo" element={<ProtectedRoute><CleoPage /></ProtectedRoute>} />
                  <Route path="/cv-builder" element={<ProtectedRoute><CVBuilderPage /></ProtectedRoute>} />
                  <Route path="/cv-builder/:id" element={<ProtectedRoute><CVBuilderPage /></ProtectedRoute>} />
                  <Route path="/cover-letter-builder" element={<ProtectedRoute><CoverLetterBuilderPage /></ProtectedRoute>} />
                  <Route path="/cover-letter-builder/:id" element={<ProtectedRoute><CoverLetterBuilderPage /></ProtectedRoute>} />
                  <Route path="/my-documents" element={<ProtectedRoute><PageTransition><MyDocumentsPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/manage-subscription" element={<ProtectedRoute><PageTransition><ManageSubscriptionPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/upgrade" element={<ProtectedRoute><UpgradePlan /></ProtectedRoute>} />
                  <Route path="/upgrade-plan" element={<Navigate to="/upgrade" replace />} />
                  <Route path="/user/rgpd" element={<ProtectedRoute><PageTransition><RgpdPage /></PageTransition></ProtectedRoute>} />
                  <Route path="/user/cookies-preferences" element={<ProtectedRoute><PageTransition><CookiesPreferencesPage /></PageTransition></ProtectedRoute>} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage onNavigate={handleNavigate} /></AdminRoute>} />
                  <Route path="/admin/metiers" element={<AdminRoute><AdminMetiers /></AdminRoute>} />
                  <Route path="/admin/institutions" element={<AdminRoute><AdminInstitutionsPage /></AdminRoute>} />
                  <Route path="/admin/establishment/:id/dashboard" element={<AdminRoute><EstablishmentDashboardPage /></AdminRoute>} />
                  <Route path="/admin/institution/:id/codes" element={<AdminRoute><AdminInstitutionCodesPage /></AdminRoute>} />
                  <Route path="/admin/institution/:id/staff" element={<AdminRoute><AdminInstitutionStaffPage /></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsDashboard /></AdminRoute>} />
                  <Route path="/admin/weight-audit" element={<AdminRoute><AdminWeightAuditPage /></AdminRoute>} />
                  <Route path="/admin/rgpd-compliance" element={<AdminRoute><RgpdCompliancePage /></AdminRoute>} />
                  <Route path="/admin/legal-versions" element={<AdminRoute><LegalVersionsPage /></AdminRoute>} />
                  <Route path="/admin/security-audit" element={<AdminRoute><SecurityAuditPage /></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
                  <Route path="/admin/*" element={<AdminRoute><AdminDashboardPage onNavigate={handleNavigate} /></AdminRoute>} />
                  
                  {/* Establishment Routes */}
                  <Route path="/establishment/login" element={<EstablishmentLoginPage />} />
                  <Route path="/establishment/forgot-password" element={<EstablishmentForgotPasswordPage />} />
                  <Route path="/establishment/dashboard/*" element={<ProtectedEstablishmentRoute><EstablishmentDashboard /></ProtectedEstablishmentRoute>} />
                  <Route path="/institution/staff/login" element={<InstitutionStaffLogin />} />
                  <Route path="/institution/:id/dashboard" element={<ProtectedEstablishmentRoute><InstitutionDashboard /></ProtectedEstablishmentRoute>} />
                  <Route path="/institution/:id/users" element={<ProtectedEstablishmentRoute><UserManagement /></ProtectedEstablishmentRoute>} /> 
                  
                  {/* Redirects */}
                  <Route path="/profil" element={<Navigate to="/profile" replace />} />
                  <Route path="/a-propos" element={<Navigate to="/about" replace />} />
                  <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
                  <Route path="/blog-posts" element={<Navigate to="/blog" replace />} />
                  <Route path="/metiers-explorer" element={<Navigate to="/metiers" replace />} />
                  <Route path="/formations-explorer" element={<Navigate to="/formations" replace />} />
                  <Route path="/jobs-explorer" element={<Navigate to="/offres-emploi" replace />} />
                  <Route path="/comment-ca-marche" element={<Navigate to="/how-it-works" replace />} />
                  
                  {/* Catch-all 404 Route MUST be absolute last */}
                  <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </PlanLimitationProvider>
        </AppRouteErrorBoundary>
      </main>

      {!isEstablishmentPortal && !isAuthPage && !isAdminPage && !isCleoPage && !isTestPage && !isCVBuilder && !isMaintenancePage && <CleoWidget />} 
      {!isEstablishmentPortal && !isAuthPage && !isAdminPage && !isMaintenancePage && <BugReportButton />}
      
      <CookieConsent />
      
      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  checkHookRules('App');
  return (
    <SystemSettingsProvider>
      <MetaTags />
      <StructuredData />
      <PageContent />
    </SystemSettingsProvider>
  );
}