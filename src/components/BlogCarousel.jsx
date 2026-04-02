import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { faqBlogArticles } from '@/data/faqBlogArticles';
import { ChevronLeft, ChevronRight, Clock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ImageOptimizer from '@/components/ui/ImageOptimizer';
import './BlogCarousel.css';

const BlogCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Fetch articles from Supabase, fallback to local data
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error("Error fetching blog articles from DB:", error);
          throw error;
        }

        if (data && data.length > 0) {
          setArticles(data);
        } else {
          // If DB is empty, fallback to local data
          console.warn("Using local fallback data for blog carousel");
          setArticles(faqBlogArticles.slice(0, 6));
        }
      } catch (err) {
        // Fallback on error
        setArticles(faqBlogArticles.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isPaused || loading || articles.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, loading, articles.length]);

  const handleNext = (e) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setIsPaused(true);
  };

  const handlePrev = (e) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setIsPaused(true);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  const handleReadArticle = () => {
    if (articles[currentIndex]) {
      navigate(`/blog/${articles[currentIndex].slug}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-slate-50/50 rounded-2xl">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <section 
      className="blog-carousel-section py-12 md:py-16 bg-gradient-to-br from-indigo-50/30 via-white to-slate-50/50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-2 max-w-[1200px] mx-auto gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Conseils & Actualités</h2>
            <p className="text-slate-600 text-lg">Les dernières clés pour votre réussite professionnelle</p>
          </div>
          <Link 
            to="/blog" 
            className="group hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Voir tous les articles 
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="blog-carousel-container relative max-w-[1200px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArticle.id || currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col md:flex-row h-full min-h-[400px] md:h-[400px]"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group">
                <ImageOptimizer 
                  src={currentArticle.featured_image || 'https://via.placeholder.com/800x600?text=CléAvenir'} 
                  alt={currentArticle.title}
                  className="w-full h-full"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 z-20 pointer-events-none" />
                
                <div className="absolute top-4 left-4 z-30">
                  <span className="bg-white/95 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                    {currentArticle.category || 'Article'}
                  </span>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white relative z-10">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4 uppercase tracking-wide">
                   {currentArticle.published_at && (
                     <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> 
                        {new Date(currentArticle.published_at).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
                     </span>
                   )}
                   {currentArticle.reading_time && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{currentArticle.reading_time} min lecture</span>
                     </>
                   )}
                </div>
                
                <h3 
                  className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={handleReadArticle}
                >
                  {currentArticle.title}
                </h3>
                
                <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {currentArticle.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{currentArticle.author || 'Rédaction'}</p>
                      <p className="text-xs text-slate-500">{currentArticle.author_role || 'Expert'}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleReadArticle}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105"
                  >
                    Lire l'article
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons (Overlay) */}
          <button 
            onClick={handlePrev} 
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-sm transition-all hover:scale-110 focus:outline-none"
            aria-label="Article précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-sm transition-all hover:scale-110 focus:outline-none"
            aria-label="Article suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-indigo-600 w-8' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/blog" className="text-indigo-600 font-bold hover:underline inline-flex items-center">
             Voir tous les articles <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;