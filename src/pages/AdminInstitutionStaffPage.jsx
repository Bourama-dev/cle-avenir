import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { institutionService } from '@/services/institutionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, UserPlus, Trash2, KeyRound } from 'lucide-react';

const AdminInstitutionStaffPage = () => {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [tempPassword, setTempPassword] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: inst } = await supabase.from('institutions').select('*').eq('id', id).single();
      const { data: st } = await supabase.from('institution_staff').select('*').eq('institution_id', id);
      
      setInstitution(inst);
      setStaff(st || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaffEmail) return;
    try {
      const result = await institutionService.createStaff(id, newStaffEmail);
      
      // Here we would send an email via EmailService
      console.log('Sending email to:', newStaffEmail, 'Password:', result.temporaryPassword);
      
      setTempPassword(result.temporaryPassword);
      setStaff([...staff, result.staff]);
      toast({ title: "Membre ajouté", description: "Le mot de passe temporaire a été généré." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const handleDelete = async (staffId) => {
    if(!confirm("Supprimer ce membre ?")) return;
    try {
      const { error } = await supabase.from('institution_staff').delete().eq('id', staffId);
      if(error) throw error;
      setStaff(staff.filter(s => s.id !== staffId));
      toast({ title: "Membre supprimé" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/institutions">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Personnel - {institution?.name}</h1>
          <p className="text-slate-500">Gérez les accès administratifs de l'établissement</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste du personnel</CardTitle>
          <Button onClick={() => { setTempPassword(null); setIsDialogOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un membre
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Aucun membre du personnel.</TableCell></TableRow>
              ) : (
                staff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell className="capitalize">{s.role}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell>{s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : 'Jamais'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
          </DialogHeader>
          
          {!tempPassword ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email professionnel</Label>
                <Input value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="email@ecole.fr" />
              </div>
              <Button onClick={handleAddStaff} className="w-full">Créer le compte</Button>
            </div>
          ) : (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Compte créé avec succès !</h3>
              <p className="text-sm text-slate-500">Veuillez transmettre ce mot de passe temporaire :</p>
              <div className="p-4 bg-slate-100 rounded-lg font-mono text-xl font-bold tracking-wider select-all">
                {tempPassword}
              </div>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-full">Fermer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInstitutionStaffPage;