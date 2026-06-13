import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventLogger } from '@/services/eventLoggerService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * AuthCallback — post-OAuth redirect handler.
 *
 * detectSessionInUrl: true in the Supabase client means the JS SDK exchanges
 * the PKCE code automatically during initialization, before INITIAL_SESSION
 * fires. By the time this component runs its effect, the auth context has
 * already processed the session (authLoading is false and user is set).
 *
 * We therefore do NOT call exchangeCodeForSession here — doing so would
 * either race with the SDK's own exchange or fail with "code already used".
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [redirected, setRedirected] = useState(false);
  const [error, setError] = useState(null);

  // Check for OAuth error params in the URL (e.g. ?error=access_denied)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const oauthDesc  = params.get('error_description');
    if (oauthError) {
      setError(oauthDesc?.replace(/\+/g, ' ') || "Connexion refusée. Veuillez réessayer.");
    }
  }, []);

  // Auto-redirect to login after 5 s if an error is displayed
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => navigate('/login', { replace: true }), 5000);
    return () => clearTimeout(t);
  }, [error, navigate]);

  useEffect(() => {
    if (authLoading || redirected) return;
    setRedirected(true);

    if (!user) {
      setError('La connexion a échoué ou le lien a expiré. Veuillez réessayer.');
      return;
    }

    const redirect = async () => {
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
    };

    redirect().catch((err) => {
      console.error('[AuthCallback] Redirect error:', err);
      setError(err.message || 'Erreur lors de la validation.');
    });
  }, [authLoading, user, navigate, redirected]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Erreur de connexion</h2>
          <p className="text-slate-600 mb-2">{error}</p>
          <p className="text-sm text-slate-400 mb-6">Redirection automatique dans 5 secondes…</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login', { replace: true })} variant="outline">
              Retour à la connexion
            </Button>
            <Button onClick={() => navigate('/signup', { replace: true })}>
              S'inscrire
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
