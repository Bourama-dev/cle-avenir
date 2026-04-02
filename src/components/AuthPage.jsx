import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { isUserAdmin } from '@/services/userProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthPage = ({ initialTab = 'signin', onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // Handle successful login redirect
  useEffect(() => {
    if (user && !loading && !redirecting) {
      console.log('[AuthPage] Successful login detected:', {
        userId: user.id,
        role: userProfile?.role
      });

      setRedirecting(true);

      // Determine destination based on role
      let destination = location.state?.returnTo || '/dashboard';
      
      if (userProfile && isUserAdmin(userProfile)) {
        destination = '/admin/dashboard';
      } else if (userProfile && (userProfile.role === 'institution_admin' || userProfile.role === 'institution_employee')) {
        destination = '/institution-dashboard';
      }

      const timer = setTimeout(() => {
        handleNavigation(destination);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [user, userProfile, loading, navigate, location.state, redirecting]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      setAuthError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setAuthError(error.message || "Identifiants incorrects");
        setIsLoading(false);
        return;
      }
      
      if (!data?.user) {
        setAuthError("Erreur de connexion. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[AuthPage] Unexpected error:', error);
      setAuthError("Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password || !firstName || !lastName) {
      setAuthError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      setAuthError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const options = {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'individual',
        },
      };
      
      const { data, error } = await signUp(email, password, options);
      
      if (error) {
        setAuthError(error.message || "Erreur lors de l'inscription");
        setIsLoading(false);
        return;
      }
      
      if (data?.user) {
        toast({ 
          title: "Compte créé !", 
          description: "Bienvenue sur CléAvenir." 
        });
      }
    } catch (error) {
      console.error('[AuthPage] Unexpected error:', error);
      setAuthError("Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };

  if (redirecting || (user && !loading)) {
    const isAdmin = userProfile ? isUserAdmin(userProfile) : false;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
         <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
         >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Connexion réussie</h2>
            <p className="text-slate-600 mb-1">
              {isAdmin ? 'Accès administrateur confirmé' : 'Bienvenue !'}
            </p>
            <div className="flex items-center space-x-2 text-slate-500">
               <Loader2 className="h-4 w-4 animate-spin" />
               <span>Redirection en cours...</span>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 p-4 relative">
      
      {/* Back to Home Button */}
      <motion.button
        type="button"
        onClick={() => handleNavigation('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-purple-600 rounded-lg shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 group text-sm font-medium hover:scale-105"
        aria-label="Retour à l'accueil"
      >
        <span className="text-lg group-hover:scale-110 transition-transform duration-200">🏠</span>
        <span className="hidden sm:inline">Retour à l'accueil</span>
      </motion.button>
      
      <div className="w-full max-w-md pt-12 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <img 
               src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png" 
               alt="CléAvenir" 
               className="h-12 w-12 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CléAvenir</h1>
            <p className="text-slate-500 mt-2">Votre futur professionnel commence ici.</p>
          </div>

          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setAuthError(null); }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100/50 p-1">
                <TabsTrigger value="signin">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">Créer un compte</TabsTrigger>
              </TabsList>
              
              <div className="px-6 pb-6">
                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="votre@email.com" 
                          className="pl-9 bg-white" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Mot de passe</Label>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Oublié ?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          id="signin-password" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-9 pr-9 bg-white" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        <>
                          Se connecter
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignUp} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-firstname">Prénom</Label>
                          <Input 
                            id="signup-firstname" 
                            placeholder="Jean" 
                            className="bg-white" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-lastname">Nom</Label>
                          <Input 
                            id="signup-lastname" 
                            placeholder="Dupont" 
                            className="bg-white" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                     </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="votre@email.com" 
                          className="pl-9 bg-white" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          id="signup-password" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-9 pr-9 bg-white" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                      </div>
                      <p className="text-[10px] text-slate-500">8 caractères minimum</p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création du compte...
                        </>
                      ) : (
                        "S'inscrire gratuitement"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;