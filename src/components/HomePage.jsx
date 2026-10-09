import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Sparkles, Target, Zap, Search,
  GraduationCap, BookOpen, Clock, ChevronRight, Briefcase, Wand2, Gift, PlayCircle,
} from 'lucide-react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import PageHelmet from '@/components/SEO/PageHelmet';
import { AuthService } from '@/services/authService';

const NewsPreview = lazy(() => import('@/components/NewsPreview'));

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Search,
    title: "Exploration Métiers",
    desc: "Des milliers de fiches métiers : salaires, débouchés, évolutions.",
    gradient: 'from-rose-500 to-rose-600',
    link: "/metiers",
  },
  {
    icon: GraduationCap,
    title: "Formations Adaptées",
    desc: "La formation idéale selon ton niveau, ta région et tes objectifs.",
    gradient: 'from-cyan-500 to-teal-600',
    link: "/formations",
  },
  {
    icon: Zap,
    title: "Coaching IA · Cléo",
    desc: "Un assistant disponible 24/7 qui t'accompagne pas à pas.",
    gradient: 'from-rose-400 to-rose-600',
    link: "/cleo",
  },
];

const STAT_TINTS = [
  'bg-pink-50 text-pink-500',
  'bg-violet-50 text-violet-500',
  'bg-sky-50 text-sky-500',
  'bg-teal-50 text-teal-500',
];

const STATS = [
  { value: 5,     suffix: ' min',  label: 'Pour passer le test',       icon: Clock },
  { value: 1500,  suffix: '+',     label: 'Fiches métiers (ROME)',     icon: Briefcase },
  { value: 3,     suffix: '',      label: 'Sources officielles',       icon: BookOpen },
  { value: 100,   suffix: ' %',    label: 'Gratuit, sans carte bancaire', icon: Gift },
];

const STEPS = [
  {
    number: '01',
    icon: Target,
    title: 'Passe le test gratuit',
    desc: "Quelques questions sur tes intérêts et tes valeurs. Crée ton compte gratuit à la fin pour voir et garder tes résultats.",
    gradient: 'from-pink-500 to-rose-500',
    link: '/test-orientation',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Cléo analyse ton profil',
    desc: "Notre IA analyse tes compétences et tes affinités métier en quelques secondes.",
    gradient: 'from-violet-500 to-indigo-500',
    link: '/cleo',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Explore ta voie',
    desc: "Métiers, formations et offres personnalisés, avec des données officielles à jour.",
    gradient: 'from-teal-400 to-emerald-500',
    link: '/metiers',
  },
];

const ALL_PERKS = [
  'Test d\'orientation et résultats complets (4 à 15 métiers)',
  'Plan d\'action personnalisé, sans limite',
  'Cléo, ton coach IA, disponible 24h/24',
  'Simulateur d\'entretien avec rapport détaillé',
  'Créateur de CV et de lettre de motivation',
  'Recherche de formations et d\'offres d\'emploi',
];

const VIDEOS = [
  {
    src: 'https://www.youtube-nocookie.com/embed/z6SXP8BO15M',
    title: 'Présentation de CléAvenir',
    label: 'Présentation',
  },
  {
    src: 'https://www.youtube-nocookie.com/embed/QedCSeYSDe8',
    title: "L'entrepreneur derrière CléAvenir",
    label: "L'entrepreneur",
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

// Light scroll-in reveal, disabled when reduced motion is requested
function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, children }) {
  return (
    <Reveal className="px-5 md:px-0 mb-5 md:mb-8">
      <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-1.5">{eyebrow}</p>
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{children}</h2>
    </Reveal>
  );
}

// Horizontal snap row on mobile, grid from md
const CAROUSEL = 'snap-feed flex gap-3 overflow-x-auto px-5 pb-2 md:px-0 md:overflow-visible md:grid md:gap-6';
const GRAD_TEXT = 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-cyan-500 dark:from-rose-400 dark:to-cyan-300';

// ── Utility functions ────────────────────────────────────────────────────────
function generateRandomRiasecProfile() {
  const profile = {};
  ['R', 'I', 'A', 'S', 'E', 'C'].forEach(dim => {
    profile[dim] = Math.floor(Math.random() * 100) + 20;
  });
  return profile;
}

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = ({ onNavigate }) => {
  const reduce = useReducedMotion();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

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

  const handleSimulateTest = async () => {
    setIsSimulating(true);
    try {
      const profile = generateRandomRiasecProfile();
      localStorage.setItem('test_riasec_profile', JSON.stringify(profile));
      onNavigate('/test-results');
    } catch (err) {
      console.error('Error simulating test:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const heroIn = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <PageHelmet
        title="CléAvenir - Test de Carrière Intelligent & Orientation IA"
        description="Découvrez votre avenir professionnel avec CléAvenir. Test d'orientation gratuit, analyse IA des compétences, fiches métiers, formations et offres d'emploi."
        keywords="orientation, orientation professionnelle, test orientation gratuit, quel métier faire, recherche métier, offres d'emploi, carrière, formation, Parcoursup, alternance, stage, apprentissage, reconversion professionnelle, bilan de compétences, IA orientation, emploi, trouver sa voie, orientation après bac"
        image="https://cleavenir.com/og-image.jpg"
        breadcrumbs={[{ name: 'Accueil', url: '/' }]}
      />

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white min-h-[calc(100dvh-4rem)] md:min-h-[78dvh] flex items-center">
        <div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-pink-300/50 dark:bg-pink-500/20 blur-3xl -z-10" aria-hidden />
        <div className="absolute top-1/3 right-1/4 w-[26rem] h-[26rem] rounded-full bg-violet-300/40 dark:bg-violet-500/15 blur-3xl -z-10" aria-hidden />
        <div className="absolute -bottom-40 -right-10 w-[32rem] h-[32rem] rounded-full bg-sky-300/50 dark:bg-sky-500/15 blur-3xl -z-10" aria-hidden />
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full bg-indigo-200/50 dark:bg-indigo-500/10 blur-3xl -z-10" aria-hidden />

        <div className="w-full max-w-6xl mx-auto px-5 py-10 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-6">
            <motion.span
              {...heroIn(0.05)}
              className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-violet-200 dark:border-white/15 text-violet-700 dark:text-violet-200 text-sm font-semibold"
            >
              <Sparkles size={14} className="shrink-0" />
              L'IA au service de ton avenir
            </motion.span>

            <motion.h1
              {...heroIn(0.15)}
              className="text-5xl sm:text-6xl xl:text-7xl font-black text-[#0f1a3d] dark:text-white leading-[1.05] tracking-tight"
            >
              Trouve ta voie avec{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500">CléAvenir</span>
            </motion.h1>

            <motion.p {...heroIn(0.3)} className="text-lg md:text-xl text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
              Test d'orientation, analyse IA, métiers et formations. 100&nbsp;% gratuit.
            </motion.p>

            <motion.div {...heroIn(0.45)} className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => onNavigate('/test-orientation')}
                className="min-h-[56px] px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 text-white font-bold text-base shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition hover:brightness-110"
              >
                Faire le test gratuit <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('/how-it-works')}
                className="min-h-[56px] px-7 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/25 backdrop-blur text-indigo-700 dark:text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition hover:bg-white"
              >
                <PlayCircle className="w-5 h-5" />
                Comment ça marche&nbsp;?
              </button>
            </motion.div>

            <motion.div {...heroIn(0.6)} className="flex flex-wrap gap-x-5 gap-y-2">
              {['Test sans inscription', 'Résultat immédiat', '100 % Gratuit'].map((label) => (
                <span key={label} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>

            {isAdmin && (
              <motion.div {...heroIn(0.7)}>
                <button
                  onClick={handleSimulateTest}
                  disabled={isSimulating}
                  className="min-h-[48px] px-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Wand2 className="w-4 h-4" />
                  {isSimulating ? 'Simulation...' : 'Admin: Simuler test'}
                </button>
              </motion.div>
            )}
          </div>

          {/* Desktop-only: the 3 steps as shortcuts */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="rounded-[2rem] bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/15 p-6 shadow-xl shadow-violet-900/10 space-y-4">
              {STEPS.map((st) => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.number}
                    onClick={() => onNavigate(st.link)}
                    className="w-full text-left flex items-center gap-4 rounded-2xl bg-white/90 dark:bg-white/10 p-4 shadow-sm hover:shadow-md active:scale-[0.99] transition"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${st.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{st.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-2">{st.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-10 px-4 md:px-5">
        <Reveal>
          <div className="max-w-6xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-violet-900/10 grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-4 p-5 md:p-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${STAT_TINTS[i % STAT_TINTS.length]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ══ TOOLS ═══════════════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Nos outils">
            Tout pour réussir <span className={GRAD_TEXT}>ton orientation</span>
          </SectionHead>
          <div className={`${CAROUSEL} md:grid-cols-3`}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.title}
                  onClick={() => onNavigate(f.link)}
                  className={`group relative shrink-0 w-[78%] sm:w-[60%] md:w-auto text-left rounded-3xl bg-gradient-to-br ${f.gradient} text-white p-6 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xl shadow-rose-900/10 active:scale-[0.98] md:hover:-translate-y-1 transition`}
                >
                  <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" aria-hidden />
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1.5">{f.title}</h3>
                    <p className="text-sm text-white/85 leading-snug mb-3">{f.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold">
                      Découvrir <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ STEPS ═══════════════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-24 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Comment ça marche">
            Ton avenir en <span className={GRAD_TEXT}>3 étapes</span>
          </SectionHead>
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={i * 0.08}>
                  <Link
                    to={step.link}
                    className="h-full flex md:flex-col items-start gap-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 md:p-7 shadow-sm active:scale-[0.99] md:hover:shadow-xl transition"
                  >
                    <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg shadow-rose-500/20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-rose-500 mb-0.5">{step.number}</p>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 self-center md:hidden" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-6 md:mt-10 flex justify-center">
            <button
              onClick={() => onNavigate('/test-orientation')}
              className="w-full md:w-auto min-h-[56px] px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-cyan-500 text-white font-bold text-base shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              Commencer maintenant · C'est gratuit <ArrowRight className="w-5 h-5" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ══ ACTUALITÉS ══════════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Actualités">
            L'emploi & la formation <span className={GRAD_TEXT}>en direct</span>
          </SectionHead>
        </div>
        <Suspense fallback={<div className="h-[340px] mx-5 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
          <NewsPreview />
        </Suspense>
      </section>

      {/* ══ VIDEOS ══════════════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="En vidéo">
            Découvre <span className={GRAD_TEXT}>CléAvenir</span>
          </SectionHead>
          <div className={`${CAROUSEL} md:grid-cols-2`}>
            {VIDEOS.map((v) => (
              <div key={v.src} className="shrink-0 w-[88%] sm:w-[70%] md:w-auto">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl shadow-slate-300/40 dark:shadow-none border border-slate-100 dark:border-slate-800 bg-slate-900">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={v.src}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="mt-2 px-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GRATUIT ═════════════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-24">
        <div className="max-w-3xl mx-auto">
          <SectionHead eyebrow="100 % gratuit">
            Tout est inclus, sans abonnement
          </SectionHead>
          <p className="px-5 md:px-0 -mt-3 mb-5 md:mb-8 text-slate-500 dark:text-slate-400">
            Pas de carte bancaire, pas de plan payant : toutes les fonctionnalités de CléAvenir sont accessibles gratuitement.
          </p>
          <div className="mx-5 md:mx-0 relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-cyan-500 text-white p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">CléAvenir</p>
                <p className="text-sm font-semibold text-rose-100">Gratuit · Sans engagement</p>
              </div>
            </div>
            <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 md:gap-y-3">
              {ALL_PERKS.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('/test-orientation')}
              className="mt-6 w-full md:w-auto md:self-start md:px-10 min-h-[52px] rounded-2xl bg-white text-rose-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <Zap className="w-4 h-4" /> Commencer gratuitement
            </button>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <section className="px-5 py-14 md:py-24">
        <Reveal className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-500 to-cyan-600 text-white text-center px-6 py-12 md:p-20">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-fuchsia-500/25 blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-semibold mb-6">
                <Sparkles size={14} />
                Rejoins CléAvenir, c'est gratuit
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4">
                Prêt à dessiner ton avenir&nbsp;?
              </h2>
              <p className="text-rose-100/90 text-lg mb-8 max-w-xl mx-auto">
                Passe le test d'orientation IA en 5 minutes et découvre les métiers qui te correspondent vraiment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('/test-orientation')}
                  className="w-full sm:w-auto min-h-[56px] px-10 rounded-2xl bg-white text-rose-700 font-bold text-lg shadow-xl active:scale-[0.98] transition"
                >
                  Commencer maintenant
                </button>
                <span className="text-rose-100/80 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Compte gratuit · Sans carte bancaire
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default HomePage;
