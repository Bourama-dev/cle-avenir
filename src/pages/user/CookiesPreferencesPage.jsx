import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, Info, Save, XCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cookieService } from '@/services/cookieService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CookiesPreferencesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    social: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      const prefs = await cookieService.getCookiePreferences(user?.id);
      setPreferences({ ...prefs, essential: true });
    };
    loadPrefs();
  }, [user]);

  const handleToggle = (key) => {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (prefsToSave) => {
    try {
      setLoading(true);
      await cookieService.saveCookiePreferences(user?.id, prefsToSave || preferences);
      toast({
        title: "Préférences sauvegardées",
        description: "Vos choix en matière de cookies ont été mis à jour.",
        className: "bg-green-50 text-green-900 border-green-200"
      });
      if (prefsToSave) setPreferences(prefsToSave);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-black text-slate-900">Préférences de Cookies</h1>
             <p className="text-slate-600 mt-2">Gérez vos paramètres de confidentialité et les cookies que nous utilisons.</p>
           </div>
           <img 
             src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/562266afc8be6330af6f7c1899eddd00.png" 
             alt="Cookies Management" 
             className="w-24 h-24 object-contain hidden sm:block mix-blend-multiply opacity-80"
           />
        </div>

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Essential */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-lg">Cookies strictement nécessaires</h3>
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ces cookies sont indispensables au fonctionnement du site web et ne peuvent pas être désactivés. 
                  Ils garantissent les fonctionnalités de base et la sécurité du site.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                Toujours actifs
              </div>
            </div>

            <Separator />

            {/* Analytics */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Cookies analytiques</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ils nous permettent de compter les visites et les sources de trafic afin de mesurer et d'améliorer 
                  les performances de notre site. Toutes les informations sont agrégées et anonymes.
                </p>
              </div>
              <Switch 
                checked={preferences.analytics} 
                onCheckedChange={() => handleToggle('analytics')} 
                className="data-[state=checked]:bg-indigo-600 shrink-0"
              />
            </div>

            <Separator />

            {/* Marketing */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Cookies publicitaires & Marketing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ces cookies peuvent être mis en place par nos partenaires publicitaires pour établir un profil 
                  de vos intérêts et vous proposer des annonces pertinentes sur d'autres sites.
                </p>
              </div>
              <Switch 
                checked={preferences.marketing} 
                onCheckedChange={() => handleToggle('marketing')} 
                className="data-[state=checked]:bg-indigo-600 shrink-0"
              />
            </div>

            <Separator />

            {/* Social */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Réseaux Sociaux</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Nous utilisons ces cookies pour vous permettre de partager du contenu sur les réseaux sociaux. 
                  Ils peuvent tracer votre navigation sur d'autres sites web.
                </p>
              </div>
              <Switch 
                checked={preferences.social} 
                onCheckedChange={() => handleToggle('social')} 
                className="data-[state=checked]:bg-indigo-600 shrink-0"
              />
            </div>

          </div>

          <div className="bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <div className="flex w-full sm:w-auto gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSave({ essential: true, analytics: false, marketing: false, social: false })}
                className="flex-1 sm:flex-none text-slate-600"
                disabled={loading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tout refuser
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSave({ essential: true, analytics: true, marketing: true, social: true })}
                className="flex-1 sm:flex-none text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                disabled={loading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tout accepter
              </Button>
            </div>
            
            <Button 
              onClick={() => handleSave()} 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-md"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer mes choix
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPreferencesPage;