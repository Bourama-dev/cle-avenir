import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Basic shimmering block
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className }) => (
  <div className={cn("flex flex-col space-y-3 p-4 border rounded-xl shadow-sm bg-white", className)}>
    <Skeleton className="h-[125px] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export const SkeletonAvatar = ({ className }) => (
  <Skeleton className={cn("h-12 w-12 rounded-full", className)} />
);

export const SkeletonText = ({ lines = 1, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn("h-4 w-full", i === lines - 1 && lines > 1 ? "w-4/5" : "")} />
    ))}
  </div>
);

export const SkeletonList = ({ count = 3, className }) => (
    <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
                <SkeletonAvatar />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;