import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, CheckCircle, XCircle } from 'lucide-react';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Exchange PKCE code for session (Supabase redirects with ?code= param)
  useEffect(() => {
    const exchangeCode = async () => {
      try {
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setSessionReady(true);
          return;
        }
        // No code — check if session already exists (implicit flow)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSessionReady(true);
        } else {
          throw new Error('Lien invalide ou expiré.');
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Lien invalide',
          description: err.message || 'Ce lien de réinitialisation est invalide ou a expiré.',
        });
        setTimeout(() => navigate('/forgot-password'), 3000);
      } finally {
        setVerifying(false);
      }
    };
    exchangeCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour.",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le mot de passe.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500">Vérification du lien...</p>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lien invalide ou expiré</h2>
          <p className="text-slate-600 mb-6">Redirection vers la page de réinitialisation...</p>
          <Button onClick={() => navigate('/forgot-password')}>Demander un nouveau lien</Button>
        </div>
      </div>
    );
  }

  const resetPasswordSEO = categoryPageSEO({
    title: "Réinitialisation du mot de passe - CléAvenir",
    description: "Réinitialisez votre mot de passe de manière sécurisée pour accéder à votre compte CléAvenir.",
    keywords: "réinitialisation mot de passe, sécurité, compte",
    category: "Sécurité",
    categoryPath: "/reset-password"
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <PageHelmet {...resetPasswordSEO} />
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-center">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Mot de passe mis à jour !</h3>
              <p className="text-slate-600">
                Vous allez être redirigé vers la page de connexion dans quelques instants...
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Se connecter maintenant
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Modifier le mot de passe
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;