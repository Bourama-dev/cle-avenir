import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AuthService } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await AuthService.login(formData.email, formData.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect."
      });
      return;
    }

    toast({ title: "Connexion réussie", description: "Heureux de vous revoir !" });
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await AuthService.signInWithGoogle();
      // Supabase redirect takes over — page navigates away
    } catch (error) {
      setIsGoogleLoading(false);
      toast({
        variant: "destructive",
        title: "Erreur Google",
        description: error.message || "Impossible de se connecter avec Google."
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">

      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          CléAvenir
        </h1>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900">Connexion</CardTitle>
          <CardDescription className="text-slate-500">
            Connectez-vous pour accéder à vos résultats et recommandations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-5"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading
              ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              : <GoogleIcon />
            }
            Continuer avec Google
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">ou</span>
            </div>
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="jean@exemple.com"
                className="bg-white text-slate-900 border-slate-300"
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white text-slate-900 border-slate-300"
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2 py-5 text-base"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Créer un compte gratuitement
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
