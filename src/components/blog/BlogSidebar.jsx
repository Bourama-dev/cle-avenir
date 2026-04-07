import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Hash } from 'lucide-react';

const BlogSidebar = ({ recentPosts, categories, tags }) => {
  return (
    <div className="blog-sidebar">
      {/* Articles récents */}
      <div className="blog-sidebar__block">
        <h3 className="blog-sidebar__title">Articles récents</h3>
        <div className="blog-sidebar__recent">
          {recentPosts.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="blog-sidebar__recent-item">
              <span className="blog-sidebar__recent-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="blog-sidebar__recent-label">{post.title}</p>
                <p className="blog-sidebar__recent-date">
                  {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <ArrowUpRight size={14} className="blog-sidebar__recent-arrow" />
            </Link>
          ))}
        </div>
      </div>

      {/* Catégories */}
      <div className="blog-sidebar__block">
        <h3 className="blog-sidebar__title">Catégories</h3>
        <div className="blog-sidebar__cats">
          {categories.map((cat, i) => (
            <Link key={i} to={`/blog?category=${cat.name || cat}`} className="blog-sidebar__cat">
              {cat.name || cat}
              <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="blog-sidebar__block">
        <h3 className="blog-sidebar__title">Tags populaires</h3>
        <div className="blog-sidebar__tags">
          {tags.map((tag, i) => (
            <span key={i} className="blog-sidebar__tag">
              <Hash size={11} />{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA newsletter */}
      <div className="blog-sidebar__newsletter">
        <p className="blog-sidebar__newsletter-label">Newsletter</p>
        <p className="blog-sidebar__newsletter-sub">Reçois les meilleurs articles chaque semaine.</p>
        <Link to="/signup" className="blog-sidebar__newsletter-btn">
          S'inscrire gratuitement
        </Link>
      </div>
    </div>
  );
};

export default BlogSidebar;
