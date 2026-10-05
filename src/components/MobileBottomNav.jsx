import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Compass, Sparkles, Target, User, ClipboardList, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const startsWithAny = (path, prefixes) =>
  prefixes.some((p) => path === p || path.startsWith(p + '/'));

const EXPLORE_PATHS = ['/metiers', '/metier', '/formations', '/formation', '/lycees', '/lycee', '/offres-emploi', '/job', '/careers', '/actualites'];
const PROFILE_PATHS = ['/dashboard', '/profile', '/settings', '/account', '/notifications', '/my-documents', '/test-history', '/recommendations', '/offers-formations'];

const MobileBottomNav = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  const tabs = [
    { key: 'home', label: 'Accueil', to: '/', icon: Home, active: pathname === '/' || pathname === '/accueil' },
    { key: 'explore', label: 'Explorer', to: '/metiers', icon: Compass, active: startsWithAny(pathname, EXPLORE_PATHS) },
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
        {tabs.map(({ key, label, to, icon: Icon, active, highlight }) => (
          <li key={key} className="relative">
            <Link
              to={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium select-none',
                '[-webkit-tap-highlight-color:transparent] active:scale-90 transition-transform duration-150',
                active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : 'bottom-nav-indicator'}
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-indigo-600 dark:bg-indigo-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                />
              )}
              {highlight ? (
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-2xl shadow-md transition-colors',
                    active
                      ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                      : 'bg-gradient-to-br from-indigo-500/90 to-violet-500/90 text-white'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : (
                <Icon className={cn('h-6 w-6 transition-transform', active && 'scale-110')} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
              )}
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
