import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Tout est gratuit : une seule offre, avec toutes les fonctionnalités incluses.
const FEATURES_INCLUDED = [
  "Test d'orientation complet",
  "Détails complets des formations",
  "Analyse marché & salaires",
  "Plan d'action complet",
  "Cléo, coach IA personnel",
  "Suivi et recommandations personnalisées",
];

const SubscriptionTierComparison = () => (
  <div className="max-w-md mx-auto">
    <Card className="border-violet-500 shadow-lg bg-white">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto bg-slate-100 p-3 rounded-full w-fit mb-3">
          <Sparkles className="h-6 w-6 text-violet-500" />
        </div>
        <CardTitle className="text-xl">CléAvenir</CardTitle>
        <div className="mt-2">
          <span className="text-2xl font-bold">Gratuit</span>
          <span className="text-sm text-slate-500 ml-1">pour tous, accès complet</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {FEATURES_INCLUDED.map((name) => (
            <li key={name} className="flex items-center text-sm gap-3">
              <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700">{name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default SubscriptionTierComparison;
