import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

const classics = [
  "Tests longs et fastidieux (45min+)",
  "Résultats génériques et peu précis",
  "Données marché souvent obsolètes",
  "Pas de plan d'action concret",
  "Coût élevé (Bilan de compétences)"
];

const moderns = [
  "Test adaptatif intelligent (7-10 min)",
  "Profil psychométrique ultra-précis",
  "Données emploi en temps réel",
  "Feuille de route formation & emploi",
  "Accessible gratuitement"
];

const ComparisonSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Changez de méthode
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600"
          >
            Découvrez la différence CléAvenir
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Classic Method */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-8 -mt-8 z-0 opacity-50 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <X className="w-5 h-5" />
                </span>
                Orientation Classique
              </h3>
              <ul className="space-y-6 flex-grow">
                {classics.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4 text-slate-600 group"
                  >
                    <X className="w-5 h-5 text-red-400 mt-0.5 shrink-0 group-hover:text-red-600 transition-colors" />
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* CléAvenir Method */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-white h-full transform transition-transform hover:scale-[1.02] duration-300"
          >
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-rose-500/10 to-violet-500/10 z-0 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0 shadow-lg shadow-green-500/10">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                Méthode CléAvenir
              </h3>
              <ul className="space-y-6 flex-grow">
                {moderns.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4 group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0 group-hover:text-green-300 transition-colors" />
                    <span className="font-medium text-slate-100">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;