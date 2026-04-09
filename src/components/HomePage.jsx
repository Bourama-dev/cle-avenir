import React, { Suspense, lazy } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, Search, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHelmet from '@/components/SEO/PageHelmet';

// Lazy load non-critical components
const BlogCarousel = lazy(() => import('@/components/BlogCarousel'));
const HeroScene3D = lazy(() => import('@/components/three/HeroScene3D'));

const HomePage = ({
  onNavigate
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHelmet
        title="CléAvenir - Test de Carrière Intelligent & Orientation IA"
        description="Découvrez votre avenir professionnel avec CléAvenir. Test d'orientation gratuit, analyse IA des compétences, fiches métiers, formations et offres d'emploi."
        keywords="orientation professionnelle, test carrière, métiers, formations, emploi, IA, Parcoursup"
        image="https://cleavenir.com/og-image.jpg"
        breadcrumbs={[
          { name: 'Accueil', url: '/' }
        ]}
      />
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-50 to-white -z-10 rounded-bl-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-cyan-50 to-white -z-10 rounded-tr-[100px] opacity-40"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-medium text-sm">
              <Sparkles size={16} className="mr-2 fill-rose-600" />
              <span>L'intelligence artificielle au service de ton avenir</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Trouve ta voie avec <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500">
                CléAvenir
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
              Une approche révolutionnaire pour découvrir les métiers qui te correspondent vraiment. Simple, rapide et 100% personnalisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => onNavigate('/test-orientation')} size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-rose-200 bg-rose-600 hover:bg-rose-700 hover:scale-105 transition-all duration-300">
                Faire le test gratuit <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('/how-it-works')} 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-300"
              >
                Comment ça marche ?
              </Button>
            </div>

            <div className="pt-8 flex items-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-5 h-5" /> Sans inscription
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-5 h-5" /> Résultat immédiat
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-5 h-5" /> 100% Gratuit
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[600px] hidden lg:flex items-center justify-center"
          >
            {/* Halo de fond */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/40 to-cyan-100/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

            {/* Scène 3D interactive */}
            <div className="relative w-full h-full" style={{ minHeight: '520px' }}>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 animate-pulse blur-sm" />
                </div>
              }>
                <HeroScene3D />
              </Suspense>

              {/* Labels UI flottants par-dessus le canvas */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute left-0 top-1/4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-rose-100 z-20 max-w-[180px] pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600"><Target size={16} /></div>
                  <span className="font-bold text-slate-800 text-sm">Précision IA</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-violet-500 w-[95%]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute right-0 bottom-1/4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-cyan-100 z-20 pointer-events-none"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600"><Zap size={16} /></div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Match Métier</div>
                    <div className="text-xs text-slate-500">Développeur Fullstack</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
                className="absolute right-8 top-1/4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-violet-100 z-20 pointer-events-none"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-violet-500" />
                  <span className="text-xs font-semibold text-slate-700">RIASEC analysé</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tout pour réussir ton orientation</h2>
            <p className="text-slate-600 text-lg">Une suite d'outils complète pour passer de la réflexion à l'action.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: <Search className="w-8 h-8 text-rose-600" />,
              title: "Exploration Métiers",
              desc: "Découvre des milliers de fiches métiers détaillées avec salaires et débouchés.",
              color: "rose",
              link: "/metiers"
            }, {
              icon: <GraduationCap className="w-8 h-8 text-cyan-500" />,
              title: "Formations Adaptées",
              desc: "Trouve l'école ou la formation idéale pour atteindre ton objectif professionnel.",
              color: "cyan",
              link: "/formations"
            }, {
              icon: <Zap className="w-8 h-8 text-rose-600" />,
              title: "Coaching IA (Cléo)",
              desc: "Un assistant personnel disponible 24/7 pour répondre à toutes tes questions.",
              color: "rose",
              link: "/cleo"
            }].map((feature, i) => (
               <div 
                 key={i} 
                 className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                 onClick={() => onNavigate(feature.link)}
               >
                  <div className={`w-16 h-16 rounded-2xl ${feature.color === 'cyan' ? 'bg-cyan-50' : 'bg-rose-50'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{feature.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     Découvrir <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Carousel Section */}
      <Suspense fallback={<div className="h-[500px] w-full bg-slate-50 animate-pulse" />}>
        <BlogCarousel />
      </Suspense>
      
      {/* Call to Action */}
      <section className="py-24">
         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden">
               {/* Decorative blobs */}
               <div className="absolute top-0 left-0 w-64 h-64 bg-rose-600 rounded-full blur-[100px] opacity-30"></div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
               
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Prêt à dessiner ton avenir ?</h2>
                  <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Rejoins plus de 200+ utilisateurs qui ont trouvé leur voie grâce à CléAvenir.</p>
                  <Button onClick={() => onNavigate('/test-orientation')} size="lg" className="h-16 px-10 text-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full shadow-lg border-0">
                    Commencer maintenant
                  </Button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;