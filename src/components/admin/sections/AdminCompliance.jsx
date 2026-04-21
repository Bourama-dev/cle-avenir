import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Download, Percent, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { rgpdAdminService } from '@/services/admin/rgpdAdminService';

const CHECKLIST = [
  { label: 'Bandeau Cookie Actif', status: true },
  { label: 'Portabilité des Données (Export JSON)', status: true },
  { label: 'Registre des Activités de Traitement', status: true },
  { label: 'Politique de Confidentialité à jour', status: true },
  { label: 'Anonymisation des tests supprimés', status: false },
];

const AdminCompliance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, consentRate: 0, dataDownloads: 0, complianceScore: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await rgpdAdminService.getRgpdStatistics(user?.id);
      setStats(data);
    } catch (err) {
      console.error('Error loading RGPD stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const KPI_CARDS = [
    { label: 'Utilisateurs totaux', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: "Taux d'acceptation cookies", value: `${stats.consentRate}%`, icon: Percent, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Exports de données', value: stats.dataDownloads, icon: Download, color: 'bg-purple-100 text-purple-600' },
    { label: 'Score de conformité', value: `${stats.complianceScore}/100`, icon: ShieldCheck, color: 'bg-indigo-100 text-indigo-600', highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Tableau de bord RGPD</h2>
          <p className="text-slate-500 text-sm mt-1">Supervision de la conformité et gestion des données</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI_CARDS.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="p-5 border-slate-200">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-slate-500 text-xs font-medium">{kpi.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${kpi.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {kpi.value}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">Checklist de Conformité</h3>
              <div className="space-y-3">
                {CHECKLIST.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                    <span className="font-medium text-slate-700 text-sm">{item.label}</span>
                    {item.status ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Conforme</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">À vérifier</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">Alertes & Recommandations</h3>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Audit Annuel</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Le dernier audit de sécurité RGPD date de plus de 6 mois. Pensez à planifier une revue technique.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/admin/security')}
                >
                  <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />
                  Voir les logs d'audit de sécurité
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/admin/gdpr')}
                >
                  <Users className="w-4 h-4 mr-2 text-slate-400" />
                  Gérer les demandes RGPD
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCompliance;
