import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Download, Search, RefreshCw, Filter } from 'lucide-react';
import { rgpdAdminService } from '@/services/admin/rgpdAdminService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { format } from 'date-fns';

const ACTION_COLORS = {
  EXPORT: 'bg-blue-100 text-blue-700',
  DOWNLOAD: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

const getActionColor = (action = '') => {
  for (const [key, cls] of Object.entries(ACTION_COLORS)) {
    if (action.includes(key)) return cls;
  }
  return 'bg-slate-100 text-slate-700';
};

const AdminSecurity = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
    setLoading(true);
    try {
      const data = await rgpdAdminService.getAuditLogs(user?.id, { limit: 100 });
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const ACTION_FILTERS = ['ALL', 'EXPORT', 'UPDATE', 'DELETE'];

  const filtered = logs.filter(log => {
    const matchSearch =
      !search ||
      (log.profiles?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || (log.action || '').includes(filter);
    return matchSearch && matchFilter;
  });

  const exportCsv = () => {
    const header = ['Date', 'Action', 'Utilisateur', 'Détails'];
    const rows = filtered.map(l => [
      format(new Date(l.timestamp), 'dd/MM/yyyy HH:mm:ss'),
      l.action,
      l.profiles?.email || l.user_id,
      JSON.stringify(l.details || {}),
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Logs d'Audit & Sécurité</h2>
          <p className="text-slate-500 text-sm mt-1">Traçabilité complète des actions liées aux données sensibles.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Exporter CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par email, action…"
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {ACTION_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-white">
          <ShieldAlert className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-700 text-sm">
            Registre d'activités · {filtered.length} entrée{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Date / Heure</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Utilisateur</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    {search || filter !== 'ALL' ? 'Aucun log correspondant.' : 'Aucun log disponible.'}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600 text-xs">
                      {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={`${getActionColor(log.action)} border-none text-xs`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800 text-xs hidden md:table-cell">
                      {log.profiles?.email || log.user_id}
                    </td>
                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate font-mono text-xs hidden lg:table-cell">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminSecurity;
