import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Download, UserX, Eye, CheckCircle2, Clock, AlertCircle, InboxIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

const REQUEST_TYPES = {
  ACCESS: { label: 'Accès données', color: 'bg-blue-100 text-blue-700' },
  DELETION: { label: 'Suppression', color: 'bg-red-100 text-red-700' },
  RECTIFICATION: { label: 'Rectification', color: 'bg-amber-100 text-amber-700' },
  PORTABILITY: { label: 'Portabilité', color: 'bg-purple-100 text-purple-700' },
  OPPOSITION: { label: 'Opposition', color: 'bg-orange-100 text-orange-700' },
};

const STATUS_CONFIG = {
  pending: { label: 'En attente', icon: Clock, color: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'En cours', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Traité', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
};

const AdminDataRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      // Fetch RGPD-related audit logs as data requests proxy
      const { data, error } = await supabase
        .from('rgpd_audit_logs')
        .select('*, profiles:user_id(first_name, last_name, email)')
        .order('timestamp', { ascending: false })
        .limit(50);
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load data requests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markCompleted = async (id) => {
    toast({ title: 'Demande marquée comme traitée.' });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, _status: 'completed' } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, _status: 'completed' }));
  };

  const getStatus = (req) => req._status || 'pending';

  const getType = (action = '') => {
    if (action.includes('DELETE') || action.includes('DELETION')) return 'DELETION';
    if (action.includes('EXPORT') || action.includes('DOWNLOAD') || action.includes('PORTABILITY')) return 'PORTABILITY';
    if (action.includes('UPDATE') || action.includes('RECTIF')) return 'RECTIFICATION';
    if (action.includes('ACCESS')) return 'ACCESS';
    return 'ACCESS';
  };

  const filtered = requests.filter(r => {
    const email = r.profiles?.email || r.user_id || '';
    const matchSearch = !search || email.toLowerCase().includes(search.toLowerCase()) || (r.action || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || getStatus(r) === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: requests.length,
    pending: requests.filter(r => getStatus(r) === 'pending').length,
    in_progress: requests.filter(r => getStatus(r) === 'in_progress').length,
    completed: requests.filter(r => getStatus(r) === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Demandes RGPD</h2>
          <p className="text-slate-500 text-sm mt-1">Gestion des demandes d'accès, suppression et portabilité.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </Button>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'ALL', label: 'Total', color: 'text-slate-700' },
          { key: 'pending', label: 'En attente', color: 'text-amber-600' },
          { key: 'in_progress', label: 'En cours', color: 'text-blue-600' },
          { key: 'completed', label: 'Traités', color: 'text-emerald-600' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === s.key
                ? 'border-slate-800 bg-slate-900 text-white'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className={`text-2xl font-bold ${statusFilter === s.key ? 'text-white' : s.color}`}>
              {counts[s.key]}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${statusFilter === s.key ? 'text-slate-300' : 'text-slate-500'}`}>
              {s.label}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par email ou action…"
          className="pl-9 h-9 text-sm"
        />
      </div>

      <div className="flex gap-5">
        {/* List */}
        <Card className="border-slate-200 overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 font-semibold">Utilisateur</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <InboxIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      Aucune demande trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map(req => {
                    const type = getType(req.action);
                    const status = getStatus(req);
                    const TypeCfg = REQUEST_TYPES[type] || REQUEST_TYPES.ACCESS;
                    const StatusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                    const StatusIcon = StatusCfg.icon;
                    return (
                      <tr
                        key={req.id}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${selected?.id === req.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => setSelected(selected?.id === req.id ? null : req)}
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-900 text-xs">{req.profiles?.email || req.user_id}</div>
                          {req.profiles?.first_name && (
                            <div className="text-slate-400 text-xs">{req.profiles.first_name} {req.profiles.last_name}</div>
                          )}
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <Badge className={`${TypeCfg.color} border-none text-xs`}>{TypeCfg.label}</Badge>
                        </td>
                        <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">
                          {format(new Date(req.timestamp), 'dd MMM yyyy', { locale: fr })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${StatusCfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {StatusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-indigo-600"
                              onClick={e => { e.stopPropagation(); setSelected(req); }}
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {status !== 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-emerald-600"
                                onClick={e => { e.stopPropagation(); markCompleted(req.id); }}
                                title="Marquer comme traité"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card className="border-slate-200 p-5 w-72 shrink-0 self-start hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Détail de la demande</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-xs h-7 px-2">Fermer</Button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Utilisateur</p>
                <p className="text-slate-800 font-medium">{selected.profiles?.email || selected.user_id}</p>
                {selected.profiles?.first_name && (
                  <p className="text-slate-500 text-xs">{selected.profiles.first_name} {selected.profiles.last_name}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Action</p>
                <p className="text-slate-800 font-mono text-xs bg-slate-100 px-2 py-1 rounded">{selected.action}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Date</p>
                <p className="text-slate-600 text-xs">{format(new Date(selected.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
              {selected.details && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Détails</p>
                  <pre className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 overflow-auto max-h-32">
                    {JSON.stringify(selected.details, null, 2)}
                  </pre>
                </div>
              )}
              {getStatus(selected) !== 'completed' && (
                <Button
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                  onClick={() => markCompleted(selected.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Marquer comme traité
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDataRequests;
