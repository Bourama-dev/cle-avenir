import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const RoadmapPage = () => {
  const roadmap = [
    {
      quarter: "Q1 2026",
      status: "completed",
      items: [
        "Lancement officiel V2.4",
        "Refonte du moteur de recherche formations",
        "Intégration Stripe pour paiements sécurisés"
      ]
    },
    {
      quarter: "Q2 2026",
      status: "current",
      items: [
        "Application Mobile iOS & Android",
        "Module de simulation d'entretien vidéo avec Cléo",
        "Partenariats Écoles Étendus"
      ]
    },
    {
      quarter: "Q3 2026",
      status: "planned",
      items: [
        "Marketplace de mentors professionnels",
        "Tests de personnalité avancés (Big Five)",
        "Programme Ambassadeurs Étudiants"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Roadmap Produit</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Découvrez les prochaines fonctionnalités que nous construisons pour révolutionner votre orientation.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-12">
        {roadmap.map((phase, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white ${
              phase.status === 'completed' ? 'border-green-500 bg-green-500' : 
              phase.status === 'current' ? 'border-rose-500 animate-pulse' : 'border-slate-300'
            }`} />

            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{phase.quarter}</h2>
              {phase.status === 'current' && <Badge className="bg-rose-100 text-rose-700 w-fit">En cours</Badge>}
              {phase.status === 'completed' && <Badge className="bg-green-100 text-green-700 w-fit">Terminé</Badge>}
              {phase.status === 'planned' && <Badge className="bg-slate-100 text-slate-600 w-fit">Planifié</Badge>}
            </div>

            <ul className="space-y-3">
              {phase.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-lg border shadow-sm">
                  {phase.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  ) : phase.status === 'current' ? (
                    <Clock className="h-5 w-5 text-rose-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;