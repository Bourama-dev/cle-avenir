import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';

const ConditionsGeneralesPage = () => {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Règles et conditions régissant l'utilisation de la plateforme CléAvenir."
      lastUpdated="8 avril 2026"
    >
      <div className="legal-section">
        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation de la plateforme <strong>CléAvenir</strong>, éditée par la société CléAvenir SAS.
        </p>
        <p>
          Tout accès ou utilisation du site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Accès au service</h2>
        <p>
          La plateforme CléAvenir est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Certaines fonctionnalités avancées sont réservées aux utilisateurs disposant d'un abonnement payant.
        </p>
        <p>
          CléAvenir se réserve le droit de modifier, suspendre ou interrompre l'accès au service à tout moment, notamment pour des raisons de maintenance, sans obligation de préavis.
        </p>
      </div>

      <div className="legal-section">
        <h2>3. Inscription et compte utilisateur</h2>
        <p>
          La création d'un compte est nécessaire pour accéder aux fonctionnalités personnalisées. Lors de l'inscription, l'utilisateur s'engage à fournir des informations exactes, complètes et à les maintenir à jour.
        </p>
        <p>
          L'utilisateur est seul responsable de la confidentialité de ses identifiants. En cas d'utilisation non autorisée de son compte, il doit en informer immédiatement CléAvenir à l'adresse <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline">contact@cleavenir.com</a>.
        </p>
      </div>

      <div className="legal-section">
        <h2>4. Services proposés</h2>
        <p>CléAvenir propose notamment :</p>
        <ul>
          <li>Des tests d'orientation professionnelle et scolaire basés sur l'intelligence artificielle.</li>
          <li>Des fiches métiers détaillées avec débouchés, salaires et compétences requises.</li>
          <li>Un moteur de recherche de formations et d'offres d'emploi/alternance.</li>
          <li>Un assistant IA (Cléo) pour accompagner les utilisateurs dans leur parcours.</li>
          <li>Des outils de création de CV et lettres de motivation.</li>
          <li>Un blog et des ressources sur l'orientation et la carrière.</li>
        </ul>
        <p>
          Les résultats des tests d'orientation sont fournis à titre indicatif et ne constituent pas un bilan de compétences certifié au sens légal du terme.
        </p>
      </div>

      <div className="legal-section">
        <h2>5. Utilisation acceptable</h2>
        <p>L'utilisateur s'engage à utiliser la plateforme dans le respect des lois en vigueur et à ne pas :</p>
        <ul>
          <li>Diffuser des contenus illégaux, offensants, diffamatoires ou portant atteinte à la vie privée d'autrui.</li>
          <li>Usurper l'identité d'une personne ou d'une organisation.</li>
          <li>Tenter de contourner les mesures de sécurité de la plateforme.</li>
          <li>Utiliser des robots ou outils automatisés pour accéder au service sans autorisation.</li>
          <li>Revendre ou exploiter commercialement les données ou résultats fournis par la plateforme.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>6. Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments de la plateforme (algorithmes, interfaces, contenus éditoriaux, marques, logos) est la propriété exclusive de CléAvenir SAS et est protégé par le droit de la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation ou utilisation non autorisée est strictement interdite et susceptible de poursuites.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Responsabilité</h2>
        <p>
          CléAvenir met en œuvre tous les moyens raisonnables pour assurer la disponibilité et la fiabilité du service. Toutefois, CléAvenir ne saurait être tenu responsable de toute interruption de service, perte de données ou dommage indirect résultant de l'utilisation de la plateforme.
        </p>
        <p>
          Les informations d'orientation fournies sont générées par des algorithmes d'intelligence artificielle. Bien que nous nous efforcions d'assurer leur pertinence, elles ne remplacent pas l'avis d'un conseiller d'orientation certifié.
        </p>
      </div>

      <div className="legal-section">
        <h2>8. Abonnements et paiements</h2>
        <p>
          Les offres payantes de CléAvenir sont disponibles à la page <a href="/plans" className="text-blue-600 hover:underline">/plans</a>. Les paiements sont sécurisés via Stripe. L'utilisateur bénéficie d'un droit de rétractation de 14 jours pour tout abonnement souscrit en ligne, sauf si les services ont été intégralement consommés dans ce délai.
        </p>
      </div>

      <div className="legal-section">
        <h2>9. Résiliation</h2>
        <p>
          L'utilisateur peut supprimer son compte à tout moment depuis ses paramètres ou en contactant <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline">contact@cleavenir.com</a>. CléAvenir se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU.
        </p>
      </div>

      <div className="legal-section">
        <h2>10. Modifications des CGU</h2>
        <p>
          CléAvenir se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email et/ou notification sur la plateforme. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.
        </p>
      </div>

      <div className="legal-section">
        <h2>11. Droit applicable et litiges</h2>
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige non résolu à l'amiable, les tribunaux compétents du ressort du siège social de CléAvenir seront seuls compétents.
        </p>
        <p>
          Conformément à l'article L. 612-1 du Code de la consommation, l'utilisateur peut recourir gratuitement à un médiateur de la consommation en cas de litige.
        </p>
      </div>
    </LegalLayout>
  );
};

export default ConditionsGeneralesPage;
