import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSafeToast } from '@/hooks/useSafeToast';

const EstablishmentAuthContext = createContext(undefined);

export const EstablishmentAuthProvider = ({ children }) => {
  const { toast } = useSafeToast();
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedEst = localStorage.getItem('establishment_session');
        if (storedEst) {
          const parsedEst = JSON.parse(storedEst);
          setEstablishment(parsedEst);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Error restoring establishment session", e);
        localStorage.removeItem('establishment_session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('verify_establishment_credentials', {
        email_input: email,
        password_input: password
      });

      if (error) throw error;

      if (data && data.success) {
        const estData = data.establishment;
        setEstablishment(estData);
        setIsAuthenticated(true);
        localStorage.setItem('establishment_session', JSON.stringify(estData));
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${estData.name}`,
        });
        return { success: true, data: estData };
      } else {
        throw new Error(data?.message || 'Identifiants invalides');
      }
    } catch (error) {
      console.error("Establishment login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    setEstablishment(null);
    setIsAuthenticated(false);
    localStorage.removeItem('establishment_session');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  }, [toast]);

  const value = useMemo(() => ({
    establishment,
    loading,
    isAuthenticated,
    login,
    logout
  }), [establishment, loading, isAuthenticated, login, logout]);

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