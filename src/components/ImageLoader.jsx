import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ImageLoader = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full bg-slate-200 animate-pulse" />
      )}
      
      {hasError ? (
         <div className="flex items-center justify-center w-full h-full bg-slate-100 text-slate-400 text-xs p-2 text-center">
            Image non disponible
         </div>
      ) : (
         <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
               "w-full h-full object-cover transition-opacity duration-500",
               isLoaded ? "opacity-100" : "opacity-0"
            )}
            {...props}
         />
      )}
    </div>
  );
};

export default ImageLoader;