import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Settings, Crown, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getDisplayPlanName, PLAN_TYPES } from '@/lib/subscriptionUtils';
import SubscriptionErrorBoundary from '@/components/SubscriptionErrorBoundary';

const CurrentPlanContent = () => {
  const { subscriptionPlan, subscriptionTier, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
        console.log(`[CurrentPlanSection] Rendered with plan: ${subscriptionTier} (${getDisplayPlanName(subscriptionTier)})`);
    }
  }, [subscriptionTier, loading]);

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  // Handle null or entirely missing subscription tier safely
  const safeTier = subscriptionTier || PLAN_TYPES.FREE;
  const isActive = subscriptionPlan?.status === 'active' || subscriptionPlan?.status === 'active_legacy';
  const displayTierName = getDisplayPlanName(safeTier);
  const isFree = safeTier === PLAN_TYPES.FREE;

  // Visual Styles based on tier
  const cardStyle = safeTier === PLAN_TYPES.PREMIUM_PLUS 
    ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white"
    : safeTier === PLAN_TYPES.PREMIUM 
      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
      : "bg-white border-slate-200 text-slate-800";
  
  const badgeStyle = isFree
    ? "bg-slate-100 text-slate-700 border-slate-200"
    : "bg-white/20 text-white border-none backdrop-blur-sm";

  return (
    <Card className={`shadow-sm mb-6 transition-all duration-300 ${cardStyle}`}>
      <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={`uppercase tracking-wide text-xs ${badgeStyle}`}>
                 Plan Actuel
              </Badge>
              {isActive && <Badge className="bg-green-500/90 hover:bg-green-600 text-white border-none">Actif</Badge>}
              {!isActive && isFree && <Badge className="bg-slate-200 text-slate-600 border-none">Gratuit</Badge>}
           </div>
           
           <div className="flex items-center gap-2">
             <h3 className="text-3xl font-bold mb-1 flex items-center gap-2">
               {safeTier === PLAN_TYPES.PREMIUM_PLUS && <Crown className="h-6 w-6 text-yellow-200" />}
               {safeTier === PLAN_TYPES.PREMIUM && <Star className="h-6 w-6 text-indigo-200" />}
               {isFree && <AlertCircle className="h-6 w-6 text-slate-400" />}
               {displayTierName}
             </h3>
           </div>

           <p className={`text-sm ${isFree ? 'text-slate-500' : 'text-white/80'}`}>
              {isActive && !isFree && subscriptionPlan?.end_date
                ? `Prochain renouvellement le ${new Date(subscriptionPlan.end_date).toLocaleDateString()}` 
                : "Débloquez tout le potentiel de CléAvenir."}
           </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           {!isFree && (
             <Button 
               variant={isFree ? "outline" : "secondary"}
               className="flex-1 md:flex-none gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
               onClick={() => navigate('/manage-subscription')}
             >
                <Settings className="h-4 w-4" /> Gérer
             </Button>
           )}
           
           {isFree && (
             <Button 
               className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-lg shadow-purple-500/20"
               onClick={() => navigate('/upgrade-plan')}
             >
                <CreditCard className="h-4 w-4" /> Passer Premium
             </Button>
           )}
           
           {safeTier === PLAN_TYPES.PREMIUM && (
              <Button 
                className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-white gap-2"
                onClick={() => navigate('/upgrade-plan')}
              >
                <Crown className="h-4 w-4" /> Upgrade Plus
              </Button>
           )}
        </div>
      </CardContent>
    </Card>
  );
};

const CurrentPlanSection = () => (
  <SubscriptionErrorBoundary>
    <CurrentPlanContent />
  </SubscriptionErrorBoundary>
);

export default CurrentPlanSection;