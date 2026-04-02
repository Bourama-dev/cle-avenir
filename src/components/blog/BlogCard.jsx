import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ImageOptimizer from '@/components/ui/ImageOptimizer';
import { getPublicBlogImageUrl } from '@/utils/blogImages';

const BlogCard = memo(({ post, className }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = (e) => {
    // If user clicks a link inside, let it propagate, otherwise navigate
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    navigate(`/blog/${post.slug}`);
  };

  const imageUrl = getPublicBlogImageUrl(post.featured_image || post.cover_image);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={handleClick}
      className={cn(
        "group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <ImageOptimizer 
          src={imageUrl || 'https://via.placeholder.com/800x400?text=CléAvenir+Blog'} 
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-blog.png';
          }}
        />
        
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors pointer-events-none" />
        
        {post.category && (
          <Badge className="absolute top-4 left-4 bg-white/95 text-indigo-600 hover:bg-white backdrop-blur-sm shadow-sm border-none font-semibold">
            {post.category}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)}
          </span>
          {post.reading_time && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.reading_time} min
              </span>
            </>
          )}
        </div>

        <Link to={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
               <User className="w-3.5 h-3.5" />
            </div>
            {post.author || 'Équipe CléAvenir'}
          </div>
          <span 
            className="text-indigo-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Lire <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
});

export default BlogCard;