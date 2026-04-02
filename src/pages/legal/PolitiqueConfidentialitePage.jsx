import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { Mail, Shield } from 'lucide-react';

const PolitiqueConfidentialitePage = () => {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      subtitle="Notre engagement pour la protection de vos données personnelles et votre vie privée."
      lastUpdated="15 janvier 2024"
    >
      <div className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          Chez CléAvenir, la confidentialité de vos données est une priorité absolue. Cette politique détaille comment nous collectons, 
          utilisons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Données collectées</h2>
        <p>Nous collectons différents types de données pour fournir et améliorer notre service :</p>
        <ul>
          <li><strong>Données d'inscription :</strong> Nom, prénom, adresse email, mot de passe (chiffré).</li>
          <li><strong>Données de profil :</strong> Âge, niveau d'études, situation professionnelle, localisation (optionnel).</li>
          <li><strong>Données d'utilisation :</strong> Réponses aux tests d'orientation, résultats, interactions avec la plateforme.</li>
          <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, données de connexion (logs).</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>3. Utilisation des données</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Vous fournir des résultats de tests personnalisés et pertinents.</li>
          <li>Gérer votre compte utilisateur et vos accès.</li>
          <li>Améliorer nos algorithmes de recommandation (données anonymisées).</li>
          <li>Communiquer avec vous concernant votre compte ou nos services (selon vos préférences).</li>
          <li>Assurer la sécurité et l'intégrité de notre plateforme.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>4. Partage des données</h2>
        <p>
          Nous ne vendons <strong>jamais</strong> vos données personnelles. Nous ne partageons vos informations qu'avec :
        </p>
        <ul>
          <li>Nos prestataires de services techniques (hébergement, paiement) strictement pour les besoins du service.</li>
          <li>Les autorités légales si la loi l'exige.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>5. Sécurité des données</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 my-4">
           <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
           <div>
             <h4 className="font-bold text-blue-800 m-0">Protection renforcée</h4>
             <p className="text-sm text-blue-700 m-0">
               Toutes vos données sont chiffrées en transit (SSL/TLS) et au repos. Nous utilisons des protocoles de sécurité standards de l'industrie.
             </p>
           </div>
        </div>
        <p>
          L'accès à vos données personnelles est strictement limité aux employés et prestataires qui ont besoin d'y accéder pour opérer le service.
        </p>
      </div>

      <div className="legal-section">
        <h2>6. Durée de conservation</h2>
        <p>
          Nous conservons vos données tant que votre compte est actif. En cas d'inactivité prolongée (3 ans), ou sur votre demande de suppression, 
          vos données personnelles seront supprimées ou anonymisées de manière irréversible.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Vos droits RGPD</h2>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données.</li>
          <li><strong>Droit de rectification :</strong> Corriger des données inexactes.</li>
          <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données ("droit à l'oubli").</li>
          <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré.</li>
          <li><strong>Droit d'opposition :</strong> Vous opposer à certains traitements.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) :
        </p>
        <a href="mailto:privacy@horizons.fr" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium">
          <Mail className="w-4 h-4" /> privacy@horizons.fr
        </a>
      </div>

      <div className="legal-section">
        <h2>8. Cookies</h2>
        <p>
          Nous utilisons des cookies pour améliorer votre expérience. Pour en savoir plus et gérer vos préférences, consultez notre page 
          <a href="/gestion-cookies" className="text-blue-600 hover:underline mx-1">Gestion des Cookies</a>.
        </p>
      </div>

      <div className="legal-section">
        <h2>9. Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante : 
          <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline ml-1">contact@cleavenir.com</a>.
        </p>
      </div>
    </LegalLayout>
  );
};

export default PolitiqueConfidentialitePage;