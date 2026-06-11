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
 * detectSessionInUrl is now FALSE in the Supabase client so the client no longer
 * blocks on the PKCE exchange at initialisation time (which caused the infinite
 * loading screen). We handle the exchange ourselves here with a hard timeout.
 *
 * Flow:
 * 1. Component mounts immediately (auth context resolves in milliseconds from localStorage).
 * 2. If there is a ?code= in the URL we exchange it manually (10s timeout).
 * 3. On success, SIGNED_IN fires → auth context sets user.
 * 4. Once exchange is done AND user is available → redirect.
 */

const EXCHANGE_TIMEOUT_MS = 10000;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState(null);
  const [exchangeDone, setExchangeDone] = useState(false);
  const [redirectDone, setRedirectDone] = useState(false);

  // Step 1 — Exchange the PKCE code once on mount.
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (!code) {
      // No code to exchange (e.g. already cleaned after a previous exchange).
      setExchangeDone(true);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setError('La connexion avec Google a pris trop de temps. Veuillez réessayer.');
      }
    }, EXCHANGE_TIMEOUT_MS);

    supabase.auth.exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (cancelled) return;
        clearTimeout(timeout);
        if (exchangeError) {
          // "code verifier" missing means the code was already exchanged (hard reload).
          // The session should still be in localStorage — proceed and let Step 2 handle it.
          console.warn('[AuthCallback] Code exchange warning (may be a hard reload):', exchangeError.message);
        }
        // Clean the code from the URL so a page refresh won't trigger a second attempt.
        window.history.replaceState({}, document.title, url.pathname);
        setExchangeDone(true);
      })
      .catch((err) => {
        if (cancelled) return;
        clearTimeout(timeout);
        console.error('[AuthCallback] Exchange error:', err);
        window.history.replaceState({}, document.title, url.pathname);
        setExchangeDone(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2 — Once exchange is done and auth context has settled, redirect.
  useEffect(() => {
    if (!exchangeDone || authLoading || redirectDone || error) return;

    if (!user) {
      setError('Lien de connexion invalide ou expiré. Veuillez recommencer.');
      return;
    }

    setRedirectDone(true);

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
        console.error('[AuthCallback] Redirect error:', err);
        setRedirectDone(false);
        setError(err.message || 'Erreur lors de la validation.');
      }
    };

    redirect();
  }, [exchangeDone, authLoading, user, navigate, redirectDone, error]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Erreur de connexion</h2>
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
