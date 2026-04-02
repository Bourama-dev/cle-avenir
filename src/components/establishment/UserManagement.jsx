import React, { useState, useEffect } from 'react';
import { useEstablishment } from '@/contexts/EstablishmentContext';
import { establishmentService } from '@/services/establishmentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, FileDown } from 'lucide-react';
import { format } from 'date-fns';

const UserManagement = () => {
  const { establishmentId } = useEstablishment();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [establishmentId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await establishmentService.getEstablishmentUsers(establishmentId);
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
     const fullName = `${user.profile?.first_name} ${user.profile?.last_name}`.toLowerCase();
     const email = user.profile?.email?.toLowerCase() || '';
     const search = searchTerm.toLowerCase();
     return fullName.includes(search) || email.includes(search);
  });

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      teacher: "bg-blue-100 text-blue-700",
      student: "bg-green-100 text-green-700",
      viewer: "bg-slate-100 text-slate-700"
    };
    return <Badge className={styles[role] || styles.viewer}>{role}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500">Gérez les membres de votre établissement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" /> Exporter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" /> Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un nom ou email..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">Aucun utilisateur trouvé</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {user.profile?.first_name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {user.profile?.first_name} {user.profile?.last_name}
                        </div>
                        <div className="text-xs text-slate-500">{user.profile?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-500' : ''}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(user.joined_at), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;