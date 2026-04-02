import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '@/lib/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load sections for better performance
const AdminOverview = lazy(() => import('@/components/admin/sections/AdminOverview'));
const UserManagement = lazy(() => import('@/components/admin/UserManagement')); 
const AdminTests = lazy(() => import('@/components/admin/sections/AdminTests'));
const AdminContent = lazy(() => import('@/components/admin/sections/AdminContent'));
const AdminAnalytics = lazy(() => import('@/components/admin/sections/AdminAnalytics'));
const AdminSettings = lazy(() => import('@/components/admin/sections/AdminSettings'));
const AdminSubscriptions = lazy(() => import('@/components/admin/sections/AdminSubscriptions'));
const AdminEstablishments = lazy(() => import('@/components/admin/sections/AdminEstablishments'));
const AdminSupport = lazy(() => import('@/components/admin/sections/AdminSupport'));
const AdminDataRequests = lazy(() => import('@/components/admin/sections/AdminDataRequests')); 
const AdminCompliance = lazy(() => import('@/components/admin/sections/AdminCompliance'));
const AdminSecurity = lazy(() => import('@/components/admin/sections/AdminSecurity'));
const AdminGdprDocs = lazy(() => import('@/components/admin/sections/AdminGdprDocs'));
const AdminGdprOps = lazy(() => import('@/components/admin/sections/AdminGdprOps'));
const AdminLegalVersions = lazy(() => import('@/components/admin/sections/AdminLegalVersions'));
const AdminOpsCenter = lazy(() => import('@/components/admin/sections/AdminOpsCenter'));
const AdminMonitoring = lazy(() => import('@/components/admin/sections/AdminMonitoring'));
const AdminWiki = lazy(() => import('@/components/admin/sections/AdminWiki'));
const AdminLaunchControl = lazy(() => import('@/components/admin/sections/AdminLaunchControl'));
const AdminQA = lazy(() => import('@/components/admin/sections/AdminQA'));

const AdminDashboardLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
  </div>
);

const AdminDashboard = ({ onNavigate }) => {
  const location = useLocation();

  // Redirect /admin or /admin/ to /admin/dashboard
  // This helps when the route renders this component at /admin
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    // Redundant but safe check. AdminRoute in App.jsx is the primary guard.
    <ProtectedRoute requiredRole="admin">
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
        <AdminSidebar onNavigate={onNavigate} currentPath={location.pathname} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-64px)] lg:max-h-screen w-full">
          <Suspense fallback={<AdminDashboardLoader />}>
            <Routes>
              {/* Default route /admin/dashboard points here */}
              <Route path="dashboard" element={<AdminOverview />} />
              <Route index element={<AdminOverview />} /> {/* Fallback for /admin/dashboard root if handled this way */}
              
              {/* Launch & Quality */}
              <Route path="launch" element={<AdminLaunchControl />} />
              <Route path="qa" element={<AdminQA />} />
              
              {/* Ops */}
              <Route path="ops" element={<AdminOpsCenter />} />
              <Route path="monitoring" element={<AdminMonitoring />} />
              <Route path="wiki" element={<AdminWiki />} />
              
              {/* Core Management */}
              <Route path="users" element={<UserManagement />} />
              <Route path="establishments" element={<AdminEstablishments />} />
              <Route path="tests" element={<AdminTests />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="support" element={<AdminSupport />} />
              
              {/* Compliance Group */}
              <Route path="gdpr" element={<AdminDataRequests />} />
              <Route path="compliance" element={<AdminCompliance />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="legal-versions" element={<AdminLegalVersions />} />
              <Route path="docs" element={<AdminGdprDocs />} />
              
              <Route path="settings" element={<AdminSettings />} />
              
              {/* Catch all redirect to dashboard */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;