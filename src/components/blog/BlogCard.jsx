import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPublicBlogImageUrl } from '@/utils/blogImages';

const BlogCard = memo(({ post, index = 0, className }) => {
  const imageUrl = getPublicBlogImageUrl(post.featured_image || post.cover_image);
  const fallback = `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80`;

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn('blog-card', className)}
    >
      <Link to={`/blog/${post.slug}`} className="blog-card__inner">
        {/* Image */}
        <div className="blog-card__img-wrap">
          <img
            src={imageUrl || fallback}
            alt={post.title}
            className="blog-card__img"
            onError={(e) => { e.target.src = fallback; }}
          />
          <div className="blog-card__img-overlay" />
          {post.category && (
            <span className="blog-card__cat">{post.category}</span>
          )}
        </div>

        {/* Body */}
        <div className="blog-card__body">
          <div className="blog-card__meta">
            <span className="blog-card__meta-item">
              <Calendar size={12} />
              {formatDate(post.published_at)}
            </span>
            {post.reading_time && (
              <span className="blog-card__meta-item">
                <Clock size={12} />
                {post.reading_time} min
              </span>
            )}
          </div>

          <h3 className="blog-card__title">{post.title}</h3>

          {post.excerpt && (
            <p className="blog-card__excerpt">{post.excerpt}</p>
          )}

          <div className="blog-card__footer">
            <span className="blog-card__author">
              {post.author || 'Équipe CléAvenir'}
            </span>
            <span className="blog-card__read">
              Lire <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';
export default BlogCard;
