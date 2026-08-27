import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import {
  Play,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Plus,
  MoreVertical,
  Check,
  Home,
  ClipboardList,
  Briefcase,
  GraduationCap,
  School,
  FileText,
  User,
  Route as RouteIcon,
  Bell as BellIcon,
  Settings,
} from 'lucide-react';
import '@/styles/landingHero.css';

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Tarifs', to: '/plans' },
  { label: 'À propos', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  const { settings } = useSystemSettings();
  const siteName = settings?.general?.siteName || 'Cléavenir';
  const logoUrl = settings?.general?.logo_url || '/favicon.svg';

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body">
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
        <img src={logoUrl} alt={`Logo ${siteName}`} width="24" height="24" className="object-contain shrink-0" />
        {siteName}
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
      <Link
        to="/signup"
        className="hidden md:inline-flex rounded-full px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Commencer
      </Link>
    </nav>
  );
}

function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground font-body mb-6"
    >
      Nouveau : Cléo, ton assistant IA d&rsquo;orientation ✨
    </motion.div>
  );
}

function Headline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-center font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-foreground max-w-xl"
    >
      La clé de ton <span className="italic">avenir</span> professionnel
    </motion.h1>
  );
}

function Subheadline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-4 text-center text-base md:text-lg text-muted-foreground max-w-[650px] leading-relaxed font-body"
    >
      Des tests d&rsquo;orientation intelligents, des recommandations de
      métiers et de formations personnalisées, et un accompagnement pas à pas
      pour construire ton parcours en toute confiance.
    </motion.p>
  );
}

function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-5 flex items-center gap-3"
    >
      <Link
        to="/test-gate"
        className="rounded-full px-6 py-5 text-sm font-medium font-body inline-flex items-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Passer le test gratuit
      </Link>
      <button
        type="button"
        aria-label="Voir la vidéo de présentation"
        className="h-11 w-11 rounded-full border-0 bg-background shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-background/80 transition-colors inline-flex items-center justify-center"
      >
        <Play className="h-4 w-4 fill-foreground text-foreground" />
      </button>
    </motion.div>
  );
}

function AreaChart() {
  return (
    <svg viewBox="0 0 240 80" className="h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cleavenir-chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,55 C20,58 30,35 50,38 C70,41 80,20 100,22 C120,24 130,50 150,45 C170,40 180,15 200,18 C215,20 225,30 240,25 L240,80 L0,80 Z"
        fill="url(#cleavenir-chart-gradient)"
      />
      <path
        d="M0,55 C20,58 30,35 50,38 C70,41 80,20 100,22 C120,24 130,50 150,45 C170,40 180,15 200,18 C215,20 225,30 240,25"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardPreview() {
  const sidebarItems = [
    { icon: Home, label: 'Accueil', active: true },
    { icon: ClipboardList, label: 'Tests', badge: '3' },
    { icon: Briefcase, label: 'Métiers' },
    { icon: GraduationCap, label: 'Formations', chevron: true },
    { icon: School, label: 'Lycées' },
    { icon: FileText, label: 'Candidatures' },
    { icon: User, label: 'Profil', chevron: true },
  ];

  const workflowItems = [
    { icon: RouteIcon, label: 'Suivi de parcours' },
    { icon: FileText, label: 'Documents' },
    { icon: BellIcon, label: 'Notifications' },
    { icon: Settings, label: 'Paramètres' },
  ];

  const savedItems = [
    { label: 'Développeur Web', value: '38 500 €' },
    { label: 'Ingénieur Data', value: '52 000 €' },
    { label: 'UX Designer', value: '41 200 €' },
  ];

  const activity = [
    { date: '12 juil.', desc: 'Test d’orientation', amount: '', status: 'Complété', tone: 'green' },
    { date: '15 juil.', desc: 'Candidature — Prépa Ingé', amount: '', status: 'En attente', tone: 'amber' },
    { date: '18 juil.', desc: 'Entretien Lycée Voltaire', amount: '', status: 'Confirmé', tone: 'green' },
    { date: '22 juil.', desc: 'CV généré par Cléo', amount: '', status: 'Complété', tone: 'green' },
  ];

  const toneClasses = {
    green: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-8 w-full max-w-5xl"
    >
      <div
        className="rounded-2xl overflow-hidden p-3 md:p-4 select-none pointer-events-none text-[11px] font-body"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: 'var(--shadow-dashboard)',
        }}
      >
        <div className="rounded-xl bg-white/80 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-semibold">
                C
              </div>
              <span className="font-semibold text-foreground">Cléavenir</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border px-3 py-1 text-muted-foreground">
              <Search className="h-3 w-3" />
              <span>Rechercher</span>
              <span className="text-[9px] border border-border rounded px-1">⌘K</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-foreground font-medium">Mon profil</span>
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-5 w-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[9px] font-semibold">
                LM
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-40 shrink-0 border-r border-border p-3 hidden sm:block">
              <div className="space-y-0.5">
                {sidebarItems.map(({ icon: Icon, label, active, badge, chevron }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md ${
                      active ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3" />
                      <span>{label}</span>
                    </div>
                    {badge && (
                      <span className="text-[9px] rounded-full bg-accent text-accent-foreground px-1.5">
                        {badge}
                      </span>
                    )}
                    {chevron && <ChevronRight className="h-3 w-3" />}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-muted-foreground">
                <p className="px-2 mb-1 text-[10px] uppercase tracking-wide">Parcours</p>
                <div className="space-y-0.5">
                  {workflowItems.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                      <Icon className="h-3 w-3" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-foreground">Bonjour, Léa</p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {['Faire un test', 'Explorer métiers', 'Formations', 'Lycées', 'CV', 'Lettre de motivation'].map(
                  (label, i) => (
                    <span
                      key={label}
                      className={`rounded-full px-2.5 py-1 text-[10px] ${
                        i === 0
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-white text-foreground border border-border'
                      }`}
                    >
                      {label}
                    </span>
                  ),
                )}
                <span className="ml-auto text-muted-foreground">Personnaliser</span>
              </div>

              <div className="flex gap-3 mt-3">
                {/* Score card */}
                <div className="flex-1 basis-0 rounded-xl bg-white p-3 border border-border">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span>Score d&rsquo;orientation</span>
                  </div>
                  <div className="mt-1 text-foreground font-semibold text-base">
                    87<span className="text-xs text-muted-foreground">% compatibilité</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>30 derniers jours</span>
                    <span className="text-emerald-600">+12%</span>
                    <span className="text-red-500">-3%</span>
                  </div>
                  <div className="mt-1">
                    <AreaChart />
                  </div>
                </div>

                {/* Saved items card */}
                <div className="flex-1 basis-0 rounded-xl bg-white p-3 border border-border">
                  <div className="flex items-center justify-between text-foreground">
                    <span className="font-medium">Mes favoris</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Plus className="h-3 w-3" />
                      <MoreVertical className="h-3 w-3" />
                    </div>
                  </div>
                  <div>
                    {savedItems.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 text-xs">
                        <span className="text-foreground">{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity table */}
              <div className="mt-3 rounded-xl bg-white p-3 border border-border">
                <p className="font-medium text-foreground mb-2">Activité récente</p>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="font-normal pb-1">Date</th>
                      <th className="font-normal pb-1">Description</th>
                      <th className="font-normal pb-1 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((row) => (
                      <tr key={row.desc} className="border-t border-border/60">
                        <td className="py-1.5 text-muted-foreground">{row.date}</td>
                        <td className="py-1.5 text-foreground">{row.desc}</td>
                        <td className="py-1.5 text-right">
                          <span className={`rounded-full px-2 py-0.5 ${toneClasses[row.tone]}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative flex-1 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 z-0 bg-background/40" />
      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10">
        <Badge />
        <Headline />
        <Subheadline />
        <CTAButtons />
        <DashboardPreview />
      </div>
    </section>
  );
}

export default function LandingHeroPage() {
  return (
    <div className="landing-hero-page h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  );
}
