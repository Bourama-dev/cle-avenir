import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import './FAQHero.css';

const FAQHero = () => {
  return (
    <section className="faq-hero">
      <div className="faq-hero-overlay"></div>
      <div className="faq-hero-content container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 mb-6 text-white">
            <HelpCircle className="w-4 h-4 text-yellow-300" />
            <span>Centre d'aide CléAvenir</span>
          </div>

          <h1 className="faq-hero-title">
            Comment pouvons-nous <br className="md:hidden" />
            <span className="text-yellow-300">vous aider ?</span>
          </h1>
          
          <p className="faq-hero-subtitle">
            Trouvez rapidement des réponses à vos questions sur l'orientation, notre méthode, ou votre compte.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="faq-circle faq-circle-1" />
        <div className="faq-circle faq-circle-2" />
      </div>
    </section>
  );
};

export default FAQHero;