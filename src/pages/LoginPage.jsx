import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AuthService } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await AuthService.login(formData.email, formData.password);
    
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect."
      });
      return;
    }

    toast({
      title: "Connexion réussie",
      description: "Heureux de vous revoir !"
    });
    
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          CléAvenir
        </h1>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Connexion
          </CardTitle>
          <CardDescription className="text-slate-500">
            Connectez-vous pour accéder à vos résultats et recommandations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
                placeholder="jean@exemple.com"
                className="bg-white text-slate-900 border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                required
                className="bg-white text-slate-900 border-slate-300"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6 py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-600">
            Pas encore de compte ?
          </p>
          <Link 
            to="/signup"
            className="mt-2 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Créer un compte gratuitement
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;