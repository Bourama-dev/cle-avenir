import React from 'react';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/Counter';

// Only verifiable facts here: ROME référentiel size, official data sources, free service.
const stats = [
  { value: 1500, suffix: "+", label: "Fiches métiers (référentiel ROME)" },
  { value: 3, suffix: "", label: "Sources officielles : France Travail, Parcoursup, ONISEP" },
  { value: 100, suffix: "%", label: "Gratuit, sans carte bancaire" }
];

const ResultsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500 mb-2 flex justify-center items-center gap-1">
                <Counter from={0} to={stat.value} duration={2} />
                <span>{stat.suffix}</span>
              </div>
              <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
