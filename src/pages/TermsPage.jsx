import React from 'react';
import SEOHead from '@/components/SEOHead';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Conditions d'Utilisation" 
        description="Conditions Générales d'Utilisation de la plateforme d'orientation CléAvenir." 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Conditions Générales d'Utilisation (CGU)</h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation encadrent l'accès et l'utilisation de la plateforme CléAvenir, qui propose des services d'aide à l'orientation scolaire et professionnelle, intégrant des outils d'intelligence artificielle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Accès aux Services</h2>
              <p>
                L'utilisation de la plateforme nécessite la création d'un compte utilisateur. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants de connexion. CléAvenir se réserve le droit de suspendre tout compte en cas de non-respect des CGU.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">3. Nature des Recommandations</h2>
              <p>
                Les résultats de tests et les recommandations d'orientation générés par nos algorithmes et IA (comme l'assistant Cléo) sont fournis à titre indicatif. Ils constituent un outil d'aide à la réflexion et ne sauraient remplacer l'avis d'un conseiller d'orientation professionnel humain. CléAvenir ne garantit pas l'obtention d'un emploi ou l'admission à une formation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Propriété Intellectuelle</h2>
              <p>
                L'ensemble des éléments constituant la plateforme (textes, graphismes, logiciels, algorithmes, bases de données) sont protégés par le droit de la propriété intellectuelle et appartiennent exclusivement à CléAvenir. Toute reproduction non autorisée est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Responsabilité</h2>
              <p>
                CléAvenir s'efforce de maintenir un accès ininterrompu à ses services, mais ne peut être tenue responsable des éventuelles pannes, interruptions de maintenance ou problèmes de réseau. L'utilisateur utilise la plateforme à ses propres risques.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Modification des CGU</h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés de toute mise à jour significative par email ou via une notification sur la plateforme.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;