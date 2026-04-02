import React from 'react';
import SEOHead from '@/components/SEOHead';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Politique de Confidentialité" 
        description="Découvrez comment CléAvenir protège vos données personnelles conformément au RGPD." 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Politique de Confidentialité</h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Collecte des Données Personnelles</h2>
              <p>
                Dans le cadre de l'utilisation de CléAvenir, nous collectons les données strictement nécessaires à la fourniture de nos services d'orientation. Cela inclut vos informations d'identification (nom, email), vos résultats de tests d'orientation, votre parcours académique et vos préférences professionnelles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Base Légale et Finalité</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), le traitement de vos données repose sur votre consentement explicite et sur l'exécution des conditions générales d'utilisation. Ces données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Générer des recommandations d'orientation personnalisées.</li>
                <li>Améliorer nos algorithmes d'intelligence artificielle (de manière anonymisée).</li>
                <li>Vous communiquer des opportunités (formations, offres d'emploi) pertinentes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">3. Partage des Données</h2>
              <p>
                Vos données personnelles ne sont <strong>jamais</strong> vendues à des tiers à des fins commerciales. Elles peuvent être partagées avec des établissements partenaires uniquement avec votre accord explicite (par exemple, lors d'une candidature à une formation).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Durée de Conservation</h2>
              <p>
                Vos données sont conservées pendant la durée d'utilisation de votre compte. En cas d'inactivité continue pendant 3 ans, votre compte et vos données personnelles associées seront automatiquement supprimés, sauf obligation légale contraire.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Vos Droits (RGPD)</h2>
              <p>
                Vous disposez d'un droit d'accès, de rectification, d'effacement (droit à l'oubli), de limitation du traitement, de portabilité de vos données et d'opposition. Pour exercer ces droits, vous pouvez gérer vos préférences directement depuis votre profil ou nous contacter à <a href="mailto:dpo@cleavenir.com" className="text-blue-600 hover:underline">dpo@cleavenir.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Cookies et Traceurs</h2>
              <p>
                Notre plateforme utilise des cookies pour assurer son bon fonctionnement technique et analyser l'audience. Vous pouvez à tout moment modifier vos préférences en matière de cookies via notre bannière dédiée ou les paramètres de votre navigateur.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;