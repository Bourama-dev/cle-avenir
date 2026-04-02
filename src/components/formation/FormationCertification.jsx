import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, FileCheck, CalendarDays, ScrollText } from 'lucide-react';

const FormationCertification = ({ formation }) => {
  if (!formation) return null;

  const diplomes = formation.diplomas_obtained || formation.certifications_obtained || ['Certification d\'Établissement'];
  const rncpLevel = formation.level || 'Non spécifié';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <Card className="border-slate-200 shadow-sm overflow-hidden group">
        <CardContent className="p-0">
          <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Type de validation</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">À l'issue de la formation</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {diplomes.map((dip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{dip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden group">
        <CardContent className="p-0">
          <div className="bg-emerald-50/50 p-6 border-b border-emerald-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <ScrollText className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reconnaissance</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Valeur sur le marché</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Niveau RNCP / Académique</span>
              <Badge variant="outline" className="font-bold border-slate-300 bg-slate-50 text-slate-800">
                {rncpLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Reconnaissance État</span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                Oui
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                Validité
              </span>
              <span className="font-medium text-slate-800">À vie</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormationCertification;