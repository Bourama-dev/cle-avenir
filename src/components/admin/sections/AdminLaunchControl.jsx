import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Rocket, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const AdminLaunchControl = () => {
  const [checklist, setChecklist] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    fetchLaunchData();
  }, []);

  const fetchLaunchData = async () => {
    setLoading(true);
    try {
      // Updated query to be explicit about sort order and ensure robustness
      const [listRes, mileRes, riskRes] = await Promise.all([
        supabase.from('launch_checklist').select('*').order('created_at', { ascending: true }),
        supabase.from('launch_milestones').select('*').order('target_date', { ascending: true }),
        supabase.from('launch_risks').select('*').order('created_at', { ascending: false })
      ]);

      if (listRes.data) setChecklist(listRes.data);
      if (mileRes.data) setMilestones(mileRes.data);
      if (riskRes.data) setRisks(riskRes.data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données de lancement.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = async (id, currentStatus) => {
    const { error } = await supabase.from('launch_checklist').update({ is_completed: !currentStatus }).eq('id', id);
    if (!error) fetchLaunchData();
  };

  const addChecklistItem = async () => {
    if (!newItemText) return;
    // created_at will be handled by the database default value
    const { error } = await supabase.from('launch_checklist').insert({ 
      item: newItemText, 
      category: 'General', 
      priority: 'medium' 
    });
    
    if (!error) {
      setNewItemText('');
      fetchLaunchData();
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'ajouter l'élément." });
    }
  };

  const completionRate = checklist.length > 0 
    ? Math.round((checklist.filter(i => i.is_completed).length / checklist.length) * 100) 
    : 0;

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Launch Control Center</h2>
          <p className="text-slate-500">Supervision du déploiement et Go-Live</p>
        </div>
        <div className="text-right">
           <div className="text-sm font-medium text-slate-500 mb-1">État de préparation</div>
           <div className="flex items-center gap-3">
             <Progress value={completionRate} className="w-32 h-3" />
             <span className="font-bold text-xl text-primary">{completionRate}%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5 text-blue-600"/> Checklist de Lancement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input placeholder="Nouvelle tâche..." value={newItemText} onChange={e => setNewItemText(e.target.value)} />
              <Button onClick={addChecklistItem}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Checkbox 
                    id={item.id} 
                    checked={item.is_completed} 
                    onCheckedChange={() => toggleChecklistItem(item.id, item.is_completed)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor={item.id} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.is_completed ? 'line-through text-slate-400' : ''}`}>
                      {item.item}
                    </label>
                    <p className="text-xs text-slate-500">{item.category} • {item.priority}</p>
                  </div>
                </div>
              ))}
              {checklist.length === 0 && <p className="text-center text-slate-400 py-4">Aucune tâche.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500"/> Matrice des Risques</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risks.slice(0, 5).map(risk => (
                  <div key={risk.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <div className="font-medium text-slate-900 mb-1">{risk.description}</div>
                    <div className="flex justify-between items-center text-xs">
                      <Badge variant="outline" className="bg-white">Prob: {risk.probability}</Badge>
                      <Badge variant={risk.impact === 'High' ? 'destructive' : 'secondary'}>Impact: {risk.impact}</Badge>
                    </div>
                  </div>
                ))}
                {risks.length === 0 && <p className="text-sm text-slate-400">Aucun risque identifié.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600"/> Jalons Clés</CardTitle></CardHeader>
            <CardContent>
               <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                  {milestones.map((m, idx) => (
                    <div key={m.id} className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${m.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <div className="text-sm font-medium">{m.title}</div>
                      <div className="text-xs text-slate-500">{new Date(m.target_date).toLocaleDateString()}</div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLaunchControl;