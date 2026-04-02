import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FileImage as ImageIcon } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  placeholderSrc, 
  threshold = 0.1,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, { threshold });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // To remove skeleton
  };

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden bg-slate-100", className)} 
      {...props}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-slate-200">
           <ImageIcon className="h-6 w-6 text-slate-400 opacity-50" />
        </div>
      )}
      
      {isInView && !error && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
           <span className="text-xs">Image non disponible</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;