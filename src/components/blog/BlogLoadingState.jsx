import React from 'react';
import SkeletonBlogCard from './SkeletonBlogCard';
import { Loader2 } from 'lucide-react';

const BlogLoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonBlogCard key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center text-slate-500 gap-2">
         <Loader2 className="w-4 h-4 animate-spin" />
         <span className="text-sm">Chargement des articles...</span>
      </div>
    </div>
  );
};

export default BlogLoadingState;