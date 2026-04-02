import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Plus, CheckSquare, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const AdminOpsCenter = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('operational_tasks').select('*').order('created_at', { ascending: false });
      if (data) setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if(!newTask) return;
    const { error } = await supabase.from('operational_tasks').insert({ title: newTask, status: 'pending' });
    if (!error) {
      setNewTask('');
      fetchTasks();
      toast({ title: 'Tâche créée' });
    }
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    await supabase.from('operational_tasks').update({ status: newStatus }).eq('id', task.id);
    fetchTasks();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Centre d'Opérations</h2>
        <Dialog>
           <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2"/> Nouvelle Tâche</Button></DialogTrigger>
           <DialogContent>
              <DialogHeader><DialogTitle>Créer une tâche opérationnelle</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                 <Input placeholder="Titre de la tâche..." value={newTask} onChange={e => setNewTask(e.target.value)} />
                 <Button onClick={createTask} className="w-full">Créer</Button>
              </div>
           </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500"/> En Attente</CardTitle></CardHeader>
            <CardContent className="space-y-3">
               {tasks.filter(t => t.status !== 'done').map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => toggleTask(t)}>
                     <span>{t.title}</span>
                     <div className="w-4 h-4 border-2 border-slate-300 rounded-sm" />
                  </div>
               ))}
               {tasks.filter(t => t.status !== 'done').length === 0 && <p className="text-slate-400">Rien à signaler.</p>}
            </CardContent>
         </Card>

         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-green-500"/> Terminées</CardTitle></CardHeader>
            <CardContent className="space-y-3">
               {tasks.filter(t => t.status === 'done').map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 opacity-70 cursor-pointer" onClick={() => toggleTask(t)}>
                     <span className="line-through text-slate-500">{t.title}</span>
                     <CheckSquare className="w-4 h-4 text-green-500" />
                  </div>
               ))}
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default AdminOpsCenter;