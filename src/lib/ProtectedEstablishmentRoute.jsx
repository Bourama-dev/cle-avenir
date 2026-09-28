import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedEstablishmentRoute = ({ children }) => {
  const { isAuthenticated, loading, ensureAccess } = useEstablishmentAuth();
  const location = useLocation();

  useEffect(() => {
    ensureAccess();
  }, [ensureAccess]);

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
    return <Navigate to="/establishment/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedEstablishmentRoute;
