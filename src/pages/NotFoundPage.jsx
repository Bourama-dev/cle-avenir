import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft, HelpCircle } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <SEOHead title="Page non trouvée - CléAvenir" description="La page que vous recherchez n'existe pas." />
      
      {/* Hero Section with Glassmorphism */}
      <div className="relative p-12 rounded-3xl backdrop-blur-md bg-white/40 border border-white/60 shadow-xl shadow-purple-100 max-w-2xl w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-full shadow-lg shadow-purple-900/5 ring-4 ring-white">
          <Search className="h-12 w-12 text-purple-600" />
        </div>

        <h1 className="mt-8 text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4 tracking-tighter">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Oups ! Cette page s'est perdue.
        </h2>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Il semblerait que le lien que vous avez suivi soit cassé ou que la page ait été supprimée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto gap-2 border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <ArrowLeft size={18} /> Retour
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            size="lg" 
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20"
          >
            <Home size={18} /> Retour à l'accueil
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col items-center">
          <p className="text-sm text-slate-500 mb-3">Besoin d'aide ?</p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100"
          >
            <HelpCircle size={16} /> Contacter le support
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;