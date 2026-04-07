import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { faqBlogArticles } from '@/data/faqBlogArticles';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSEO from '@/components/SEO/BlogSEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, X, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogCategories, popularTags } from '@/data/blogPosts';
import './BlogPage.css';

const ITEMS_PER_PAGE = 6;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });
        if (error) throw error;
        setPosts(data && data.length > 0 ? data : faqBlogArticles);
      } catch {
        setPosts(faqBlogArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(term) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)));
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const featuredPost = posts[0];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  return (
    <div className="blog-page">
      <BlogSEO
        title="Blog CléAvenir — Conseils carrière & orientation"
        description="L'actualité de l'emploi, des conseils d'experts et de l'inspiration pour construire votre avenir professionnel."
        url="/blog"
        type="website"
      />

      {/* ── Hero éditorial ── */}
      <header className="blog-hero">
        <div className="blog-hero__noise" />
        <div className="blog-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="blog-hero__label">
              <Rss size={13} />
              <span>Le blog CléAvenir</span>
            </div>
            <h1 className="blog-hero__title">
              Construis ton<br />
              <em>avenir professionnel</em>
            </h1>
            <p className="blog-hero__sub">
              Conseils d'experts, tendances du marché et témoignages pour guider chaque étape de ta carrière.
            </p>
          </motion.div>
        </div>
        <div className="blog-hero__scroll-hint">
          <span />
        </div>
      </header>

      {/* ── Article en vedette ── */}
      {!loading && featuredPost && (
        <section className="blog-featured">
          <div className="blog-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link to={`/blog/${featuredPost.slug}`} className="blog-featured__card">
                <div className="blog-featured__image">
                  <img
                    src={featuredPost.featured_image || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80`}
                    alt={featuredPost.title}
                  />
                  <div className="blog-featured__overlay" />
                </div>
                <div className="blog-featured__body">
                  {featuredPost.category && (
                    <span className="blog-cat-badge">{featuredPost.category}</span>
                  )}
                  <h2 className="blog-featured__title">{featuredPost.title}</h2>
                  <p className="blog-featured__excerpt">{featuredPost.excerpt}</p>
                  <div className="blog-featured__meta">
                    <span className="blog-featured__author">{featuredPost.author || 'Équipe CléAvenir'}</span>
                    <span className="blog-featured__dot">·</span>
                    <span>{featuredPost.reading_time ? `${featuredPost.reading_time} min` : '5 min'}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Corps principal ── */}
      <main className="blog-main">
        <div className="blog-container blog-layout">

          {/* Colonne articles */}
          <div className="blog-articles-col">

            {/* Barre filtre/recherche */}
            <div className="blog-toolbar">
              <div className="blog-cats">
                {['Tous', ...blogCategories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat === 'Tous' ? 'all' : cat)}
                    className={`blog-cat-btn ${categoryFilter === (cat === 'Tous' ? 'all' : cat) ? 'blog-cat-btn--active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="blog-search-wrap">
                <Search className="blog-search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="blog-search-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="blog-search-clear">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Grille articles */}
            {loading ? (
              <div className="blog-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="blog-skeleton" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${categoryFilter}-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="blog-grid"
                >
                  {currentPosts.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="blog-empty">
                <p>Aucun article ne correspond à votre recherche.</p>
                <button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
                  Réinitialiser
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="blog-pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="blog-page-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`blog-page-btn ${currentPage === idx + 1 ? 'blog-page-btn--active' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="blog-page-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar-col">
            <BlogSidebar
              recentPosts={posts.slice(0, 5)}
              categories={blogCategories}
              tags={popularTags}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
