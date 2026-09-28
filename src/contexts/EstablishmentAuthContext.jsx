import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSafeToast } from '@/hooks/useSafeToast';

const EstablishmentAuthContext = createContext(undefined);

// Staff members sign in with a regular CléAvenir account. Access to an
// establishment is granted server-side: the account email must be listed in
// the establishment's authorized emails (see claim_establishment_access).
const ACCESS_ERRORS = {
  not_authorized: "Ce compte n'est pas autorisé à accéder à un espace établissement. Demandez à votre établissement ou à CléAvenir d'ajouter votre email.",
  email_not_confirmed: 'Confirmez votre adresse email (lien reçu par email) avant de vous connecter.',
  establishment_paused: "L'accès de votre établissement est suspendu. Contactez CléAvenir.",
  not_authenticated: 'Session expirée, reconnectez-vous.',
};

const AUTH_ERRORS = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'Email not confirmed': ACCESS_ERRORS.email_not_confirmed,
  'User already registered': 'Un compte existe déjà avec cet email : connectez-vous.',
};

const translate = (message) => AUTH_ERRORS[message] || message || 'Une erreur est survenue.';

async function claimAccess() {
  const { data, error } = await supabase.rpc('claim_establishment_access');
  if (error) throw error;
  return data;
}

export const EstablishmentAuthProvider = ({ children }) => {
  const { toast } = useSafeToast();
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  // Id of the account whose access was last checked; the check only runs on
  // establishment pages (ensureAccess), not for every visitor of the site.
  const checkedUserRef = useRef(undefined);

  const ensureAccess = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id ?? null;
    if (checkedUserRef.current === userId) {
      setLoading(false);
      return;
    }
    checkedUserRef.current = userId;
    if (!userId) {
      setEstablishment(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await claimAccess();
      setEstablishment(result?.success ? result.establishment : null);
    } catch (error) {
      console.error('Establishment access check failed:', error);
      setEstablishment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Old client-side session format: it was never verified, drop it.
    try { localStorage.removeItem('establishment_session'); } catch { /* storage unavailable */ }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Another account (or none): the next establishment page checks again.
      if ((session?.user?.id ?? null) !== checkedUserRef.current) {
        checkedUserRef.current = undefined;
        setEstablishment(null);
        setLoading(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { success: false, message: translate(error.message) };

    checkedUserRef.current = data.user.id;
    try {
      const result = await claimAccess();
      if (!result?.success) {
        // Keep the student side of the site signed out as well: the user came
        // here for the establishment space only.
        await supabase.auth.signOut();
        setEstablishment(null);
        return { success: false, message: ACCESS_ERRORS[result?.reason] || ACCESS_ERRORS.not_authorized };
      }
      setEstablishment(result.establishment);
      toast({ title: 'Connexion réussie', description: `Bienvenue, ${result.establishment.name}` });
      return { success: true, establishment: result.establishment };
    } catch (claimError) {
      console.error('Establishment access check failed:', claimError);
      return { success: false, message: 'Impossible de vérifier votre accès. Réessayez dans un instant.' };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/establishment/login` },
    });
    if (error) return { success: false, message: translate(error.message) };
    // With email confirmation enabled no session is returned yet.
    if (!data.session) return { success: true, needsConfirmation: true };
    return login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setEstablishment(null);
    toast({ title: 'Déconnexion', description: 'Vous avez été déconnecté avec succès' });
  }, [toast]);

  const value = useMemo(() => ({
    establishment,
    loading,
    isAuthenticated: Boolean(establishment),
    ensureAccess,
    login,
    signUp,
    logout,
  }), [establishment, loading, ensureAccess, login, signUp, logout]);

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
