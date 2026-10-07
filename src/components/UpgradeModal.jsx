import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UpgradeModal.css';

// CléAvenir est 100 % gratuit : cette fenêtre ne vend plus rien, elle le rappelle simplement.
const UpgradeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const features = [
    "Test d'orientation complet",
    "Détails des métiers et des formations",
    "Plan d'action personnalisé",
    "Cléo, ton coach IA",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[560px] border-none bg-transparent shadow-none">
        <div className="upgrade-modal-content">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10" aria-label="Fermer">
            <X size={20} className="text-slate-500" />
          </button>

          <div className="upgrade-header">
            <h2 className="upgrade-title">Tout est gratuit 🎉</h2>
            <p className="upgrade-subtitle">
              Tu as accès à toutes les fonctionnalités de CléAvenir, sans abonnement ni paiement.
            </p>
          </div>

          <ul className="space-y-3 my-6 px-6">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                <Check size={16} className="text-emerald-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>

          <div className="px-6 pb-6">
            <button
              className="cta-button cta-premium w-full flex items-center justify-center gap-2"
              onClick={() => { onClose?.(); navigate('/test'); }}
            >
              Faire le test d'orientation <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
