import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts'; // Import centralized data

const Blog = ({ onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title="Le Blog de l'Orientation et de l'Emploi"
        description="Conseils carrière, guides de reconversion, tendances du marché de l'emploi et analyses métiers. Tout pour réussir votre vie professionnelle."
        keywords="blog emploi, conseils carrière, reconversion, orientation, formation"
      />
      {/* Header removed */}

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs items={[{ label: "Blog", path: "/blog" }]} />

        <div className="text-center mb-16 pt-8">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-4 py-1 text-sm">Ressources & Conseils</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            L'actualité de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Avenir Pro</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Décryptages, conseils pratiques et inspirations pour naviguer dans le monde du travail de demain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col h-full group cursor-pointer"
              onClick={() => onNavigate(`/blog/${post.slug}`)}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm shadow-sm font-semibold border-none">
                    {post.category}
                  </Badge>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                       <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{post.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 -mr-2">
                    Lire <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;