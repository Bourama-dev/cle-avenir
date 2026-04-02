import React from 'react';
import { Helmet } from 'react-helmet';
import SubscriptionTierComparison from '@/components/SubscriptionTierComparison';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const TarifsPage = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Tarifs et Plans - CléAvenir</title>
        <meta name="description" content="Découvrez nos offres d'accompagnement. Du gratuit au premium, choisissez le plan adapté à vos ambitions professionnelles." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Investissez dans votre avenir</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Des outils puissants pour une orientation réussie. Choisissez l'offre qui correspond à vos besoins.
          </p>
        </div>

        <SubscriptionTierComparison currentTier={userProfile?.subscription_tier} />

        <div className="mt-20 text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h2 className="text-2xl font-bold mb-4">Une question sur nos offres ?</h2>
           <p className="text-slate-600 mb-6">Notre équipe est là pour vous aider à choisir la meilleure solution.</p>
           <a href="mailto:contact@cleavenir.com" className="text-violet-600 font-medium hover:underline">
             Contacter le support commercial
           </a>
        </div>
      </div>
    </div>
  );
};

export default TarifsPage;