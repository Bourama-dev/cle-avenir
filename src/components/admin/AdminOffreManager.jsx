import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import OffreForm from './forms/OffreForm';

export default function AdminOffreManager() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const { toast } = useToast();

  const fetchOffres = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOffresList();
      setOffres(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les offres' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleSave = async (data) => {
    if (editingOffre) {
      await adminService.updateOffre(editingOffre.id, data);
    } else {
      await adminService.createOffre(data);
    }
    setIsModalOpen(false);
    fetchOffres();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await adminService.deleteOffre(id);
        toast({ title: 'Supprimé', description: "L'offre a été supprimée." });
        fetchOffres();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer cette offre.' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion des Offres d'emploi</h2>
        <Button onClick={() => { setEditingOffre(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter une Offre
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="border rounded-md bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offres.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-6">Aucune offre trouvée.</TableCell></TableRow>
              ) : (
                offres.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.title}</TableCell>
                    <TableCell>{o.company}</TableCell>
                    <TableCell>{o.contract_type}</TableCell>
                    <TableCell>{o.is_active ? <span className="text-green-600 text-sm">Active</span> : <span className="text-slate-400 text-sm">Inactive</span>}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingOffre(o); setIsModalOpen(true); }}><Edit className="w-4 h-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
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
            <DialogTitle>{editingOffre ? "Modifier l'Offre" : "Ajouter une Offre"}</DialogTitle>
          </DialogHeader>
          <OffreForm initialData={editingOffre} onSubmit={handleSave} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}