import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('auth_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    localStorage.setItem('auth_email', formData.email);

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        // Error is already handled by toast in context, but we can show local error too
        setError("Identifiants incorrects. Veuillez réessayer.");
      } else if (data?.user) {
        // Success - redirection is handled by AuthPage or App.jsx via user state change
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          autoComplete="email"
        />
        
        <div className="space-y-1">
          <PasswordInput
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 h-10 text-white font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;