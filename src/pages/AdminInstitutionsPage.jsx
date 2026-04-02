import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, Search, Edit, Trash2, Building2, Users, MoreHorizontal, ArrowRight 
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';

const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInst, setCurrentInst] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', postal_code: ''
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      // Join with user links to count students
      const { data, error } = await supabase
        .from('institutions')
        .select(`
          *,
          user_institution_links (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentInst) {
        const { error } = await supabase
          .from('institutions')
          .update(formData)
          .eq('id', currentInst.id);
        if (error) throw error;
        toast({ title: "Succès", description: "Institution mise à jour" });
      } else {
        const { error } = await supabase
          .from('institutions')
          .insert(formData);
        if (error) throw error;
        toast({ title: "Succès", description: "Institution créée" });
      }
      setIsDialogOpen(false);
      fetchInstitutions();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette institution ?')) return;
    try {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Institution supprimée" });
      fetchInstitutions();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const filteredInstitutions = institutions.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institutions</h1>
          <p className="text-slate-500 mt-2">Gérez les établissements scolaires et partenaires.</p>
        </div>
        <Button onClick={() => { setCurrentInst(null); setFormData({}); setIsDialogOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Institution
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <Input 
          placeholder="Rechercher..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus-visible:ring-0"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead className="text-center">Étudiants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : filteredInstitutions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Aucune institution trouvée.</TableCell></TableRow>
            ) : (
              filteredInstitutions.map((inst) => (
                <TableRow key={inst.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        {inst.name}
                        <div className="text-xs text-slate-500">Créé le {new Date(inst.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{inst.email || '-'}</div>
                    <div className="text-xs text-slate-500">{inst.phone}</div>
                  </TableCell>
                  <TableCell>{inst.city} {inst.postal_code && `(${inst.postal_code})`}</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Users className="w-3 h-3 mr-1" />
                      {inst.user_institution_links?.[0]?.count || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/institution/${inst.id}/dashboard`)}>
                          <ArrowRight className="mr-2 h-4 w-4" /> Gérer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setCurrentInst(inst); setFormData(inst); setIsDialogOpen(true); }}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(inst.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentInst ? 'Modifier' : 'Ajouter'} une Institution</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal_code">Code Postal</Label>
                <Input id="postal_code" value={formData.postal_code || ''} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} className="bg-purple-600 text-white">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInstitutionsPage;