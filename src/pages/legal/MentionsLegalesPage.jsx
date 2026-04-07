import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';

const MentionsLegalesPage = () => {
  return (
    <LegalLayout
      title="Mentions Légales"
      subtitle="Informations légales et réglementaires concernant l'éditeur du site CléAvenir."
      lastUpdated="8 avril 2026"
    >
      <div className="legal-section">
        <h2>1. Identification de l'éditeur</h2>
        <p>
          Le site <strong>CléAvenir</strong> est édité par la société <strong>CléAvenir</strong>,
          Société par Actions Simplifiée (SAS) au capital de 10 000 €.
        </p>
        <ul>
          <li><strong>Siège social :</strong> 30 rue du Faubourg Saint Vincent, 45000 Orléans, France</li>
          <li><strong>Immatriculation :</strong> RCS Orléans</li>
          <li><strong>Numéro SIREN :</strong> 932 419 013</li>
          <li><strong>Numéro de TVA intracommunautaire :</strong> FR82932419013</li>
          <li><strong>Email de contact :</strong> <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline">contact@cleavenir.com</a></li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>2. Hébergement</h2>
        <p>
          Le site est hébergé par :<br/>
          <strong>Vercel Inc.</strong><br/>
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br/>
          Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://vercel.com</a>
        </p>
      </div>

      <div className="legal-section">
        <h2>3. Directeur de la publication</h2>
        <p>
          Le directeur de la publication est le représentant légal de la société CléAvenir.<br/>
          Pour toute demande concernant le contenu éditorial, veuillez nous contacter à :&nbsp;
          <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline">contact@cleavenir.com</a>
        </p>
      </div>

      <div className="legal-section">
        <h2>4. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, logos, graphismes, logiciels, bases de données, structure) est la propriété exclusive de CléAvenir ou de ses partenaires et est protégé par le droit de la propriété intellectuelle français et international.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou diffusion, totale ou partielle, sans l'autorisation écrite préalable de CléAvenir est strictement interdite.
        </p>
      </div>

      <div className="legal-section">
        <h2>5. Limitation de responsabilité</h2>
        <p>
          CléAvenir s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, CléAvenir ne peut garantir l'exhaustivité ou l'absence d'erreur des informations publiées et décline toute responsabilité pour toute imprécision ou omission.
        </p>
        <p>
          Les informations fournies sur la plateforme, notamment les suggestions d'orientation professionnelle, sont à titre indicatif et ne constituent pas un conseil professionnel certifié.
        </p>
      </div>

      <div className="legal-section">
        <h2>6. Liens hypertextes</h2>
        <p>
          Le site CléAvenir peut contenir des liens vers des sites tiers. CléAvenir n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu. La création de liens vers le site CléAvenir est autorisée sous réserve d'affichage dans une nouvelle fenêtre.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige non résolu à l'amiable, les tribunaux français seront seuls compétents.
        </p>
      </div>
    </LegalLayout>
  );
};

export default MentionsLegalesPage;
