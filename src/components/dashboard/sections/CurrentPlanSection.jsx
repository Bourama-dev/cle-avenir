import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import SubscriptionErrorBoundary from '@/components/SubscriptionErrorBoundary';

// CléAvenir is fully free — every account has unrestricted access.
const CurrentPlanContent = () => (
  <Card className="shadow-sm mb-6 bg-white border-slate-200 text-slate-800">
    <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="uppercase tracking-wide text-xs bg-slate-100 text-slate-700 border-slate-200">
            Votre accès
          </Badge>
          <Badge className="bg-green-500/90 hover:bg-green-600 text-white border-none">Actif</Badge>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-violet-500" />
            100% Gratuit
          </h3>
        </div>

        <p className="text-sm text-slate-500">
          Accès complet et illimité à toutes les fonctionnalités de CléAvenir.
        </p>
      </div>
    </CardContent>
  </Card>
);

const CurrentPlanSection = () => (
  <SubscriptionErrorBoundary>
    <CurrentPlanContent />
  </SubscriptionErrorBoundary>
);

export default CurrentPlanSection;
