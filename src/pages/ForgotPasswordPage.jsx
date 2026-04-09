import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordSEO = categoryPageSEO({
    title: "Mot de passe oublié - CléAvenir",
    description: "Réinitialisez votre mot de passe CléAvenir en quelques étapes simples.",
    keywords: "mot de passe oublié, réinitialisation, compte",
    category: "Sécurité",
    categoryPath: "/forgot-password"
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <PageHelmet {...forgotPasswordSEO} />
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
          <CardDescription className="text-center">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-slate-600">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec les instructions.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                Ressayer avec une autre adresse
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;