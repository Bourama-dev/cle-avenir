import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Mot de passe trop court",
            description: "Le mot de passe doit contenir au moins 6 caractères."
        });
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour.",
      });
      
      setTimeout(() => {
          navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le mot de passe."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-slate-100">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            {success ? <CheckCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>
            Saisissez votre nouveau mot de passe pour sécuriser votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
             <div className="text-center space-y-4">
                 <p className="text-green-600 font-medium">Mot de passe modifié avec succès !</p>
                 <p className="text-sm text-slate-500">Vous allez être redirigé vers la page de connexion...</p>
             </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                <Input
                    type="password"
                    placeholder="Nouveau mot de passe (6 caractères min.)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="text-lg"
                />
                </div>
                <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Mise à jour...' : 'Confirmer le mot de passe'}
                </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;