import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSafeToast } from '@/hooks/useSafeToast';

const EstablishmentAuthContext = createContext(undefined);

// Establishment staff are regular Supabase Auth users (auth.users), linked to
// an establishment via establishment_users (role admin/teacher). Login here
// creates a real session — the same one useAuth()/SupabaseAuthContext sees —
// instead of the old localStorage session that never produced a JWT and so
// could never satisfy any RLS policy.
export const EstablishmentAuthProvider = ({ children }) => {
  const { toast } = useSafeToast();
  const [establishment, setEstablishment] = useState(null);
  const [staffRole, setStaffRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadStaffContext = useCallback(async (userId) => {
    try {
      const { data: link, error: linkError } = await supabase
        .from('establishment_users')
        .select('establishment_id, role, status')
        .eq('user_id', userId)
        .in('role', ['admin', 'teacher'])
        .eq('status', 'active')
        .maybeSingle();

      if (linkError || !link) {
        setEstablishment(null);
        setStaffRole(null);
        setIsAuthenticated(false);
        return false;
      }

      const { data: est, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .eq('id', link.establishment_id)
        .maybeSingle();

      if (estError || !est) {
        setEstablishment(null);
        setStaffRole(null);
        setIsAuthenticated(false);
        return false;
      }

      setEstablishment(est);
      setStaffRole(link.role);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      console.error('Error loading establishment staff context', e);
      setEstablishment(null);
      setStaffRole(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        setEstablishment(null);
        setStaffRole(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        await loadStaffContext(session.user.id);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadStaffContext]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const ok = await loadStaffContext(data.user.id);
      if (!ok) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'est pas rattaché à un établissement actif.");
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace établissement",
      });
      return { success: true };
    } catch (error) {
      console.error("Establishment login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message === 'Invalid login credentials'
          ? "Email ou mot de passe incorrect."
          : (error.message || "Une erreur est survenue"),
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, loadStaffContext]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setEstablishment(null);
    setStaffRole(null);
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  }, [toast]);

  const value = useMemo(() => ({
    establishment,
    staffRole,
    loading,
    isAuthenticated,
    login,
    logout
  }), [establishment, staffRole, loading, isAuthenticated, login, logout]);

  return (
    <EstablishmentAuthContext.Provider value={value}>
      {children}
    </EstablishmentAuthContext.Provider>
  );
};

export const useEstablishmentAuth = () => {
  const context = useContext(EstablishmentAuthContext);
  if (context === undefined) {
    throw new Error('useEstablishmentAuth must be used within an EstablishmentAuthProvider');
  }
  return context;
};
