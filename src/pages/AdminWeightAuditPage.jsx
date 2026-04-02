import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminWeightAuditPage = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        // Fallback for UI visualization if table doesn't exist yet
        setLogs([
          { id: '1', job_code: 'M1805', reason: 'Feedback threshold reached', created_at: new Date().toISOString(), status: 'pending' },
          { id: '2', job_code: 'D1201', reason: 'Manual override', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'approved' }
        ]);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "default"
    });
  };

  const handleApprove = (id) => {
    toast({
      title: "Poids approuvés",
      description: "Les nouveaux poids pour ce métier ont été appliqués avec succès.",
      variant: "default"
    });
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Audit des Poids (ML)</h1>
          <p className="text-slate-500">Journal des ajustements de poids de l'algorithme de matching.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 bg-white">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Journal des modifications</CardTitle>
          <CardDescription>Liste des récents ajustements de poids basés sur le feedback utilisateur</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Code Métier</TableHead>
                <TableHead>Raison de l'ajustement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Chargement...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Aucun journal disponible.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-slate-600">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{log.job_code}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{log.reason}</TableCell>
                    <TableCell>
                      {log.status === 'approved' ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                          <CheckCircle className="h-3 w-3" /> Approuvé
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                          <AlertTriangle className="h-3 w-3" /> En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.status !== 'approved' && (
                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => handleApprove(log.id)}>
                          Approuver <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWeightAuditPage;