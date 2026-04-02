import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import EstablishmentsTable from './establishments/EstablishmentsTable';
import EstablishmentFilters from './establishments/EstablishmentFilters';
import EstablishmentStats from './establishments/EstablishmentStats';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import EstablishmentForm from './establishments/EstablishmentForm';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const AdminEstablishments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: 'all', status: 'all' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [sort, setSort] = useState({ column: 'created_at', direction: 'desc' });
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await establishmentService.getEstablishments({
        page: pagination.page,
        limit: pagination.limit,
        filters,
        sort
      });
      setData(response.data);
      setPagination(prev => ({ ...prev, total: response.count }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les établissements."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, filters, sort]);

  const handleCreate = () => {
    setEditingEstablishment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (establishment) => {
    try {
      const fullDetails = await establishmentService.getEstablishmentById(establishment.id);
      setEditingEstablishment(fullDetails);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails de l'établissement."
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible.")) return;
    
    try {
      await establishmentService.deleteEstablishment(id);
      toast({
        title: "Suppression réussie",
        description: "L'établissement a été supprimé."
      });
      loadData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'établissement."
      });
    }
  };

  const handleAccessDashboard = (id) => {
    console.log('[Navigation] Executing navigate to:', `/admin/establishment/${id}/dashboard`);
    navigate(`/admin/establishment/${id}/dashboard`);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEstablishment) {
        await establishmentService.updateEstablishment(editingEstablishment.id, formData);
      } else {
        await establishmentService.createEstablishment(formData);
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      throw error; 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">Établissements</h2>
           <p className="text-slate-500">Gestion des écoles, universités et partenaires éducatifs.</p>
        </div>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nouvel Établissement
        </Button>
      </div>

      <EstablishmentStats />

      <div className="space-y-4">
        <EstablishmentFilters 
          filters={filters} 
          onChange={setFilters} 
        />

        <EstablishmentsTable 
          data={data}
          loading={loading}
          sort={sort}
          onSort={(col) => setSort(prev => ({ column: col, direction: prev.column === col && prev.direction === 'asc' ? 'desc' : 'asc' }))}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAccessDashboard={handleAccessDashboard}
          onRetry={loadData}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEstablishment ? "Modifier l'établissement" : "Ajouter un établissement"}</DialogTitle>
          </DialogHeader>
          
          <EstablishmentForm 
            initialData={editingEstablishment}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEstablishments;