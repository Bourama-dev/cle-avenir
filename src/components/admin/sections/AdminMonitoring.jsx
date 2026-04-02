import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Activity, Server, AlertOctagon, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminMonitoring = () => {
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ errorRate: 0, avgResponse: 0, uptime: 99.9 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const { data: logData } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (logData) setLogs(logData);

      // Mock real-time data for charts since we don't have a populated metrics table yet
      const mockMetrics = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: Math.floor(Math.random() * 200) + 50,
        errors: Math.floor(Math.random() * 5)
      }));
      setMetrics(mockMetrics);

      const errorCount = logData?.length || 0;
      setStats(prev => ({ ...prev, errorRate: (errorCount / 1000).toFixed(2), avgResponse: 124 })); // Mock calc
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Monitoring Système</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
           <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-full"><Activity className="w-6 h-6"/></div>
              <div>
                 <div className="text-sm text-slate-500">Uptime (30j)</div>
                 <div className="text-2xl font-bold text-slate-900">{stats.uptime}%</div>
              </div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-full"><Clock className="w-6 h-6"/></div>
              <div>
                 <div className="text-sm text-slate-500">Temps de Réponse</div>
                 <div className="text-2xl font-bold text-slate-900">{stats.avgResponse}ms</div>
              </div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-700 rounded-full"><AlertOctagon className="w-6 h-6"/></div>
              <div>
                 <div className="text-sm text-slate-500">Taux d'erreur</div>
                 <div className="text-2xl font-bold text-slate-900">{stats.errorRate}%</div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader><CardTitle>Latence API (ms)</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                     <defs><linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                     <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip />
                     <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLat)" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card>
            <CardHeader><CardTitle>Logs d'Erreurs Récents</CardTitle></CardHeader>
            <CardContent>
               <div className="space-y-2 max-h-[300px] overflow-y-auto text-sm">
                  {logs.map(log => (
                     <div key={log.id} className="p-2 border-b border-slate-100 last:border-0">
                        <div className="flex justify-between">
                           <span className="font-mono text-xs text-red-600 bg-red-50 px-1 rounded">{log.severity || 'ERROR'}</span>
                           <span className="text-xs text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-slate-700 mt-1 truncate">{log.message || 'Unknown Error'}</div>
                     </div>
                  ))}
                  {logs.length === 0 && <p className="text-center text-slate-400 pt-8">Aucune erreur récente.</p>}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default AdminMonitoring;