import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HelpButton from '@/components/ui/HelpButton';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        // Using api_logs table from schema
        const { data } = await supabase
            .from('api_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (data) setLogs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-bold text-slate-900">Logs Système & Monitoring</h2>
                   <HelpButton section="AUDIT_LOGS" />
                </div>
                <Button variant="outline" size="sm" onClick={fetchLogs}><RefreshCcw className="mr-2 h-4 w-4"/> Actualiser</Button>
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left">
                        <thead className="bg-slate-900 text-slate-300">
                            <tr>
                                <th className="p-3">Timestamp</th>
                                <th className="p-3">Endpoint</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">IP Address</th>
                                <th className="p-3">Latency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Aucun log récent.</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="p-3 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="p-3 font-semibold text-slate-700">{log.endpoint}</td>
                                    <td className="p-3">
                                        <Badge variant={log.status >= 400 ? 'destructive' : 'outline'} className={log.status < 300 ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="p-3 text-slate-500">{log.ip_address || '-'}</td>
                                    <td className="p-3 text-slate-500">{log.response_time_ms}ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogs;