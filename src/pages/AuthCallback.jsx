import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventLogger } from '@/services/eventLoggerService';

/**
 * AuthCallback Component
 * 
 * Handles the redirect from Supabase email links.
 * Extracts the code from the URL and exchanges it for a session.
 * 
 * Routes to:
 * - /dashboard on success
 * - /login on error
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Method 1: Check for 'code' query param (PKCE flow)
        const code = searchParams.get('code');
        
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          
          if (data?.user) {
            EventLogger.logEvent('auth_email_confirmed', data.user.id);
            // Successful exchange
            navigate('/dashboard', { replace: true });
            return;
          }
        }
        
        // Method 2: Check for implicit flow (access_token in hash) - usually handled by supabase client automatically
        // However, we wait a moment to see if session is established by the listener in AuthContext
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
           navigate('/dashboard', { replace: true });
        } else if (!code) {
           // No code and no session found
           throw new Error("Lien de validation invalide ou expiré.");
        }

      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err.message || "Erreur lors de la validation.");
        EventLogger.logEvent('auth_callback_failed', null, null, { error: err.message });
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-medium text-slate-700">Validation de votre compte...</h2>
        <p className="text-slate-500">Veuillez patienter un instant.</p>
      </div>
    );
  }

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

  return null;
};

export default AuthCallback;