import React, { Suspense, lazy, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, Search, GraduationCap } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import PageHelmet from '@/components/SEO/PageHelmet';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import TiltCard from '@/components/ui/TiltCard';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';

const BlogCarousel = lazy(() => import('@/components/BlogCarousel'));

const FEATURES = [
  {
    icon: <Search className="w-8 h-8 text-rose-600" />,
    title: "Exploration Métiers",
    desc: "Découvre des milliers de fiches métiers détaillées avec salaires et débouchés.",
    color: "rose",
    link: "/metiers",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-cyan-500" />,
    title: "Formations Adaptées",
    desc: "Trouve l'école ou la formation idéale pour atteindre ton objectif professionnel.",
    color: "cyan",
    link: "/formations",
  },
  {
    icon: <Zap className="w-8 h-8 text-rose-600" />,
    title: "Coaching IA (Cléo)",
    desc: "Un assistant personnel disponible 24/7 pour répondre à toutes tes questions.",
    color: "rose",
    link: "/cleo",
  },
];

const CHECKS = ["Sans inscription", "Résultat immédiat", "100% Gratuit"];

const HomePage = ({ onNavigate }) => {
  const heroRef = useRef(null);
  const reduce = useReducedMotion();

  // Parallax: track scroll within the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroTextY   = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -55]);
  const heroImageY  = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -28]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHelmet
        title="CléAvenir - Test de Carrière Intelligent & Orientation IA"
        description="Découvrez votre avenir professionnel avec CléAvenir. Test d'orientation gratuit, analyse IA des compétences, fiches métiers, formations et offres d'emploi."
        keywords="orientation professionnelle, test carrière, métiers, formations, emploi, IA, Parcoursup"
        image="https://cleavenir.com/og-image.jpg"
        breadcrumbs={[{ name: 'Accueil', url: '/' }]}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative px-6 pt-16 pb-24 md:pt-32 md:pb-32 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-50 to-white -z-10 rounded-bl-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-cyan-50 to-white -z-10 rounded-tr-[100px] opacity-40" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text + CTA (parallax layer) */}
          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-medium text-sm"
            >
              <Sparkles size={16} className="mr-2 fill-rose-600" />
              <span>L'intelligence artificielle au service de ton avenir</span>
            </motion.div>

            {/* Title — word-by-word reveal */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              <TextReveal text="Trouve ta voie avec" delay={0.2} stagger={0.07} />
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500"
              >
                CléAvenir
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg"
            >
              Une approche révolutionnaire pour découvrir les métiers qui te correspondent vraiment. Simple, rapide et 100% personnalisé.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <MagneticButton strength={0.2}>
                <Button
                  onClick={() => onNavigate('/test-orientation')}
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full shadow-xl shadow-rose-200 bg-rose-600 hover:bg-rose-700 hover:scale-105 transition-all duration-300"
                >
                  Faire le test gratuit <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('/how-it-works')}
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-300"
                >
                  Comment ça marche ?
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Check list — staggered */}
            <AnimatedSection className="pt-8 flex items-center gap-6 text-sm font-medium text-slate-500" delay={1}>
              {CHECKS.map((label) => (
                <AnimatedItem key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="text-success w-5 h-5 flex-shrink-0" />
                  {label}
                </AnimatedItem>
              ))}
            </AnimatedSection>
          </motion.div>

          {/* Right — image + floating cards (parallax layer) */}
          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-cyan-100 rounded-full blur-3xl opacity-60 animate-pulse" />
              <img
                alt="Jeune professionnel confiant utilisant une application sur tablette"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl shadow-rose-900/10 rotate-3 hover:rotate-0 transition-transform duration-500"
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/b332e387-2771-4da0-b054-67325add24f3-ouwvH.png"
              />

              {/* Floating card 1 — Précision IA */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-rose-100 z-20 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                    <Target size={20} />
                  </div>
                  <span className="font-bold text-slate-800">Précision IA</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-rose-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>

              {/* Floating card 2 — Match Métier */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -1, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, delay: 1, ease: 'easeInOut' }}
                className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-cyan-100 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Match Métier</div>
                    <div className="text-xs text-slate-500">Développeur Fullstack</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                <TextReveal text="Tout pour réussir ton orientation" />
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <p className="text-slate-600 text-lg">
                Une suite d'outils complète pour passer de la réflexion à l'action.
              </p>
            </AnimatedItem>
          </AnimatedSection>

          {/* Cards — staggered + tilt */}
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <AnimatedItem key={i}>
                <TiltCard
                  intensity={6}
                  glare={0.12}
                  onClick={() => onNavigate(feature.link)}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 cursor-pointer group h-full"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${
                      feature.color === 'cyan' ? 'bg-cyan-50' : 'bg-rose-50'
                    } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{feature.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Découvrir <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </TiltCard>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ── Blog Carousel ─────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-[500px] w-full bg-slate-50 animate-pulse" />}>
        <BlogCarousel />
      </Suspense>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <AnimatedItem>
              <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden">
                {/* Animated blobs */}
                <motion.div
                  className="absolute top-0 left-0 w-64 h-64 bg-rose-600 rounded-full blur-[100px] opacity-30"
                  animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"
                  animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    <TextReveal text="Prêt à dessiner ton avenir ?" stagger={0.06} />
                  </h2>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto"
                  >
                    Rejoins plus de 200+ utilisateurs qui ont trouvé leur voie grâce à CléAvenir.
                  </motion.p>

                  <MagneticButton strength={0.18}>
                    <Button
                      onClick={() => onNavigate('/test-orientation')}
                      size="lg"
                      className="h-16 px-10 text-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full shadow-lg border-0"
                    >
                      Commencer maintenant
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
