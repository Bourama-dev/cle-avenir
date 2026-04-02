import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Chargement en cours...", className }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingState;