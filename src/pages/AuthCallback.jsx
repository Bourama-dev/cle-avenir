import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventLogger } from '@/services/eventLoggerService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * AuthCallback Component
 *
 * With detectSessionInUrl: true + flowType: 'pkce' in the Supabase client,
 * Supabase auto-exchanges the OAuth code on init and fires SIGNED_IN before
 * this component even mounts. We therefore rely on the auth context (which
 * has already processed the session) instead of calling exchangeCodeForSession
 * manually — that would fail with "code already used".
 *
 * Flow:
 * 1. App.jsx shows <LoadingFallback> while authLoading is true
 * 2. Once authLoading is false, AuthCallback mounts and the effect runs
 * 3. If the user is a new Google user (no region in profile) → /signup?google=true
 * 4. Otherwise → /dashboard
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState(null);
  const [processed, setProcessed] = useState(false);

  // If auth finished loading but there's still no user after a short grace period,
  // show a real error. This handles genuinely invalid / expired links while avoiding
  // a false "invalid link" message when the SIGNED_IN event arrives slightly after
  // authLoading flips to false (PKCE timing race).
  useEffect(() => {
    if (authLoading || user || error) return;
    const timer = setTimeout(() => {
      setError("Lien de validation invalide ou expiré.");
    }, 4000);
    return () => clearTimeout(timer);
  }, [authLoading, user, error]);

  useEffect(() => {
    // Wait for auth to settle AND for a user to be available before proceeding.
    if (authLoading || processed || !user) return;
    setProcessed(true);

    const redirect = async () => {
      try {
        const isGoogleUser =
          user.app_metadata?.provider === 'google' ||
          user.app_metadata?.providers?.includes('google');

        if (isGoogleUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('region')
            .eq('id', user.id)
            .maybeSingle();

          if (!profile?.region) {
            navigate('/signup?google=true', { replace: true });
            return;
          }
        }

        EventLogger.logEvent('auth_callback', user.id);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err.message || "Erreur lors de la validation.");
      }
    };

    redirect();
  }, [authLoading, user, navigate, processed]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Erreur de validation</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')} variant="outline">
              Retour à la connexion
            </Button>
            <Button onClick={() => navigate('/signup')}>
              S'inscrire à nouveau
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <h2 className="text-lg font-medium text-slate-700">Validation de votre compte...</h2>
      <p className="text-slate-500">Veuillez patienter un instant.</p>
    </div>
  );
};

export default AuthCallback;
