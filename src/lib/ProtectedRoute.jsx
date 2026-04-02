import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [], requiredRole = null }) => {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  // 1. Loading State - Don't redirect while verifying session
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 font-medium">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // 2. Auth Check - Redirect to login if not authenticated
  if (!user) {
    // Save current location to redirect back after login
    // We redirect to /login to ensure the user lands on the explicit login page
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 3. Admin Requirement Check
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Role List Check (if specific roles provided)
  if (allowedRoles.length > 0) {
     const currentRole = userProfile?.role || 'user';
     // Admins generally have access to everything unless specifically excluded
     const hasAccess = allowedRoles.includes(currentRole) || isAdmin;

     if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
     }
  }

  // 5. Authorized - Render content
  return children;
};

export default ProtectedRoute;