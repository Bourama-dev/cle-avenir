import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { stripePortalService } from '@/services/stripePortalService';
import { stripeService } from '@/services/stripeService';
import { STRIPE_PRICES, TIER_NAMES, TIERS } from '@/constants/subscriptionTiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, CreditCard, Loader2, Check, AlertCircle, RefreshCw,
  Crown, Zap, Star, ExternalLink,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Plan cards shown when user is on free plan
───────────────────────────────────────── */
const PLANS = [
  {
    key: TIERS.PREMIUM,
    name: TIER_NAMES[TIERS.PREMIUM],
    price: '9,99',
    priceId: STRIPE_PRICES.PREMIUM,
    badge: null,
    icon: Star,
    color: 'border-violet-500',
    badgeClass: '',
    features: [
      'Tests d\'orientation illimités',
      'Résultats détaillés & analyse RIASEC',
      'Plan personnalisé complet',
      'Export PDF de vos résultats',
      'Fiches métiers complètes',
    ],
  },
  {
    key: TIERS.PREMIUM_PLUS,
    name: TIER_NAMES[TIERS.PREMIUM_PLUS],
    price: '19,99',
    priceId: STRIPE_PRICES.PREMIUM_PLUS,
    badge: 'Complet',
    icon: Crown,
    color: 'border-amber-500',
    badgeClass: 'bg-amber-500',
    features: [
      'Tout inclus dans Premium',
      'Cleo IA — coach illimité',
      'Simulation d\'entretien',
      'Lettres de motivation IA',
      'Suivi mensuel personnalisé',
      'Support prioritaire',
    ],
  },
];

/* ─────────────────────────────────────────
   Free plan — prompt to upgrade
───────────────────────────────────────── */
const FreePlanView = ({ onUpgrade, upgradeLoading }) => (
  <div className="space-y-6">
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-8 text-center">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Plan Découverte (gratuit)</h2>
        <p className="text-slate-500 mb-2">
          Vous utilisez la version gratuite de CléAvenir. Passez à Premium pour débloquer toutes les fonctionnalités.
        </p>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-4">
      {PLANS.map((plan) => {
        const Icon = plan.icon;
        return (
          <div
            key={plan.key}
            className={`relative p-6 bg-white rounded-2xl border-2 ${plan.color} shadow-sm hover:shadow-md transition-shadow`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.badgeClass} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {plan.badge}
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{plan.name}</p>
                <p className="text-slate-500 text-sm">{plan.price} € / mois</p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              onClick={() => onUpgrade(plan.priceId)}
              disabled={!!upgradeLoading}
            >
              {upgradeLoading === plan.priceId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Passer à {plan.name}
            </Button>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Paid plan view
───────────────────────────────────────── */
const PaidPlanView = ({ subscription, onPortal, portalLoading, onUpgrade, upgradeLoading }) => {
  const isPremiumPlus = subscription.tier === TIERS.PREMIUM_PLUS;

  return (
    <div className="space-y-6">
      {/* Current plan card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Plan actuel</p>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isPremiumPlus ? <Crown className="w-5 h-5 text-amber-400" /> : <Star className="w-5 h-5 text-violet-400" />}
              {subscription.plan_type}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {subscription.price > 0 ? `${String(subscription.price).replace('.', ',')} €` : 'Gratuit'}
              {subscription.price > 0 && <span className="text-base text-slate-400 font-normal"> /mois</span>}
            </div>
            <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30">Actif</Badge>
          </div>
        </div>

        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Fonctionnalités incluses</h3>
            <ul className="space-y-2">
              {(subscription.features || []).map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 justify-center">
            {!isPremiumPlus && (
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => onUpgrade(STRIPE_PRICES.PREMIUM_PLUS)}
                disabled={!!upgradeLoading}
              >
                {upgradeLoading === STRIPE_PRICES.PREMIUM_PLUS ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Crown className="h-4 w-4 mr-2" />
                )}
                Passer à Premium+
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onPortal}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Gérer via Stripe
            </Button>
            <p className="text-xs text-slate-400 text-center">
              Modifier ou annuler votre abonnement depuis le portail Stripe sécurisé.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment history placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-slate-500" /> Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500 text-sm">
            Consultez vos factures directement dans le portail Stripe.
            <br />
            <Button variant="link" className="mt-2 text-violet-600" onClick={onPortal} disabled={portalLoading}>
              Ouvrir le portail Stripe <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
const ManageSubscriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription, loading, error, refetch } = useUserSubscription();

  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(null);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      await stripePortalService.createPortalSession();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Impossible d\'ouvrir le portail de gestion.',
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (priceId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUpgradeLoading(priceId);
    try {
      await stripeService.createCheckoutSession(priceId, null, user.id);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Impossible de démarrer le paiement.',
      });
      setUpgradeLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
        <p className="text-slate-500">Chargement de votre abonnement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur de chargement</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gérer mon abonnement</h1>
          <p className="text-slate-500 mt-1">Consultez votre plan actuel et gérez vos options.</p>
        </div>

        {subscription ? (
          <PaidPlanView
            subscription={subscription}
            onPortal={handlePortal}
            portalLoading={portalLoading}
            onUpgrade={handleUpgrade}
            upgradeLoading={upgradeLoading}
          />
        ) : (
          <FreePlanView onUpgrade={handleUpgrade} upgradeLoading={upgradeLoading} />
        )}
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;
