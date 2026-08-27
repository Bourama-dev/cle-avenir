import React from 'react';
import PageHelmet from '@/components/SEO/PageHelmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import TextReveal from '@/components/ui/TextReveal';

const INCLUDED = [
  "Test d'orientation complet",
  'Analyse détaillée du profil',
  'Fiches métiers complètes & salaires',
  "Plan d'action personnalisé",
  'Recherche de formations',
  'Coach IA (Cléo)',
  'Export PDF de vos résultats',
];

const PlansPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <PageHelmet
        title="CléAvenir est 100% gratuit"
        description="CléAvenir est entièrement gratuit : test d'orientation, analyse détaillée, plan d'action et coach IA, sans aucune limite ni carte bancaire."
        keywords="gratuit, orientation professionnelle, test métier, formations, CléAvenir"
        breadcrumbs={[{ name: 'Accueil', url: '/' }, { name: 'Nos offres', url: '/plans' }]}
      />

      <main className="container mx-auto px-4 py-16 max-w-3xl flex-grow flex flex-col items-center text-center">
        <AnimatedSection>
          <AnimatedItem>
            <div className="mx-auto bg-violet-100 p-4 rounded-full w-fit mb-6">
              <Sparkles className="h-8 w-8 text-violet-600" />
            </div>
            <TextReveal
              text="CléAvenir est 100% gratuit"
              as="h1"
              className="text-4xl font-bold text-slate-900 mb-4"
            />
            <p className="text-xl text-slate-600 max-w-xl mx-auto mb-10">
              Aucun abonnement, aucune carte bancaire, aucune fonctionnalité limitée.
              Toutes nos fonctionnalités sont accessibles librement à chaque utilisateur.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection>
          <AnimatedItem>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-left mb-10">
              <ul className="space-y-3">
                {INCLUDED.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection>
          <AnimatedItem>
            <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
              <Link to="/dashboard">
                Accéder à mon espace <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </AnimatedItem>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default PlansPage;
