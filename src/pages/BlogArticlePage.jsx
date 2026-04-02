import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { faqBlogArticles } from '@/data/faqBlogArticles';
import BlogSEO from '@/components/SEO/BlogSEO';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Linkedin, Twitter, Facebook, Link as LinkIcon, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { getPublicBlogImageUrl } from '@/utils/blogImages';

const BlogArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from Supabase
        const { data, error: dbError } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('slug', slug)
          .single();

        if (dbError) throw dbError;

        if (data) {
          setPost(data);
          
          // Fetch related posts (same category, excluding current)
          const { data: relatedData } = await supabase
            .from('blog_articles')
            .select('id, title, slug, featured_image, category, published_at')
            .eq('category', data.category)
            .neq('id', data.id)
            .limit(3);
            
          setRelatedPosts(relatedData || []);
        } else {
          throw new Error("Article not found in DB");
        }
      } catch (err) {
        console.warn("Falling back to local data for blog article:", err);
        // Fallback to local data
        const foundPost = faqBlogArticles.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          const related = faqBlogArticles
            .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError("Article introuvable");
        }
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié !",
      description: "Le lien de l'article a été copié dans votre presse-papier.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white container mx-auto px-4 py-12 max-w-4xl">
         <div className="space-y-4 mb-8 text-center">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
         </div>
         <Skeleton className="w-full h-96 rounded-2xl mb-12" />
         <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
         </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Oups ! Article introuvable</h1>
        <p className="text-slate-600 mb-8">{error || "Cet article n'existe pas ou a été déplacé."}</p>
        <Button onClick={() => navigate('/blog')}>Retour au blog</Button>
      </div>
    );
  }

  const heroImageUrl = getPublicBlogImageUrl(post.featured_image || post.cover_image);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <BlogSEO 
        title={post.title}
        description={post.excerpt}
        image={heroImageUrl}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published_at}
        author={post.author}
        tags={post.tags}
      />

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 sticky top-16 z-20">
        <div className="container mx-auto px-4 py-3 text-sm text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap max-w-4xl">
          <Link to="/" className="hover:text-indigo-600">Accueil</Link>
          <span className="text-slate-300">/</span>
          <Link to="/blog" className="hover:text-indigo-600">Blog</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge className="mb-6 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 px-4 py-1.5 text-sm font-semibold tracking-wide uppercase">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">{post.author ? post.author[0] : 'C'}</AvatarFallback>
              </Avatar>
              <span className="text-slate-900">{post.author}</span>
            </div>
            <span className="hidden md:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {post.reading_time && (
              <>
                <span className="hidden md:inline text-slate-300">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.reading_time} min de lecture
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl relative aspect-video border border-slate-100"
        >
          <img 
            src={heroImageUrl || 'https://via.placeholder.com/1200x600?text=CléAvenir'} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder-blog.png';
            }}
          />
        </motion.div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Article Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl">
               <div 
                 className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-xl prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-li:marker:text-indigo-600"
                 dangerouslySetInnerHTML={{ __html: post.content }}
               />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Sujets abordés</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/blog?search=${tag}`}>
                      <Badge variant="secondary" className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors cursor-pointer px-3 py-1.5 text-sm">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-base font-bold text-slate-900">Vous avez aimé cet article ? Partagez-le !</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full bg-white text-slate-500 hover:text-[#0077b5] hover:border-[#0077b5]" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}>
                   <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white text-slate-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2]" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`, '_blank')}>
                   <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white text-slate-500 hover:text-[#4267B2] hover:border-[#4267B2]" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                   <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white text-slate-500 hover:text-slate-900 hover:border-slate-900" onClick={copyLink}>
                   <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Author Box */}
            <div className="mt-12 bg-white rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-100 shadow-sm">
               <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">{post.author ? post.author[0] : 'A'}</AvatarFallback>
               </Avatar>
               <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">À propos de {post.author}</h3>
                  <p className="text-indigo-600 text-sm font-medium mb-3">{post.author_role || 'Contributeur CléAvenir'}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     Expert en orientation et développement de carrière. Passionné par l'accompagnement des talents de demain et l'analyse des tendances du marché de l'emploi.
                  </p>
               </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
             <div className="sticky top-32 space-y-8">
                {/* Newsletter Box */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   <h3 className="font-bold text-xl mb-2 relative z-10">Restez informé 🚀</h3>
                   <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed">
                     Recevez nos meilleurs conseils carrière et les tendances de l'emploi directement dans votre boîte mail.
                   </p>
                   <div className="space-y-3 relative z-10">
                      <input type="email" placeholder="Votre email" className="w-full px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border-none shadow-inner" />
                      <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold shadow-md h-10">
                         S'abonner gratuitement
                      </Button>
                   </div>
                   <p className="text-[10px] text-indigo-200 mt-4 text-center relative z-10">Désinscription possible à tout moment.</p>
                </div>
                
                {/* Related Articles Vertical List */}
                 {relatedPosts.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Dans la même catégorie</h3>
                    <div className="space-y-4">
                      {relatedPosts.map(related => {
                        const relatedImgUrl = getPublicBlogImageUrl(related.featured_image || related.cover_image);
                        return (
                          <Link key={related.id} to={`/blog/${related.slug}`} className="group block">
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                                 <img 
                                   src={relatedImgUrl || 'https://via.placeholder.com/150'} 
                                   alt="" 
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                   onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-blog.png'; }}
                                 />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 leading-snug line-clamp-2 mb-1">
                                   {related.title}
                                 </h4>
                                 <span className="text-xs text-slate-500">{new Date(related.published_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                 )}
             </div>
          </aside>
        </div>

        {/* Related Articles Grid (Mobile/Bottom) */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 border-t border-slate-200 pt-16">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Articles recommandés</h2>
               <Link to="/blog" className="text-indigo-600 font-semibold hover:underline hidden sm:block">Voir tout le blog</Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(related => {
                   const relatedImgUrl = getPublicBlogImageUrl(related.featured_image || related.cover_image);
                   return (
                     <Link key={related.id} to={`/blog/${related.slug}`} className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-slate-100 block">
                        <div className="aspect-video overflow-hidden relative bg-slate-200">
                           <img 
                             src={relatedImgUrl || 'https://via.placeholder.com/400x200'} 
                             alt={related.title} 
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                             onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-blog.png'; }}
                           />
                           <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 text-indigo-600 hover:bg-white">{related.category}</Badge>
                           </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2 line-clamp-2">
                             {related.title}
                          </h3>
                          <div className="text-xs text-slate-500 font-medium">{new Date(related.published_at).toLocaleDateString()}</div>
                        </div>
                     </Link>
                   );
                })}
             </div>
          </div>
        )}

        {/* Comments Section Placeholder */}
        <div className="mt-16 bg-gradient-to-r from-slate-50 to-white rounded-2xl p-8 md:p-12 text-center border border-slate-100">
           <h3 className="text-xl font-bold text-slate-900 mb-2">La discussion continue !</h3>
           <p className="text-slate-500 mb-6 max-w-lg mx-auto">Vous avez une question ou un avis à partager sur ce sujet ? Rejoignez la communauté sur nos réseaux.</p>
           <Button disabled variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
              <Send className="w-4 h-4 mr-2" />
              Espace commentaires (Bientôt disponible)
           </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogArticlePage;