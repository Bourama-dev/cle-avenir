import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, Sparkles, Target, Zap, Search,
  GraduationCap, Users, BookOpen, Clock, ChevronRight, Briefcase,
} from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import PageHelmet from '@/components/SEO/PageHelmet';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import TiltCard from '@/components/ui/TiltCard';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';

const NewsPreview = lazy(() => import('@/components/NewsPreview'));

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Search className="w-7 h-7 text-white" />,
    title: "Exploration Métiers",
    desc: "Découvre des milliers de fiches métiers détaillées avec salaires, débouchés et perspectives d'évolution.",
    gradient: 'from-rose-500 to-rose-600',
    shadow: 'shadow-rose-200',
    link: "/metiers",
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-white" />,
    title: "Formations Adaptées",
    desc: "Trouve la formation idéale selon ton niveau, ta région et tes objectifs professionnels.",
    gradient: 'from-cyan-500 to-teal-600',
    shadow: 'shadow-cyan-200',
    link: "/formations",
  },
  {
    icon: <Zap className="w-7 h-7 text-white" />,
    title: "Coaching IA · Cléo",
    desc: "Un assistant personnel disponible 24/7 qui analyse ton profil et t'accompagne pas à pas.",
    gradient: 'from-violet-500 to-indigo-600',
    shadow: 'shadow-violet-200',
    link: "/cleo",
  },
];

const STATS = [
  { value: 5,     suffix: ' min',  label: 'Pour passer le test',       icon: Clock },
  { value: 1000,  suffix: '+',     label: 'Fiches métiers',            icon: Briefcase },
  { value: 10000, suffix: '+',     label: 'Formations référencées',    icon: BookOpen },
  { value: 200,   suffix: '+',     label: 'Utilisateurs orientés',     icon: Users },
];

const STEPS = [
  {
    number: '01',
    icon: <Target className="w-6 h-6" />,
    title: 'Passe le test gratuit',
    desc: "Réponds à quelques questions sur tes centres d'intérêt, tes valeurs et ton parcours. Aucune inscription requise.",
    gradient: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-300',
    link: '/test-orientation',
  },
  {
    number: '02',
    icon: <Zap className="w-6 h-6" />,
    title: 'Cléo analyse ton profil',
    desc: "Notre IA génère une analyse complète de tes compétences, aspirations et affinités métier en quelques secondes.",
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-300',
    link: '/cleo',
  },
  {
    number: '03',
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Explore ta voie',
    desc: "Accède aux métiers, formations et offres d'emploi personnalisés pour toi, avec des données officielles à jour.",
    gradient: 'from-cyan-500 to-teal-600',
    glow: 'shadow-cyan-300',
    link: '/metiers',
  },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function CountUp({ value, suffix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ease * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display.toLocaleString('fr-FR')}{suffix}</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = ({ onNavigate }) => {
  const heroRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroTextY  = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -55]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -28]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHelmet
        title="CléAvenir - Test de Carrière Intelligent & Orientation IA"
        description="Découvrez votre avenir professionnel avec CléAvenir. Test d'orientation gratuit, analyse IA des compétences, fiches métiers, formations et offres d'emploi."
        keywords="orientation, orientation professionnelle, test orientation gratuit, quel métier faire, recherche métier, offres d'emploi, carrière, formation, Parcoursup, alternance, stage, apprentissage, reconversion professionnelle, bilan de compétences, IA orientation, emploi, trouver sa voie, orientation après bac"
        image="https://cleavenir.com/og-image.jpg"
        breadcrumbs={[{ name: 'Accueil', url: '/' }]}
      />

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative px-6 pt-16 pb-32 md:pt-32 md:pb-40 overflow-hidden"
      >
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-rose-50/80 via-rose-50/30 to-transparent -z-10 rounded-bl-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-cyan-50/60 to-transparent -z-10 rounded-tr-[120px]" />
        {/* Dot grid decoration */}
        <div className="absolute inset-0 -z-10 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <motion.div style={{ y: heroTextY }} className="space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-semibold text-sm"
            >
              <Sparkles size={15} className="fill-rose-500 shrink-0" />
              L'intelligence artificielle au service de ton avenir
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              <TextReveal text="Trouve ta voie" delay={0.15} stagger={0.07} />
              <br />
              <TextReveal text="avec" delay={0.35} stagger={0.07} />
              {' '}
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-cyan-500"
              >
                CléAvenir
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-[480px]"
            >
              Orientation personnalisée, analyse IA de ton profil, fiches métiers et formations — tout au même endroit, 100&nbsp;% gratuit.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <MagneticButton strength={0.2}>
                <Button
                  onClick={() => onNavigate('/test-orientation')}
                  size="lg"
                  className="h-14 px-8 text-base font-bold rounded-full shadow-xl shadow-rose-200 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 hover:scale-105 transition-all duration-300 border-0"
                >
                  Faire le test gratuit <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('/how-it-works')}
                  size="lg"
                  className="h-14 px-8 text-base rounded-full border-2 border-slate-200 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50/60 transition-all duration-300"
                >
                  Comment ça marche&nbsp;?
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Trust checks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2"
            >
              {['Sans inscription', 'Résultat immédiat', '100 % Gratuit'].map((label) => (
                <span key={label} className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — image + floating cards */}
          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-cyan-100 rounded-full blur-3xl opacity-70 animate-pulse" />
              <img
                alt="Jeune professionnel confiant utilisant une application sur tablette"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl shadow-rose-900/10 rotate-2 hover:rotate-0 transition-transform duration-700"
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/b332e387-2771-4da0-b054-67325add24f3-ouwvH.png"
              />

              {/* Floating card — Précision IA */}
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute -left-10 top-1/4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-rose-100/80 z-20 max-w-[210px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-white shadow-md shadow-rose-200">
                    <Target size={18} />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Précision IA</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1.4, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">95 % de pertinence</p>
              </motion.div>

              {/* Floating card — Match Métier */}
              <motion.div
                animate={{ y: [0, 14, 0], rotate: [0, -1, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, delay: 1, ease: 'easeInOut' }}
                className="absolute -right-6 bottom-1/4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-cyan-100/80 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl text-white shadow-md shadow-cyan-200">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Match Métier</div>
                    <div className="text-xs text-slate-400">Développeur Fullstack</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card — Source */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, delay: 2, ease: 'easeInOut' }}
                className="absolute right-10 -top-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-violet-100/80 z-20"
              >
                <span className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                  <Sparkles size={12} className="fill-violet-500" /> Analyse IA
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-10 py-16 bg-slate-900 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-1">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-slate-400 text-sm font-medium leading-tight">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-6">

          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <AnimatedItem>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-semibold mb-5 shadow-sm"
              >
                ✨ Nos outils
              </motion.span>
            </AnimatedItem>
            <AnimatedItem>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Tout pour réussir<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500">
                  ton orientation
                </span>
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <p className="text-slate-500 text-lg leading-relaxed">
                Une suite d'outils complète pour passer de la réflexion à l'action.
              </p>
            </AnimatedItem>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <AnimatedItem key={i}>
                <TiltCard
                  intensity={5}
                  glare={0.1}
                  onClick={() => onNavigate(feature.link)}
                  className="bg-white p-8 rounded-3xl border border-slate-100/80 cursor-pointer group h-full hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Subtle gradient wash on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`} />

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${feature.shadow}`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[0.9375rem] mb-6">{feature.desc}</p>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-rose-600 translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </TiltCard>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ══ STEPS ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Faint decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-rose-50 to-cyan-50 opacity-40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">

          <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
            <AnimatedItem>
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-sm font-semibold mb-5">
                Comment ça marche
              </span>
            </AnimatedItem>
            <AnimatedItem>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Ton avenir en{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500">
                  3 étapes
                </span>
              </h2>
            </AnimatedItem>
          </AnimatedSection>

          {/* Steps grid */}
          <div className="relative">
            {/* Connector — desktop */}
            <div className="hidden md:block absolute top-[2.25rem] left-[22%] right-[22%] h-px">
              <div className="w-full h-full bg-gradient-to-r from-rose-200 via-violet-200 to-cyan-200" />
              {/* Arrow midpoints */}
              <div className="absolute left-[48%] top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-violet-300 rotate-45" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Numbered circle */}
                  <div className={`relative w-[4.5rem] h-[4.5rem] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.glow} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 z-10`}>
                    <span className="text-white font-black text-2xl">{step.number}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm max-w-[280px]">{step.desc}</p>

                  <Link
                    to={step.link}
                    className="mt-5 text-sm font-bold text-rose-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-250"
                  >
                    En savoir plus <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA hint */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Button
              onClick={() => onNavigate('/test-orientation')}
              size="lg"
              className="h-13 px-8 rounded-full shadow-lg shadow-rose-200 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 hover:scale-105 transition-all duration-300 border-0 text-base font-bold"
            >
              Commencer maintenant · C'est gratuit <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══ ACTUALITÉS ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-50/60 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto px-6 pt-16 pb-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold mb-4">
            🗞️ Actualités
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            L'emploi & la formation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500">en direct</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Statistiques officielles, réformes et données du marché du travail.
          </p>
        </motion.div>

        <Suspense fallback={<div className="h-[340px] mx-6 my-8 rounded-3xl bg-slate-100 animate-pulse" />}>
          <NewsPreview />
        </Suspense>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <AnimatedItem>
              <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden">
                {/* Animated blobs */}
                <motion.div
                  className="absolute top-0 left-0 w-80 h-80 bg-rose-600 rounded-full blur-[120px] opacity-25"
                  animate={{ scale: [1, 1.3, 1], x: [0, 24, 0], y: [0, -12, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 rounded-full blur-[120px] opacity-20"
                  animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 16, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-10"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm font-semibold mb-8"
                  >
                    <Sparkles size={14} className="fill-rose-400" />
                    Rejoins plus de 200 utilisateurs orientés
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                    <TextReveal text="Prêt à dessiner" stagger={0.06} />
                    <br />
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-cyan-400"
                    >
                      ton avenir ?
                    </motion.span>
                  </h2>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
                  >
                    Passe le test d'orientation IA en 5 minutes et découvre les métiers qui te correspondent vraiment.
                  </motion.p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <MagneticButton strength={0.18}>
                      <Button
                        onClick={() => onNavigate('/test-orientation')}
                        size="lg"
                        className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full shadow-2xl shadow-rose-900/40 border-0 hover:scale-105 transition-all duration-300"
                      >
                        Commencer maintenant
                      </Button>
                    </MagneticButton>

                    <span className="text-slate-500 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Sans inscription · 100&nbsp;% gratuit
                    </span>
                  </div>
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
