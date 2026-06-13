import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSafeToast } from '@/hooks/useSafeToast';
import { PLAN_TYPES } from '@/lib/subscriptionUtils';
import { AuthService } from '@/services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useSafeToast();

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [subscriptionTier, setSubscriptionTier] = useState(PLAN_TYPES.FREE);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Helpers ---

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[AuthContext] Error fetching profile:', error);
      return null;
    }
  };

  const fetchSubscriptionData = async (userId, profileData = null) => {
    try {
      // 1. Try to get active subscription from user_subscriptions
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // 2. Fallback to profile data if no subscription record
      let effectiveTier = PLAN_TYPES.FREE;
      let effectivePlanObject = null;

      if (subData) {
        effectiveTier = subData.plan_type || PLAN_TYPES.FREE;
        effectivePlanObject = subData;
      } else if (profileData?.subscription_tier) {
        effectiveTier = profileData.subscription_tier;
        effectivePlanObject = {
          plan_type: effectiveTier,
          status: 'active_legacy',
          source: 'profile'
        };
      }

      return {
        tier: effectiveTier,
        plan: effectivePlanObject
      };
    } catch (err) {
      console.error('[AuthContext] Error in fetchSubscriptionData:', err);
      return { tier: PLAN_TYPES.FREE, plan: null };
    }
  };

  // --- Session Management ---

  const handleSession = useCallback(async (currentSession) => {
    try {
      if (!currentSession?.user) {
        // Clear state if no session
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setSubscriptionPlan(null);
        setSubscriptionTier(PLAN_TYPES.FREE);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      // Fetch profile and subscription in parallel — independent DB queries
      let [profile, subResult] = await Promise.all([
        fetchUserProfile(currentSession.user.id),
        fetchSubscriptionData(currentSession.user.id)
      ]);

      // New Google/OAuth user — no profile row yet: create it
      const isGoogle = currentSession.user.app_metadata?.provider === 'google' ||
        currentSession.user.app_metadata?.providers?.includes('google');
      if (!profile && isGoogle) {
        const meta = currentSession.user.user_metadata || {};
        const nameParts = (meta.full_name || '').split(' ');
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: currentSession.user.id,
          email: currentSession.user.email,
          first_name: meta.given_name || nameParts[0] || '',
          last_name: meta.family_name || nameParts.slice(1).join(' ') || '',
          avatar_url: meta.avatar_url || null,
          role: 'user',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        if (upsertError) {
          console.error('[AuthContext] Google profile creation failed:', upsertError);
          // FK violation (23503) means the session references a user that no
          // longer exists in auth.users — purge it so the user can log in fresh.
          if (upsertError.code === '23503') {
            // Do NOT call supabase.auth.signOut() here — it would wipe the
            // PKCE code_verifier from localStorage, breaking exchangeCodeForSession
            // if this INITIAL_SESSION fired while a fresh OAuth code is in the URL.
            // Just reset React state; the stale session will be overwritten when
            // the code exchange fires SIGNED_IN.
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setSubscriptionPlan(null);
            setSubscriptionTier(PLAN_TYPES.FREE);
            setLoading(false);
            return;
          }
        } else {
          profile = await fetchUserProfile(currentSession.user.id);
        }
      }

      // Default profile structure if missing (non-Google fallback)
      const effectiveProfile = profile || {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.user_metadata?.role || 'user'
      };

      setUserProfile(effectiveProfile);

      // Apply profile-based subscription fallback if no subscription record found
      let { tier, plan } = subResult;
      if (!plan && effectiveProfile?.subscription_tier) {
        tier = effectiveProfile.subscription_tier;
        plan = { plan_type: tier, status: 'active_legacy', source: 'profile' };
      }

      setSubscriptionTier(tier);
      setSubscriptionPlan(plan);

    } catch (error) {
      console.error("[AuthContext] Session handling error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Effects ---

  useEffect(() => {
    let mounted = true;

    // Safety valve: never stay stuck in loading forever
    const safetyTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 15000);

    // Single source of truth — onAuthStateChange fires INITIAL_SESSION on mount,
    // so we do NOT call getSession() separately (would cause double handleSession).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        clearTimeout(safetyTimer);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          await handleSession(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  // --- Public Methods ---

  const refreshSubscription = async () => {
    if (!user) return;
    setLoading(true);
    const profile = await fetchUserProfile(user.id);
    if (profile) setUserProfile(profile);
    
    const { tier, plan } = await fetchSubscriptionData(user.id, profile);
    setSubscriptionTier(tier);
    setSubscriptionPlan(plan);
    setLoading(false);
    return tier;
  };

  const signUp = async (email, password, options) => {
    const result = await AuthService.signUp(email, password, options);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: result.error.message,
      });
    }
    return result;
  };

  const signIn = async (email, password) => {
    console.log('[AuthContext] Signing in...');
    const result = await AuthService.login(email, password);
    
    if (result.error) {
      console.error('[AuthContext] Sign in error:', result.error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: result.error.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect." 
          : result.error.message,
      });
    } else {
      console.log('[AuthContext] Sign in success.');
      // Fire handleSession but do NOT await — onAuthStateChange will handle it.
      // Awaiting here can cause errors (profile/subscription fetch) to bubble up
      // as a login failure even though auth succeeded.
      if (result.data?.session) {
        handleSession(result.data.session).catch(err =>
          console.warn('[AuthContext] handleSession post-login error (non-blocking):', err)
        );
      }

      toast({
        title: "Connexion réussie",
        description: "Ravi de vous revoir !",
        className: "bg-green-50 border-green-200 text-green-900",
      });
    }
    return result;
  };

  const signOut = async () => {
    await AuthService.logout();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  // --- Derived State ---
  const isAdmin = useMemo(() => userProfile?.role === 'admin', [userProfile]);
  const isInstitutionManager = useMemo(() => userProfile?.role === 'institution_manager', [userProfile]);
  const isEmailVerified = useMemo(() => user?.email_confirmed_at != null, [user]);

  const value = useMemo(() => ({
    user,
    userProfile,
    subscriptionPlan,
    subscriptionTier,
    session,
    loading,
    isAdmin,
    isInstitutionManager,
    isEmailVerified,
    signUp,
    signIn,
    signOut,
    refreshSubscription
  }), [user, userProfile, subscriptionPlan, subscriptionTier, session, loading, isAdmin, isInstitutionManager, isEmailVerified, signIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};