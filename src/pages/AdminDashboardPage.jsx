import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * AdminDashboardPage
 * This page acts as a wrapper for the main AdminDashboard component.
 * It ensures that the component is rendered within the correct context and 
 * handles top-level routing concerns for the admin section.
 */
const AdminDashboardPage = ({ onNavigate }) => {
  const { user, isAdmin, loading } = useAuth();

  // Basic check here, though AdminRoute handles the robust protection
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // AdminDashboard component handles the internal layout and routing
  return <AdminDashboard onNavigate={onNavigate} />;
};

export default AdminDashboardPage;