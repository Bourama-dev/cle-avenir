import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Briefcase,
  FileText,
  Settings,
  Sparkles,
  Award,
  Lock,
  ShieldCheck,
  Home,
  ArrowLeft,
  CreditCard,
  Brain
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FEATURES } from '@/constants/subscriptionTiers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DashboardSidebar = ({ userProfile, className, onItemClick, variant = 'rail' }) => {
  const location = useLocation();
  const { hasAccess } = useSubscriptionAccess();
  const { goBack, goHome } = useNavigation();
  const { userProfile: authProfile } = useAuth();

  const canAccessCleo = hasAccess(FEATURES.AI_COACH);
  // Use live auth context to prevent stale prop from showing/hiding admin link incorrectly
  const isAdmin = (authProfile ?? userProfile)?.role === 'admin';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const NavItem = ({ to, icon: Icon, label, disabled = false, badge = null, className: itemClassName }) => (
    <Link
      to={disabled ? '#' : to}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else if (onItemClick) {
          onItemClick();
        }
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
        isActive(to)
          ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
        disabled && "opacity-70 cursor-not-allowed hover:bg-transparent",
        itemClassName
      )}
    >
      <Icon className={cn(
        "h-4 w-4",
        isActive(to) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
        itemClassName && "text-current group-hover:text-current"
      )} />
      <span>{label}</span>
      
      {badge}
      
      {disabled && (
        <Lock className="h-3 w-3 text-slate-400 ml-auto" />
      )}
    </Link>
  );

  if (variant === 'chips') {
    const chips = [
      { to: '/dashboard', icon: LayoutDashboard, label: "Vue d'ensemble" },
      { to: '/profile', icon: Target, label: 'Profil & Résultats' },
      { to: '/recommendations', icon: Award, label: 'Recommandations' },
      { to: '/offers-formations', icon: Briefcase, label: 'Offres & Formations' },
      { to: '/cleo', icon: Sparkles, label: 'Coach Cléo', locked: !canAccessCleo },
      { to: '/apprentissage', icon: Brain, label: 'Apprentissage' },
      { to: '/cv-builder', icon: FileText, label: 'CV' },
      { to: '/cover-letter-builder', icon: FileText, label: 'Lettre' },
      { to: '/account', icon: Settings, label: 'Compte' },
      { to: '/manage-subscription', icon: CreditCard, label: 'Mon accès' },
      ...(isAdmin ? [{ to: '/admin/content', icon: ShieldCheck, label: 'Admin', admin: true }] : []),
    ];
    return (
      <nav aria-label="Mon espace" className={cn("flex gap-2 overflow-x-auto px-4 pb-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
        {chips.map(({ to, icon: Icon, label, locked, admin }) => {
          const active = to === '/dashboard' ? location.pathname === to : isActive(to);
          return (
            <Link
              key={to}
              to={locked ? '#' : to}
              onClick={(e) => { if (locked) e.preventDefault(); else onItemClick?.(); }}
              aria-current={active ? 'page' : undefined}
              className={cn(
                "snap-start shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full text-sm font-medium border transition-colors active:scale-95",
                active
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                  : admin
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200",
                locked && "opacity-70"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {locked && <Lock className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-slate-900 h-full flex flex-col", className)}>
      {/* Navigation Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 mb-2">
         <div className="flex gap-2 justify-between">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={goHome} 
               className="flex-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-transparent hover:border-indigo-100"
            >
               <Home className="w-4 h-4 mr-2" /> Accueil
            </Button>
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={goBack} 
               className="flex-1 text-slate-600 dark:text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 border border-transparent hover:border-violet-100"
            >
               <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
         </div>
      </div>

      <div className="p-6 pt-2">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Mon Espace
        </h2>
        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Vue d'ensemble" />
          <NavItem to="/profile" icon={Target} label="Mon Profil & Résultats" />
          <NavItem to="/recommendations" icon={Award} label="Recommandations" />
          <NavItem to="/offers-formations" icon={Briefcase} label="Offres & Formations" />
        </nav>
      </div>

      <div className="px-6 py-2">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Outils
        </h2>
        <nav className="space-y-1">
          <NavItem 
            to="/cleo" 
            icon={Sparkles} 
            label="Coach IA Cléo" 
            disabled={!canAccessCleo}
            badge={
              !canAccessCleo && (
                <span className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  PRO+
                </span>
              )
            }
          />
          <NavItem to="/apprentissage" icon={Brain} label="Parcours d'apprentissage" />
          <NavItem to="/cv-builder" icon={FileText} label="Créateur de CV" />
          <NavItem to="/cover-letter-builder" icon={FileText} label="Créateur de Lettre" />
        </nav>
      </div>

      <div className="px-6 py-2 mt-auto mb-6">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Paramètres
        </h2>
        <nav className="space-y-1">
          <NavItem to="/account" icon={Settings} label="Mon Compte" />
          <NavItem to="/manage-subscription" icon={CreditCard} label="Mon accès" />

          {isAdmin && (
            <>
              <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-2" />
              <NavItem
                to="/admin/content"
                icon={ShieldCheck}
                label="Portail Admin"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              />
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;