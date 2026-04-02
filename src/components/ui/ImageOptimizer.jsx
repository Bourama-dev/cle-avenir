import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, ImageOff } from 'lucide-react';

const ImageOptimizer = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  fallbackSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : undefined);

  // Intersection Observer for lazy loading if not priority
  useEffect(() => {
    if (priority || !src) return;

    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    
    // If not priority, use intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentSrc(src);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [src, priority]);

  // Handle immediate load for priority images
  useEffect(() => {
    if (priority) {
      setCurrentSrc(src);
    }
  }, [src, priority]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);

  // Render error state
  if (error) {
    return (
      <div 
        className={cn(
          "bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300", 
          className
        )}
        style={{ width, height }}
      >
        <ImageOff className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", className)} style={{ width, height }}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
           <div className="w-full h-full bg-slate-200 animate-pulse" />
        </div>
      )}
      
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-in-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        />
      )}
    </div>
  );
};

export default ImageOptimizer;