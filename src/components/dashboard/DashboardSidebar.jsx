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
  ArrowLeft
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useNavigation } from '@/hooks/useNavigation';
import { FEATURES } from '@/constants/subscriptionTiers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DashboardSidebar = ({ userProfile, className, onItemClick }) => {
  const location = useLocation();
  const { hasAccess } = useSubscriptionAccess();
  const { goBack, goHome } = useNavigation();
  
  const canAccessCleo = hasAccess(FEATURES.AI_COACH);
  const isAdmin = userProfile?.role === 'admin';

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
          ? "bg-indigo-50 text-indigo-600" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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

  return (
    <div className={cn("bg-white h-full flex flex-col", className)}>
      {/* Navigation Header */}
      <div className="p-4 border-b border-slate-100 mb-2">
         <div className="flex gap-2 justify-between">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={goHome} 
               className="flex-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
            >
               <Home className="w-4 h-4 mr-2" /> Accueil
            </Button>
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={goBack} 
               className="flex-1 text-slate-600 hover:text-violet-600 hover:bg-violet-50 border border-transparent hover:border-violet-100"
            >
               <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
         </div>
      </div>

      <div className="p-6 pt-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
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
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
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
          <NavItem to="/cv-builder" icon={FileText} label="Créateur de CV" />
          <NavItem to="/cover-letter-builder" icon={FileText} label="Créateur de Lettre" />
        </nav>
      </div>

      <div className="px-6 py-2 mt-auto mb-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Paramètres
        </h2>
        <nav className="space-y-1">
          <NavItem to="/account" icon={Settings} label="Mon Compte" />
          
          {isAdmin && (
            <>
              <div className="h-px bg-slate-100 my-2" />
              <NavItem 
                to="/admin/dashboard" 
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