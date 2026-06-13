import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/customSupabaseClient';
import { auditService } from '@/services/auditService';
import { Loader2, Shield, AlertTriangle, Bug, Activity, CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SEVERITY_CONFIG = {
  HIGH:     { color: 'bg-red-100 text-red-700 border-red-200',    label: 'Élevée' },
  MEDIUM:   { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Moyenne' },
  LOW:      { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Faible' },
  ERROR:    { color: 'bg-red-100 text-red-700 border-red-200',    label: 'Erreur' },
  CRITICAL: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Critique' },
};

const STATUS_CONFIG = {
  OPEN:        { color: 'bg-red-100 text-red-700',    label: 'Ouvert' },
  INVESTIGATING:{ color: 'bg-orange-100 text-orange-700', label: 'En cours' },
  RESOLVED:    { color: 'bg-green-100 text-green-700', label: 'Résolu' },
};

const AdminSecurity = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [auditRes, incidentRes, errorRes, apiRes] = await Promise.all([
        supabase.from('audit_logs').select('id, user_id, action, details, created_at').order('created_at', { ascending: false }).limit(50),
        supabase.from('compliance_incidents').select('id, title, description, severity, status, created_at').order('created_at', { ascending: false }).limit(20),
        supabase.from('error_logs').select('id, message, severity, resolved, url, created_at').order('created_at', { ascending: false }).limit(30),
        supabase.from('api_logs').select('id, endpoint, status, ip_address, response_time_ms, created_at').order('created_at', { ascending: false }).limit(100),
      ]);

      if (auditRes.error) throw auditRes.error;
      if (incidentRes.error) throw incidentRes.error;
      if (errorRes.error) throw errorRes.error;

      setAuditLogs(auditRes.data || []);
      setIncidents(incidentRes.data || []);
      setErrorLogs(errorRes.data || []);
      setApiLogs(apiRes.data || []);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les logs de sécurité.' });
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setHealthLoading(true);
    try {
      const result = await auditService.healthCheck();
      setHealth(result);
    } catch (error) {
      console.error(error);
      setHealth({ status: 'UNHEALTHY', database: 'DISCONNECTED' });
    } finally {
      setHealthLoading(false);
    }
  };

  const resolveIncident = async (id) => {
    setResolvingId(id);
    try {
      const { error } = await supabase
        .from('compliance_incidents')
        .update({ status: 'RESOLVED' })
        .eq('id', id);
      if (error) throw error;
      setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'RESOLVED' } : i));
      toast({ title: 'Incident résolu', className: 'bg-green-50 border-green-200' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de résoudre l\'incident.' });
    } finally {
      setResolvingId(null);
    }
  };

  const resolveError = async (id) => {
    setResolvingId('err_' + id);
    try {
      const { error } = await supabase.from('error_logs').update({ resolved: true }).eq('id', id);
      if (error) throw error;
      setErrorLogs(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
      toast({ title: 'Erreur marquée résolue', className: 'bg-green-50 border-green-200' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Mise à jour échouée.' });
    } finally {
      setResolvingId(null);
    }
  };

  useEffect(() => {
    fetchAll();
    runHealthCheck();
  }, []);

  const openIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
  const unresolvedErrors = errorLogs.filter(e => !e.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Sécurité & Audit</h2>
        <Button variant="outline" size="sm" onClick={() => { fetchAll(); runHealthCheck(); }} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </Button>
      </div>

      {/* Health + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            {healthLoading ? (
              <Loader2 className="animate-spin mx-auto text-slate-400" />
            ) : health ? (
              <>
                <div className={`text-2xl font-bold ${health.status === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
                  {health.status === 'OK' ? <CheckCircle className="w-8 h-8 mx-auto" /> : <XCircle className="w-8 h-8 mx-auto" />}
                </div>
                <div className="text-sm text-slate-600 mt-1">Base de données</div>
                <div className="text-xs text-slate-400">{health.latency || health.error || health.reason}</div>
              </>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={`text-3xl font-bold ${openIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>{openIncidents}</div>
            <div className="text-sm text-slate-600 mt-1">Incidents ouverts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={`text-3xl font-bold ${unresolvedErrors > 0 ? 'text-orange-500' : 'text-green-600'}`}>{unresolvedErrors}</div>
            <div className="text-sm text-slate-600 mt-1">Erreurs non résolues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-slate-900">{auditLogs.length}</div>
            <div className="text-sm text-slate-600 mt-1">Entrées d'audit (50 dernières)</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <Tabs defaultValue="incidents">
          <TabsList>
            <TabsTrigger value="incidents" className="gap-2">
              <AlertTriangle className="w-4 h-4" /> Incidents
              {openIncidents > 0 && <Badge className="bg-red-500 text-white text-[10px] px-1.5">{openIncidents}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="errors" className="gap-2">
              <Bug className="w-4 h-4" /> Erreurs applicatives
              {unresolvedErrors > 0 && <Badge className="bg-orange-500 text-white text-[10px] px-1.5">{unresolvedErrors}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Activity className="w-4 h-4" /> Journal d'audit
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Database className="w-4 h-4" /> Logs API
            </TabsTrigger>
          </TabsList>

          {/* Incidents */}
          <TabsContent value="incidents">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> Incidents de sécurité</CardTitle></CardHeader>
              <CardContent>
                {incidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />Aucun incident enregistré.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Sévérité</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidents.map(inc => {
                        const sev = SEVERITY_CONFIG[inc.severity] || SEVERITY_CONFIG.HIGH;
                        const sta = STATUS_CONFIG[inc.status] || STATUS_CONFIG.OPEN;
                        return (
                          <TableRow key={inc.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{inc.title}</div>
                              {inc.description && <div className="text-xs text-slate-400 truncate max-w-[200px]">{inc.description}</div>}
                            </TableCell>
                            <TableCell><Badge className={`text-xs ${sev.color}`}>{sev.label}</Badge></TableCell>
                            <TableCell><Badge className={`text-xs ${sta.color}`}>{sta.label}</Badge></TableCell>
                            <TableCell className="text-xs text-slate-500">{new Date(inc.created_at).toLocaleString('fr-FR')}</TableCell>
                            <TableCell className="text-right">
                              {inc.status !== 'RESOLVED' && (
                                <Button size="sm" variant="outline" disabled={resolvingId === inc.id} onClick={() => resolveIncident(inc.id)}>
                                  {resolvingId === inc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Résoudre'}
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
          </TabsContent>

          {/* Error logs */}
          <TabsContent value="errors">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bug className="w-4 h-4 text-orange-500" /> Erreurs applicatives</CardTitle></CardHeader>
              <CardContent>
                {errorLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />Aucune erreur enregistrée.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message</TableHead>
                        <TableHead>Sévérité</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {errorLogs.map(err => {
                        const sev = SEVERITY_CONFIG[err.severity] || SEVERITY_CONFIG.ERROR;
                        return (
                          <TableRow key={err.id} className={err.resolved ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="font-medium text-sm truncate max-w-[220px]">{err.message}</div>
                              {err.url && <div className="text-xs text-slate-400 truncate max-w-[220px]">{err.url}</div>}
                            </TableCell>
                            <TableCell><Badge className={`text-xs ${sev.color}`}>{sev.label}</Badge></TableCell>
                            <TableCell>
                              {err.resolved
                                ? <Badge className="text-xs bg-green-100 text-green-700">Résolu</Badge>
                                : <Badge className="text-xs bg-red-100 text-red-700">Ouvert</Badge>}
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">{new Date(err.created_at).toLocaleString('fr-FR')}</TableCell>
                            <TableCell className="text-right">
                              {!err.resolved && (
                                <Button size="sm" variant="outline" disabled={resolvingId === 'err_' + err.id} onClick={() => resolveError(err.id)}>
                                  {resolvingId === 'err_' + err.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Résoudre'}
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
          </TabsContent>

          {/* Audit log */}
          <TabsContent value="audit">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Journal d'audit (50 dernières entrées)</CardTitle></CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">Aucune entrée d'audit.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Détails</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell><Badge variant="outline" className="text-xs font-mono">{log.action}</Badge></TableCell>
                          <TableCell className="text-xs text-slate-500 font-mono">{log.user_id?.slice(0, 8)}…</TableCell>
                          <TableCell className="text-xs text-slate-400 max-w-[200px] truncate">
                            {log.details ? JSON.stringify(log.details) : '—'}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString('fr-FR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* API logs */}
          <TabsContent value="api">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="w-4 h-4 text-slate-500" /> Logs API (100 dernières requêtes)</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {apiLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 p-4">Aucun log API.</div>
                ) : (
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-slate-900 text-slate-300">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Endpoint</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">IP</th>
                        <th className="p-3">Latence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {apiLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 text-slate-500">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                          <td className="p-3 font-semibold text-slate-700 truncate max-w-[200px]">{log.endpoint}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={log.status >= 400 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}>
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-500">{log.ip_address || '—'}</td>
                          <td className="p-3 text-slate-500">{log.response_time_ms != null ? `${log.response_time_ms}ms` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminSecurity;
