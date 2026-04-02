import React from 'react';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// A reusable template for static SEO landing pages
const StaticPage = ({ onNavigate, title, subtitle, description, keywords, content, ctaLink = "/test", ctaText = "Faire le point gratuitement" }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title={title}
        description={description}
        keywords={keywords}
      />
      {/* Header removed */}

      <main className="container mx-auto px-4 py-8 max-w-5xl">
         <Breadcrumbs items={[{ label: title, path: window.location.pathname }]} />
         
         <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                {title}
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl leading-relaxed">
                {subtitle}
            </p>

            <div className="prose prose-lg prose-slate max-w-none mb-12">
                {content}
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 md:p-10 text-center">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Prêt à passer à l'action ?</h2>
                <p className="text-indigo-700 mb-8 max-w-xl mx-auto">
                    Ne restez pas seul face à vos questions. Utilisez nos outils intelligents pour avancer concrètement.
                </p>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6 h-auto" onClick={() => onNavigate(ctaLink)}>
                    {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
         </div>
      </main>
    </div>
  );
};

export default StaticPage;