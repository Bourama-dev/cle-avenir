import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RIASEC_DESCRIPTIONS } from '@/data/riasecDescriptions';
import { getTopDimensions } from '@/utils/riasecMatchingAlgorithm';
import { BookOpen, Lightbulb } from 'lucide-react';

const ProfileExplanation = ({ userProfile }) => {
  if (!userProfile) return null;

  const topDims = getTopDimensions(userProfile, 3);

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-slate-900 mb-4">Que signifie votre profil ?</h3>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Vos 3 dimensions dominantes révèlent vos forces naturelles et vos aspirations profondes dans le monde du travail.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {topDims.map((dim, idx) => {
          const desc = RIASEC_DESCRIPTIONS[dim];
          const val = userProfile[dim];
          
          return (
            <Card key={dim} className="border-slate-200 shadow-sm relative overflow-hidden group">
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: desc.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {idx === 0 ? 'Dominant' : idx === 1 ? 'Secondaire' : 'Tertiaire'}
                  </span>
                  <span className="text-lg font-black" style={{ color: desc.color }}>{val}%</span>
                </div>
                <CardTitle className="text-2xl font-black" style={{ color: desc.color }}>
                  {desc.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed text-sm">
                  {desc.description}
                </p>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase text-slate-500">Au travail</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {desc.careerMeaning}
                  </p>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 italic">
                    <strong>Secteurs typiques :</strong> {desc.examples}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileExplanation;