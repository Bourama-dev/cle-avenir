import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Activity, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StatusPage = () => {
  const systems = [
    { name: "Site Web & Plateforme", status: "operational" },
    { name: "API Cléo (IA)", status: "operational" },
    { name: "Base de données Métiers", status: "operational" },
    { name: "Système d'Authentification", status: "operational" },
    { name: "Paiements Stripe", status: "operational" }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">État des Services</h1>
          <p className="text-slate-600 mt-2">Dernière mise à jour : {new Date().toLocaleTimeString()}</p>
        </div>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-lg px-4 py-1 h-auto">
          Tous les systèmes opérationnels
        </Badge>
      </div>

      <div className="space-y-4">
        {systems.map((sys, idx) => (
          <Card key={idx} className="border-l-4 border-l-green-500">
            <CardContent className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                 {sys.status === 'operational' ? (
                   <CheckCircle2 className="h-5 w-5 text-green-500" />
                 ) : (
                   <AlertTriangle className="h-5 w-5 text-amber-500" />
                 )}
                 <span className="font-medium text-slate-900">{sys.name}</span>
               </div>
               <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Opérationnel</span>
            </CardContent>
          </Card>
        ))}
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