import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';

const LegalNoticesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-black text-slate-900">Mentions Légales</h1>
          </div>
          <p className="text-slate-500">Conformément aux dispositions de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>
        </div>

        <Card className="p-8 md:p-12 prose prose-slate max-w-none border-slate-200 shadow-sm bg-white rounded-xl">
          <h2>Éditeur du site</h2>
          <p>Le site <strong>CléAvenir</strong> est édité par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> CléAvenir SAS</li>
            <li><strong>Capital social :</strong> 10 000 €</li>
            <li><strong>Siège social :</strong> 30 rue du Faubourg Saint Vincent, 45000 Orléans, France</li>
            <li><strong>RCS :</strong> Orléans B 123 456 789</li>
            <li><strong>TVA Intracommunautaire :</strong> FR 12 345678910</li>
            <li><strong>Email de contact :</strong> contact@cleavenir.com</li>
          </ul>

          <Separator className="my-8" />

          <h2>Directeur de la publication</h2>
          <p><strong>Nom :</strong> John Doe</p>
          <p><strong>Qualité :</strong> Président</p>

          <Separator className="my-8" />

          <h2>Hébergement</h2>
          <p>Ce site est hébergé par :</p>
          <ul>
            <li><strong>Hébergeur :</strong> Hostinger International Ltd.</li>
            <li><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
            <li><strong>Site web :</strong> <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer">hostinger.fr</a></li>
          </ul>

          <Separator className="my-8" />

          <h2>Propriété Intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>

          <Separator className="my-8" />

          <h2>Protection des Données (RGPD)</h2>
          <p>
            Pour toute information sur la manière dont nous traitons vos données personnelles, veuillez consulter notre <a href="/legal/privacy" className="text-indigo-600 font-medium hover:underline">Politique de Confidentialité</a>.
            Pour exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données à l'adresse <strong>dpo@cleavenir.com</strong>.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LegalNoticesPage;