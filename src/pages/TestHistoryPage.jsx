import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { TestHistoryService } from '@/services/testHistoryService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Calendar, ArrowRight, Brain, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TestHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/test-history' } });
      return;
    }

    const loadHistory = async () => {
      setLoading(true);
      const data = await TestHistoryService.getUserHistory(user.id);
      setHistory(data);
      setLoading(false);
    };

    loadHistory();
  }, [user, navigate]);

  const handleNavigate = (path) => navigate(path);

  const getProfileTitle = (result) => {
    if (result.results?.profileData?.primaryProfile?.title) {
      return result.results.profileData.primaryProfile.title;
    }
    // Fallback for older data format
    return "Profil analysé";
  };

  const getProfileEmoji = (result) => {
    return result.results?.profileData?.primaryProfile?.emoji || '🧠';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <History className="w-8 h-8 text-violet-600" />
              Historique des tests
            </h1>
            <p className="text-slate-500 mt-2">
              Retrouvez vos 10 derniers résultats d'analyse de personnalité et d'orientation.
            </p>
          </div>
          <Button onClick={() => navigate('/test')} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Brain className="w-4 h-4 mr-2" />
            Nouveau Test
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun historique</h3>
            <p className="text-slate-500 mb-6">Vous n'avez pas encore passé de test d'orientation.</p>
            <Button onClick={() => navigate('/test')} variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
              Passer mon premier test
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((test) => (
              <Card key={test.id} className="group hover:shadow-md transition-all cursor-pointer border-slate-200" onClick={() => navigate(`/test-results?id=${test.id}`)}>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                    {getProfileEmoji(test)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        {getProfileTitle(test)}
                      </h3>
                      <Badge variant="secondary" className="w-fit mx-auto md:mx-0 text-xs bg-slate-100 text-slate-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(test.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {test.results?.profileData?.primaryProfile?.description || "Analyse complète disponible."}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-4 text-violet-600 font-medium group-hover:translate-x-1 transition-transform">
                    Voir les détails <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-8 p-4 bg-amber-50 rounded-lg flex items-start gap-3 text-sm text-amber-800 border border-amber-100">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Note :</strong> Seuls vos 10 derniers résultats sont conservés automatiquement pour optimiser votre espace. 
                Pensez à exporter vos résultats importants si nécessaire.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}