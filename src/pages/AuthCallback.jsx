import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventLogger } from '@/services/eventLoggerService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const EXCHANGE_TIMEOUT_MS = 10000;

/**
 * AuthCallback handles the PKCE code exchange manually because
 * detectSessionInUrl is set to false in the Supabase client (to avoid
 * the client blocking app init on a network request).
 *
 * Flow:
 * 1. Extract ?code from URL and call exchangeCodeForSession with a timeout.
 * 2. Once exchanged, onAuthStateChange fires SIGNED_IN → AuthContext sets user.
 * 3. Wait for authLoading to settle, then redirect based on profile completeness.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [exchangeDone, setExchangeDone] = useState(false);
  const [redirectDone, setRedirectDone] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: exchange the PKCE code
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (!code) {
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
          console.error('[AuthCallback] Exchange error:', exchangeError);
          // "code already used" means PKCE exchange already happened (e.g. strict
          // mode double-mount) — treat it as success so the redirect can proceed.
          if (!exchangeError.message?.includes('already')) {
            setError('Lien de connexion invalide ou expiré. Veuillez vous reconnecter.');
            return;
          }
        }
        // Remove the code from the URL without a full reload
        url.searchParams.delete('code');
        window.history.replaceState({}, document.title, url.pathname + (url.search || ''));
        setExchangeDone(true);
      })
      .catch((err) => {
        if (cancelled) return;
        clearTimeout(timeout);
        console.error('[AuthCallback] Exchange threw:', err);
        setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        setExchangeDone(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  // Step 2: redirect once exchange is done and auth context has settled
  useEffect(() => {
    if (!exchangeDone || authLoading || redirectDone || error) return;
    setRedirectDone(true);

    const redirect = async () => {
      try {
        if (!user) {
          throw new Error('Lien de connexion invalide ou expiré. Veuillez vous reconnecter.');
        }

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
      <h2 className="text-lg font-medium text-slate-700">Connexion en cours...</h2>
      <p className="text-slate-500">Veuillez patienter un instant.</p>
    </div>
  );
};

export default AuthCallback;
