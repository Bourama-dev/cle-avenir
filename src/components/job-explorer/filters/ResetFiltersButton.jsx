import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResetFiltersButton = ({ onReset, className }) => {
  return (
    <Button
      variant="outline"
      onClick={onReset}
      className={`w-full border-slate-200 hover:bg-slate-50 hover:text-rose-600 transition-colors ${className}`}
    >
      <X className="w-4 h-4 mr-2" />
      Réinitialiser les filtres
    </Button>
  );
};

export default ResetFiltersButton;