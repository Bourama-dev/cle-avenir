import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, ShieldAlert } from 'lucide-react';
import { rgpdAdminService } from '@/services/admin/rgpdAdminService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { format } from 'date-fns';

const SecurityAuditPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await rgpdAdminService.getAuditLogs(user?.id, { limit: 50 });
        setLogs(data || []);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchLogs();
  }, [user]);

  const getActionColor = (action) => {
    if (action.includes('EXPORT') || action.includes('DOWNLOAD')) return 'bg-blue-100 text-blue-700';
    if (action.includes('UPDATE')) return 'bg-amber-100 text-amber-700';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Logs d'Audit & Sécurité</h1>
          <p className="text-slate-600 mt-1">Traçabilité complète des actions liées aux données sensibles.</p>
        </div>
        <img 
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/67030075d8c2178b8f1cad7f1c5c2f37.png" 
          alt="Security Design" 
          className="w-16 h-16 object-contain hidden md:block opacity-40 mix-blend-multiply"
        />
      </div>

      <Card className="border-slate-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-xl">
          <div className="flex gap-2 items-center">
             <ShieldAlert className="w-5 h-5 text-slate-400" />
             <span className="font-semibold text-slate-700">Registre d'activités</span>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Exporter CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Date / Heure</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">Chargement des logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">Aucun log disponible</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${getActionColor(log.action)} hover:opacity-80 border-none`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {log.profiles?.email || log.user_id}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate font-mono text-xs">
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

export default SecurityAuditPage;