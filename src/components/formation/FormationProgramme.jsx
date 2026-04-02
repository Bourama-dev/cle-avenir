import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, GraduationCap, Globe, CheckCircle2, Target, BookOpen } from 'lucide-react';

const FormationProgramme = ({ formation }) => {
  if (!formation) return null;

  const duration = formation.duration_hours ? `${formation.duration_hours} heures` : (formation.duration || 'Variable');
  const level = formation.level || formation.required_education_level || 'Non spécifié';
  const language = formation.language || 'Français';
  const skills = formation.tags || formation.competences_visees || ['Compétences métiers', 'Savoir-être'];
  const objectives = formation.objectives || formation.prerequisites || ['Maîtriser les fondamentaux', 'Acquérir une posture professionnelle'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="formation-stat-card border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Durée estimée</p>
              <p className="text-lg font-bold text-slate-900">{duration}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="formation-stat-card border-violet-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Niveau visé</p>
              <p className="text-lg font-bold text-slate-900">{level}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="formation-stat-card border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Langue</p>
              <p className="text-lg font-bold text-slate-900">{language}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-500" />
              Objectifs de la formation
            </h3>
            <ul className="space-y-4">
              {objectives.map((obj, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Compétences développées
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 text-sm font-medium border border-indigo-100 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormationProgramme;