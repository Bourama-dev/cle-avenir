import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cookieService } from '@/services/cookieService';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hasConsented = cookieService.initializeCookieConsent();
    if (!hasConsented) {
      // Small delay to ensure it doesn't pop in abruptly
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = async () => {
    try {
      await cookieService.saveCookiePreferences(user?.id, {
        essential: true,
        analytics: true,
        marketing: true,
        social: true
      });
      setIsVisible(false);
    } catch (err) {
      console.error('Error saving cookies', err);
    }
  };

  const handleRejectAll = async () => {
    try {
      await cookieService.saveCookiePreferences(user?.id, {
        essential: true,
        analytics: false,
        marketing: false,
        social: false
      });
      setIsVisible(false);
    } catch (err) {
      console.error('Error saving cookies', err);
    }
  };

  const handleCustomize = () => {
    setIsVisible(false);
    navigate('/user/cookies-preferences');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center pointer-events-none">
      <Card className="w-full max-w-4xl bg-white shadow-2xl border-slate-200 pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Nous respectons votre vie privée</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer du contenu personnalisé. 
              Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos préférences. Pour en savoir plus, consultez notre{' '}
              <Link to="/legal/cookies" className="text-indigo-600 hover:underline font-medium">politique en matière de cookies</Link>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
            <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto font-medium">
              Tout refuser
            </Button>
            <Button variant="secondary" onClick={handleCustomize} className="w-full sm:w-auto font-medium bg-slate-100 hover:bg-slate-200">
              Personnaliser
            </Button>
            <Button onClick={handleAcceptAll} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200">
              Tout accepter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;