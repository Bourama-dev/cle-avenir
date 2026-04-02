import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ className, size = 24, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center p-4", className)}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
};