import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Check, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  Building2, 
  Users, 
  GraduationCap, 
  BarChart3, 
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { TIERS } from '@/constants/subscriptionTiers';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const PlansPage = () => {
  const { currentTier, loading: tierLoading } = useSubscriptionAccess();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Updated Stripe Payment Links
  const STRIPE_LINK_PREMIUM = "https://buy.stripe.com/5kQ5kE1IUdbWa1UfPpbsc02"; 
  const STRIPE_LINK_PREMIUM_PLUS = "https://buy.stripe.com/bJe5kE9bm3Bm7TMcDdbsc03"; 

  const handleSubscribe = (paymentLinkUrl) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter ou créer un compte pour souscrire à une offre.",
      });
      navigate('/auth', { state: { returnTo: '/forfaits' } });
      return;
    }

    try {
      const url = new URL(paymentLinkUrl);
      url.searchParams.append('client_reference_id', user.id);
      if (user.email) {
        url.searchParams.append('prefilled_email', user.email);
      }
      window.location.href = url.toString();
    } catch (error) {
      console.error("Error constructing payment URL:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la redirection vers le paiement."
      });
    }
  };

  const handleContact = () => {
    navigate('/contact', { state: { subject: 'Demande Établissement Scolaire' } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Helmet>
        <title>Nos Offres & Forfaits - CléAvenir</title>
        <meta name="description" content="Découvrez les différents forfaits CléAvenir : Découverte (gratuit), Premium, et Premium+ pour un accompagnement complet dans votre orientation professionnelle." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16 max-w-6xl flex-grow">
        {/* INDIVIDUAL PLANS SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choisissez votre niveau d'accompagnement</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            De la simple découverte à l'accompagnement complet, avancez à votre rythme.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start mb-24">
          
          {/* 1. FREEMIUM - Découverte */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full flex flex-col">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-slate-100 p-3 rounded-full w-fit mb-4">
                <HelpCircle className="h-6 w-6 text-slate-500" />
              </div>
              <CardTitle className="text-xl text-slate-900">Découverte</CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold text-slate-900">0 €</span>
              </div>
              <CardDescription>Pour explorer vos options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Test d'orientation complet</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Liste des métiers compatibles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Recherche basique de formations</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>Détails métiers & salaires</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>Plan d'action personnalisé</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={true}>
                {currentTier === TIERS.FREE ? "Votre plan actuel" : "Inclus"}
              </Button>
            </CardFooter>
          </Card>

          {/* 2. PREMIUM - Clarté */}
          <Card className={`border-violet-200 shadow-lg scale-105 z-10 relative bg-white h-full flex flex-col ${currentTier === TIERS.PREMIUM ? 'ring-2 ring-violet-500' : ''}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500"></div>
            <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              RECOMMANDÉ
            </div>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-violet-100 p-3 rounded-full w-fit mb-4">
                <Zap className="h-6 w-6 text-violet-600" />
              </div>
              <CardTitle className="text-xl text-violet-900">Premium</CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold text-slate-900">9,90 €</span>
                <span className="text-sm text-slate-500 ml-2">paiement unique</span>
              </div>
              <CardDescription>Pour réussir votre reconversion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900">Analyse détaillée du profil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900">Fiches métiers complètes & Salaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span>Plan d'action étape par étape</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span>Accès complet aux organismes de formation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span>Export PDF des résultats</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {currentTier === TIERS.PREMIUM ? (
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled>
                  Plan actuel
                </Button>
              ) : (
                <Button 
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all"
                  onClick={() => handleSubscribe(STRIPE_LINK_PREMIUM)}
                  disabled={tierLoading}
                >
                  {tierLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Débloquer mon avenir"}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* 3. PREMIUM+ - Sécurité */}
          <Card className={`border-yellow-200 shadow-sm hover:shadow-md transition-shadow relative bg-yellow-50/30 h-full flex flex-col ${currentTier === TIERS.PREMIUM_PLUS ? 'ring-2 ring-yellow-500' : ''}`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4">
                <ShieldCheck className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl text-yellow-900">Premium+</CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold text-slate-900">19,90 €</span>
                <span className="text-sm text-slate-500 ml-2">/ mois</span>
              </div>
              <CardDescription>L'excellence du coaching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900">Tout le contenu Premium inclus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900">Coach IA personnel 24/7 (Cléo)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <span>Suivi mensuel de progression</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <span>Ajustements dynamiques du parcours</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <span>Support prioritaire VIP</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {currentTier === TIERS.PREMIUM_PLUS ? (
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" disabled>
                  Plan actuel
                </Button>
              ) : (
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white hover:text-white"
                  onClick={() => handleSubscribe(STRIPE_LINK_PREMIUM_PLUS)}
                  disabled={tierLoading}
                >
                  {tierLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Être coaché"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>


        {/* INSTITUTION SECTION */}
        <section className="mt-12 pt-16 border-t border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
              <Building2 className="h-8 w-8 text-violet-600" />
              Pour les Établissements Scolaires
            </h2>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
              Une solution clé en main pour déployer CléAvenir à grande échelle et accompagner vos élèves vers la réussite.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Left Column: Features & Value Proposition */}
              <div className="p-8 lg:p-12 bg-slate-900 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-violet-400">Offre Établissement – Plan Premium+</h3>
                  <p className="text-slate-400 mb-8">Déployez la puissance de l'IA pour l'orientation de vos élèves.</p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Accès Premium+ pour <strong>100 élèves</strong> (base)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Accès <strong>enseignants & direction</strong> inclus</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Tableaux de bord établissement & Suivi des parcours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Reporting annuel exportable</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Onboarding, formation & accompagnement initial</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">Mises à jour continues & Support prioritaire</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700">
                  <h4 className="font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Investissement Stratégique
                  </h4>
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    "Le Premium+ n'est pas une dépense, c'est un levier de réussite. 
                    En investissant moins de 2% du coût annuel d'un élève, vous sécurisez son parcours, 
                    réduisez le risque de décrochage et valorisez votre établissement."
                  </p>
                </div>
              </div>

              {/* Right Column: Pricing Logic, Renewal, CTA */}
              <div className="p-8 lg:p-12 bg-slate-50 flex flex-col">
                
                {/* Pricing Breakdown */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Modèle Économique Transparent</h4>
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-baseline border-b border-slate-100 pb-3">
                      <span className="text-slate-600 font-medium">Année 1 (Lancement)</span>
                      <div className="text-right">
                        <span className="block font-bold text-slate-900 text-lg">~15 €</span>
                        <span className="text-xs text-slate-500">/ élève / an</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-600 font-medium">Financable par le BAEF</span>
                      <div className="text-right">
                        <span className="block font-bold text-slate-900 text-lg">~5 000 à 10 000€</span>
                        <span className="text-xs text-slate-500">/ an</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-blue-50 text-blue-800 text-xs p-3 rounded flex items-center gap-2">
                      <div className="bg-blue-200 rounded-full p-1 shrink-0">
                        <Check className="h-3 w-3 text-blue-700" />
                      </div>
                      <p>
                        Représente <strong>&lt; 2%</strong> du coût annuel d'un lycéen pour l'État (~11 000€).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extensions */}
                <div className="mb-8 flex-grow">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Options & Extensions</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-violet-600" />
                      <span>Pack supplémentaire (+50 élèves)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-violet-600" />
                      <span>Modules pédagogiques avancés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-violet-600" />
                      <span>Accompagnement renforcé (ateliers physiques)</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-auto">
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-slate-900 block">Sur devis</span>
                    <span className="text-slate-500 text-sm">Tarif personnalisé selon la taille de l'établissement</span>
                  </div>
                  
                  <Button 
                    onClick={handleContact} 
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Contacter notre équipe Éducation <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </section>
        
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Paiement sécurisé via Stripe. Facture disponible sur demande.</p>
        </div>
      </main>
      
    </div>
  );
};

export default PlansPage;