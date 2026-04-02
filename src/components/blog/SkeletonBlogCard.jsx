import React from 'react';

const SkeletonBlogCard = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-slate-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="flex-1 p-6 flex flex-col space-y-4">
        {/* Meta */}
        <div className="flex gap-2">
          <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 flex-1">
           <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
           <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
           <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
           <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
           <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonBlogCard;