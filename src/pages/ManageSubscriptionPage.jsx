import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';

const INCLUDED = [
  "Test d'orientation complet",
  'Analyse détaillée du profil',
  'Fiches métiers complètes & salaires',
  "Plan d'action personnalisé",
  'Coach IA (Cléo)',
  'Export PDF de vos résultats',
];

// CléAvenir is fully free — there is no subscription to manage.
const ManageSubscriptionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </Button>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="mx-auto bg-violet-100 p-4 rounded-full w-fit mb-4">
              <Sparkles className="h-8 w-8 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Votre compte est 100% gratuit</h1>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              CléAvenir ne propose aucun abonnement payant. Vous avez un accès complet et illimité
              à toutes les fonctionnalités, sans restriction.
            </p>
            <ul className="text-left inline-block space-y-2 mb-6">
              {INCLUDED.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;
