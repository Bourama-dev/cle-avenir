import React from 'react';
import { Briefcase, TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CareerDetails = ({ career }) => {
  return (
    <div className="pt-4 space-y-6 animate-in slide-in-from-top-4 duration-500">
        {/* Why this matches */}
        <div className="bg-violet-50/50 p-4 rounded-xl border border-violet-100">
            <h4 className="font-semibold text-violet-900 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Pourquoi ce métier te correspond ?
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
                Ce métier s'aligne avec ton intérêt pour <span className="font-medium text-violet-700">{career.tags?.[0] || 'ce domaine'}</span> et tes compétences en résolution de problèmes. Ton profil indique une préférence pour des environnements stimulants.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Environment */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-slate-500" />
                    Environnement
                </h4>
                <p className="text-sm text-slate-600">
                    🏢 Bureau & Terrain
                    <br/>
                    🤝 Travail d'équipe fréquent
                </p>
            </div>

            {/* Salary */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-500" />
                    Salaire estimé (Débutant)
                </h4>
                <div className="flex items-center gap-2">
                    <div className="flex space-x-0.5">
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-200 rounded-sm"></div>
                        <div className="w-4 h-2 bg-slate-100 rounded-sm"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">32k€ - 38k€ / an</span>
                </div>
            </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                Compétences clés
            </h4>
            <div className="flex flex-wrap gap-2">
                {['Analyse', 'Communication', 'Gestion de projet', 'Créativité'].map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                        {skill}
                    </Badge>
                ))}
            </div>
        </div>

        {/* Progression */}
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-slate-500" />
                Évolution possible
            </h4>
            <div className="flex items-center text-sm text-slate-600 gap-2">
                <span>Junior</span>
                <span className="text-slate-300">→</span>
                <span>Confirmé</span>
                <span className="text-slate-300">→</span>
                <span className="font-medium text-violet-700">Manager / Expert</span>
            </div>
        </div>
    </div>
  );
};

export default CareerDetails;