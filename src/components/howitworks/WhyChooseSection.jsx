import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Heart } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Intelligence Artificielle",
    description: "Notre algorithme analyse vos réponses en temps réel pour construire un profil psychométrique ultra-précis.",
    color: "from-rose-500 to-orange-500",
    bg: "bg-rose-50 text-rose-600"
  },
  {
    icon: Target,
    title: "Précision Marché",
    description: "Nous croisons votre profil avec les données réelles de 200+ métiers et les tendances actuelles de l'emploi.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50 text-violet-600"
  },
  {
    icon: Zap,
    title: "Rapidité & Efficacité",
    description: "Oubliez les bilans de 3 mois. Obtenez des pistes concrètes et actionnables en moins de 10 minutes.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 text-blue-600"
  },
  {
    icon: Heart,
    title: "Approche Humaine",
    description: "Au-delà des compétences, nous prenons en compte vos valeurs, vos passions et votre équilibre de vie.",
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50 text-emerald-600"
  }
];

const WhyChooseSection = () => {
  return (
    <section id="why-us" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 md:mb-24 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600">CléAvenir</span> ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Une technologie de pointe au service de votre épanouissement professionnel.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group relative overflow-hidden h-full flex flex-col"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background blobs - optimized with simple CSS */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
    </section>
  );
};

export default WhyChooseSection;