import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ConditionsGeneralesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet>
        <title>Conditions Générales d'Utilisation - CléAvenir</title>
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-slate-500">Dernière mise à jour : 15 Janvier 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">1. Objet</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site CléAvenir et les conditions d'utilisation du Service par l'Utilisateur.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">2. Accès aux services</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Service, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur. Il est seul responsable du bon fonctionnement de son équipement informatique ainsi que de son accès à internet.
                <br /><br />
                Certaines sections du site sont réservées aux Membres après identification à l'aide de leur Identifiant et de leur Mot de passe.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">3. Propriété intellectuelle</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Les marques, logos, signes ainsi que tout le contenu du site (textes, images, son...) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
                <br /><br />
                L'Utilisateur doit solliciter l'autorisation préalable du site pour toute reproduction, publication, copie des différents contenus. Il s'engage à une utilisation des contenus du site dans un cadre strictement privé, toute utilisation à des fins commerciales et publicitaires est strictement interdite.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">4. Données personnelles</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                CléAvenir s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site cleavenir.com, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">5. Responsabilité</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Les sources des informations diffusées sur le site CléAvenir sont réputées fiables mais le site ne garantit pas qu'il soit exempt de défauts, d'erreurs ou d'omissions.
                <br /><br />
                Les informations communiquées sont présentées à titre indicatif et général sans valeur contractuelle. Malgré des mises à jour régulières, le site CléAvenir ne peut être tenu responsable de la modification des dispositions administratives et juridiques survenant après la publication.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ConditionsGeneralesPage;