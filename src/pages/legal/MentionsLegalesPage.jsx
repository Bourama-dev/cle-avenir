import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';

const MentionsLegalesPage = () => {
  return (
    <LegalLayout
      title="Mentions Légales"
      subtitle="Informations légales et réglementaires concernant l'éditeur du site CléAvenir."
      lastUpdated="15 janvier 2024"
    >
      <div className="legal-section">
        <h2>1. Identification de l'éditeur</h2>
        <p>
          Le site <strong>CléAvenir</strong> est édité par la société <strong>Horizons</strong>, 
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
          <strong>Hostinger International Ltd.</strong><br/>
          61 Lordou Vironos Street, 6023 Larnaca, Chypre<br/>
          Site web : <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.hostinger.fr</a>
        </p>
      </div>

      <div className="legal-section">
        <h2>3. Responsable du site</h2>
        <p>
          <strong>Directeur de la publication :</strong> Direction Horizons<br/>
          Pour toute demande concernant le contenu éditorial, veuillez nous contacter à l'adresse email mentionnée ci-dessus.
        </p>
      </div>

      <div className="legal-section">
        <h2>4. Propriété intellectuelle</h2>
        <p>
          L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
          Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
        </p>
        <p>
          La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
        </p>
      </div>

      <div className="legal-section">
        <h2>5. Limitation de responsabilité</h2>
        <p>
          Horizons s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
          Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site.
        </p>
        <p>
          En conséquence, Horizons décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
        </p>
      </div>

      <div className="legal-section">
        <h2>6. Liens externes</h2>
        <p>
          Le site CléAvenir peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. 
          Les liens vers ces autres ressources vous font quitter le site CléAvenir.
        </p>
        <p>
          Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse d'Horizons. 
          Aucune autorisation ou demande d'information préalable ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur. 
          Il convient toutefois d'afficher ce site dans une nouvelle fenêtre du navigateur.
        </p>
      </div>

      <div className="legal-section">
        <h2>7. Modification des conditions</h2>
        <p>
          Horizons se réserve le droit de modifier les présentes mentions légales à tout moment. 
          L'utilisateur s'engage donc à les consulter régulièrement.
        </p>
      </div>

      <div className="legal-section">
        <h2>8. Droit applicable</h2>
        <p>
          Tant le présent site que les modalités et conditions de son utilisation sont régis par le droit français, 
          quel que soit le lieu d'utilisation. En cas de contestation éventuelle, et après l'échec de toute tentative 
          de recherche d'une solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.
        </p>
      </div>
    </LegalLayout>
  );
};

export default MentionsLegalesPage;