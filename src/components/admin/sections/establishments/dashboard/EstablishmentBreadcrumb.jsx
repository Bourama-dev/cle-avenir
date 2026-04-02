import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Building2 } from 'lucide-react';

const EstablishmentBreadcrumb = ({ name }) => {
  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6 animate-in fade-in slide-in-from-left-2 duration-300">
      <Link 
        to="/admin/dashboard" 
        className="flex items-center hover:text-purple-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Console
      </Link>
      
      <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
      
      <Link 
        to="/admin/dashboard?tab=establishments" 
        className="flex items-center hover:text-purple-600 transition-colors"
      >
        <Building2 className="w-4 h-4 mr-1" />
        Établissements
      </Link>
      
      <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
      
      <span className="font-medium text-slate-900 truncate max-w-[200px] md:max-w-none">
        {name || 'Chargement...'}
      </span>
    </nav>
  );
};

export default EstablishmentBreadcrumb;