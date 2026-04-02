import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      q: "Est-ce que le test est vraiment gratuit ?",
      a: "Oui, la première analyse et la découverte de vos 5 métiers principaux sont entièrement gratuites. Une version Premium existe pour ceux qui souhaitent aller plus loin (plan d'action détaillé, coach illimité), mais l'essentiel est accessible à tous."
    },
    {
      q: "Combien de temps dure le test ?",
      a: "Grâce à notre algorithme adaptatif, le test dure en moyenne entre 7 et 10 minutes. Il s'ajuste en temps réel à vos réponses pour être le plus efficace possible."
    },
    {
      q: "Mes résultats peuvent-ils changer ?",
      a: "Oui, car vous évoluez ! Vous pouvez repasser le test à différents moments de votre vie. Votre profil est dynamique et s'enrichit au fur et à mesure de vos expériences."
    },
    {
      q: "Cléo remplace-t-elle un conseiller d'orientation ?",
      a: "Cléo est un outil complémentaire puissant disponible 24/7. Pour des situations très complexes, l'humain reste important, mais Cléo couvre 90% des besoins d'information et d'analyse initiale."
    },
    {
      q: "Puis-je utiliser CléAvenir sur mobile ?",
      a: "Absolument. Toute la plateforme est conçue pour être parfaitement utilisable sur smartphone, tablette et ordinateur."
    },
    {
      q: "Comment sont calculés les scores de matching ?",
      a: "Nous utilisons un algorithme vectoriel qui compare vos traits de personnalité, intérêts et compétences avec les profils types de plus de 200 métiers, en pondérant avec la demande du marché."
    },
    {
      q: "Comment contacter le support ?",
      a: "Vous pouvez contacter notre équipe support directement depuis votre espace utilisateur ou via la page de contact. Nous répondons généralement sous 24h ouvrées."
    },
    {
      q: "Mes données sont-elles partagées avec les écoles ?",
      a: "Uniquement si vous donnez votre accord explicite lors d'une demande de mise en relation. Sinon, vos données restent strictement confidentielles et ne sont jamais partagées."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-50" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Questions Fréquentes
          </motion.h2>
          <p className="text-slate-600 text-lg">
            Tout ce que vous devez savoir avant de commencer
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6"
        >
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100 last:border-0">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-rose-600 hover:no-underline px-2 py-4 text-base sm:text-lg transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 px-2 pb-4 pt-0 leading-relaxed text-sm sm:text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;