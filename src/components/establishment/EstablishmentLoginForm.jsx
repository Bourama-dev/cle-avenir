import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { validateEstablishmentForm } from '@/utils/establishmentValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Building, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentLoginForm = () => {
  const { login } = useEstablishmentAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Check local validation (now without domain restrictions)
    const validation = validateEstablishmentForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/establishment/dashboard');
      } else {
        // Error toast handled by context
      }
    } catch (error) {
      console.error("Login form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Connexion Établissement
        </h1>
        <p className="text-sm text-slate-500">
          Entrez vos identifiants pour accéder au portail
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email de connexion</Label>
          <Input
            id="email"
            name="email"
            type="email"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
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
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
          <div className="flex justify-end">
             <Link
              to="/establishment/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>

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