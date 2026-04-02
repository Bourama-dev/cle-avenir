import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, ShieldCheck, Sparkles } from 'lucide-react';

const CleoCoach = () => {
  return (
    <section className="hiw-section" id="cleo">
      <div className="hiw-cleo-section">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div 
            className="hiw-cleo-avatar"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            🤖
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Rencontrez Cléo, votre coach IA</h2>
          <p className="text-slate-600 text-lg">
            Disponible 24h/24 et 7j/7, Cléo utilise la puissance de l'IA générative pour vous accompagner personnellement à chaque étape.
          </p>
        </div>

        <div className="hiw-cleo-features">
          <div className="hiw-cleo-card">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Répond à tout</h4>
            <p className="text-sm text-slate-500">Posez n'importe quelle question sur un métier, une formation ou une école.</p>
          </div>
          <div className="hiw-cleo-card">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Simulation</h4>
            <p className="text-sm text-slate-500">Entraînez-vous pour vos entretiens d'embauche ou de motivation.</p>
          </div>
          <div className="hiw-cleo-card">
            <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Analyse CV</h4>
            <p className="text-sm text-slate-500">Téléchargez votre CV et recevez des conseils d'amélioration instantanés.</p>
          </div>
          <div className="hiw-cleo-card">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Conseil Perso</h4>
            <p className="text-sm text-slate-500">Des recommandations basées sur VOTRE profil unique et vos résultats.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Exemples de questions à poser à Cléo :
          </h3>
          <div className="space-y-2">
             <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm">"Quelles sont les compétences clés pour devenir Data Analyst ?"</div>
             <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm">"Peux-tu m'aider à rédiger une lettre de motivation pour une école de commerce ?"</div>
             <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm">"Quel salaire je peux espérer en tant que débutant dans le marketing digital ?"</div>
             <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm">"Je suis timide, comment me préparer à un entretien ?"</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CleoCoach;