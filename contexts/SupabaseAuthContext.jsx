import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user profile data
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, []);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.id);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Wrap getSession in try/catch to handle "missing sub claim" and other JWT errors
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          await handleSession(session);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        
        // Critical: If token is malformed (missing sub claim), we MUST sign out to clear it
        if (error.message && (error.message.includes("jwt") || error.message.includes("claim") || error.message.includes("sub"))) {
           console.warn("Invalid token detected, clearing session to recover.");
           await supabase.auth.signOut();
           if (mounted) {
             setSession(null);
             setUser(null);
             setUserProfile(null);
             setLoading(false);
           }
        } else {
           // For other errors (network, etc), just stop loading
           if (mounted) setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setUserProfile(null);
            setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await handleSession(session);
        } else if (event === 'USER_UPDATED') {
            await handleSession(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    // Force clear state immediately
    setUser(null);
    setSession(null);
    setUserProfile(null);
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: async () => {
        if (user) {
            const profile = await fetchUserProfile(user.id);
            setUserProfile(profile);
        }
    }
  }), [user, session, userProfile, loading, signUp, signIn, signOut, fetchUserProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};