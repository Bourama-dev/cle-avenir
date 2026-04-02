import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToWhyUs = () => {
    const element = document.getElementById('why-us');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1695173583133-c19731e2df44" 
          alt="Jeune professionnel regardant l'horizon" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/90 via-fuchsia-900/80 to-slate-900/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-200 text-sm font-medium mb-8 hover:bg-white/20 transition-colors cursor-default"
          >
            <Sparkles className="w-4 h-4" />
            <span>Révélez votre potentiel avec l'IA</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            Transformez Votre <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 animate-gradient-x">
              Orientation Professionnelle
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Une méthode révolutionnaire alliant psychologie cognitive, données marché en temps réel et intelligence artificielle pour vous guider vers le métier qui vous correspond vraiment.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/test-orientation')}
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-bold shadow-xl shadow-rose-900/20 hover:scale-105 transition-all duration-300"
            >
              Commencer le test gratuit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={scrollToWhyUs}
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300"
            >
              Découvrir la méthode
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative gradient blur at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;