import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tout est gratuit : plus de paiement, le bouton mène simplement au test d'orientation.
const UpgradeButton = ({ className, children, variant = "default" }) => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate('/test')} className={className} variant={variant}>
      {children || (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Commencer le test
        </>
      )}
    </Button>
  );
};

export default UpgradeButton;
