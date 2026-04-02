import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-slate-900 to-violet-900/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Prêt à Transformer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">
              Votre Carrière ?
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Rejoignez les milliers de personnes qui ont trouvé leur voie grâce à CléAvenir.
            C'est gratuit, sans engagement et ça prend moins de 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button 
                size="lg"
                onClick={() => navigate('/test-orientation')}
                className="w-full h-14 px-8 text-lg rounded-full bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-bold shadow-xl shadow-rose-900/20 border-0 transition-all duration-300"
              >
                Faire le test gratuit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/formations')}
                className="w-full h-14 px-8 text-lg rounded-full border-slate-700 text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-300 bg-transparent"
              >
                Explorer les formations
              </Button>
            </motion.div>
          </div>

          <p className="mt-8 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="flex items-center gap-2">✨ Pas de carte bancaire requise</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2">🔒 Données sécurisées</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;