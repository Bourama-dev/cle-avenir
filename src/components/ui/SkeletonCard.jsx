import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export const SkeletonCard = () => (
  <Card className="h-full">
    <CardHeader className="gap-2">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-9 w-24 rounded-md" />
    </CardFooter>
  </Card>
);

export const SkeletonRow = () => (
  <div className="flex items-center space-x-4 py-4 w-full">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-1" />
          <Skeleton className="h-3 w-[80px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);