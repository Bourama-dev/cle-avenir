import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Download, Percent, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { rgpdAdminService } from '@/services/admin/rgpdAdminService';

const RgpdCompliancePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    consentRate: 0,
    dataDownloads: 0,
    complianceScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await rgpdAdminService.getRgpdStatistics(user?.id);
        setStats(data);
      } catch (error) {
        console.error("Error loading RGPD admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadStats();
  }, [user]);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Tableau de bord RGPD</h1>
          <p className="text-slate-600 mt-1">Supervision de la conformité et gestion des données</p>
        </div>
        <img 
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/ec4b7fa5052ddce02e7f86decfe648f5.png" 
          alt="Dashboard Design" 
          className="w-16 h-16 object-contain hidden md:block opacity-50 mix-blend-multiply"
        />
      </div>

      {loading ? (
         <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Users className="w-6 h-6" /></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Utilisateurs totaux</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
          </Card>
          
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><Percent className="w-6 h-6" /></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Taux d'acceptation cookies</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.consentRate}%</p>
          </Card>
          
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><Download className="w-6 h-6" /></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Exports de données</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.dataDownloads}</p>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600"><ShieldCheck className="w-6 h-6" /></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Score de conformité</h3>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-3xl font-bold text-emerald-600">{stats.complianceScore}/100</p>
               <Badge className="bg-emerald-100 text-emerald-700">Excellent</Badge>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
         <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Checklist de Conformité</h3>
            <div className="space-y-4">
               {[
                 { label: "Bandeau Cookie Actif", status: true },
                 { label: "Portabilité des Données (Export JSON)", status: true },
                 { label: "Registre des Activités de Traitement", status: true },
                 { label: "Politique de Confidentialité à jour", status: true },
                 { label: "Anonymisation des tests supprimés", status: false }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    {item.status ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Conforme</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">À vérifier</Badge>
                    )}
                 </div>
               ))}
            </div>
         </Card>

         <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-slate-900">Alertes & Recommandations</h3>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 mb-4">
               <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-bold text-blue-900">Audit Annuel</h4>
                  <p className="text-blue-800 text-sm mt-1">Le dernier audit de sécurité RGPD date de plus de 6 mois. Pensez à planifier une revue technique.</p>
               </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/security-audit'}>Voir les logs d'audit complets</Button>
         </Card>
      </div>
    </div>
  );
};

export default RgpdCompliancePage;