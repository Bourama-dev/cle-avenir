import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { stripeService } from '@/services/stripeService';
import { TIERS, TIER_NAMES } from '@/constants/subscriptionTiers';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, timeout
  const [activatedTier, setActivatedTier] = useState(null);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      // If no session ID, assume manual navigation or error, but let them go to dashboard
      if (!sessionId) {
         setStatus('success');
         return;
      }

      try {
        // Poll for subscription activation
        const result = await stripeService.verifySubscriptionActive(15, 2000); // 30 seconds max wait
        
        if (!mounted) return;

        if (result.active) {
          setActivatedTier(result.tier);
          setStatus('success');
          toast({
            title: "Paiement confirmé !",
            description: `Votre abonnement ${TIER_NAMES[result.tier]} est actif.`,
            variant: "default",
          });
        } else {
          setStatus('timeout');
          // Still success technically, just webhook is slow
          toast({
            title: "Paiement reçu",
            description: "Votre abonnement est en cours d'activation. Il sera disponible dans quelques instants.",
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus('success'); // Assume success to not block user indefinitely
      }
    };

    verify();

    return () => { mounted = false; };
  }, [sessionId, toast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
          
          {status === 'verifying' && (
            <div className="flex flex-col items-center animate-in fade-in duration-500">
               <Loader2 className="h-12 w-12 text-violet-600 animate-spin mb-6" />
               <h1 className="text-2xl font-bold text-slate-900 mb-2">Finalisation...</h1>
               <p className="text-slate-600">
                 Nous vérifions votre paiement et activons vos droits. Cela prend quelques secondes.
               </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
               <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Félicitations !</h1>
              <p className="text-slate-600 mb-8">
                {activatedTier 
                  ? `Bienvenue dans le club ${TIER_NAMES[activatedTier]} !`
                  : "Votre abonnement est activé. Vous avez désormais accès aux fonctionnalités exclusives."}
              </p>
              
              <div className="space-y-3 w-full">
                <Button onClick={() => navigate('/dashboard')} className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700">
                  Accéder à mon Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => navigate('/account')} className="w-full">
                  Voir mon compte
                </Button>
              </div>
            </div>
          )}

          {status === 'timeout' && (
             <div className="flex flex-col items-center">
               <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                <AlertCircle className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Presque fini !</h1>
              <p className="text-slate-600 mb-8">
                Nous avons bien reçu votre paiement, mais l'activation prend un peu plus de temps que prévu. Pas d'inquiétude, tout sera prêt dans une minute.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                  Aller au Dashboard
              </Button>
             </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;