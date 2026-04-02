import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Bug, Play, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminQA = () => {
  const [testSuites, setTestSuites] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newIssue, setNewIssue] = useState({ title: '', severity: 'Medium', description: '' });

  useEffect(() => {
    fetchQAData();
  }, []);

  const fetchQAData = async () => {
    setLoading(true);
    try {
      const [suitesRes, issuesRes] = await Promise.all([
        supabase.from('test_suites').select('*').order('created_at', { ascending: false }),
        supabase.from('bug_reports').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      if (suitesRes.data) setTestSuites(suitesRes.data);
      if (issuesRes.data) setIssues(issuesRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async () => {
      const { error } = await supabase.from('bug_reports').insert({
          title: newIssue.title,
          description: newIssue.description,
          severity: newIssue.severity,
          status: 'open',
          user_id: (await supabase.auth.getUser()).data.user?.id
      });
      if (!error) {
          toast({ title: 'Bug rapporté' });
          setNewIssue({ title: '', severity: 'Medium', description: '' });
          fetchQAData();
      }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Assurance Qualité</h2>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4"/> Rapporter un Bug</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Nouveau Rapport de Bug</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <Input placeholder="Titre du bug" value={newIssue.title} onChange={e => setNewIssue({...newIssue, title: e.target.value})} />
                    <Select value={newIssue.severity} onValueChange={v => setNewIssue({...newIssue, severity: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Faible</SelectItem>
                            <SelectItem value="Medium">Moyen</SelectItem>
                            <SelectItem value="High">Élevé</SelectItem>
                            <SelectItem value="Critical">Critique</SelectItem>
                        </SelectContent>
                    </Select>
                    <Textarea placeholder="Description et étapes pour reproduire..." value={newIssue.description} onChange={e => setNewIssue({...newIssue, description: e.target.value})} />
                    <Button onClick={createIssue} className="w-full">Soumettre</Button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Play className="w-5 h-5 text-purple-600"/> Suites de Tests</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Statut</TableHead><TableHead>Catégorie</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {testSuites.map(suite => (
                                <TableRow key={suite.id}>
                                    <TableCell className="font-medium">{suite.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={suite.status === 'active' ? 'default' : 'secondary'}>{suite.status}</Badge>
                                    </TableCell>
                                    <TableCell>{suite.category}</TableCell>
                                </TableRow>
                            ))}
                            {testSuites.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-slate-400">Aucune suite de test définie.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
         </div>

         <div>
            <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center gap-2"><Bug className="w-5 h-5 text-red-500"/> Bugs Récents</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {issues.map(issue => (
                            <div key={issue.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm text-slate-900 truncate pr-2">{issue.title}</span>
                                    <Badge variant="outline" className={`text-[10px] ${issue.severity === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' : ''}`}>
                                        {issue.severity}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                            </div>
                        ))}
                        {issues.length === 0 && <p className="text-center text-slate-400">Aucun bug signalé.</p>}
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default AdminQA;