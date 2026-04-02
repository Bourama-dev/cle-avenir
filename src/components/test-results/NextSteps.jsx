import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Share2, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const NextSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Lien copié dans le presse-papier !", description: "Vous pouvez maintenant le partager." });
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Et maintenant ?</h2>
        <p className="text-slate-500 mb-12 text-lg">Découvrez les prochaines étapes pour concrétiser votre projet professionnel.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -5 }}>
            <Button 
              variant="outline" 
              className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-slate-50 hover:bg-slate-100 border-slate-200 rounded-2xl"
              onClick={() => navigate('/test-orientation')}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">Refaire le test</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Button 
              variant="outline" 
              className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-slate-50 hover:bg-slate-100 border-slate-200 rounded-2xl"
              onClick={() => toast({ title: "Téléchargement en cours...", description: "Votre rapport PDF sera bientôt prêt." })}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">Télécharger (PDF)</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Button 
              variant="outline" 
              className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-slate-50 hover:bg-slate-100 border-slate-200 rounded-2xl"
              onClick={handleShare}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">Partager</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Button 
              className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/20 border-none"
              onClick={() => navigate('/formations')}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold">Explorer Formations</span>
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-2">Besoin d'aller plus loin ?</h3>
            <p className="text-slate-300">Créez votre CV, préparez vos entretiens et décrochez votre futur emploi.</p>
          </div>
          <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-8 rounded-xl shrink-0" onClick={() => navigate('/dashboard')}>
            Accéder au Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NextSteps;