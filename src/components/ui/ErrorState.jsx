import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorState = ({ 
  title = "Une erreur est survenue", 
  message = "Nous n'avons pas pu charger les données. Veuillez réessayer.",
  onRetry,
  className 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default ErrorState;