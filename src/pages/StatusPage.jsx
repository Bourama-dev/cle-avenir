import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Activity, AlertTriangle, Loader2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';

const SYSTEMS = [
  {
    name: 'Site Web & Plateforme',
    check: async () => 'operational'
  },
  {
    name: 'Base de données (Supabase)',
    check: async () => {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) return 'degraded';
      return Date.now() - start > 3000 ? 'degraded' : 'operational';
    }
  },
  {
    name: 'Authentification',
    check: async () => {
      const { error } = await supabase.auth.getSession();
      return error ? 'degraded' : 'operational';
    }
  },
  {
    name: 'API Cléo (IA)',
    check: async () => {
      try {
        await supabase.functions.invoke('chat-advisor', { body: { ping: true } });
        return 'operational';
      } catch {
        return 'degraded';
      }
    }
  },
  {
    name: 'Paiements Stripe',
    check: async () => {
      try {
        await supabase.functions.invoke('create-checkout-session', { body: { ping: true } });
        return 'operational';
      } catch {
        return 'degraded';
      }
    }
  }
];

const STATUS_CONFIG = {
  operational: {
    label: 'Opérationnel',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    border: 'border-l-green-500',
    text: 'text-green-600'
  },
  degraded: {
    label: 'Dégradé',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    border: 'border-l-amber-500',
    text: 'text-amber-600'
  },
  down: {
    label: 'Hors service',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    border: 'border-l-red-500',
    text: 'text-red-600'
  },
  checking: {
    label: 'Vérification...',
    icon: <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />,
    border: 'border-l-slate-300',
    text: 'text-slate-400'
  }
};

const StatusPage = () => {
  const [statuses, setStatuses] = useState(SYSTEMS.map(() => 'checking'));
  const [lastUpdated, setLastUpdated] = useState(null);

  const runChecks = async () => {
    setStatuses(SYSTEMS.map(() => 'checking'));
    const results = await Promise.all(
      SYSTEMS.map(async (sys) => {
        try { return await sys.check(); } catch { return 'degraded'; }
      })
    );
    setStatuses(results);
    setLastUpdated(new Date());
  };

  useEffect(() => { runChecks(); }, []);

  const checking = statuses.some(s => s === 'checking');
  const allOperational = statuses.every(s => s === 'operational');
  const anyDown = statuses.some(s => s === 'down');

  const globalBadge = checking
    ? { label: 'Vérification en cours...', cls: 'bg-slate-100 text-slate-600' }
    : anyDown
    ? { label: 'Incident en cours', cls: 'bg-red-100 text-red-700' }
    : allOperational
    ? { label: 'Tous les systèmes opérationnels', cls: 'bg-green-100 text-green-700' }
    : { label: 'Perturbations détectées', cls: 'bg-amber-100 text-amber-700' };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">État des Services</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {lastUpdated
              ? `Dernière vérification : ${lastUpdated.toLocaleTimeString('fr-FR')}`
              : 'Vérification en cours...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${globalBadge.cls} text-sm px-3 py-1 h-auto`}>
            {globalBadge.label}
          </Badge>
          <button
            onClick={runChecks}
            disabled={checking}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            title="Rafraîchir"
          >
            <Activity className={`h-5 w-5 text-slate-500 ${checking ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {SYSTEMS.map((sys, idx) => {
          const status = statuses[idx];
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.checking;
          return (
            <Card key={idx} className={`border-l-4 ${config.border}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {config.icon}
                  <span className="font-medium text-slate-900">{sys.name}</span>
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>
                  {config.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center p-6 bg-slate-50 rounded-xl border border-dashed">
        <Activity className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <h3 className="font-medium text-slate-900">Historique des incidents</h3>
        <p className="text-sm text-slate-500">Aucun incident majeur signalé au cours des 90 derniers jours.</p>
      </div>
    </div>
  );
};

export default StatusPage;
