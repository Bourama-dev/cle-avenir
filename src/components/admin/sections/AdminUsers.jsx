import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Trash2, Edit2, CheckCircle, UserX, Loader2, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TIERS, TIER_NAMES } from '@/constants/subscriptionTiers';
import HelpButton from '@/components/ui/HelpButton';

const PAGE_SIZE = 20;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  const [editForm, setEditForm] = useState({ 
    role: 'user', 
    first_name: '', 
    last_name: '',
    subscription_tier: TIERS.FREE 
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0); // Reset to first page on search
      fetchUsers(0, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
      fetchUsers(page, searchTerm);
  }, [page]);

  const fetchUsers = async (pageIndex, search) => {
    setLoading(true);
    try {
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

        if (search) {
            query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        }

        const { data, error, count } = await query;
        
        if (error) throw error;

        setUsers(data || []);
        setTotalCount(count || 0);
    } catch (error) {
        console.error("Error fetching users:", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les utilisateurs." });
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = (user) => {
      setSelectedUser(user);
      setEditForm({ 
          role: user.role || 'user', 
          first_name: user.first_name || '', 
          last_name: user.last_name || '',
          subscription_tier: user.subscription_tier || TIERS.FREE
      });
      setIsEditOpen(true);
  };

  const saveEdit = async () => {
      if (!selectedUser) return;
      
      const { error } = await supabase
          .from('profiles')
          .update({ 
              role: editForm.role,
              first_name: editForm.first_name,
              last_name: editForm.last_name,
              subscription_tier: editForm.subscription_tier
          })
          .eq('id', selectedUser.id);

      if (error) {
          toast({ variant: "destructive", title: "Erreur", description: "Mise à jour échouée." });
      } else {
          toast({ title: "Succès", description: "Profil mis à jour." });
          fetchUsers(page, searchTerm);
          setIsEditOpen(false);
      }
  };

  const handleDelete = async () => {
      if (!selectedUser) return;

      const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedUser.id);

      if (error) {
          toast({ variant: "destructive", title: "Erreur", description: "Suppression échouée." });
      } else {
          toast({ title: "Succès", description: "Utilisateur supprimé." });
          fetchUsers(page, searchTerm);
          setIsDeleteOpen(false);
      }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case TIERS.PREMIUM_PLUS: return 'bg-purple-100 text-purple-700 border-purple-200';
      case TIERS.PREMIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-bold text-slate-900">Gestion Utilisateurs</h2>
               <HelpButton section="USERS" />
            </div>
            <p className="text-sm text-slate-500">Total: {totalCount} utilisateurs</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
             <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Rechercher..." 
                   className="pl-9 w-full sm:w-64"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <Button onClick={() => fetchUsers(page, searchTerm)} variant="outline" size="icon" title="Rafraîchir" className="min-w-[44px] min-h-[44px]">
                 <CheckCircle className="h-4 w-4" />
             </Button>
          </div>
       </div>

       <Card className="overflow-hidden border-slate-200">
          <CardContent className="p-0 overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                   <tr>
                      <th className="p-4 font-medium min-w-[200px]">Utilisateur</th>
                      <th className="p-4 font-medium min-w-[120px]">Plan</th>
                      <th className="p-4 font-medium min-w-[100px]">Rôle</th>
                      <th className="p-4 font-medium hidden sm:table-cell min-w-[120px]">Inscription</th>
                      <th className="p-4 font-medium text-right min-w-[80px]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {loading ? (
                      <tr><td colSpan="5" className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-slate-400"/></td></tr>
                   ) : users.length === 0 ? (
                      <tr>
                         <td colSpan="5" className="p-12 text-center text-slate-500">
                             <div className="flex flex-col items-center gap-2">
                                 <UserX className="h-8 w-8 text-slate-300"/>
                                 <p>Aucun utilisateur trouvé.</p>
                             </div>
                         </td>
                      </tr>
                   ) : users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback>{user.first_name?.[0]?.toUpperCase() || 'U'}{user.last_name?.[0]?.toUpperCase() || ''}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {user.first_name || 'Sans nom'} {user.last_name || ''}
                                    </div>
                                    <div className="text-slate-500 text-xs break-all">{user.email}</div>
                                </div>
                            </div>
                         </td>
                         <td className="p-4">
                            <Badge variant="outline" className={`capitalize font-medium border ${getTierBadgeColor(user.subscription_tier)}`}>
                                {TIER_NAMES[user.subscription_tier] || 'Gratuit'}
                            </Badge>
                         </td>
                         <td className="p-4">
                            <Badge variant="outline" className={`uppercase text-[10px] ${user.role === 'admin' ? 'border-red-200 bg-red-50 text-red-700' : 'bg-slate-50'}`}>
                               {user.role || 'user'}
                            </Badge>
                         </td>
                         <td className="p-4 hidden sm:table-cell text-slate-500">
                            {new Date(user.created_at).toLocaleDateString()}
                         </td>
                         <td className="p-4 text-right">
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 min-w-[32px] min-h-[32px]"><MoreHorizontal className="h-4 w-4"/></Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(user)} className="cursor-pointer min-h-[44px]">
                                      <Edit2 className="mr-2 h-4 w-4"/> Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }} className="text-red-600 focus:text-red-700 cursor-pointer min-h-[44px]">
                                      <Trash2 className="mr-2 h-4 w-4"/> Supprimer
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </CardContent>
       </Card>

       {/* Pagination */}
       <div className="flex items-center justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="min-h-[44px] min-w-[44px]"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-500">
                Page {page + 1} sur {Math.max(1, totalPages)}
            </span>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="min-h-[44px] min-w-[44px]"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
       </div>

       {/* Edit Modal */}
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="sm:max-w-lg w-[95%]">
               <DialogHeader>
                   <DialogTitle>Modifier Utilisateur</DialogTitle>
                   <DialogDescription>
                       Mettez à jour les informations du profil, le rôle et le plan d'abonnement.
                   </DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-2">
                           <Label htmlFor="editFirstName">Prénom</Label>
                           <Input id="editFirstName" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                           <Label htmlFor="editLastName">Nom</Label>
                           <Input id="editLastName" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} />
                       </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="editRole">Rôle</Label>
                           <Select value={editForm.role} onValueChange={v => setEditForm({...editForm, role: v})}>
                               <SelectTrigger id="editRole" className="min-h-[44px]"><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="user">Utilisateur</SelectItem>
                                   <SelectItem value="admin">Administrateur</SelectItem>
                                   <SelectItem value="organization">Organisation</SelectItem>
                               </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="editPlan" className="flex items-center gap-2">
                               <CreditCard className="w-3 h-3" /> Plan Actuel
                           </Label>
                           <Select value={editForm.subscription_tier} onValueChange={v => setEditForm({...editForm, subscription_tier: v})}>
                               <SelectTrigger id="editPlan" className="min-h-[44px]"><SelectValue placeholder="Sélectionner un plan" /></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value={TIERS.FREE}>Découverte (Gratuit)</SelectItem>
                                   <SelectItem value={TIERS.PREMIUM}>Premium</SelectItem>
                                   <SelectItem value={TIERS.PREMIUM_PLUS}>Premium+</SelectItem>
                               </SelectContent>
                           </Select>
                        </div>
                   </div>
               </div>
               <DialogFooter className="flex-col sm:flex-row gap-2">
                   <Button variant="outline" onClick={() => setIsEditOpen(false)} className="w-full sm:w-auto min-h-[44px]">Annuler</Button>
                   <Button onClick={saveEdit} className="w-full sm:w-auto min-h-[44px]">Enregistrer</Button>
               </DialogFooter>
           </DialogContent>
       </Dialog>

       {/* Delete Modal */}
       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
           <DialogContent className="sm:max-w-lg w-[95%]">
               <DialogHeader>
                   <DialogTitle>Confirmer la suppression</DialogTitle>
                   <DialogDescription>
                       Cette action supprimera définitivement le profil de l'utilisateur et ne pourra pas être annulée.
                   </DialogDescription>
               </DialogHeader>
               <p className="text-slate-600">
                   Êtes-vous sûr de vouloir supprimer le profil de <strong>{selectedUser?.email}</strong> ?
                   Cette action est irréversible.
               </p>
               <DialogFooter className="flex-col sm:flex-row gap-2">
                   <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="w-full sm:w-auto min-h-[44px]">Annuler</Button>
                   <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto min-h-[44px]">Supprimer définitivement</Button>
               </DialogFooter>
           </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminUsers;