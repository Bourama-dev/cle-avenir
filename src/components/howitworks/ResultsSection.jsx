import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Counter from '@/components/ui/Counter';

const stats = [
  { value: 95, suffix: "%", label: "Satisfaction Utilisateurs" },
  { value: 200, suffix: "+", label: "Utilisateurs Actifs" },
  { value: 200, suffix: "+", label: "Métiers Matchés" }
];

const testimonials = [
  {
    name: "Thomas Dubois",
    role: "Étudiant en reconversion",
    quote: "J'étais complètement perdu après mon bac. CléAvenir m'a permis de découvrir des métiers du numérique que je ne connaissais même pas.",
    rating: 5,
    initials: "TD"
  },
  {
    name: "Sarah Martin",
    role: "Responsable Marketing",
    quote: "Le test est bluffant de précision. En 10 minutes, il a cerné ma personnalité mieux que certains bilans qui m'ont coûté des centaines d'euros.",
    rating: 5,
    initials: "SM"
  },
  {
    name: "Léa Petit",
    role: "Lycéenne",
    quote: "Grâce au plan d'action, j'ai su exactement quelles spécialités choisir pour mon orientation. Un vrai soulagement !",
    rating: 5,
    initials: "LP"
  }
];

const ResultsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600 mb-2 flex justify-center items-center gap-1">
                <Counter from={0} to={stat.value} duration={2} />
                <span>{stat.suffix}</span>
              </div>
              <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Ils ont trouvé leur voie
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg"
          >
            Rejoignez notre communauté de talents épanouis
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 relative group hover:shadow-xl transition-all h-full flex flex-col"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-rose-100 group-hover:text-rose-200 transition-colors" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-600 mb-8 italic leading-relaxed flex-grow">"{t.quote}"</p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;