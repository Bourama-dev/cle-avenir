import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const MetierCardSkeleton = () => {
  return (
    <Card className="p-6 relative overflow-hidden bg-white/40 border-white/60 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-full rounded-xl" />
    </Card>
  );
};

export default MetierCardSkeleton;