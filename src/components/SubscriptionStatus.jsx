import React, { useEffect, useState } from 'react';
import { stripeService } from '@/services/stripeService';
import { stripePortalService } from '@/services/stripePortalService';
import { TIERS, TIER_NAMES } from '@/constants/subscriptionTiers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Crown, Star, Sparkles, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

const SubscriptionStatus = () => {
  const { currentTier, loading } = useSubscriptionAccess();
  const [statusDetails, setStatusDetails] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchStatusDetails = async () => {
      try {
        const sub = await stripeService.getSubscriptionStatus();
        if (mounted) setStatusDetails(sub);
      } catch (e) {
        console.error("Failed to fetch subscription status", e);
      }
    };
    
    if (!loading) {
      fetchStatusDetails();
    }
    
    return () => { mounted = false; };
  }, [loading]);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      await stripePortalService.createPortalSession();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au portail de gestion.",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  const getTierConfig = (tier) => {
    switch (tier) {
      case TIERS.PREMIUM_PLUS:
        return {
          icon: <Crown className="text-yellow-600 h-5 w-5" />,
          color: "bg-yellow-50 border-yellow-200",
          textColor: "text-yellow-900",
          badgeColor: "bg-yellow-500 hover:bg-yellow-600",
          label: TIER_NAMES[TIERS.PREMIUM_PLUS]
        };
      case TIERS.PREMIUM:
        return {
          icon: <Star className="text-violet-600 h-5 w-5" />,
          color: "bg-violet-50 border-violet-200",
          textColor: "text-violet-900",
          badgeColor: "bg-violet-600 hover:bg-violet-700",
          label: TIER_NAMES[TIERS.PREMIUM]
        };
      default:
        return {
          icon: <Sparkles className="text-slate-400 h-5 w-5" />,
          color: "bg-slate-50 border-slate-200",
          textColor: "text-slate-900",
          badgeColor: "bg-slate-500 hover:bg-slate-600",
          label: TIER_NAMES[TIERS.FREE]
        };
    }
  };

  const config = getTierConfig(currentTier);
  const isSubscriber = currentTier !== TIERS.FREE;

  if (currentTier === TIERS.FREE) {
    return (
      <Card className={`${config.color} border`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm">
              <AlertCircle className="text-slate-400 h-5 w-5" />
            </div>
            <div>
              <p className={`font-semibold ${config.textColor}`}>Plan {config.label}</p>
              <p className="text-sm text-slate-500">Passez au Premium pour plus de fonctionnalités.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/forfaits')} variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
            Voir les offres
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${config.color} border`}>
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <p className={`font-semibold ${config.textColor}`}>Abonnement {config.label}</p>
               <Badge className={`${config.badgeColor} h-5 text-[10px]`}>Actif</Badge>
            </div>
            <p className="text-sm opacity-80 capitalize">
               {statusDetails?.status === 'trialing' ? 'Période d\'essai' : 'Renouvellement automatique'}
            </p>
          </div>
        </div>
        
        {isSubscriber && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-slate-600 hover:text-slate-900 hover:bg-white/50"
            onClick={handlePortal}
            disabled={portalLoading}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gérer l'abonnement
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;