import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Save, UserPlus } from 'lucide-react';

const TestAuthFlow = ({ onSaveGuest }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null;

  if (user) {
    return (
      <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm mt-8">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-indigo-900 text-lg">Vos résultats sont sauvegardés !</h3>
            <p className="text-indigo-700 text-sm">Découvrez votre plan d'action détaillé.</p>
          </div>
          <Button onClick={() => navigate('/personalized-plan')} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
            Voir mon Plan Personnalisé <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 mt-8">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" /> Sauvegardez vos résultats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-slate-600 mb-6">
          Créez un compte gratuitement pour conserver vos résultats, accéder à votre plan personnalisé et suivre votre évolution.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/signup', { state: { from: location.pathname } })} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="w-4 h-4 mr-2" /> Créer un compte
          </Button>
          <Button onClick={() => navigate('/login', { state: { from: location.pathname } })} variant="outline" className="flex-1">
            Se connecter
          </Button>
          {onSaveGuest && (
            <Button onClick={onSaveGuest} variant="ghost" className="flex-1 text-slate-500 hover:text-slate-700">
              <Save className="w-4 h-4 mr-2" /> Continuer sans compte
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAuthFlow;