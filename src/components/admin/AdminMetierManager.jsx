import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MetierForm from './forms/MetierForm';

export default function AdminMetierManager() {
  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetier, setEditingMetier] = useState(null);
  const { toast } = useToast();

  const fetchMetiers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMetiersList();
      setMetiers(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les métiers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetiers();
  }, []);

  const handleSave = async (data) => {
    if (editingMetier) {
      await adminService.updateMetier(editingMetier.id, data);
    } else {
      await adminService.createMetier(data);
    }
    setIsModalOpen(false);
    fetchMetiers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce métier ?")) {
      try {
        await adminService.deleteMetier(id);
        toast({ title: 'Supprimé', description: 'Le métier a été supprimé.' });
        fetchMetiers();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer ce métier.' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion des Métiers</h2>
        <Button onClick={() => { setEditingMetier(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un Métier
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="border rounded-md bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code ROME</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Salaire Moyen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metiers.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">Aucun métier trouvé.</TableCell></TableRow>
              ) : (
                metiers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm">{m.rome_code}</TableCell>
                    <TableCell className="font-medium">{m.libelle}</TableCell>
                    <TableCell>{m.average_salary ? `${m.average_salary} €` : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingMetier(m); setIsModalOpen(true); }}><Edit className="w-4 h-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
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
            <DialogTitle>{editingMetier ? 'Modifier le Métier' : 'Ajouter un Métier'}</DialogTitle>
          </DialogHeader>
          <MetierForm initialData={editingMetier} onSubmit={handleSave} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}