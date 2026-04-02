import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, FileText, Lock, Cookie, Settings, Scale } from 'lucide-react';
import './LegalLayout.css';
import SEOHead from '@/components/SEOHead';

const LegalLayout = ({ children, title, subtitle, lastUpdated }) => {
  const navItems = [
    { path: '/mentions-legales', icon: Scale, label: 'Mentions Légales' },
    { path: '/conditions-generales', icon: FileText, label: 'Conditions Générales' },
    { path: '/politique-confidentialite', icon: Shield, label: 'Politique de Confidentialité' },
    { path: '/gestion-cookies', icon: Cookie, label: 'Gestion des Cookies' },
    { path: '/preferences-rgpd', icon: Settings, label: 'Préférences RGPD' },
  ];

  return (
    <div className="legal-layout-container">
      <SEOHead title={`${title} - CléAvenir Légal`} description={subtitle} />
      
      {/* Header */}
      <header className="legal-header">
        <div className="legal-header-content">
          <h1>{title}</h1>
          <p className="text-blue-100 text-lg">{subtitle}</p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="legal-main">
        {/* Sidebar Navigation */}
        <aside>
          <div className="legal-sidebar">
            <nav className="legal-nav-list">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `legal-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="legal-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-100">
               <p className="text-xs text-slate-400 text-center">
                 Centre de Conformité<br/>CléAvenir © 2026
               </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="legal-content">
          {children}
          {lastUpdated && (
            <div className="legal-footer">
              Dernière mise à jour : {lastUpdated}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalLayout;