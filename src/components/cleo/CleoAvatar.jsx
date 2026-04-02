import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const CleoAvatar = ({ size = "md", className, showStatus = true }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(
        "rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-br from-violet-100 to-fuchsia-100 relative z-10",
        sizeClasses[size]
      )}>
        <img 
          src="https://horizons-cdn.hostinger.com/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/4425979471c3cd45f14210cbf6789013.png" 
          alt="Cléo Avatar"
          className="w-full h-full object-cover object-top transform scale-110 translate-y-1"
        />
      </div>
      
      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 z-20 flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
          </span>
        </div>
      )}
      
      {/* Decorative elements for larger sizes */}
      {(size === 'lg' || size === 'xl') && (
        <>
          <Sparkles className="absolute -top-2 -right-4 text-yellow-400 w-6 h-6 animate-pulse" />
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full -z-10 transform scale-150"></div>
        </>
      )}
    </div>
  );
};

export default CleoAvatar;