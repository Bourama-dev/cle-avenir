import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Tag } from 'lucide-react';

const BlogSidebar = ({ recentPosts, categories, tags }) => {
  return (
    <div className="space-y-8">
      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-900 border-b pb-2">Articles Récents</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
              <h4 className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {post.title}
              </h4>
              <p className="text-xs text-slate-500">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-900 border-b pb-2">Catégories</h3>
        <ul className="space-y-2">
          {categories.map((cat, idx) => (
            <li key={idx}>
               <Link 
                 to={`/blog?category=${cat.name || cat}`} 
                 className="flex items-center justify-between text-sm text-slate-600 hover:text-primary transition-colors py-1"
               >
                  <span>{cat.name || cat}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
               </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-900 border-b pb-2 flex items-center gap-2">
           <Tag className="w-4 h-4" /> Tags Populaires
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
               {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;