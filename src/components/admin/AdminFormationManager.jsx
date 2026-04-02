import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FormationForm from './forms/FormationForm';

export default function AdminFormationManager() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion des Formations</h2>
        <Button onClick={() => { setEditingFormation(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter une Formation
        </Button>
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
    </div>
  );
}