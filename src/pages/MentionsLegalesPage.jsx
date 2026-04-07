import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MentionsLegalesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet>
        <title>Mentions Légales - CléAvenir</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mentions Légales</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-2">
              <p>Le site <strong>CléAvenir</strong> est édité par la société <strong>FutureKey SAS</strong>.</p>
              <p><strong>Siège social :</strong> 30 rue du Faubourg Saint Vincent, 45000 Orléans, France</p>
              <p><strong>Capital social :</strong> 10 000 €</p>
              <p><strong>RCS :</strong> Orléans B 123 456 789</p>
              <p><strong>Numéro de TVA intracommunautaire :</strong> FR 12 123456789</p>
              <p><strong>Directeur de la publication :</strong> M. le Directeur Général</p>
              <p><strong>Email :</strong> contact@cleavenir.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Hébergement</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-2">
              <p>Le site est hébergé par :</p>
              <p><strong>Nom de l'hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
              <p><strong>Site web :</strong> https://vercel.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-2">
              <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-2">
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.</p>
              <p>Pour exercer ce droit, veuillez consulter notre <a href="/politique-confidentialite" className="text-violet-600 hover:underline">Politique de Confidentialité</a> ou nous contacter à dpo@cleavenir.com.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;