import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { onisepSyncService } from '@/services/onisepSyncService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FormationForm from './forms/FormationForm';

export default function AdminFormationManager() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState(null);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchFormations = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFormationsList();
      setFormations(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les formations' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const handleSave = async (data) => {
    if (editingFormation) {
      await adminService.updateFormation(editingFormation.id, data);
    } else {
      await adminService.createFormation(data);
    }
    setIsModalOpen(false);
    fetchFormations();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      try {
        await adminService.deleteFormation(id);
        toast({ title: 'Supprimé', description: 'La formation a été supprimée.' });
        fetchFormations();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer cette formation.' });
      }
    }
  };

  const handleSyncOnisep = async () => {
    setSyncing(true);
    setIsSyncDialogOpen(true);
    try {
      const result = await onisepSyncService.syncFormationsFromOnisep({
        limit: 100,
        offset: 0,
        syncToDb: true,
      });

      if (result.success) {
        setSyncStats(result);
        toast({
          title: '✅ Synchronisation réussie',
          description: `${result.synced} formations ont été ajoutées à la base de données.`,
        });
        fetchFormations();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur de synchronisation',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion des Formations</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncOnisep}
            disabled={syncing}
            variant="outline"
            className="border-blue-500 text-blue-600"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Synchronisation...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" /> Importer ONISEP
              </>
            )}
          </Button>
          <Button onClick={() => { setEditingFormation(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter une Formation
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="border rounded-md bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>École/Orga</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formations.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">Aucune formation trouvée.</TableCell></TableRow>
              ) : (
                formations.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell>{f.provider}</TableCell>
                    <TableCell>{f.level}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingFormation(f); setIsModalOpen(true); }}><Edit className="w-4 h-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFormation ? 'Modifier la Formation' : 'Ajouter une Formation'}</DialogTitle>
          </DialogHeader>
          <FormationForm initialData={editingFormation} onSubmit={handleSave} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>📊 Résultats de la synchronisation ONISEP</DialogTitle>
          </DialogHeader>
          {syncing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-center">Synchronisation en cours...</p>
            </div>
          ) : syncStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Récupérées</p>
                  <p className="text-2xl font-bold text-blue-600">{syncStats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Ajoutées</p>
                  <p className="text-2xl font-bold text-green-600">{syncStats.synced}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Erreurs</p>
                  <p className="text-2xl font-bold text-purple-600">{syncStats.errors?.length || 0}</p>
                </div>
              </div>
              {syncStats.errors && syncStats.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-800 mb-2">Erreurs:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {syncStats.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button onClick={() => setIsSyncDialogOpen(false)} className="w-full">
                Fermer
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}