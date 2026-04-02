import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog, Lock } from 'lucide-react';
import MaintenanceCountdown from './MaintenanceCountdown';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';

/*
  =============================================================================
  TESTING CHECKLIST FOR MAINTENANCE PAGE & THEME SYSTEM
  =============================================================================
  1. [ ] Visual design is professional and responsive (check on mobile & desktop).
  2. [ ] Countdown updates every second automatically without flickering.
  3. [ ] Admin login button redirects to /login.
  4. [ ] Dark mode toggle works site-wide (header button switches themes).
  5. [ ] All elements (text, backgrounds, borders) are visible in both light and dark modes.
  6. [ ] Animations (rotating gear, fade-in, pulse) are smooth and not jarring.
  7. [ ] Theme persists on page reload (refresh browser to confirm).
  8. [ ] Maintenance page displays correctly at /maintenance route.
  =============================================================================
*/

export default function MaintenancePage() {
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  const general = settings?.general || {};

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div 
        className="max-w-2xl w-full rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-8 animate-fade-in border transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)' 
        }}
      >
        {general.logo_url && (
          <img 
            src={general.logo_url} 
            alt={general.siteName || 'CléAvenir'} 
            className="h-16 mx-auto object-contain"
          />
        )}
        
        <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <Cog 
            className="w-12 h-12 animate-spin-slow" 
            style={{ color: 'var(--color-primary)' }} 
          />
        </div>

        <div className="space-y-4">
          <h1 
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            MAINTENANCE EN COURS
          </h1>
          
          <p 
            className="text-lg md:text-xl max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Notre plateforme fait actuellement l'objet d'une mise à jour majeure afin de vous offrir une meilleure expérience. Nous serons de retour très bientôt.
          </p>
        </div>

        <div className="py-6">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
            Retour estimé dans
          </p>
          <MaintenanceCountdown />
        </div>

        <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: 'var(--color-primary)', 
              color: '#ffffff'
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            Se connecter (Admin)
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-sm" style={{ color: 'var(--text-secondary)' }}>
        &copy; 2026 CléAvenir. Tous droits réservés.
      </div>
    </div>
  );
}