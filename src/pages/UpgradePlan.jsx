import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { stripeService } from '@/services/stripeService';
import { STRIPE_PRICES, STRIPE_MODES } from '@/constants/subscriptionTiers';

// Mock plans data if database is empty initially
const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Découverte',
    price: 0,
    description: 'Pour explorer les bases de votre orientation',
    features: ['1 Test d\'orientation', '1 Création de CV', 'Recherche métiers basique'],
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    description: 'Le boost complet pour votre carrière',
    features: ['Tests illimités', 'CV illimités & Export PDF', 'Assistant IA Cleo', 'Accès aux offres exclusives'],
    highlight: true
  },
  {
    id: 'expert',
    name: 'Expert',
    price: 19.99,
    description: 'Accompagnement personnalisé maximum',
    features: ['Tout du plan Pro', 'Coaching vidéo (1h/mois)', 'Revue de CV par expert', 'Support prioritaire'],
    highlight: false
  }
];

// Map plan names/ids to Stripe price IDs
const PLAN_PRICE_MAP = {
  pro: STRIPE_PRICES.PREMIUM,
  premium: STRIPE_PRICES.PREMIUM,
  expert: STRIPE_PRICES.PREMIUM_PLUS,
  premium_plus: STRIPE_PRICES.PREMIUM_PLUS,
};

const UpgradePlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase.from('plans').select('*').order('price');
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      } catch (err) {
        setPlans(DEFAULT_PLANS);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login', { state: { from: '/upgrade' } });
      return;
    }

    if (plan.price === 0) return; // Plan gratuit, pas de checkout

    const planKey = (plan.id || plan.name || '').toLowerCase();
    const priceId = PLAN_PRICE_MAP[planKey];

    if (!priceId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Plan non reconnu. Contactez le support.",
      });
      return;
    }

    setProcessingId(plan.id);
    try {
      toast({
        title: "Redirection...",
        description: "Vous allez être redirigé vers la page de paiement sécurisé.",
      });
      const mode = STRIPE_MODES[planKey] || 'subscription';
      await stripeService.createCheckoutSession(priceId, mode);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: error.message || "Impossible d'initier le paiement. Réessayez.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Choisissez votre plan</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Investissez dans votre avenir professionnel avec nos outils premium.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "relative flex flex-col transition-all hover:shadow-xl",
                plan.highlight || plan.name === 'Pro' ? "border-primary shadow-lg scale-105 z-10" : "border-slate-200"
              )}
            >
              {(plan.highlight || plan.name === 'Pro') && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" /> Recommandé
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-slate-500">/ mois</span>
                </div>

                <ul className="space-y-3">
                  {plan.features && (Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features)).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className={cn("w-full h-11 text-base", plan.price === 0 ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-primary hover:bg-primary/90")}
                  variant={plan.price === 0 ? "outline" : "default"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={!!processingId}
                >
                  {processingId === plan.id ? <Loader2 className="animate-spin h-5 w-5" /> : (plan.price === 0 ? "Plan actuel" : "Choisir ce plan")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
            <h3 className="font-semibold text-lg mb-2">Besoin d'aide pour choisir ?</h3>
            <p className="text-slate-600 mb-4">Contactez notre équipe support pour des conseils personnalisés.</p>
            <Button variant="outline">Contacter le support</Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;