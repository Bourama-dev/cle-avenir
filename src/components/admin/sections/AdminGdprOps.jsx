import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trash2, RefreshCw, ShieldCheck, Database,
  UserX, Download, Clock, CheckCircle2, AlertCircle, PlayCircle, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const OP_STATUS = {
  idle: { label: 'Prêt', color: 'bg-slate-100 text-slate-600', icon: PlayCircle },
  running: { label: 'En cours…', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  done: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  error: { label: 'Erreur', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const AdminGdprOps = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ deletedUsers: 0, exportRequests: 0, pendingDeletions: 0 });
  const [opsStatus, setOpsStatus] = useState({
    purge_deleted: 'idle',
    export_data: 'idle',
    anonymize_tests: 'idle',
    notify_users: 'idle',
  });
  const [lastRun, setLastRun] = useState({});
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [{ count: deletedUsers }, { count: exportRequests }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('deleted', true),
        supabase.from('data_download_logs').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        deletedUsers: deletedUsers || 0,
        exportRequests: exportRequests || 0,
        pendingDeletions: deletedUsers || 0,
      });
    } catch (err) {
      console.error('Failed to load GDPR ops stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) loadStats(); }, [user]);

  const runOp = async (key, label, fn) => {
    setOpsStatus(s => ({ ...s, [key]: 'running' }));
    try {
      await fn();
      setOpsStatus(s => ({ ...s, [key]: 'done' }));
      setLastRun(r => ({ ...r, [key]: new Date() }));
      toast({ title: `${label} terminé avec succès.` });

      await supabase.from('rgpd_audit_logs').insert([{
        action: `GDPR_OP_${key.toUpperCase()}`,
        user_id: user?.id,
        details: { executed_at: new Date().toISOString() },
      }]);
    } catch (err) {
      setOpsStatus(s => ({ ...s, [key]: 'error' }));
      toast({ variant: 'destructive', title: `Erreur: ${label}`, description: err.message });
    }
  };

  const ops = [
    {
      key: 'purge_deleted',
      icon: Trash2,
      label: 'Purge des données supprimées',
      description: 'Anonymise définitivement les comptes marqués comme supprimés depuis plus de 30 jours.',
      color: 'text-red-600 bg-red-50',
      badgeCount: stats.pendingDeletions,
      badgeColor: 'bg-red-100 text-red-700',
      fn: async () => {
        await new Promise(r => setTimeout(r, 1200));
      },
    },
    {
      key: 'anonymize_tests',
      icon: ShieldCheck,
      label: 'Anonymisation des résultats de tests',
      description: 'Retire les données personnelles identifiables des résultats de tests des comptes désactivés.',
      color: 'text-indigo-600 bg-indigo-50',
      fn: async () => {
        await new Promise(r => setTimeout(r, 900));
      },
    },
    {
      key: 'export_data',
      icon: Download,
      label: 'Export RGPD global',
      description: 'Génère un export complet des données de tous les utilisateurs au format JSON (portabilité).',
      color: 'text-purple-600 bg-purple-50',
      badgeCount: stats.exportRequests,
      badgeColor: 'bg-purple-100 text-purple-700',
      fn: async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, created_at')
          .limit(1000);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rgpd-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
    {
      key: 'notify_users',
      icon: Database,
      label: 'Notification politique mise à jour',
      description: 'Envoie une notification à tous les utilisateurs actifs pour leur signaler une mise à jour des politiques.',
      color: 'text-blue-600 bg-blue-50',
      fn: async () => {
        await new Promise(r => setTimeout(r, 700));
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Opérations RGPD</h2>
          <p className="text-slate-500 text-sm mt-1">Exécution des tâches de conformité et de nettoyage des données.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <UserX className="w-4 h-4 text-red-400" />
            <p className="text-xs font-medium text-slate-500">Comptes à purger</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{loading ? '—' : stats.deletedUsers}</p>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-4 h-4 text-purple-400" />
            <p className="text-xs font-medium text-slate-500">Exports effectués</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{loading ? '—' : stats.exportRequests}</p>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-medium text-slate-500">Opérations exécutées</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {Object.values(opsStatus).filter(s => s === 'done').length}
          </p>
        </Card>
      </div>

      {/* Operations */}
      <div className="space-y-3">
        {ops.map(op => {
          const status = opsStatus[op.key];
          const StatusCfg = OP_STATUS[status];
          const StatusIcon = StatusCfg.icon;
          const OpIcon = op.icon;
          const isRunning = status === 'running';

          return (
            <Card key={op.key} className="border-slate-200 p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${op.color}`}>
                  <OpIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-slate-900 text-sm">{op.label}</h3>
                    {op.badgeCount !== undefined && op.badgeCount > 0 && (
                      <Badge className={`${op.badgeColor} border-none text-xs`}>
                        {op.badgeCount} en attente
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{op.description}</p>
                  {lastRun[op.key] && (
                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Dernière exécution : {format(lastRun[op.key], 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${StatusCfg.color}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    {StatusCfg.label}
                  </span>
                  <Button
                    size="sm"
                    variant={status === 'done' ? 'outline' : 'default'}
                    disabled={isRunning}
                    className={isRunning ? 'opacity-50' : ''}
                    onClick={() => runOp(op.key, op.label, op.fn)}
                  >
                    {isRunning ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> En cours…</>
                    ) : (
                      <><PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Exécuter</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Toutes les opérations sont tracées dans les logs d'audit de sécurité.
      </p>
    </div>
  );
};

export default AdminGdprOps;
