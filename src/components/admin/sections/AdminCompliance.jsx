import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CHECKLIST = [
  { id: 'legal_docs',       label: 'Documents légaux publiés (CGU, Politique, RGPD)',     category: 'Documents',       done: true },
  { id: 'dpo_contact',      label: 'Contact DPO disponible (rgpd@cleavenir.com)',          category: 'Contact',         done: true },
  { id: 'soft_delete',      label: 'Suppression douce des comptes (soft delete)',           category: 'Sécurité',        done: true },
  { id: 'deletion_process', label: 'Processus de suppression des données (Art. 17)',       category: 'Données',         done: true },
  { id: 'export_process',   label: 'Export des données utilisateur (Art. 20)',             category: 'Données',         done: true },
  { id: 'ssl',              label: 'Connexion sécurisée HTTPS/SSL',                        category: 'Sécurité',        done: true },
  { id: 'auth_verify',      label: 'Vérification email à l\'inscription',                  category: 'Auth',            done: true },
  { id: 'cookie_consent',   label: 'Bannière de consentement cookies',                    category: 'Consentement',    done: false },
  { id: 'data_retention',   label: 'Politique de rétention des données formalisée',        category: 'Données',         done: false },
  { id: 'rls',              label: 'Row Level Security (RLS) activé sur toutes les tables', category: 'Sécurité',       done: false },
];

const AdminCompliance = () => {
  const [stats, setStats] = useState({ totalUsers: 0, deletedUsers: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ count: total }, { count: deleted }] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
        ]);
        setStats({ totalUsers: total || 0, deletedUsers: deleted || 0 });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les statistiques.' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const done = CHECKLIST.filter(c => c.done);
  const missing = CHECKLIST.filter(c => !c.done);
  const score = Math.round((done.length / CHECKLIST.length) * 100);
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-500' : 'text-red-600';
  const scoreBg = score >= 80 ? 'bg-green-50 border-green-200' : score >= 60 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Conformité RGPD</h2>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className={`border ${scoreBg}`}>
              <CardContent className="pt-6 text-center">
                <div className={`text-4xl font-bold ${scoreColor}`}>{score}%</div>
                <div className="text-sm text-slate-600 mt-1">Score de conformité</div>
                <div className="text-xs text-slate-400 mt-1">{done.length}/{CHECKLIST.length} points validés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-slate-900">{stats.totalUsers}</div>
                <div className="text-sm text-slate-600 mt-1">Utilisateurs actifs</div>
                <div className="text-xs text-slate-400 mt-1">{stats.deletedUsers} compte(s) désactivé(s)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className={`text-4xl font-bold ${missing.length > 0 ? 'text-orange-500' : 'text-green-600'}`}>{missing.length}</div>
                <div className="text-sm text-slate-600 mt-1">Point(s) à traiter</div>
                <div className="text-xs text-slate-400 mt-1">Actions requises</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-green-700">
                  <CheckCircle className="w-4 h-4" /> Points validés ({done.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {done.map(item => (
                    <div key={item.id} className="flex items-start gap-2 p-2 rounded bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-slate-700">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-orange-700">
                  <AlertTriangle className="w-4 h-4" /> Points à traiter ({missing.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {missing.map(item => (
                    <div key={item.id} className="flex items-start gap-2 p-2 rounded bg-orange-50">
                      <XCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-slate-700">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </div>
                    </div>
                  ))}
                  {missing.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">Tous les points sont validés !</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCompliance;
