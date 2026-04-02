import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden border border-slate-200 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo Skeleton */}
          <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
          
          <div className="flex-1 space-y-3">
            {/* Title & Company */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            
            {/* Description Lines */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCardSkeleton;