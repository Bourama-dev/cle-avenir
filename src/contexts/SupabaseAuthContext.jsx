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

      // Fetch additional data
      const profile = await fetchUserProfile(currentSession.user.id);
      
      // Default profile structure if missing
      const effectiveProfile = profile || {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.user_metadata?.role || 'user'
      };
      
      setUserProfile(effectiveProfile);

      const { tier, plan } = await fetchSubscriptionData(currentSession.user.id, effectiveProfile);
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

    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) await handleSession(initialSession);
      } catch (error) {
        console.error('[AuthContext] Init error:', error);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (event === 'SIGNED_OUT') {
             setUser(null);
             setSession(null);
             setUserProfile(null);
             setLoading(false);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
             await handleSession(session);
          }
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
      console.log('[AuthContext] Sign in success. Updating session state manually to ensure consistency.');
      if (result.data?.session) {
        await handleSession(result.data.session);
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