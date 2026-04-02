import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Archive, Download, PlayCircle, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { planHistoryService } from '@/services/planHistoryService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PlanHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    if (!user) return;
    setLoading(true);
    const res = await planHistoryService.getAllPlans(user.id);
    if (res.success) {
      setPlans(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const handleRestore = async (planId) => {
    const res = await planHistoryService.restorePlan(user.id, planId);
    if (res.success) {
      toast({ title: "Plan restauré", description: "Ce plan est maintenant votre plan actif." });
      fetchPlans();
    }
  };

  const handleDelete = async (planId) => {
    const res = await planHistoryService.deletePlan(planId);
    if (res.success) {
      toast({ title: "Plan supprimé" });
      fetchPlans();
    }
  };

  const handleExport = async (planId) => {
    toast({ title: "Export en cours..." });
    await planHistoryService.exportPlan(planId);
  };

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-xl"></div>;

  const activePlan = plans.find(p => p.status === 'active');
  const otherPlans = plans.filter(p => p.status !== 'active');

  return (
    <div className="space-y-6">
      
      {/* Active Plan */}
      <Card className="border-indigo-200 shadow-md">
        <CardHeader className="bg-indigo-50/50 pb-4 border-b border-indigo-100">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <PlayCircle className="w-5 h-5" /> Plan Actif
          </CardTitle>
          <CardDescription>Votre objectif professionnel principal en cours.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {activePlan ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{activePlan.selected_metier_name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span>Créé le {new Date(activePlan.created_at).toLocaleDateString()}</span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700">En cours</Badge>
                </div>
                <div className="max-w-md">
                  <div className="flex justify-between text-xs mb-1 font-semibold text-indigo-700">
                    <span>Progression</span>
                    <span>{activePlan.progress_percentage}%</span>
                  </div>
                  <Progress value={activePlan.progress_percentage} className="h-2" indicatorClassName="bg-indigo-600" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleExport(activePlan.id)} variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Exporter
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">Aucun plan d'action actif actuellement.</p>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {otherPlans.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
              <Clock className="w-5 h-5 text-slate-500" /> Historique des Projets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {otherPlans.map(plan => (
                <div key={plan.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {plan.selected_metier_name}
                      {plan.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {plan.status === 'archived' ? 'Archivé' : 'Terminé'} le {new Date(plan.updated_at).toLocaleDateString()} • {plan.progress_percentage}% accompli
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleRestore(plan.id)} variant="outline" size="sm" className="bg-white">
                      <Archive className="w-3.5 h-3.5 mr-2" /> Restaurer
                    </Button>
                    <Button onClick={() => handleExport(plan.id)} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(plan.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanHistory;