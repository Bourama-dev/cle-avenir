import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { validateEstablishmentForm } from '@/utils/establishmentValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Building, Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const EstablishmentLoginForm = () => {
  const { login, signUp, isAuthenticated, ensureAccess } = useEstablishmentAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/establishment/dashboard';

  // 'login' or 'signup' (first access with an authorized email)
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Already signed in with an authorized account (e.g. after the email link).
  useEffect(() => {
    ensureAccess();
  }, [ensureAccess]);

  useEffect(() => {
    if (isAuthenticated) navigate(destination, { replace: true });
  }, [isAuthenticated, navigate, destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const validation = validateEstablishmentForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const result = mode === 'login'
        ? await login(formData.email, formData.password)
        : await signUp(formData.email, formData.password);
      if (result.needsConfirmation) {
        setConfirmationSent(true);
      } else if (result.success) {
        navigate(destination, { replace: true });
      } else {
        setFormError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 text-center">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <MailCheck className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Vérifiez vos emails</h1>
        <p className="text-sm text-slate-500">
          Un lien de confirmation a été envoyé à <strong>{formData.email}</strong>.
          Cliquez dessus puis connectez-vous ici.
        </p>
        <Button variant="outline" onClick={() => { setConfirmationSent(false); setMode('login'); }}>
          Retour à la connexion
        </Button>
      </div>
    );
  }

  const isSignup = mode === 'signup';

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignup ? 'Première connexion' : 'Connexion Établissement'}
        </h1>
        <p className="text-sm text-slate-500">
          {isSignup
            ? "Choisissez un mot de passe pour l'email autorisé par votre établissement."
            : 'Connectez-vous avec votre email professionnel autorisé.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="contact@etablissement.fr"
            value={formData.email}
            onChange={handleChange}
            className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
          {!isSignup && (
            <div className="flex justify-end">
              <Link
                to="/establishment/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignup ? 'Création en cours...' : 'Connexion en cours...'}
            </>
          ) : (
            isSignup ? 'Créer mon accès' : 'Se connecter'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        {isSignup ? 'Déjà un accès ?' : 'Première connexion ?'}{' '}
        <button type="button" onClick={switchMode} className="font-medium text-blue-600 hover:underline">
          {isSignup ? 'Se connecter' : 'Créer mon accès'}
        </button>
      </p>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default EstablishmentLoginForm;
