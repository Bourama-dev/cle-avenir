import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import FeatureGate from '@/components/FeatureGate';
import { FEATURES, TIERS } from '@/constants/subscriptionTiers';
import { useNavigate } from 'react-router-dom';

const ActionPlanSection = ({ userProfile, match }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mon Plan d'Action</h2>
        <p className="text-slate-500">Les étapes pour réussir votre reconversion</p>
      </div>

      {/* Free / Basic Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-1" />
            <div>
              <p className="font-medium text-slate-900">1. Définir le projet</p>
              <p className="text-sm text-slate-500">Identifier vos compétences et aspirations (Fait)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
             <div className="h-5 w-5 rounded-full border-2 border-slate-200 mt-1" />
             <div>
               <p className="font-medium text-slate-900">2. Se former</p>
               <p className="text-sm text-slate-500">Trouver la bonne formation pour {match?.title || 'votre futur métier'}</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <div className="h-5 w-5 rounded-full border-2 border-slate-200 mt-1" />
             <div>
               <p className="font-medium text-slate-900">3. Financer</p>
               <p className="text-sm text-slate-500">Explorer les options (CPF, Pôle Emploi)</p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium+ Detailed Plan */}
      <FeatureGate 
        feature={FEATURES.FULL_ACTION_PLAN} 
        requiredTier={TIERS.PREMIUM_PLUS}
        title="Plan d'action détaillé"
        description="Obtenez une feuille de route étape par étape avec des délais précis."
      >
        <Card className="border-violet-100 bg-violet-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              Planning Détaillé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 border-l-2 border-violet-200 pl-4 ml-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet-500" />
                <p className="text-sm font-semibold text-violet-600 mb-1">Mois 1 : Enquête métier</p>
                <p className="text-sm text-slate-600">Réalisez 3 enquêtes métier auprès de professionnels.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet-300" />
                <p className="text-sm font-semibold text-violet-600 mb-1">Mois 2 : Sélection Formation</p>
                <p className="text-sm text-slate-600">Postulez à 2 organismes de formation minimum.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet-300" />
                <p className="text-sm font-semibold text-violet-600 mb-1">Mois 3 : Dossier Financement</p>
                <p className="text-sm text-slate-600">Montez votre dossier CPF de transition.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>

      {/* Premium+ Monthly Adjustments */}
      <FeatureGate 
        feature={FEATURES.MONTHLY_FOLLOWUP} 
        requiredTier={TIERS.PREMIUM_PLUS}
        title="Suivi et Ajustements Mensuels"
        description="Un coach expert ajuste votre plan chaque mois selon votre progression."
        blur={true}
      >
         <Card className="border-yellow-100 bg-yellow-50/30">
            <CardHeader>
               <CardTitle className="text-yellow-800">Suivi Personnalisé Premium+</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-slate-700 mb-4">
                 Votre coach a analysé votre progression ce mois-ci. Voici les ajustements recommandés pour accélérer votre transition.
               </p>
               <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => navigate('/suivi')}
               >
                 Voir le rapport mensuel <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </CardContent>
         </Card>
      </FeatureGate>
    </div>
  );
};

export default ActionPlanSection;