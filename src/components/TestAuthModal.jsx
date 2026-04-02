import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertCircle, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import './TestAuthModal.css';

const TestAuthModal = ({ isOpen, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup for new test takers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors on typing
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    if (!isLogin && !formData.fullName) {
      setError("Le nom complet est requis pour l'inscription.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (signInError) throw signInError;

        setSuccessMessage("Connexion réussie ! Redirection...");
        setTimeout(() => onAuthSuccess(data.user), 1000);

      } else {
        // SIGNUP LOGIC
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.fullName.split(' ')[0],
              last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
              role: 'user'
            }
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Explicitly insert/upsert profile to ensure it exists immediately
          // Although trigger might handle it, doing it here ensures data consistency for immediate use
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: formData.email,
              first_name: formData.fullName.split(' ')[0],
              last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
              role: 'user',
              subscription_tier: 'decouverte',
              subscription_status: 'active',
              updated_at: new Date().toISOString()
            });

          if (profileError) console.error("Profile creation warning:", profileError);

          setSuccessMessage("Compte créé avec succès ! Sauvegarde de vos résultats...");
          setTimeout(() => onAuthSuccess(authData.user), 1500);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      let msg = "Une erreur est survenue.";
      if (err.message.includes("Invalid login credentials")) msg = "Email ou mot de passe incorrect.";
      if (err.message.includes("User already registered")) msg = "Cet email est déjà utilisé.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-auth-overlay">
      <div className="test-auth-card">
        <div className="test-auth-header">
          <h2>{isLogin ? 'Bon retour !' : 'Sauvegardez vos résultats'}</h2>
          <p>
            {isLogin 
              ? 'Connectez-vous pour accéder à votre profil.' 
              : 'Créez un compte gratuit pour voir votre analyse détaillée et conserver vos résultats.'}
          </p>
        </div>

        {error && (
          <div className="auth-error-message">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-success-message">
            <CheckCircle2 size={20} className="inline-block mr-2" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-form-group">
              <label className="auth-label">Nom complet</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  className="auth-input pl-10"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email professionnel ou personnel</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                className="auth-input pl-10"
                placeholder="jean@exemple.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                className="auth-input pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {!isLogin && (
              <p className="auth-password-hint">
                <Lock size={12} /> Minimum 6 caractères
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" /> Traitement...
              </span>
            ) : (
              isLogin ? 'Se connecter' : 'Voir mes résultats'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button 
              className="btn-text-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMessage(null);
              }}
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestAuthModal;