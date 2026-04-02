import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import './CookiePreferences.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CookiePreferences = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    social: false
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('cookie_preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    // Here you would typically trigger your GTM or cookie manager update
    toast({
      title: "Préférences enregistrées",
      description: "Vos choix en matière de cookies ont été mis à jour.",
      className: "bg-green-50 border-green-200 text-green-800"
    });
    onClose();
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      social: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted));
    toast({
      title: "Tous les cookies acceptés",
      description: "Merci de votre confiance !",
      className: "bg-green-50 border-green-200 text-green-800"
    });
    onClose();
  };

  const rejectAll = () => {
    const allRejected = {
      essential: true,
      analytics: false,
      marketing: false,
      social: false
    };
    setPreferences(allRejected);
    localStorage.setItem('cookie_preferences', JSON.stringify(allRejected));
    toast({
      title: "Cookies refusés",
      description: "Seuls les cookies essentiels seront utilisés.",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal-content" role="dialog" aria-modal="true">
        <div className="cookie-modal-header">
          <h2>Vos préférences de cookies</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="cookie-modal-body">
          <p className="cookie-description">
            Nous utilisons des cookies pour optimiser votre expérience sur notre site. 
            Certains sont essentiels au fonctionnement, tandis que d'autres nous aident à comprendre comment vous utilisez le site.
          </p>

          <div className="cookie-categories">
            {/* Essential */}
            <div className="cookie-category-item">
              <div className="cookie-category-header">
                <label className="cookie-label">
                  <input 
                    type="checkbox" 
                    checked={preferences.essential} 
                    disabled 
                    className="cookie-checkbox"
                  />
                  Cookies Essentiels
                </label>
                <span className="cookie-required-badge">Obligatoire</span>
              </div>
              <p className="cookie-category-desc">
                Nécessaires au fonctionnement technique du site (session, sécurité, préférences). Ne peuvent pas être désactivés.
              </p>
            </div>

            {/* Analytics */}
            <div className="cookie-category-item">
              <div className="cookie-category-header">
                <label className="cookie-label">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={() => handleToggle('analytics')}
                    className="cookie-checkbox"
                  />
                  Analytique & Performance
                </label>
              </div>
              <p className="cookie-category-desc">
                Nous permettent de mesurer l'audience et d'analyser l'utilisation du site pour améliorer nos services.
              </p>
            </div>

            {/* Marketing */}
            <div className="cookie-category-item">
              <div className="cookie-category-header">
                <label className="cookie-label">
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing} 
                    onChange={() => handleToggle('marketing')}
                    className="cookie-checkbox"
                  />
                  Publicité & Marketing
                </label>
              </div>
              <p className="cookie-category-desc">
                Utilisés pour afficher des publicités pertinentes et mesurer l'efficacité de nos campagnes.
              </p>
            </div>

            {/* Social */}
            <div className="cookie-category-item">
              <div className="cookie-category-header">
                <label className="cookie-label">
                  <input 
                    type="checkbox" 
                    checked={preferences.social} 
                    onChange={() => handleToggle('social')}
                    className="cookie-checkbox"
                  />
                  Réseaux Sociaux
                </label>
              </div>
              <p className="cookie-category-desc">
                Permettent le partage de contenu sur les réseaux sociaux et l'intégration de fonctionnalités sociales.
              </p>
            </div>
          </div>
        </div>

        <div className="cookie-modal-footer">
          <button onClick={rejectAll} className="cookie-btn cookie-btn-secondary">
            Refuser tous
          </button>
          <button onClick={savePreferences} className="cookie-btn cookie-btn-primary">
            Enregistrer mes préférences
          </button>
          <button onClick={acceptAll} className="cookie-btn cookie-btn-success">
            <Check className="w-4 h-4 mr-2" />
            Accepter tous
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;