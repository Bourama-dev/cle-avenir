import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, TrendingUp, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormationDebouches = ({ careers }) => {
  const navigate = useNavigate();

  if (!careers || careers.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none">
        <CardContent className="p-12 text-center text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">Aucun débouché spécifique renseigné pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {careers.map((career) => (
        <Card key={career.code} className="hover:shadow-lg transition-all duration-300 border-slate-200 group flex flex-col">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="font-mono bg-slate-50 text-slate-600 border-slate-200">
                ROME: {career.code}
              </Badge>
              {career.debouches && (
                <Badge className={`${
                  career.debouches.toLowerCase().includes('favorable') || career.debouches.toLowerCase().includes('fort')
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Prospects
                </Badge>
              )}
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {career.libelle || career.name}
            </h4>
            
            <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
              {career.description || career.definition || 'Description non disponible pour ce métier.'}
            </p>

            <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
              <div className="flex items-center text-sm">
                <Euro className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-slate-700 font-medium">Salaire:</span>
                <span className="ml-2 text-slate-900 font-bold">{career.salaire || 'Variable'}</span>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-slate-700 font-medium">Marché:</span>
                <span className="ml-2 text-slate-900 font-bold truncate">{career.debouches || 'Stable'}</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate(`/metier/${career.code}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors mt-auto"
            >
              Voir la fiche métier <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormationDebouches;