import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-black text-slate-900">Politique des Cookies</h1>
          </div>
          <p className="text-slate-500">Comprendre comment et pourquoi nous utilisons des cookies.</p>
        </div>

        <Card className="p-8 md:p-12 prose prose-slate max-w-none border-slate-200 shadow-sm bg-white rounded-xl">
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>Un cookie est un petit fichier texte enregistré sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site internet. Il permet de conserver des données utilisateur afin de faciliter la navigation et d'offrir certaines fonctionnalités.</p>

          <Separator className="my-8" />

          <h2>2. Les types de cookies utilisés</h2>
          <ul>
            <li><strong>Cookies Essentiels (Strictement nécessaires) :</strong> Requis pour le fonctionnement du site (session utilisateur, sécurité, mémorisation de vos choix RGPD). Ils ne peuvent pas être désactivés.</li>
            <li><strong>Cookies Analytiques :</strong> Utilisés pour mesurer l'audience et analyser la navigation afin d'améliorer la performance du site (ex: pages les plus visitées).</li>
            <li><strong>Cookies Publicitaires / Marketing :</strong> Utilisés pour cibler vos intérêts et proposer du contenu ou des annonces pertinents sur d'autres plateformes.</li>
            <li><strong>Cookies Réseaux Sociaux :</strong> Liés aux boutons de partage et interactions avec les réseaux externes.</li>
          </ul>

          <Separator className="my-8" />

          <h2>3. Gestion de vos préférences</h2>
          <p>
            Lors de votre première visite, un bandeau vous permet d'accepter, de refuser ou de paramétrer ces cookies. 
            Vous pouvez à tout moment modifier vos choix en visitant la page 
            <a href="/user/cookies-preferences" className="text-indigo-600 font-medium ml-1 hover:underline">Gestion des Cookies</a>.
          </p>

          <Separator className="my-8" />

          <h2>4. Durée de conservation</h2>
          <p>
            Vos choix concernant les cookies sont conservés pour une durée maximale de 6 mois. Au-delà, le bandeau de consentement vous sera présenté à nouveau.
            Les cookies eux-mêmes ont une durée de vie variable selon leur finalité, ne dépassant pas 13 mois.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicyPage;