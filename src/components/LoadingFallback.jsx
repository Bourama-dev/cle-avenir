import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Fallback component for Suspense boundaries
 */
const LoadingFallback = () => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-purple-600 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-6 w-6 text-purple-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400 font-medium">Chargement...</p>
    </div>
  );
};

export default LoadingFallback;