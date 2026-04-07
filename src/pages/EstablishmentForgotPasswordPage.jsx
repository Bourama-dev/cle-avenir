import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Building, Loader2 } from 'lucide-react';
import { validateEmail } from '@/utils/establishmentValidation';
import { motion } from 'framer-motion';

const EstablishmentForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide du domaine ac-versailles.fr");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Mot de passe oublié | Espace Établissement</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
        >
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Email envoyé !</h2>
              <p className="text-slate-500 text-sm">
                Si un compte existe pour <strong>{email}</strong>, vous recevrez les instructions de réinitialisation dans quelques instants.
              </p>
              <Button asChild className="w-full mt-6">
                <Link to="/establishment/login">Retour à la connexion</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center mb-6">
                 <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                   <Building className="h-6 w-6 text-blue-600" />
                 </div>
                <h1 className="text-xl font-bold text-slate-900">Réinitialisation mot de passe</h1>
                <p className="text-sm text-slate-500">
                  Entrez votre email académique pour recevoir un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email académique</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ac-versailles.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={error ? "border-red-500" : ""}
                    disabled={loading}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/establishment/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default EstablishmentForgotPasswordPage;