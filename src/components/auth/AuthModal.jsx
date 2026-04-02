import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AuthModal = ({ isOpen, onClose, onSuccess, defaultMode = 'signup' }) => {
  const [mode, setMode] = useState(defaultMode); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(email, password, { data: { role: 'individual' } });
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        setError(result.error.message);
      } else if (result.data?.user) {
        if (onSuccess) onSuccess(result.data.user);
        onClose();
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {mode === 'signup' ? 'Créer votre compte' : 'Bon retour !'}
              </h2>
              <p className="text-slate-500 mt-2">
                {mode === 'signup' 
                  ? 'Pour sauvegarder vos résultats et accéder à votre plan.' 
                  : 'Connectez-vous pour accéder à votre profil.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                     <Input 
                        type="email" 
                        required
                        className="pl-9" 
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                     <Input 
                        type="password" 
                        required
                        className="pl-9" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               {error && (
                 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                 </div>
               )}

               <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg" disabled={loading}>
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                   <>
                     {mode === 'signup' ? "S'inscrire gratuitement" : "Se connecter"} 
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </>
                 )}
               </Button>
            </form>

            <div className="mt-6 text-center text-sm">
               {mode === 'signup' ? (
                 <p className="text-slate-500">
                   Déjà un compte ?{' '}
                   <button onClick={() => setMode('signin')} className="text-blue-600 font-bold hover:underline">
                     Se connecter
                   </button>
                 </p>
               ) : (
                 <p className="text-slate-500">
                   Pas encore de compte ?{' '}
                   <button onClick={() => setMode('signup')} className="text-blue-600 font-bold hover:underline">
                     Créer un compte
                   </button>
                 </p>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;