import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { stripeService } from '@/services/stripeService';
import { useToast } from '@/components/ui/use-toast';
import { STRIPE_PRICES, PRICE_MODES } from '@/constants/subscriptionTiers';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const UpgradeButton = ({ className, children, variant = "default", priceId = STRIPE_PRICES.PREMIUM, mode = null }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    // 1. Validation
    if (!priceId) {
      console.error("UpgradeButton: Missing priceId prop");
      toast({
        variant: "destructive",
        title: "Configuration manquante",
        description: "L'ID du prix est introuvable. Contactez le support.",
      });
      return;
    }

    // 2. Auth Check
    if (!user) {
      console.log("UpgradeButton: User not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          returnTo: window.location.pathname,
          message: "Connectez-vous pour souscrire à un abonnement." 
        } 
      });
      return;
    }

    setLoading(true);
    try {
      // 3. Determine Mode (Explicit prop -> Auto-detect -> Default)
      const effectiveMode = mode || PRICE_MODES[priceId] || 'subscription';
      
      console.log(`UpgradeButton: Clicked. Price=${priceId}, Mode=${effectiveMode}`);
      
      await stripeService.createCheckoutSession(priceId, effectiveMode);
      
    } catch (error) {
      console.error("UpgradeButton: Error caught:", error);
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: error.message || "Impossible d'initier le paiement. Veuillez réessayer.",
      });
      setLoading(false); // Only stop loading on error, otherwise we are redirecting
    }
  };

  return (
    <Button 
      onClick={handleUpgrade} 
      disabled={loading} 
      className={className}
      variant={variant}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Patientez...
        </>
      ) : (
        children || (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Passer Premium
          </>
        )
      )}
    </Button>
  );
};

export default UpgradeButton;