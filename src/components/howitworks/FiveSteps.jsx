import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Lightbulb, Map, Rocket } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Test Adaptatif",
    description: "Répondez à des questions qui s'adaptent à votre profil. Notre IA analyse vos réponses en temps réel.",
    icon: Brain
  },
  {
    id: "02",
    title: "Analyse Profil",
    description: "Découvrez votre profil psychométrique complet : forces, motivations et environnement de travail idéal.",
    icon: Search
  },
  {
    id: "03",
    title: "Matching Métiers",
    description: "Accédez à votre Top 5 des métiers compatibles parmi plus de 200 références croisées avec le marché.",
    icon: Lightbulb
  },
  {
    id: "04",
    title: "Feuille de Route",
    description: "Obtenez un plan d'action personnalisé : formations, écoles et compétences à acquérir pour réussir.",
    icon: Map
  },
  {
    id: "05",
    title: "Lancement",
    description: "Postulez aux offres, préparez vos entretiens avec notre coach IA et décrochez le job de vos rêves.",
    icon: Rocket
  }
];

const FiveSteps = () => {
  return (
    <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Votre parcours en <span className="text-rose-600">5 étapes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600"
          >
            Simple, fluide et efficace.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Line Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-violet-200 to-transparent -translate-x-1/2 z-0" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className="flex-1 text-center md:text-left w-full">
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'} items-center`}>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-200 to-violet-200 mb-4 block md:hidden">
                      {step.id}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className={`text-slate-600 leading-relaxed max-w-md ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} text-center`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Icon/Number */}
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-slate-50 relative z-10 group transition-transform hover:scale-110 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <step.icon className="w-6 h-6 md:w-8 md:h-8 text-slate-700 group-hover:text-white transition-colors relative z-10" />
                </div>

                {/* Empty Side for layout balance on desktop */}
                <div className="flex-1 hidden md:flex flex-col justify-center">
                  <span className={`text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-100 opacity-50 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    {step.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiveSteps;