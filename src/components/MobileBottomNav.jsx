import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home, Compass, Sparkles, Target, User, ClipboardList, LogIn, Briefcase, GraduationCap, Search } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const startsWithAny = (path, prefixes) =>
  prefixes.some((p) => path === p || path.startsWith(p + '/'));

const EXPLORE_PATHS = ['/metiers', '/metier', '/formations', '/formation', '/lycees', '/lycee', '/offres-emploi', '/job', '/careers', '/actualites'];
const PROFILE_PATHS = ['/dashboard', '/profile', '/settings', '/account', '/notifications', '/my-documents', '/test-history', '/recommendations', '/offers-formations'];

const EXPLORE_MENU = [
  { label: 'Métiers', to: '/metiers', icon: Search },
  { label: "Offres d'emploi", to: '/offres-emploi', icon: Briefcase },
  { label: 'Catalogue formations', to: '/formations', icon: GraduationCap },
];

const MobileBottomNav = () => {
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef(null);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => { setExploreOpen(false); }, [pathname]);

  useEffect(() => {
    if (!exploreOpen) return undefined;
    const onPointer = (e) => { if (exploreRef.current && !exploreRef.current.contains(e.target)) setExploreOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setExploreOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [exploreOpen]);

  const tabs = [
    { key: 'home', label: 'Accueil', to: '/', icon: Home, active: pathname === '/' || pathname === '/accueil' },
    { key: 'explore', label: 'Explorer', to: '/metiers', icon: Compass, menu: true, active: startsWithAny(pathname, EXPLORE_PATHS) },
    { key: 'cleo', label: 'Cléo', to: '/cleo', icon: Sparkles, active: pathname.startsWith('/cleo'), highlight: true },
    user
      ? { key: 'plan', label: 'Mon plan', to: '/personalized-plan', icon: Target, active: startsWithAny(pathname, ['/personalized-plan', '/action-plan', '/apprentissage']) }
      : { key: 'test', label: 'Test', to: '/test', icon: ClipboardList, active: startsWithAny(pathname, ['/test', '/test-results']) },
    user
      ? { key: 'profile', label: 'Profil', to: '/dashboard', icon: User, active: startsWithAny(pathname, PROFILE_PATHS) }
      : { key: 'login', label: 'Connexion', to: '/login', icon: LogIn, active: startsWithAny(pathname, ['/login', '/signup']) },
  ];

  return (
    <nav
      aria-label="Navigation principale"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/70 dark:border-slate-700/60 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {tabs.map(({ key, label, to, icon: Icon, active, highlight, menu }) => {
          const tabClass = cn(
            'relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium select-none',
            '[-webkit-tap-highlight-color:transparent] active:scale-90 transition-transform duration-150',
            active || (menu && exploreOpen) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          );
          const content = (
            <>
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : 'bottom-nav-indicator'}
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-indigo-600 dark:bg-indigo-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                />
              )}
              {highlight ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl shadow-md bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : (
                <Icon className={cn('h-6 w-6 transition-transform', active && 'scale-110')} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
              )}
              <span>{label}</span>
            </>
          );

          if (menu) {
            return (
              <li key={key} className="relative" ref={exploreRef}>
                <AnimatePresence>
                  {exploreOpen && (
                    <motion.div
                      role="menu"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 origin-bottom rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-2xl"
                    >
                      {EXPLORE_MENU.map(({ label: l, to: t, icon: I }) => (
                        <Link
                          key={t}
                          to={t}
                          role="menuitem"
                          className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-800 dark:text-slate-100 active:bg-indigo-50 dark:active:bg-slate-800"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                            <I className="h-5 w-5" aria-hidden="true" />
                          </span>
                          {l}
                        </Link>
                      ))}
                      <span aria-hidden="true" className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={exploreOpen}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setExploreOpen((o) => !o)}
                  className={tabClass}
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={key} className="relative">
              <Link to={to} aria-current={active ? 'page' : undefined} className={tabClass}>
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
