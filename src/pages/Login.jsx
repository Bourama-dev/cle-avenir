import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { saveUserProfile } from '@/services/userProfile';
import { createUserProfile } from '@/services/adminAuth';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLoginSuccess = (userData) => {
    // Créer le profil avec rôle et permissions
    const userProfile = createUserProfile({
      id: userData.id,
      email: userData.email,
      first_name: userData.user_metadata?.first_name || '',
      last_name: userData.user_metadata?.last_name || '',
      // ... autres données
    });

    // Sauvegarder le profil
    saveUserProfile(userProfile);

    // Rediriger vers le dashboard approprié
    if (userProfile.isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';

    if (!formData.password) newErrors.password = 'Mot de passe requis';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const { data, error } = await signIn(formData.email, formData.password);
      setLoading(false);
      
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else if (data?.user) {
        toast({ title: "Connexion réussie", description: "Bienvenue sur CléAvenir !" });
        handleLoginSuccess(data.user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Bienvenue sur CléAvenir
          </h1>
          <p className="text-lg text-slate-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100 animate-slideUp">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📧 Adresse email
              </label>
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🔐 Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Pas encore de compte ?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}