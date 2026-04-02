import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
import React from 'react';

/**
 * Hook for robust admin navigation with permission checking and user feedback.
 */
export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const { isAdmin, user, loading } = useAuth();
  const { toast } = useToast();

  const navigateToAdmin = () => {
    // 1. Check if loading
    if (loading) {
       return;
    }

    // 2. Check if logged in
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentification requise",
        description: "Veuillez vous connecter pour accéder à cet espace.",
      });
      navigate('/auth?tab=login&returnTo=/admin/dashboard');
      return;
    }

    // 3. Check Admin Permissions
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits nécessaires pour accéder au portail administrateur.",
      });
      return;
    }

    // 4. Success - Navigate
    navigate('/admin/dashboard');
  };

  return { 
    navigateToAdmin, 
    isAdmin,
    isLoading: loading 
  };
};