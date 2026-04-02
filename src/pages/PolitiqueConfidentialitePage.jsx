import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Lock, Eye, Database, Trash2 } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <section className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
        <Icon size={24} />
      </div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
    <div className="pl-0 md:pl-14 text-slate-600 space-y-3 leading-relaxed">
      {children}
    </div>
  </section>
);

const PolitiqueConfidentialitePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet>
        <title>Politique de Confidentialité - CléAvenir</title>
      </Helmet>

      <div className="container mx-auto max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Politique de Confidentialité</h1>
        <p className="text-lg text-slate-600 mb-12 border-b border-slate-100 pb-8">
          Chez CléAvenir, la confidentialité de vos données est une priorité absolue. Cette politique détaille comment nous collectons, utilisons et protégeons vos informations personnelles.
        </p>

        <Section icon={Database} title="Collecte des données">
          <p>Nous collectons les informations que vous nous fournissez directement lorsque vous :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Créez un compte utilisateur.</li>
            <li>Remplissez votre profil (CV, compétences, intérêts).</li>
            <li>Effectuez nos tests d'orientation.</li>
            <li>Contactez notre support client.</li>
          </ul>
        </Section>

        <Section icon={Eye} title="Utilisation des données">
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vous fournir des résultats de tests personnalisés.</li>
            <li>Vous recommander des formations et des offres d'emploi pertinentes.</li>
            <li>Améliorer nos services et algorithmes de recommandation.</li>
            <li>Communiquer avec vous concernant votre compte ou nos services.</li>
          </ul>
        </Section>

        <Section icon={Lock} title="Protection et Sécurité">
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Toutes les communications sont chiffrées via SSL/TLS.
          </p>
        </Section>

        <Section icon={Shield} title="Vos Droits (RGPD)">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Droit d'accès à vos données personnelles.</li>
            <li>Droit de rectification des données inexactes.</li>
            <li>Droit à l'effacement ("droit à l'oubli").</li>
            <li>Droit à la limitation du traitement.</li>
            <li>Droit à la portabilité de vos données.</li>
          </ul>
        </Section>

        <Section icon={Trash2} title="Conservation et Suppression">
          <p>
            Nous conservons vos données aussi longtemps que nécessaire pour vous fournir nos services. Vous pouvez demander la suppression complète de votre compte et de vos données à tout moment via votre espace personnel ou en contactant notre DPO.
          </p>
        </Section>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 mb-4">Pour toute question concernant cette politique :</p>
          <a href="mailto:dpo@cleavenir.com" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700">
            Contacter le Délégué à la Protection des Données
          </a>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialitePage;