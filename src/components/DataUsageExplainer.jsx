import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck } from 'lucide-react';

const DataUsageExplainer = () => {
  return (
    <div className="my-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
      <h3 className="flex items-center text-sm font-semibold text-slate-800 mb-3">
        <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
        Pourquoi nous collectons ces données ?
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="fullname">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Nom complet</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Utilisé pour personnaliser votre interface et vos communications officielles (attestations, factures).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="email">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Email (Requis)</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Nécessaire pour la sécurisation de votre compte, la connexion unique et les notifications importantes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="phone">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Téléphone (Optionnel)</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Utilisé uniquement pour la double authentification (si activée) ou les mises à jour urgentes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="institution">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Établissement / Organisation</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Nous aide à vous proposer des ressources adaptées à votre contexte scolaire ou professionnel.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="role">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Rôle / Situation</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Permet d'adapter l'expérience utilisateur (ex: étudiant vs professionnel en reconversion).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="country">
          <AccordionTrigger className="text-xs hover:no-underline py-2">Pays / Région</AccordionTrigger>
          <AccordionContent className="text-xs text-slate-600">
            Assure la conformité avec les réglementations locales (RGPD) et l'hébergement de vos données.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DataUsageExplainer;