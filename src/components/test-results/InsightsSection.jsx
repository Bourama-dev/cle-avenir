import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, GraduationCap, DollarSign, Lightbulb, Target } from 'lucide-react';
import { MATCHING_CONFIG } from '@/config/matchingAlgorithmConfig';

const InsightsSection = ({ insights, profile }) => {
  if (!insights || !profile) return null;

  const topDims = Object.entries(profile).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Vos Insights Détaillés</h2>
        <p className="text-slate-500 mt-2">Une analyse approfondie de votre profil professionnel</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths & Weaknesses */}
        <Card className="shadow-lg border-slate-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Vos Forces Naturelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {insights.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  {str}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Target className="w-5 h-5" /> Axes de Développement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {insights.developments.map((dev, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">!</div>
                  {dev}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Education */}
        <Card className="shadow-md border-slate-200 rounded-xl">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-4">Formations Suggérées</h3>
            <div className="space-y-4">
              {insights.formations.map((form, idx) => (
                <div key={idx} className="border-l-2 border-indigo-200 pl-3">
                  <p className="text-sm font-semibold text-slate-800">{form.title}</p>
                  <p className="text-xs text-slate-500">{form.duration} • {form.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trends */}
        <Card className="shadow-md border-slate-200 rounded-xl">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-4">Tendances du Secteur</h3>
            <ul className="space-y-2">
              {insights.trends.map((trend, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-500">•</span> {trend}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Salary */}
        <Card className="shadow-md border-slate-200 rounded-xl">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-4">Perspectives Salariales</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Débutant</p>
                <p className="text-xl font-bold text-slate-800">{insights.salary.entry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Sénior</p>
                <p className="text-xl font-bold text-slate-800">{insights.salary.senior}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsSection;