import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Rocket, Bot, Target, Medal, Clock } from 'lucide-react';

const V1FeaturesPage = ({ onNavigate }) => {
  const features = [
    { title: "Coach IA Personnel", desc: "Un assistant disponible 24/7 pour répondre à vos questions carrière.", icon: Bot, date: "Mars 2025" },
    { title: "Simulations Métiers", desc: "Vivez une journée type dans le métier de vos rêves en VR/Web.", icon: Target, date: "Avril 2025" },
    { title: "Micro-Certifications", desc: "Validez vos compétences soft skills directement sur la plateforme.", icon: Medal, date: "Mai 2025" },
    { title: "Suivi d'évolution", desc: "Tableau de bord dynamique qui s'adapte à votre progression.", icon: Rocket, date: "Juin 2025" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead title="Roadmap V1 - Fonctionnalités à venir" description="Découvrez le futur de CléAvenir." />
      {/* Header removed */}
      
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4">Le futur de l'orientation</h1>
        <p className="text-center text-slate-600 mb-16 text-lg">Voici ce que nous construisons pour la version 1.0 de CléAvenir.</p>

        <div className="space-y-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                <f.icon className="w-8 h-8" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
                <Clock className="w-4 h-4" /> {f.date}
              </Badge>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default V1FeaturesPage;