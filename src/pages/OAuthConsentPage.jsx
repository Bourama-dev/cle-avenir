import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Loader2, ShieldCheck, User, Mail, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const SCOPES = [
  {
    icon: <Mail className="w-4 h-4 text-blue-500" />,
    label: 'Adresse email',
    description: 'Pour créer et identifier votre compte',
  },
  {
    icon: <User className="w-4 h-4 text-blue-500" />,
    label: 'Nom et prénom',
    description: 'Pour personnaliser votre expérience',
  },
  {
    icon: <ImageIcon className="w-4 h-4 text-blue-500" />,
    label: 'Photo de profil',
    description: 'Pour afficher votre avatar (optionnel)',
  },
];

const OAuthConsentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect_to') || '/dashboard';
  const provider = searchParams.get('provider') || 'google';

  const handleAuthorize = async () => {
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
      // Supabase OAuth redirect prend le relais — la page navigue automatiquement
    } catch (error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: error.message || 'Impossible de se connecter avec Google.',
      });
    }
  };

  const handleDeny = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          CléAvenir
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Votre orientation, votre avenir</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="pb-4 space-y-4">
          {/* Provider badge */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
              <GoogleIcon />
              <span className="text-sm font-semibold text-slate-700">Google</span>
            </div>
            <span className="text-slate-400 text-lg">→</span>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">CléAvenir</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              Autoriser l'accès
            </h2>
            <p className="text-sm text-slate-500">
              CléAvenir souhaite accéder aux informations suivantes de votre compte Google
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Scopes list */}
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden bg-white">
            {SCOPES.map((scope) => (
              <div key={scope.label} className="flex items-start gap-3 px-4 py-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  {scope.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{scope.label}</p>
                  <p className="text-xs text-slate-500">{scope.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RGPD notice */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Vos données sont protégées conformément au RGPD.{' '}
            <Link to="/privacy" className="text-indigo-500 hover:underline">
              Politique de confidentialité
            </Link>
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-5 text-base rounded-xl shadow"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span className="ml-2">
                {loading ? 'Redirection en cours…' : 'Autoriser avec Google'}
              </span>
            </Button>

            <Button
              onClick={handleDeny}
              variant="ghost"
              disabled={loading}
              className="w-full text-slate-500 hover:text-slate-700 font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              Annuler
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400 text-center">
            En autorisant, vous acceptez nos{' '}
            <Link to="/terms" className="text-indigo-500 hover:underline">
              Conditions d'utilisation
            </Link>
          </p>
        </CardFooter>
      </Card>

      <p className="mt-6 text-xs text-slate-400">
        Vous pouvez révoquer cet accès à tout moment dans vos{' '}
        <Link to="/settings" className="text-indigo-500 hover:underline">
          paramètres
        </Link>
      </p>
    </div>
  );
};

export default OAuthConsentPage;
