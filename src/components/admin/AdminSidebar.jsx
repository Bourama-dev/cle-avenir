import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BookOpen,
  LogOut,
  CreditCard,
  Building2,
  MessageSquare,
  ShieldAlert,
  Lock,
  FileCheck,
  Scale,
  PlayCircle,
  Activity,
  Library,
  Rocket,
  Shield,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ currentPath }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Vue d\'ensemble', path: '/admin/dashboard' },
    
    // Core Management Group (Priority)
    { icon: <Users size={20} />, label: '👥 Utilisateurs', path: '/admin/users' },
    { icon: <Building2 size={20} />, label: 'Établissements', path: '/admin/establishments' },
    { icon: <CreditCard size={20} />, label: 'Abonnements', path: '/admin/subscriptions' },
    
    // Launch & Quality Group
    { icon: <Rocket size={20} />, label: 'Launch Control', path: '/admin/launch' },
    { icon: <Shield size={20} />, label: 'Assurance Qualité', path: '/admin/qa' },
    
    // Ops & Monitoring Group
    { icon: <Activity size={20} />, label: 'Monitoring', path: '/admin/monitoring' },
    { icon: <PlayCircle size={20} />, label: 'Opérations', path: '/admin/ops' },
    
    // Compliance & Legal Group
    { icon: <ShieldAlert size={20} />, label: 'Conformité RGPD', path: '/admin/compliance' },
    { icon: <Scale size={20} />, label: 'Légal & Versions', path: '/admin/legal-versions' },
    { icon: <Lock size={20} />, label: 'Sécurité & Audit', path: '/admin/security' },
    
    // Content
    { icon: <Briefcase size={20} />, label: 'Gestion des Métiers', path: '/admin/metiers' },
    { icon: <FileText size={20} />, label: 'Tests & Résultats', path: '/admin/tests' },
    { icon: <BookOpen size={20} />, label: 'Contenu', path: '/admin/content' },
    
    // Support & Docs
    { icon: <MessageSquare size={20} />, label: 'Support & Feedback', path: '/admin/support' },
    { icon: <Library size={20} />, label: 'Wiki Équipe', path: '/admin/wiki' },
    { icon: <FileCheck size={20} />, label: 'Docs & Checklists', path: '/admin/docs' },
    
    { icon: <Settings size={20} />, label: 'Paramètres', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    setIsOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-slate-900 text-white w-full">
      <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 h-16 md:h-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="font-bold text-lg">Admin Console</span>
        </div>
        {isMobile && (
           <SheetClose className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800 transition-colors">
              <X size={20} />
           </SheetClose>
        )}
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setIsOpen(false)}
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg transition-colors min-h-[44px]",
              isActive 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <div className="shrink-0">{item.icon}</div>
            <span className="font-medium text-left truncate text-sm md:text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 md:p-4 border-t border-slate-800 mt-auto shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors min-h-[44px]"
        >
          <div className="shrink-0"><LogOut size={20} /></div>
          <span className="font-medium text-sm md:text-base">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Trigger & Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
           <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800 h-10 w-10 shrink-0 -ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-slate-800 w-[85vw] max-w-[320px] bg-slate-900 text-white border-none flex flex-col">
              <SidebarContent isMobile={true} />
            </SheetContent>
          </Sheet>
          <span className="font-bold text-lg text-white truncate">Admin Console</span>
        </div>
        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0">A</div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[var(--sidebar-width)] bg-slate-900 text-white shrink-0 h-screen sticky top-0 border-r border-slate-800">
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;