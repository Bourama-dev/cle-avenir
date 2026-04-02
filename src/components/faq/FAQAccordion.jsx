import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import './FAQAccordion.css';

const FAQAccordion = ({ items, searchTerm }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun résultat trouvé</h3>
        <p className="text-slate-500">
          Nous n'avons trouvé aucune question correspondant à "{searchTerm}". 
          <br />Essayez avec d'autres mots-clés ou parcourez les catégories.
        </p>
      </div>
    );
  }

  return (
    <div className="faq-accordion-container max-w-3xl mx-auto px-4">
      <Accordion type="single" collapsible className="space-y-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <AccordionItem value={`item-${index}`} className="faq-item border-none rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="faq-trigger px-6 py-4 hover:no-underline text-left">
                  <span className="text-lg font-semibold text-slate-800">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="faq-content px-6 pb-6 pt-0 text-slate-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  {item.link && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <a href={item.link} className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center">
                        En savoir plus →
                      </a>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </Accordion>
    </div>
  );
};

export default FAQAccordion;