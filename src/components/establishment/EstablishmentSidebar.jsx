import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useEstablishment } from '@/contexts/EstablishmentContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const EstablishmentSidebar = () => {
  const { establishment, loading } = useEstablishment();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/establishment/dashboard' },
    { icon: Users, label: 'Utilisateurs', path: '/establishment/users' },
    { icon: Building2, label: 'Départements', path: '/establishment/departments' },
    { icon: FileText, label: 'Tests & Résultats', path: '/establishment/tests' },
    { icon: BarChart3, label: 'Analytiques', path: '/establishment/analytics' },
    { icon: Activity, label: 'Activités', path: '/establishment/activity' },
    { icon: Settings, label: 'Paramètres', path: '/establishment/settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-white shadow-md">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {loading ? "..." : establishment?.name?.charAt(0) || "E"}
             </div>
             <div className="flex-1 overflow-hidden">
                <h2 className="font-bold text-lg truncate leading-tight">
                  {loading ? "Chargement..." : establishment?.name || "Establishment"}
                </h2>
                <p className="text-xs text-slate-400 truncate">Portail Administrateur</p>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
           <Button 
             variant="ghost" 
             className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-3"
             onClick={handleLogout}
           >
             <LogOut className="h-5 w-5" />
             Déconnexion
           </Button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default EstablishmentSidebar;