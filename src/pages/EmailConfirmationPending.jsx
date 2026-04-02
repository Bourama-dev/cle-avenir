import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { EventLogger } from '@/services/eventLoggerService';

/**
 * EmailConfirmationPending Page
 * 
 * Displays checking status for email verification.
 * Automatically polls for verification status changes.
 * Provides "Resend Email" functionality.
 */
const EmailConfirmationPending = () => {
  const navigate = useNavigate();
  const { user, isEmailVerified, signOut, resendConfirmationEmail } = useAuth();
  const { toast } = useToast();
  
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds cooldown
  const [isPolling, setIsPolling] = useState(true);

  // Auto-redirect if verified
  useEffect(() => {
    if (isEmailVerified) {
      toast({
        title: "Email confirmé !",
        description: "Votre compte est activé. Redirection vers le tableau de bord...",
      });
      navigate('/dashboard');
    }
  }, [isEmailVerified, navigate, toast]);

  // Poll for status updates
  useEffect(() => {
    let interval;
    if (user && !isEmailVerified) {
      interval = setInterval(async () => {
        // Reload user data to check if email_confirmed_at has updated
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        if (updatedUser?.email_confirmed_at) {
          // Force page reload or navigation to sync context if needed, 
          // though context listener usually handles it.
          window.location.reload(); 
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [user, isEmailVerified]);

  // Redirect to login if not authenticated
  useEffect(() => {
    // Give it a moment to load user from context
    const timeout = setTimeout(() => {
        if (!user) {
           navigate('/login');
        }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [user, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!user?.email) return;
    
    setCanResend(false);
    const { error } = await resendConfirmationEmail(user.email);
    
    if (!error) {
       setCountdown(120); // Reset to 2 minutes after successful resend
    } else {
       setCanResend(true); // Allow immediate retry if it failed locally
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg border-slate-200">
        <CardHeader>
          <div className="mx-auto bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 relative">
            <Mail className="h-10 w-10 text-blue-600" />
            {isPolling && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                 <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Vérifiez votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            Un lien de confirmation a été envoyé à :
          </p>
          <div className="bg-slate-100 py-3 px-4 rounded-md font-mono text-slate-800 break-all border border-slate-200">
            {user?.email || 'Chargement...'}
          </div>
          <p className="text-sm text-slate-500">
            Cliquez sur le lien dans l'email pour activer votre compte. 
            Une fois confirmé, cette page se mettra à jour automatiquement.
          </p>
          
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 mt-4">
             ⚠️ Pensez à vérifier votre dossier <strong>Spams</strong> ou <strong>Courrier indésirable</strong>.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            onClick={handleResend} 
            disabled={!canResend}
            className="w-full"
          >
            {canResend ? "Renvoyer l'email" : `Renvoyer dans ${formatTime(countdown)}`}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="text-slate-500 hover:text-slate-700 text-sm gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Se déconnecter / Changer d'email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmationPending;