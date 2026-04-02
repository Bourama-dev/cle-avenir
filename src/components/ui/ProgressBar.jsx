import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Top loading bar similar to NProgress
 */
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start progress on location change
    setIsVisible(true);
    setProgress(10);

    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 400);
    const timer3 = setTimeout(() => setProgress(85), 800);
    const timer4 = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsVisible(false), 200);
    }, 1200); // Simulate completion

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
    };
  }, [location.pathname, location.search]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div 
        className="h-full bg-purple-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;