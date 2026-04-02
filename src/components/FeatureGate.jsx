import React, { useState } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import UpgradeModal from '@/components/UpgradeModal';
import { TIERS } from '@/constants/subscriptionTiers';

/**
 * Wraps content that requires specific feature access.
 * If user has access, renders children.
 * If not, renders a blur/lock state.
 * 
 * @param {string} feature - The feature key from FEATURES constant
 * @param {string} requiredTier - Minimum tier required (for modal messaging)
 * @param {boolean} blur - Whether to show blurred content behind the lock
 * @param {string} title - Title for the lock overlay
 * @param {string} description - Description for the lock overlay
 */
const FeatureGate = ({ 
  children, 
  feature, 
  requiredTier = TIERS.PREMIUM, 
  blur = true,
  title = "Contenu réservé",
  description = "Passez à la version supérieure pour voir ce contenu."
}) => {
  const { hasAccess, loading } = useSubscriptionAccess();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div className="animate-pulse bg-slate-100 h-24 rounded-lg w-full"></div>;

  if (hasAccess(feature)) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200">
      {/* Blurred Content Placeholder (if blur is true, we might render children with blur filter, or just a mock image) */}
      <div className={`${blur ? 'filter blur-sm select-none opacity-50' : 'hidden'} p-4`}>
        {children}
      </div>
      
      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10 p-6 text-center">
        <div className="bg-slate-100 p-3 rounded-full mb-3 shadow-sm">
          <Lock className="h-6 w-6 text-slate-500" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-4 max-w-xs">{description}</p>
        <Button onClick={() => setShowModal(true)} variant="default" className="bg-violet-600 hover:bg-violet-700">
          Débloquer maintenant
        </Button>
      </div>

      <UpgradeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        targetTier={requiredTier}
        title={title}
        description={description}
      />
    </div>
  );
};

export default FeatureGate;