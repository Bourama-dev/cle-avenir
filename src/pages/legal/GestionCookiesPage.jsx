import React, { useState } from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import CookiePreferences from '@/components/legal/CookiePreferences';

const GestionCookiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LegalLayout
      title="Gestion des Cookies"
      subtitle="Comprendre et contrôler l'utilisation des cookies sur CléAvenir."
      lastUpdated="15 janvier 2024"
    >
      <div className="legal-section">
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. 
          Il permet à son émetteur d'identifier le terminal dans lequel il est enregistré, pendant la durée de validité ou d'enregistrement du cookie.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Types de cookies utilisés</h2>
        <p>Nous utilisons quatre catégories de cookies :</p>
        <ul>
          <li><strong>Cookies essentiels :</strong> Indispensables au fonctionnement du site (connexion, sécurité).</li>
          <li><strong>Cookies analytiques :</strong> Pour mesurer l'audience et les performances du site.</li>
          <li><strong>Cookies marketing :</strong> Pour vous proposer des contenus personnalisés.</li>
          <li><strong>Cookies tiers :</strong> Déposés par des services externes (vidéos, réseaux sociaux).</li>
        </ul>
      </div>

      <div className="legal-section bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="!mt-0">3. Consentement aux cookies</h2>
        <p>
          Vous pouvez à tout moment modifier vos choix concernant les cookies non-essentiels directement via notre gestionnaire de préférences.
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
        <h2>4. Comment gérer les cookies via votre navigateur</h2>
        <p>Vous pouvez également configurer votre navigateur pour gérer les cookies :</p>
        <ul>
          <li><strong>Google Chrome :</strong> Paramètres {'>'} Confidentialité et sécurité {'>'} Cookies.</li>
          <li><strong>Mozilla Firefox :</strong> Options {'>'} Vie privée et sécurité.</li>
          <li><strong>Safari :</strong> Préférences {'>'} Confidentialité.</li>
          <li><strong>Microsoft Edge :</strong> Paramètres {'>'} Cookies et autorisations de site.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>5. Cookies tiers</h2>
        <p>Nous utilisons notamment les services tiers suivants susceptibles de déposer des cookies :</p>
        <ul>
          <li>Google Analytics (mesure d'audience)</li>
          <li>Facebook Pixel (publicité)</li>
          <li>Hotjar (analyse comportementale)</li>
          <li>Stripe (paiement sécurisé)</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>6. Durée des cookies</h2>
        <p>
          Les cookies sont conservés pour une durée maximale de 13 mois après leur premier dépôt dans le terminal de l'Utilisateur, 
          conformément aux recommandations de la CNIL.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Opt-out</h2>
        <p>
          Outre notre gestionnaire de préférences, vous pouvez utiliser des outils interprofessionnels pour gérer vos cookies publicitaires, 
          comme le site <a href="http://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YourOnlineChoices</a>.
        </p>
      </div>

      <CookiePreferences isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </LegalLayout>
  );
};

export default GestionCookiesPage;