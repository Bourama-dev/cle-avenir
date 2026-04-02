import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import StorageManager from '@/lib/storage';
import { handleError } from '@/lib/errorHandler';

const PersistenceContext = createContext(null);

export const PersistenceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [testProgress, setTestProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize persistence on mount
  useEffect(() => {
    const initPersistence = async () => {
      try {
        // 1. Check local storage for test progress
        const savedProgress = StorageManager.getTestProgress();
        if (savedProgress) {
          setTestProgress(savedProgress);
        }

        // 2. Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          StorageManager.saveUserSession(session);
        } else {
          // Check if we have a saved session in local storage as backup/optimization
          const localSession = StorageManager.getUserSession();
          if (localSession?.user) {
            setUser(localSession.user);
          }
        }
      } catch (error) {
        handleError(error, 'PersistenceProvider Init');
      } finally {
        setIsLoading(false);
      }
    };

    initPersistence();

    // Listen for auth changes to sync state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          StorageManager.saveUserSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          StorageManager.clearUserSession();
          // Optional: decide if we want to clear test progress on logout
          // StorageManager.clearTestProgress(); 
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync test progress changes to storage
  const updateTestProgress = (newData) => {
    setTestProgress(newData);
    StorageManager.saveTestProgress(newData);
  };

  const clearTestProgress = () => {
    setTestProgress(null);
    StorageManager.clearTestProgress();
  };

  const value = {
    user,
    testProgress,
    isLoading,
    updateTestProgress,
    clearTestProgress
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
};

export const usePersistence = () => {
  const context = useContext(PersistenceContext);
  if (!context) {
    throw new Error('usePersistence must be used within a PersistenceProvider');
  }
  return context;
};

export default PersistenceContext;