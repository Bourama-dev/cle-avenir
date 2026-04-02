import React from 'react';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TIERS, STRIPE_PRICES } from '@/constants/subscriptionTiers';
import { stripeService } from '@/services/stripeService';

const SubscriptionTierComparison = ({ currentTier }) => {
  const handleUpgrade = (priceId) => {
    stripeService.createCheckoutSession(priceId);
  };

  const tiers = [
    {
      id: TIERS.FREE,
      name: 'Découverte',
      price: 'Gratuit',
      icon: <Sparkles className="h-6 w-6 text-slate-400" />,
      features: [
        { name: 'Test d\'orientation basique', included: true },
        { name: 'Recherche de formations (titres uniquement)', included: true },
        { name: '3 métiers favoris', included: true },
        { name: 'Analyse détaillée du marché', included: false },
        { name: 'Coach IA personnel', included: false },
      ],
      buttonText: 'Votre plan actuel',
      disabled: true,
      highlight: false
    },
    {
      id: TIERS.PREMIUM,
      name: 'Premium',
      price: '9,90€',
      period: 'paiement unique',
      icon: <Zap className="h-6 w-6 text-violet-500" />,
      priceId: STRIPE_PRICES.PREMIUM,
      features: [
        { name: 'Test de personnalité complet', included: true },
        { name: 'Détails complets des formations', included: true },
        { name: 'Analyse marché & salaires', included: true },
        { name: 'Plan d\'action complet', included: true },
        { name: 'Coach IA personnel', included: false },
      ],
      buttonText: currentTier === TIERS.PREMIUM ? 'Votre plan actuel' : 'Passer Premium',
      disabled: currentTier === TIERS.PREMIUM,
      highlight: true
    },
    {
      id: TIERS.PREMIUM_PLUS,
      name: 'Premium+',
      price: '19,90€',
      period: '/ mois',
      icon: <Crown className="h-6 w-6 text-yellow-500" />,
      priceId: STRIPE_PRICES.PREMIUM_PLUS,
      features: [
        { name: 'Tout ce qui est inclus dans Premium', included: true },
        { name: 'Coach IA & Suivi mensuel', included: true },
        { name: 'Recommandations personnalisées', included: true },
        { name: 'Support prioritaire 7j/7', included: true },
        { name: 'Ajustements mensuels du plan', included: true },
      ],
      buttonText: currentTier === TIERS.PREMIUM_PLUS ? 'Votre plan actuel' : 'Devenir Premium+',
      disabled: currentTier === TIERS.PREMIUM_PLUS,
      highlight: false
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <Card 
          key={tier.id} 
          className={`relative flex flex-col ${
            tier.highlight 
              ? 'border-violet-500 shadow-lg scale-105 z-10 bg-white' 
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          {tier.highlight && (
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMMANDÉ
            </div>
          )}
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-slate-100 p-3 rounded-full w-fit mb-3">
              {tier.icon}
            </div>
            <CardTitle className="text-xl">{tier.name}</CardTitle>
            <div className="mt-2">
              <span className="text-2xl font-bold">{tier.price}</span>
              {tier.period && <span className="text-sm text-slate-500 ml-1">{tier.period}</span>}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm gap-3">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full ${
                tier.highlight && !tier.disabled ? 'bg-violet-600 hover:bg-violet-700' : ''
              }`}
              variant={tier.disabled ? "outline" : "default"}
              disabled={tier.disabled}
              onClick={() => !tier.disabled && tier.priceId && handleUpgrade(tier.priceId)}
            >
              {tier.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionTierComparison;