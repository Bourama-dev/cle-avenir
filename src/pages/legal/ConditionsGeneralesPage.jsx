import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';

const ConditionsGeneralesPage = () => {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Règles et conditions régissant l'utilisation de la plateforme CléAvenir."
      lastUpdated="15 janvier 2024"
    >
      <div className="legal-section">
        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site 
          <strong>CléAvenir</strong> et les conditions d'utilisation du Service par l'Utilisateur.
        </p>
        <p>
          Tout accès et/ou utilisation du site suppose l'acceptation et le respect de l'ensemble des termes des présentes Conditions et leur acceptation inconditionnelle.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Accès au site</h2>
        <p>
          Le site CléAvenir est accessible gratuitement à tout Utilisateur disposant d'un accès à Internet. 
          Tous les coûts afférents à l'accès au Service, que ce soit les frais matériels, logiciels ou d'accès à Internet sont exclusivement à la charge de l'utilisateur. 
          Il est seul responsable du bon fonctionnement de son équipement informatique ainsi que de son accès à Internet.
        </p>
      </div>

      <div className="legal-section">
        <h2>3. Inscription et compte utilisateur</h2>
        <p>
          Certaines fonctionnalités du site nécessitent la création d'un compte utilisateur. Lors de l'inscription, l'Utilisateur s'engage à fournir des informations exactes, complètes et à jour.
        </p>
        <p>
          L'Utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée sous son compte. 
          En cas d'utilisation non autorisée de son compte, l'Utilisateur doit en informer immédiatement CléAvenir.
        </p>
      </div>

      <div className="legal-section">
        <h2>4. Services offerts</h2>
        <p>CléAvenir propose une plateforme d'orientation professionnelle et académique incluant :</p>
        <ul>
          <li>Des tests d'orientation adaptatifs et personnalisés.</li>
          <li>Des analyses détaillées de profils et suggestions de métiers.</li>
          <li>Des conseils carrière et parcours de formation.</li>
          <li>Un suivi de progression et des objectifs.</li>
          <li>L'accès à une base de données de ressources éducatives et professionnelles.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>5. Utilisation acceptable</h2>
        <p>L'Utilisateur s'engage à ne pas utiliser le site pour :</p>
        <ul>
          <li>Diffuser des contenus illégaux, nuisibles, menaçants, injurieux, harcelants, diffamatoires, vulgaires, obscènes.</li>
          <li>Porter atteinte à la vie privée d'autrui.</li>
          <li>Usurper l'identité d'une personne physique ou morale.</li>
          <li>Transmettre des virus informatiques ou tout autre code malveillant.</li>
          <li>Tenter d'accéder sans autorisation aux systèmes informatiques de CléAvenir.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>6. Propriété intellectuelle</h2>
        <p>
          Tous les éléments du site (textes, images, logos, logiciels, bases de données) sont la propriété exclusive de Horizons ou de ses partenaires 
          et sont protégés par le droit de la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle du site ou de son contenu, 
          par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Limitation de responsabilité</h2>
        <p>
          CléAvenir met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au Service, mais n'est tenu à aucune obligation d'y parvenir.
        </p>
        <p>
          CléAvenir ne peut, en outre, être tenue responsable de tout dysfonctionnement du réseau ou des serveurs ou de tout autre événement échappant au contrôle raisonnable, 
          qui empêcherait ou dégraderait l'accès au Service.
        </p>
      </div>

      <div className="legal-section">
        <h2>8. Résiliation</h2>
        <p>
          Tout Utilisateur peut demander la suppression de son compte à tout moment. 
          CléAvenir se réserve également le droit de suspendre ou de supprimer le compte d'un Utilisateur qui ne respecterait pas les présentes CGU, 
          sans préavis ni indemnité.
        </p>
      </div>

      <div className="legal-section">
        <h2>9. Modification des conditions</h2>
        <p>
          CléAvenir se réserve la possibilité de modifier, à tout moment et sans préavis, les présentes conditions d'utilisation afin de les adapter aux évolutions du site et/ou de son exploitation.
        </p>
      </div>

      <div className="legal-section">
        <h2>10. Droit applicable</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation sont soumises au droit français. En cas de litige non résolu à l'amiable, 
          les tribunaux français seront seuls compétents.
        </p>
      </div>
    </LegalLayout>
  );
};

export default ConditionsGeneralesPage;