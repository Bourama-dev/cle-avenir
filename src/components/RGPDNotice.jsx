import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RGPDNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const noticed = localStorage.getItem('rgpd_notice_dismissed');
    if (!noticed) {
      // Small delay to not overwhelm on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('rgpd_notice_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white shadow-xl border border-slate-200 p-4 rounded-xl z-[100]"
        >
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full shrink-0">
              <Shield className="w-5 h-5 text-green-700" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Confidentialité & RGPD</h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Vos données sont protégées. Nous collectons uniquement les informations nécessaires au service. Vous pouvez demander leur suppression à tout moment.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild>
                  <Link to="/legal?tab=privacy">Politique de confidentialité</Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 px-2" asChild>
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RGPDNotice;