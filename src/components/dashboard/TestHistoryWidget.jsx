import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testService } from '@/services/testService';
import { History, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TestHistoryWidget = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      const res = await testService.getTestHistory(userId, 5);
      if (res.success) {
        setHistory(res.data);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [userId]);

  if (loading) {
    return <Card><CardContent className="p-6 text-center text-slate-400">Chargement de l'historique...</CardContent></Card>;
  }

  if (history.length === 0) {
    return null; // Don't show if no history
  }

  return (
    <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200">
      <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
          <History className="w-5 h-5 text-indigo-500" /> Historique des Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {history.map((test, idx) => {
            const date = new Date(test.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
            
            // Extract top dimension safely
            let topDim = "N/A";
            if (test.riasec_profile) {
              const entries = Object.entries(test.riasec_profile).sort(([,a], [,b]) => b - a);
              if (entries.length > 0) topDim = entries[0][0];
            }

            return (
              <div key={test.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {topDim}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Test d'orientation</h4>
                    <p className="text-xs text-slate-500">Réalisé le {date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">Score: {test.test_score || 0}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                     <Activity className="w-3 h-3" /> Terminé
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestHistoryWidget;