import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AuthTabs from '@/components/auth/AuthTabs';
import LoginForm from '@/components/auth/LoginForm';
import EnhancedSignupForm from '@/components/signup/EnhancedSignupForm';
import AuthLayout from '@/components/auth/AuthLayout';
import SEOHead from '@/components/SEOHead';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Get return path from location state if available, default to dashboard
  const from = location.state?.from || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'signup' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/auth?tab=${value}`, { replace: true });
  };

  if (authLoading) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={activeTab === 'login' ? 'Connexion - CléAvenir' : 'Inscription - CléAvenir'} 
        description="Connectez-vous ou créez un compte pour accéder à votre espace personnel CléAvenir."
      />
      <AuthLayout 
        title={activeTab === 'login' ? 'Bon retour parmi nous !' : 'Créer un compte'}
        subtitle={activeTab === 'login' ? 'Connectez-vous pour accéder à votre espace.' : 'Rejoignez-nous pour construire votre avenir.'}
      >
        {activeTab === 'login' ? (
           <>
              <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
              <div className="mt-6">
                 <LoginForm />
              </div>
           </>
        ) : (
           <div className="mt-2">
              <div className="text-center mb-6">
                  <button 
                    onClick={() => handleTabChange('login')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Déjà un compte ? Se connecter
                  </button>
              </div>
              <EnhancedSignupForm />
           </div>
        )}
      </AuthLayout>
    </>
  );
};

export default AuthPage;