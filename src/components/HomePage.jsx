import React, { Suspense, lazy, useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, Sparkles, Target, Zap, Search,
  GraduationCap, Users, BookOpen, Clock, ChevronRight, Briefcase, Wand2,
  Lock, MessageSquare, BarChart3, Star,
} from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import PageHelmet from '@/components/SEO/PageHelmet';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import TiltCard from '@/components/ui/TiltCard';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';
import { AuthService } from '@/services/authService';
import VideoSection from '@/components/VideoSection';

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

// ── Emoji rain ────────────────────────────────────────────────────────────────
const RAIN_EMOJIS = ['🎓', '💼', '🚀', '📊', '🔑', '💡', '🏆', '📝', '⭐', '🎯', '📚', '🤝', '🌟', '✨', '🏫', '📈'];
// Logo particles appear every ~5 items (indices 4, 9, 14, 19 → 4 logos out of 24)
const LOGO_INDICES = new Set([4, 9, 14, 19]);

function EmojiRain({ count = 24 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      isLogo: LOGO_INDICES.has(i),
      emoji: RAIN_EMOJIS[i % RAIN_EMOJIS.length],
      left: 2 + (i / count) * 96 + (Math.random() - 0.5) * 4,
      size: LOGO_INDICES.has(i) ? 1.4 + Math.random() * 0.6 : 0.85 + Math.random() * 0.9,
      delay: Math.random() * 12,
      duration: 9 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 80,
      rotate: (Math.random() - 0.5) * 360,
      opacity: LOGO_INDICES.has(i) ? 0.3 + Math.random() * 0.25 : 0.25 + Math.random() * 0.35,
    })),
  []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none inline-flex items-center justify-center"
          style={{
            left: `${p.left}%`,
            top: '-3rem',
            fontSize: p.isLogo ? 0 : `${p.size}rem`,
            width: p.isLogo ? `${p.size}rem` : undefined,
            height: p.isLogo ? `${p.size}rem` : undefined,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift],
            rotate: [0, p.rotate],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.08, 0.88, 1],
          }}
        >
          {p.isLogo
            ? <img src="/favicon.svg" alt="" width={`${p.size * 16}px`} height={`${p.size * 16}px`} draggable={false} />
            : p.emoji
          }
        </motion.span>
      ))}
    </div>
  );
}

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

// ── Utility functions ────────────────────────────────────────────────────────
function generateRandomRiasecProfile() {
  const profile = {};
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];

  dimensions.forEach(dim => {
    profile[dim] = Math.floor(Math.random() * 100) + 20; // Random between 20-120
  });

  return profile;
}

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = ({ onNavigate }) => {
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Check if user is admin (check role from profile)
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (isAuth) {
          const session = await AuthService.getSession();
          if (session?.user?.id) {
            const { data: profile } = await AuthService.getProfile(session.user.id);
            setIsAdmin(profile?.role === 'admin');
          }
        }
      } catch (err) {
        console.log('Not authenticated or error checking admin status');
      }
    };

    checkAdmin();
  }, []);

  // Simulate RIASEC test answers
  const handleSimulateTest = async () => {
    setIsSimulating(true);
    try {
      // Generate random RIASEC profile
      const profile = generateRandomRiasecProfile();

      // Save to localStorage (same location as TestPage)
      localStorage.setItem('test_riasec_profile', JSON.stringify(profile));

      // Navigate to results page
      onNavigate('/test-results');
    } catch (err) {
      console.error('Error simulating test:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // 5-layer parallax — each layer moves at a different speed
  const heroBlobY      = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -22]);
  const heroBlobScale  = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const heroRainY      = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -42]);
  const heroTextY      = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -85]);
  const heroImageY     = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -55]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94]);
  const heroOpacity    = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
        className="relative px-6 pt-16 pb-32 md:pt-32 md:pb-40 overflow-hidden [isolation:isolate]"
      >
        {/* Layer 1 — blobs (slowest) */}
        <motion.div
          style={{ y: heroBlobY, scale: heroBlobScale }}
          className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-rose-50/80 via-rose-50/30 to-transparent -z-10 rounded-bl-[120px] origin-top-right"
        />
        <motion.div
          style={{ y: heroBlobY, scale: heroBlobScale }}
          className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-cyan-50/60 to-transparent -z-10 rounded-tr-[120px] origin-bottom-left"
        />

        {/* Layer 2 — dot grid (static depth anchor) */}
        <div className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Layer 3 — emoji rain (mid speed) */}
        <motion.div
          style={{ y: heroRainY }}
          className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
        >
          <EmojiRain />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-[2] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

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

            {/* Admin button (hidden unless authenticated as admin) */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="pt-4"
              >
                <Button
                  onClick={handleSimulateTest}
                  disabled={isSimulating}
                  size="sm"
                  className="bg-slate-800 hover:bg-slate-700 text-white gap-2 text-xs font-semibold"
                >
                  <Wand2 className="w-4 h-4" />
                  {isSimulating ? 'Simulation...' : 'Admin: Simuler test'}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right — image + floating cards */}
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-cyan-100 rounded-full blur-3xl opacity-70 animate-pulse" />
              {/* Hero illustration — gradient dashboard */}
              <div className="relative z-10 w-full h-full rounded-3xl shadow-2xl shadow-rose-900/10 rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 border border-white/80">
                <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
                  {/* Background circles */}
                  <circle cx="320" cy="80" r="90" fill="url(#g1)" opacity="0.5" />
                  <circle cx="80" cy="320" r="70" fill="url(#g2)" opacity="0.4" />
                  {/* Dashboard card */}
                  <rect x="60" y="80" width="280" height="180" rx="18" fill="white" opacity="0.9" />
                  <rect x="60" y="80" width="280" height="40" rx="18" fill="#6366f1" opacity="0.9" />
                  <rect x="60" y="100" width="280" height="20" fill="#6366f1" opacity="0.9" />
                  <circle cx="88" cy="100" r="7" fill="white" opacity="0.6" />
                  <circle cx="112" cy="100" r="7" fill="white" opacity="0.4" />
                  <circle cx="136" cy="100" r="7" fill="white" opacity="0.3" />
                  {/* Chart bars */}
                  <rect x="90" y="185" width="28" height="55" rx="6" fill="#6366f1" opacity="0.7" />
                  <rect x="132" y="160" width="28" height="80" rx="6" fill="#ec4899" opacity="0.7" />
                  <rect x="174" y="175" width="28" height="65" rx="6" fill="#6366f1" opacity="0.5" />
                  <rect x="216" y="148" width="28" height="92" rx="6" fill="#ec4899" opacity="0.8" />
                  <rect x="258" y="168" width="28" height="72" rx="6" fill="#6366f1" opacity="0.6" />
                  {/* Bottom cards */}
                  <rect x="60" y="278" width="128" height="60" rx="14" fill="white" opacity="0.9" />
                  <rect x="70" y="290" width="40" height="8" rx="4" fill="#6366f1" opacity="0.6" />
                  <rect x="70" y="306" width="70" height="6" rx="3" fill="#94a3b8" opacity="0.5" />
                  <rect x="70" y="318" width="50" height="6" rx="3" fill="#94a3b8" opacity="0.3" />
                  <rect x="212" y="278" width="128" height="60" rx="14" fill="white" opacity="0.9" />
                  <rect x="222" y="290" width="40" height="8" rx="4" fill="#ec4899" opacity="0.6" />
                  <rect x="222" y="306" width="70" height="6" rx="3" fill="#94a3b8" opacity="0.5" />
                  <rect x="222" y="318" width="50" height="6" rx="3" fill="#94a3b8" opacity="0.3" />
                  <defs>
                    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a5b4fc" />
                    </radialGradient>
                    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f9a8d4" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

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
        </motion.div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-10 py-16 bg-slate-900 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <AnimatedSection className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4" stagger={0.12}>
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <AnimatedItem key={i}>
                  <motion.div
                    className="flex flex-col items-center text-center gap-2 group cursor-default"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-6 h-6 text-white/70" />
                    </motion.div>
                    <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-slate-400 text-sm font-medium leading-tight">{stat.label}</div>
                  </motion.div>
                </AnimatedItem>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      {/* ══ VIDEO ═══════════════════════════════════════════════════════════ */}
      <VideoSection />

      {/* ══ FREEMIUM TEASER ═════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" /> Essaie gratuitement, évolue à ton rythme
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Commence sans carte bancaire
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Découvre tes 3 meilleurs métiers et teste Cléo — puis débloque tout avec Premium.
              </p>
            </AnimatedItem>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Gratuit */}
            <AnimatedSection>
              <AnimatedItem>
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                      <Star className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">Plan Découverte</p>
                      <p className="text-slate-400 text-sm font-semibold">Gratuit · Sans engagement</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { icon: BarChart3, text: 'Top 3 métiers compatibles avec ton profil', ok: true },
                      { icon: MessageSquare, text: '5 messages avec Cléo pour explorer tes options', ok: true },
                      { icon: GraduationCap, text: 'Recherche de formations et d\'offres', ok: true },
                      { icon: Lock, text: 'Résultats complets (4 à 15 métiers)', ok: false },
                      { icon: Lock, text: 'Plans d\'action illimités', ok: false },
                      { icon: Lock, text: 'Cléo sans limite de messages', ok: false },
                    ].map(({ icon: Icon, text, ok }, i) => (
                      <li key={i} className={`flex items-start gap-3 text-sm ${ok ? 'text-slate-700' : 'text-slate-400'}`}>
                        {ok
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          : <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                        }
                        {text}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton className="w-full mt-8">
                    <button
                      onClick={() => onNavigate('/test-orientation')}
                      className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition"
                    >
                      Commencer gratuitement →
                    </button>
                  </MagneticButton>
                </div>
              </AnimatedItem>
            </AnimatedSection>

            {/* Premium */}
            <AnimatedSection>
              <AnimatedItem>
                <div className="rounded-2xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 h-full text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full">
                    POPULAIRE
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Plan Premium</p>
                      <p className="text-indigo-200 text-sm font-semibold">Tout débloquer · Sans limite</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Top 3 métiers + tous les résultats compatibles',
                      'Cléo illimitée — coach IA disponible 24/7',
                      'Plans d\'action personnalisés sans limite',
                      'Suivi de progression et alertes métiers',
                      'Accès prioritaire aux nouvelles fonctionnalités',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton className="w-full mt-8">
                    <button
                      onClick={() => onNavigate('/plans')}
                      className="w-full py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" /> Passer à Premium
                    </button>
                  </MagneticButton>
                </div>
              </AnimatedItem>
            </AnimatedSection>
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
                  intensity={10}
                  glare={0.22}
                  onClick={() => onNavigate(feature.link)}
                  className="bg-white p-8 rounded-3xl border border-slate-100/80 cursor-pointer group h-full hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 relative overflow-hidden"
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

            <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6" stagger={0.18}>
              {STEPS.map((step, i) => (
                <AnimatedItem key={i}>
                  <TiltCard
                    intensity={7}
                    glare={0.14}
                    className="flex flex-col items-center text-center group bg-white/60 rounded-3xl p-8 border border-slate-100/60 hover:border-slate-200/80 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-500 h-full"
                  >
                    {/* Numbered circle */}
                    <motion.div
                      className={`relative w-[4.5rem] h-[4.5rem] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.glow} mb-6 z-10`}
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="text-white font-black text-2xl">{step.number}</span>
                    </motion.div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm max-w-[280px]">{step.desc}</p>

                    <Link
                      to={step.link}
                      className="mt-5 text-sm font-bold text-rose-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      En savoir plus <ChevronRight className="w-4 h-4" />
                    </Link>
                  </TiltCard>
                </AnimatedItem>
              ))}
            </AnimatedSection>
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
