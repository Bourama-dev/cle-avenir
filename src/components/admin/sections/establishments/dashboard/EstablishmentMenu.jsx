import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  Activity, 
  FileText, 
  LifeBuoy,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      isActive 
        ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-100" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon className={cn(
      "w-4 h-4 mr-3 transition-colors",
      isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"
    )} />
    {label}
  </button>
);

const EstablishmentMenu = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'general', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'students', label: 'Gestion Étudiants', icon: Users },
    { id: 'formations', label: 'Formations', icon: GraduationCap },
    { id: 'activity', label: 'Journal d\'activité', icon: Activity },
    { id: 'audit', label: 'Audit & Sécurité', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className="space-y-6">
      <Link 
        to="/admin/dashboard?tab=establishments" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors px-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste
      </Link>

      <div className="hidden md:block space-y-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
         {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex-shrink-0 flex items-center px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap",
              activeSection === item.id
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-slate-600 border-slate-200"
            )}
          >
             <item.icon className="w-3 h-3 mr-2" />
             {item.label}
          </button>
        ))}
      </div>

      <div className="hidden md:block px-4 py-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
        <h4 className="text-xs font-semibold text-indigo-900 mb-2">Besoin d'aide ?</h4>
        <p className="text-xs text-indigo-700 mb-3 leading-relaxed">
          Consultez la documentation administrateur pour gérer les établissements.
        </p>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline">
          Voir la documentation
        </button>
      </div>
    </div>
  );
};

export default EstablishmentMenu;