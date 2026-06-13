import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Download, Trash2, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
  pending:    { label: 'En attente',  color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'En cours',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed:  { label: 'Complétée',   color: 'bg-green-100 text-green-700 border-green-200' },
  rejected:   { label: 'Refusée',     color: 'bg-red-100 text-red-700 border-red-200' },
};

const TYPE_LABELS = {
  export:        'Export de données',
  deletion:      'Suppression',
  rectification: 'Rectification',
  access:        'Accès aux données',
};

const AdminDataRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('data_requests')
        .select('id, user_id, type, status, created_at, processed_at, profiles(email, first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filterStatus !== 'all') query = query.eq('status', filterStatus);

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('data_requests')
        .update({ status, processed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Statut mis à jour', className: 'bg-green-50 border-green-200' });
      await fetchRequests();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le statut.' });
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Demandes RGPD</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> {pendingCount} demande(s) en attente de traitement
            </p>
          )}
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="completed">Complétées</SelectItem>
            <SelectItem value="rejected">Refusées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demandes de droits des personnes ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Aucune demande RGPD{filterStatus !== 'all' ? ' pour ce statut' : ''}.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const profile = req.profiles;
                  return (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</div>
                        <div className="text-xs text-slate-400">{profile?.email || req.user_id}</div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          {req.type === 'export' && <Download className="w-3 h-3" />}
                          {req.type === 'deletion' && <Trash2 className="w-3 h-3" />}
                          {req.type === 'access' && <Eye className="w-3 h-3" />}
                          {TYPE_LABELS[req.type] || req.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(req.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" disabled={updating === req.id} onClick={() => updateStatus(req.id, 'processing')}>
                              {updating === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Traiter'}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600" disabled={updating === req.id} onClick={() => updateStatus(req.id, 'rejected')}>
                              Refuser
                            </Button>
                          </div>
                        )}
                        {req.status === 'processing' && (
                          <Button size="sm" disabled={updating === req.id} onClick={() => updateStatus(req.id, 'completed')}>
                            {updating === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Marquer complété'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataRequests;
