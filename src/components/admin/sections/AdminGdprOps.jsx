import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Trash2, Download, RefreshCw, UserX, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const AdminGdprOps = () => {
  const [loading, setLoading] = useState({});
  const [purgeConfirm, setPurgeConfirm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userResult, setUserResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  const setOp = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

  const searchUser = async () => {
    if (!userEmail.trim()) return;
    setSearchLoading(true);
    setUserResult(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at, is_deleted')
        .eq('email', userEmail.trim())
        .maybeSingle();
      if (error) throw error;
      setUserResult(data || 'not_found');
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Recherche échouée.' });
    } finally {
      setSearchLoading(false);
    }
  };

  const softDeleteUser = async (userId) => {
    setOp('delete_' + userId, true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_deleted: true, deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) throw error;
      toast({ title: 'Compte désactivé', description: 'Le compte est marqué comme supprimé.', className: 'bg-green-50 border-green-200' });
      setUserResult(prev => ({ ...prev, is_deleted: true }));
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le compte.' });
    } finally {
      setOp('delete_' + userId, false);
    }
  };

  const purgeDeletedProfiles = async () => {
    setPurgeConfirm(false);
    setOp('purge', true);
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('is_deleted', true)
        .lt('deleted_at', cutoff.toISOString())
        .select('id');
      if (error) throw error;
      const count = data?.length || 0;
      toast({ title: 'Purge effectuée', description: `${count} profil(s) supprimé(s) définitivement (>30j).`, className: 'bg-green-50 border-green-200' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'La purge a échoué.' });
    } finally {
      setOp('purge', false);
    }
  };

  const exportUserData = async (userId, email) => {
    setOp('export_' + userId, true);
    try {
      const [profileRes, testRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('test_results').select('*').eq('user_id', userId),
      ]);
      const exportData = {
        exported_at: new Date().toISOString(),
        profile: profileRes.data,
        test_results: testRes.data || [],
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${email}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export téléchargé', className: 'bg-green-50 border-green-200' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'L\'export a échoué.' });
    } finally {
      setOp('export_' + userId, false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Opérations RGPD</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserX className="w-4 h-4 text-slate-500" /> Recherche & gestion d'un utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Email de l'utilisateur..."
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchUser()}
            />
            <Button onClick={searchUser} disabled={searchLoading}>
              {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rechercher'}
            </Button>
          </div>

          {userResult === 'not_found' && (
            <p className="text-sm text-slate-500">Aucun utilisateur trouvé avec cet email.</p>
          )}

          {userResult && userResult !== 'not_found' && (
            <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Nom :</span> {userResult.first_name} {userResult.last_name}</div>
                <div><span className="text-slate-500">Email :</span> {userResult.email}</div>
                <div><span className="text-slate-500">Inscription :</span> {new Date(userResult.created_at).toLocaleDateString('fr-FR')}</div>
                <div><span className="text-slate-500">Statut :</span> {userResult.is_deleted ? '🔴 Supprimé' : '🟢 Actif'}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" disabled={loading['export_' + userResult.id]} onClick={() => exportUserData(userResult.id, userResult.email)}>
                  {loading['export_' + userResult.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Download className="w-3 h-3 mr-1" />}
                  Exporter les données
                </Button>
                {!userResult.is_deleted && (
                  <Button size="sm" variant="destructive" disabled={loading['delete_' + userResult.id]} onClick={() => softDeleteUser(userResult.id)}>
                    {loading['delete_' + userResult.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Trash2 className="w-3 h-3 mr-1" />}
                    Supprimer le compte
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-500" /> Opérations en masse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled={loading.purge} onClick={() => setPurgeConfirm(true)} className="gap-2">
            {loading.purge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Purger les comptes supprimés (&gt;30 jours)
          </Button>
          <p className="text-xs text-slate-400 mt-3">
            La purge supprime définitivement les profils <code>is_deleted=true</code> depuis plus de 30 jours.
            Le compte auth.users Supabase doit être supprimé manuellement via la console.
          </p>
        </CardContent>
      </Card>

      <Dialog open={purgeConfirm} onOpenChange={setPurgeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Confirmer la purge
            </DialogTitle>
            <DialogDescription>
              Cette action supprime définitivement les profils marqués comme supprimés depuis plus de 30 jours. Elle est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurgeConfirm(false)}>Annuler</Button>
            <Button variant="destructive" onClick={purgeDeletedProfiles}>Confirmer la purge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGdprOps;
