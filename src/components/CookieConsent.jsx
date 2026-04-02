import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Initialize analytics here if needed
    console.log('[CookieConsent] Analytics initialized after consent.');
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900 text-white shadow-2xl border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-slate-300">
          <p className="mb-1 font-semibold text-white">Nous respectons votre vie privée</p>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés. 
            En cliquant sur "Accepter", vous consentez à notre utilisation des cookies. 
            Consultez notre <a href="/privacy" className="text-blue-400 hover:underline">Politique de confidentialité</a> pour en savoir plus.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleReject}
            className="text-slate-900 border-slate-600 hover:bg-slate-100"
          >
            Refuser
          </Button>
          <Button 
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accepter
          </Button>
          <button 
            onClick={handleReject}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;