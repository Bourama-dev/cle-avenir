import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { EstablishmentProvider } from '@/contexts/EstablishmentContext';
import EstablishmentSidebar from '@/components/establishment/EstablishmentSidebar';
import { Loader2 } from 'lucide-react';

const EstablishmentProtectedRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const [establishmentId, setEstablishmentId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        // Find if user is linked to an establishment
        // Prioritize admin/teacher roles
        const { data, error } = await supabase
          .from('establishment_users')
          .select('establishment_id')
          .eq('user_id', user.id)
          .in('role', ['admin', 'teacher', 'viewer'])
          .limit(1)
          .single();

        if (data) {
          setEstablishmentId(data.establishment_id);
        }
      } catch (err) {
        console.error("Access check failed", err);
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkAccess();
    }
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!establishmentId) {
    // Not authorized for any establishment
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <EstablishmentProvider establishmentId={establishmentId}>
      <div className="flex min-h-screen bg-slate-50">
         <EstablishmentSidebar />
         <main className="flex-1 lg:pl-72 transition-all duration-300">
            <Outlet />
         </main>
      </div>
    </EstablishmentProvider>
  );
};

export default EstablishmentProtectedRoute;