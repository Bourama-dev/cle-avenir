import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Rocket, ShieldCheck, Globe } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

const AboutPage = ({ onNavigate }) => {
  const values = [
    { icon: <Heart className="w-6 h-6" />, title: "Empathie", desc: "Nous mettons l'humain au cœur de notre technologie. L'orientation est avant tout une histoire de personnes." },
    { icon: <Target className="w-6 h-6" />, title: "Précision", desc: "Nos algorithmes sont basés sur des données réelles et vérifiées pour offrir des conseils justes et pertinents." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Transparence", desc: "Pas de boite noire. Nous expliquons toujours pourquoi nous vous recommandons un métier." },
    { icon: <Globe className="w-6 h-6" />, title: "Accessibilité", desc: "Nous croyons que chacun mérite de trouver sa voie, quel que soit son parcours ou ses moyens." }
  ];

  const team = [
    { name: "Bourama Diarra", role: "CEO & Fondateur", icon: <Users className="w-full h-full text-slate-500" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SEOHead title="À propos de nous - CléAvenir" description="Découvrez l'équipe et la mission derrière CléAvenir, la plateforme d'orientation nouvelle génération." />
      {/* Header removed to avoid duplication */}
      
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
            >
              Réinventer l'orientation <span className="text-primary">pour tous.</span>
            </motion.h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Nous utilisons l'intelligence artificielle pour démocratiser l'accès au conseil de carrière de haute qualité.
            </p>
         </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Notre Mission</h2>
                <div className="prose prose-lg text-slate-600">
                  <p>
                    Trop de personnes subissent leur vie professionnelle par manque d'information ou de confiance. 
                    L'orientation scolaire et professionnelle traditionnelle est souvent coûteuse, déconnectée de la réalité du marché, ou trop générique.
                  </p>
                  <p>
                    Chez CléAvenir, nous avons bâti une technologie capable d'analyser des millions de données 
                    pour offrir à chacun un GPS de carrière personnalisé, précis et actionnable.
                  </p>
                </div>
             </div>
             <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Équipe travaillant ensemble" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 max-w-xs">
                   <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full text-green-600"><Rocket className="w-6 h-6"/></div>
                      <div>
                         <div className="font-bold text-slate-900">200+</div>
                         <div className="text-sm text-slate-500">Utilisateurs accompagnés</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Nos Valeurs</h2>
               <p className="text-slate-500 mt-4">Ce qui guide nos décisions au quotidien.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {values.map((val, i) => (
                 <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                       {val.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                    <p className="text-slate-600 text-sm">{val.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-16">L'équipe</h2>
            <div className="flex justify-center"> 
               {team.map((member, i) => (
                  <div key={i} className="group flex flex-col items-center max-w-sm"> 
                     <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white flex items-center justify-center bg-slate-100">
                        {member.icon}
                     </div>
                     <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                     <p className="text-primary text-sm font-medium">{member.role}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Envie de nous rejoindre ?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
               Nous sommes toujours à la recherche de talents passionnés par l'éducation et la technologie.
            </p>
            <div className="flex justify-center gap-4">
               <Button onClick={() => onNavigate('/contact')} size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Contactez-nous
               </Button>
               <Button variant="outline" onClick={() => onNavigate('/offres-emploi')} className="border-slate-600 text-white hover:bg-slate-800">
                  Voir nos offres
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;