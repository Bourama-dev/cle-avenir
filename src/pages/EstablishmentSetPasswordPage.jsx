import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Building, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Landing page for both the staff invite link (create-establishment-staff
// edge function) and the forgot-password link (EstablishmentForgotPasswordPage).
// Supabase's client auto-exchanges the token in the URL into a real session
// on load (detectSessionInUrl: true) — this page just captures the new
// password with supabase.auth.updateUser().
const EstablishmentSetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate('/establishment/dashboard'), 1500);
    } catch (err) {
      console.error('[EstablishmentSetPassword] update error:', err);
      setError(err.message || "Le lien n'est plus valide, demandez-en un nouveau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Définir votre mot de passe | Espace Établissement</title>
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
              <h2 className="text-xl font-semibold">Mot de passe défini !</h2>
              <p className="text-slate-500 text-sm">Redirection vers votre espace établissement...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Définir votre mot de passe</h1>
                <p className="text-sm text-slate-500">
                  Choisissez le mot de passe de votre compte établissement.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="6 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider'}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default EstablishmentSetPasswordPage;
