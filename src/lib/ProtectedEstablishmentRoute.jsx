import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedEstablishmentRoute = () => {
  const { isAuthenticated, loading } = useEstablishmentAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/establishment/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedEstablishmentRoute;