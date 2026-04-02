import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Zap, ShieldCheck, X, Crown, ArrowRight } from 'lucide-react';
import { stripeService } from '@/services/stripeService';
import { STRIPE_PRICES, STRIPE_MODES } from '@/constants/subscriptionTiers';
import './UpgradeModal.css';

const UpgradeModal = ({ isOpen, onClose, defaultTier = 'premium' }) => {
  const [selectedPlan, setSelectedPlan] = useState(defaultTier);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const priceId = selectedPlan === 'premium_plus' 
        ? STRIPE_PRICES.PREMIUM_PLUS 
        : STRIPE_PRICES.PREMIUM;
        
      const mode = selectedPlan === 'premium_plus'
        ? STRIPE_MODES.PREMIUM_PLUS
        : STRIPE_MODES.PREMIUM;

      await stripeService.createCheckoutSession(priceId, mode);
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[900px] border-none bg-transparent shadow-none">
        <div className="upgrade-modal-content">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10">
            <X size={20} className="text-slate-500" />
          </button>

          <div className="upgrade-header">
            <h2 className="upgrade-title">Passez au niveau supérieur 🚀</h2>
            <p className="upgrade-subtitle">
              Débloquez tout le potentiel de CléAvenir et accélérez votre réussite professionnelle avec nos offres exclusives.
            </p>
          </div>

          <div className="plans-grid">
            {/* Premium Plan */}
            <div 
              className={`plan-card ${selectedPlan === 'premium' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('premium')}
            >
              <div className="plan-header">
                <span className="plan-name">Premium</span>
                <div className="text-right">
                  <div className="plan-price">9,90€</div>
                  <div className="plan-period">paiement unique</div>
                </div>
              </div>
              
              <ul className="plan-features">
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span>Détail complet des métiers</span>
                </li>
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span>Accès aux salaires & tendances</span>
                </li>
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span>Plan d'action personnalisé</span>
                </li>
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span>Export PDF des résultats</span>
                </li>
              </ul>

              <button 
                className={`cta-button ${selectedPlan === 'premium' ? 'cta-premium' : 'bg-slate-100 text-slate-600'}`}
                onClick={(e) => {
                   e.stopPropagation();
                   setSelectedPlan('premium');
                   if (selectedPlan === 'premium') handleUpgrade();
                }}
              >
                {selectedPlan === 'premium' ? (isLoading ? 'Chargement...' : 'Choisir Premium') : 'Sélectionner'}
              </button>
            </div>

            {/* Premium+ Plan */}
            <div 
              className={`plan-card premium-plus ${selectedPlan === 'premium_plus' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('premium_plus')}
            >
              <div className="best-value-badge">RECOMMANDÉ</div>
              <div className="plan-header">
                <div className="flex items-center gap-2">
                  <span className="plan-name text-amber-600">Premium+</span>
                  <Crown size={18} className="text-amber-500 fill-amber-500" />
                </div>
                <div className="text-right">
                  <div className="plan-price">19,90€</div>
                  <div className="plan-period">/mois</div>
                </div>
              </div>

              <ul className="plan-features">
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span><strong>Tout inclus</strong> dans Premium</span>
                </li>
                <li className="feature-item">
                  <Zap className="feature-icon text-amber-500" />
                  <span>Coach IA dédié 24/7</span>
                </li>
                <li className="feature-item">
                  <ShieldCheck className="feature-icon text-amber-500" />
                  <span>Suivi mensuel personnalisé</span>
                </li>
                <li className="feature-item">
                  <Check className="feature-icon check-icon" />
                  <span>Accès prioritaire aux nouveautés</span>
                </li>
              </ul>

              <button 
                className={`cta-button ${selectedPlan === 'premium_plus' ? 'cta-premium-plus' : 'bg-slate-100 text-slate-600'}`}
                onClick={(e) => {
                   e.stopPropagation();
                   setSelectedPlan('premium_plus');
                   if (selectedPlan === 'premium_plus') handleUpgrade();
                }}
              >
                {selectedPlan === 'premium_plus' ? (isLoading ? 'Chargement...' : 'Devenir VIP') : 'Sélectionner'}
                {selectedPlan === 'premium_plus' && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;