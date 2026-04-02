import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Users, Target, ThumbsUp, Activity } from 'lucide-react';
import { feedbackService } from '@/services/feedbackService';

const FeedbackStats = ({ metierCode }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!metierCode) return;
      const res = await feedbackService.getFeedbackStats(metierCode);
      if (res.success) {
        setStats(res.stats);
      }
      setLoading(false);
    };
    fetchStats();
  }, [metierCode]);

  if (loading) {
    return <div className="h-32 bg-slate-50 animate-pulse rounded-xl"></div>;
  }

  if (!stats || stats.total === 0) {
    return (
      <Card className="border-slate-200 shadow-sm bg-slate-50/50">
        <CardContent className="p-6 text-center text-slate-500">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium">Pas encore d'avis pour ce métier.</p>
          <p className="text-xs">Soyez le premier à partager votre expérience !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Avis de la communauté
          </span>
          <Badge variant="secondary" className="bg-slate-100">{stats.total} avis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Global Rating */}
        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="text-3xl font-extrabold text-amber-600 mb-1">{stats.avgAccuracy}<span className="text-lg text-amber-400">/5</span></div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(stats.avgAccuracy) ? "fill-amber-500 text-amber-500" : "text-amber-200"}`} 
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pertinence</span>
        </div>

        {/* Helpful Metric */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-700 flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-emerald-500" /> Utile</span>
            <span className="font-bold text-emerald-700">{stats.helpfulPercent}%</span>
          </div>
          <Progress value={stats.helpfulPercent} className="h-2" indicatorClassName="bg-emerald-500" />
          <p className="text-xs text-slate-500 mt-2">ont trouvé cette suggestion pertinente.</p>
        </div>

        {/* Chosen Metric */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-700 flex items-center gap-1"><Target className="w-4 h-4 text-indigo-500" /> Adopté</span>
            <span className="font-bold text-indigo-700">{stats.chosenPercent}%</span>
          </div>
          <Progress value={stats.chosenPercent} className="h-2" indicatorClassName="bg-indigo-500" />
          <p className="text-xs text-slate-500 mt-2">envisagent sérieusement ce métier.</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default FeedbackStats;