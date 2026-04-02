import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeNameMap = {
  'dashboard': 'Tableau de bord',
  'test-orientation': 'Test d\'orientation',
  'test': 'Test',
  'adaptive-test': 'Test Adaptatif',
  'test-results': 'Résultats',
  'metiers': 'Métiers',
  'formations': 'Formations',
  'offres-emploi': 'Offres d\'emploi',
  'profil': 'Profil',
  'profile': 'Profil',
  'account': 'Compte',
  'blog': 'Blog',
  'conseils-carriere': 'Conseils Carrière',
  'ressources': 'Ressources',
  'a-propos': 'À propos',
  'contact': 'Contact',
  'conditions-generales': 'CGU',
  'mentions-legales': 'Mentions Légales',
  'politique-confidentialite': 'Confidentialité',
  'gestion-cookies': 'Cookies',
  'status': 'État du système',
  'roadmap': 'Roadmap',
  'partenaires': 'Partenaires',
  'devenir-partenaire': 'Devenir Partenaire',
  'institution-dashboard': 'Espace Établissement',
  'establishment': 'Espace Établissement',
  'admin': 'Administration',
  'auth': 'Authentification',
  'login': 'Connexion',
  'signup': 'Inscription',
  'cleo': 'Assistant Cléo',
  'institutions': 'Établissements',
  'recommendations': 'Recommandations',
  'offers-formations': 'Offres & Formations',
  'job': 'Offre',
  'formation': 'Formation'
};

const Breadcrumbs = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Always show breadcrumbs for better navigation context
  
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap", className)}>
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="hover:text-indigo-500 transition-colors flex items-center gap-1 group">
            <Home className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        {pathnames.length > 0 && <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />}
        
        {pathnames.map((value, index) => {
          // Prevent rendering ":code" directly
          if (value === ':code' || value === ':id') return null;

          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = routeNameMap[value] || value.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

          // Skip UUIDs in breadcrumbs for cleaner look but keep them if needed for structure
          const isUUID = /^[0-9a-fA-F-]{36}$/.test(value) || /^\d+$/.test(value);
          const isRomeCode = /^[A-Z]\d{4}$/.test(value);
          
          let displayName = name;
          if (isUUID) displayName = 'Détail';
          if (isRomeCode) displayName = value;

          return (
            <React.Fragment key={to}>
              <li className="flex items-center">
                {isLast ? (
                  <span className="font-medium text-slate-900 px-1 py-0.5 rounded-md bg-slate-50/50" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-indigo-500 transition-colors hover:underline decoration-indigo-200 underline-offset-4 px-1">
                    {displayName}
                  </Link>
                )}
              </li>
              {!isLast && <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;