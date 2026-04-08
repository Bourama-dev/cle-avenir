import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Only trigger toast if loading is done, user exists, but is NOT admin
    if (!loading && user && !isAdmin) {
      setAccessDenied(true);
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Cette section est réservée aux administrateurs.",
      });
    }
  }, [loading, user, isAdmin, toast]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. Not Logged In -> Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Logged In BUT Access Denied (Not Admin)
  if (accessDenied || !isAdmin) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
         <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
               <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Accès Administrateur Requis</h2>
               <p className="text-slate-600 mt-2">
                 Votre compte ne dispose pas des permissions nécessaires pour accéder à cette page.
               </p>
            </div>
            <div className="pt-2">
               <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
                  Retour au tableau de bord
               </Button>
            </div>
         </div>
       </div>
     );
  }

  // 3. Admin -> Access Granted
  // Return children if provided (wrapper mode), otherwise Outlet (layout mode)
  return children || <Outlet />;
};

export default AdminRoute;