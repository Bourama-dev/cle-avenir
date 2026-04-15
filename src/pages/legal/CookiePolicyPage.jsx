import React, { useState } from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import CookiePreferences from '@/components/legal/CookiePreferences';
import { useLegalDocument } from '@/hooks/useLegalDocument';
import DynamicLegalContent from '@/components/legal/DynamicLegalContent';

const CookiePolicyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { content: dbContent, loading: dbLoading } = useLegalDocument('cookies');

  return (
    <DynamicLegalContent dbContent={dbContent} loading={dbLoading}>
    <LegalLayout
      title="Politique des Cookies"
      subtitle="Comment et pourquoi nous utilisons des cookies sur CléAvenir, et comment gérer vos préférences."
      lastUpdated="8 avril 2026"
    >
      <div className="legal-section">
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur votre visite pour faciliter votre navigation et personnaliser votre expérience.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Cookies utilisés sur CléAvenir</h2>

        <h3>Cookies essentiels (non désactivables)</h3>
        <p>Indispensables au fonctionnement du site, ils ne peuvent pas être refusés :</p>
        <ul>
          <li><strong>Session utilisateur :</strong> Maintient votre connexion entre les pages.</li>
          <li><strong>Sécurité :</strong> Protection contre les attaques CSRF et sessions malveillantes.</li>
          <li><strong>Préférences cookies :</strong> Mémorise vos choix de consentement (durée : 6 mois).</li>
        </ul>

        <h3>Cookies analytiques (soumis à consentement)</h3>
        <p>Nous permettent de comprendre comment vous utilisez le site :</p>
        <ul>
          <li><strong>Google Analytics (via GTM) :</strong> Mesure d'audience, pages visitées, durée des sessions. Données anonymisées.</li>
        </ul>

        <h3>Cookies fonctionnels (soumis à consentement)</h3>
        <p>Améliorent votre expérience sans être strictement nécessaires :</p>
        <ul>
          <li><strong>Préférences d'affichage :</strong> Thème, langue, dernières recherches.</li>
        </ul>

        <h3>Cookies tiers (soumis à consentement)</h3>
        <ul>
          <li><strong>Stripe :</strong> Paiement sécurisé (uniquement sur les pages d'abonnement).</li>
          <li><strong>Sentry :</strong> Rapport d'erreurs techniques anonymisés.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>3. Durée de conservation</h2>
        <p>
          Les cookies de session sont supprimés à la fermeture du navigateur. Les cookies persistants ont une durée maximale de <strong>13 mois</strong> conformément aux recommandations de la CNIL. Votre consentement est valable <strong>6 mois</strong>, au-delà duquel le bandeau vous sera à nouveau présenté.
        </p>
      </div>

      <div className="legal-section bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="!mt-0">4. Gérer vos préférences</h2>
        <p>
          Vous pouvez à tout moment modifier vos choix concernant les cookies non essentiels via notre gestionnaire de préférences.
        </p>
        <div className="mt-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Settings className="w-4 h-4" />
            Gérer mes préférences cookies
          </Button>
        </div>
      </div>

      <div className="legal-section">
        <h2>5. Gestion via votre navigateur</h2>
        <p>Vous pouvez également configurer ou bloquer les cookies directement dans votre navigateur :</p>
        <ul>
          <li><strong>Google Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
          <li><strong>Mozilla Firefox :</strong> Options → Vie privée et sécurité</li>
          <li><strong>Safari :</strong> Préférences → Confidentialité</li>
          <li><strong>Microsoft Edge :</strong> Paramètres → Cookies et autorisations de site</li>
        </ul>
        <p className="text-sm text-slate-500 mt-2">
          Attention : le blocage de tous les cookies peut affecter le fonctionnement du site et vous empêcher de vous connecter.
        </p>
      </div>

      <div className="legal-section">
        <h2>6. Opt-out publicitaire</h2>
        <p>
          Pour gérer vos préférences de publicité ciblée sur l'ensemble des sites, vous pouvez utiliser :{' '}
          <a href="http://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YourOnlineChoices</a> ou{' '}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AboutAds</a>.
        </p>
      </div>

      <CookiePreferences isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </LegalLayout>
    </DynamicLegalContent>
  );
};

export default CookiePolicyPage;
