import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, FileText, Lock, Cookie, Settings, Scale } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const navItems = [
  { path: '/mentions-legales',          icon: Scale,    label: 'Mentions légales' },
  { path: '/conditions-generales',      icon: FileText, label: 'Conditions générales' },
  { path: '/politique-confidentialite', icon: Shield,   label: 'Confidentialité' },
  { path: '/legal/cookies',             icon: Cookie,   label: 'Politique cookies' },
  { path: '/preferences-rgpd',          icon: Settings, label: 'Préférences RGPD' },
];

const LegalLayout = ({ children, title, subtitle, lastUpdated }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead title={`${title} - CléAvenir`} description={subtitle} />

      {/* Hero — même style que AboutPage */}
      <section className="bg-slate-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Layout deux colonnes */}
      <div className="container mx-auto px-4 max-w-6xl py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
                Documents légaux
              </p>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-slate-100 px-3">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Questions ? Contactez-nous à<br/>
                  <a href="mailto:contact@cleavenir.com" className="text-indigo-600 hover:underline">
                    contact@cleavenir.com
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 md:px-10 py-8 md:py-12">
              {children}
              {lastUpdated && (
                <div className="mt-10 pt-6 border-t border-slate-100 text-right">
                  <span className="text-xs text-slate-400">Dernière mise à jour : {lastUpdated}</span>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
