import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { faqBlogArticles } from '@/data/faqBlogArticles';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogSEO from '@/components/SEO/BlogSEO';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogCategories, popularTags } from '@/data/blogPosts'; // Keeping categories/tags local for consistent UI

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
        
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          // Fallback to local data
          setPosts(faqBlogArticles);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setPosts(faqBlogArticles); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter Logic
  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(term) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
                          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <BlogSEO 
        title="Le Blog CléAvenir - Conseils Carrière & Orientation"
        description="Retrouvez nos derniers articles pour booster votre carrière : reconversion, emploi, formation, et bien-être au travail."
        url="/blog"
        type="website"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
          >
             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
               Le Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">CléAvenir</span>
             </h1>
             <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
               L'actualité de l'emploi, des conseils d'experts et de l'inspiration pour construire votre avenir professionnel.
             </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Blog</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Column */}
          <div className="flex-1">
            <BlogSearch 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
              categories={blogCategories}
            />

            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
               </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {currentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg mb-2">Aucun article ne correspond à votre recherche.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
                  className="text-indigo-600 font-bold"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 p-0 rounded-full hover:bg-indigo-50 hover:text-indigo-600 border-slate-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <Button
                    key={idx}
                    variant={currentPage === idx + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-10 h-10 p-0 rounded-full font-bold ${
                      currentPage === idx + 1 
                        ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                        : 'border-slate-300 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </Button>
                ))}

                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 p-0 rounded-full hover:bg-indigo-50 hover:text-indigo-600 border-slate-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
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