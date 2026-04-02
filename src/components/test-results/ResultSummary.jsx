import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Compass, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ResultSummary = ({ profile }) => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-purple-600" />
              Synthèse du Profil
            </h2>
            
            <Card className="bg-white/80 backdrop-blur-xl border border-purple-100 shadow-xl shadow-purple-900/5">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-500" /> Mode de fonctionnement
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Votre profil indique une forte propension pour les environnements structurés offrant des défis intellectuels. Vous privilégiez la réflexion analytique et l'innovation pratique.
                </p>

                <div className="mt-8">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" /> Compétences Clés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Analyse', 'Résolution de problèmes', 'Adaptabilité', 'Rigueur', 'Autonomie'].map((skill, i) => (
                      <Badge key={i} className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6 opacity-0">
              Hidden
            </h2>
            
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl border-none h-full">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-400">
                  <Compass className="w-5 h-5" /> Secteurs de prédilection
                </h3>
                <div className="space-y-3 mb-8">
                  {profile.sectors?.map((sector, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-lg border border-white/5">
                      <span className="font-medium text-slate-200">{sector}</span>
                      <span className="text-emerald-400 font-bold">Optimal</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-pink-400">
                  <TrendingUp className="w-5 h-5" /> Dynamique Marché
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Les secteurs identifiés connaissent une croissance soutenue avec de fortes opportunités d'évolution sur les 5 prochaines années, notamment grâce à la digitalisation et aux nouvelles normes environnementales.
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ResultSummary;