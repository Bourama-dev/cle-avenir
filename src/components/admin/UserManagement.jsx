import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Shield, 
  Star, 
  Calendar, 
  Mail, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  X,
  CreditCard,
  Crown
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, premium: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filterTier, filterStatus]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStats = async () => {
    try {
      // Parallel queries for stats
      const [totalRes, activeRes, premiumRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('subscription_tier', ['premium', 'premium_plus'])
      ]);

      setStats({
        total: totalRes.count || 0,
        active: activeRes.count || 0,
        premium: premiumRes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      if (filterTier !== 'all') {
        query = query.eq('subscription_tier', filterTier);
      }

      if (filterStatus !== 'all') {
        query = query.eq('subscription_status', filterStatus);
      }

      const { data, error } = await query.limit(50); // Limit for performance

      if (error) throw error;
      setUsers(data || []);
      
      // If we have a selected user, refresh their data from the list
      if (selectedUser) {
        const updatedSelected = data.find(u => u.id === selectedUser.id);
        if (updatedSelected) setSelectedUser(updatedSelected);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId, field, value) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Mise à jour réussie",
        description: `Le profil a été mis à jour avec succès.`,
        className: "bg-green-50 border-green-200"
      });

      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, [field]: value });
      }
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: "Une erreur est survenue."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    
    try {
      // Note: This only deletes from profiles. 
      // In a real Supabase setup, you'd likely use an Edge Function to delete from auth.users too,
      // or rely on a "soft delete" (setting status to deleted).
      // Here we assume deleting profile is the administrative action requested.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Utilisateur supprimé",
        description: "Le profil a été supprimé définitivement.",
      });

      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsDeleteDialogOpen(false);
      fetchStats();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: "Impossible de supprimer cet utilisateur."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'premium': return <span className="um-badge tier-premium"><Star size={10} /> Premium</span>;
      case 'premium_plus': return <span className="um-badge tier-premium_plus"><Crown size={10} /> Premium+</span>;
      default: return <span className="um-badge tier-decouverte">Découverte</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="um-badge status-active"><CheckCircle size={10} /> Actif</span>;
      case 'inactive': return <span className="um-badge status-inactive"><XCircle size={10} /> Inactif</span>;
      case 'suspended': return <span className="um-badge status-suspended"><AlertTriangle size={10} /> Suspendu</span>;
      default: return <span className="um-badge status-active">Actif</span>;
    }
  };

  const getInitials = (user) => {
    if (user.first_name) return user.first_name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <div className="user-management-container">
      {/* Stats Header */}
      <div className="um-stats-grid">
        <div className="um-stat-card">
          <div className="um-stat-value">{stats.total}</div>
          <div className="um-stat-label">Utilisateurs Totaux</div>
        </div>
        <div className="um-stat-card">
          <div className="um-stat-value text-green-600">{stats.active}</div>
          <div className="um-stat-label">Comptes Actifs</div>
        </div>
        <div className="um-stat-card">
          <div className="um-stat-value text-purple-600">{stats.premium}</div>
          <div className="um-stat-label">Abonnés Premium</div>
        </div>
      </div>

      {/* Controls */}
      <div className="um-controls">
        <div className="um-search-wrapper">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            className="um-search-input" 
            placeholder="Rechercher par nom ou email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les plans</SelectItem>
            <SelectItem value="decouverte">Découverte</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="premium_plus">Premium+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="um-content-grid">
        {/* Left: User List */}
        <div className="um-list-panel">
          <div className="um-list-header">
            Liste des utilisateurs ({users.length})
          </div>
          <div className="um-users-list">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-slate-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Aucun utilisateur trouvé
              </div>
            ) : (
              users.map(user => (
                <div 
                  key={user.id} 
                  className={`um-user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="um-avatar-wrapper">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="um-avatar-img" />
                    ) : (
                      <div className="um-avatar">{getInitials(user)}</div>
                    )}
                  </div>
                  <div className="um-user-info">
                    <h4>{user.first_name} {user.last_name || ''}</h4>
                    <div className="um-user-email">{user.email}</div>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                     {getStatusBadge(user.subscription_status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className={`um-detail-panel ${selectedUser ? 'active' : ''}`}>
          {selectedUser ? (
            <>
              {/* Mobile Close Button */}
              <button 
                className="lg:hidden absolute top-4 right-4 p-2 text-slate-500"
                onClick={() => setSelectedUser(null)}
              >
                <X size={24} />
              </button>

              <div className="um-detail-header">
                <div className="um-detail-avatar">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt="Avatar" className="um-avatar-img" />
                  ) : (
                    getInitials(selectedUser)
                  )}
                </div>
                <div className="um-detail-title">
                  <h2>{selectedUser.first_name} {selectedUser.last_name}</h2>
                  <div className="um-detail-meta">
                    {getTierBadge(selectedUser.subscription_tier)}
                    {getStatusBadge(selectedUser.subscription_status)}
                  </div>
                  <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <Calendar size={14} /> Inscrit le {new Date(selectedUser.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="um-section">
                <div className="um-section-title"><User size={18} /> Informations Personnelles</div>
                <div className="um-form-grid">
                  <div className="um-field">
                    <label>ID Utilisateur</label>
                    <Input value={selectedUser.id} readOnly className="bg-slate-50 font-mono text-xs" />
                  </div>
                  <div className="um-field">
                    <label>Email</label>
                    <div className="flex items-center gap-2">
                       <Mail size={16} className="text-slate-400" />
                       <span className="text-slate-700">{selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="um-field">
                    <label>Prénom</label>
                    <Input value={selectedUser.first_name || ''} readOnly className="bg-slate-50" />
                  </div>
                  <div className="um-field">
                    <label>Nom</label>
                    <Input value={selectedUser.last_name || ''} readOnly className="bg-slate-50" />
                  </div>
                </div>
              </div>

              <div className="um-section">
                <div className="um-section-title"><CreditCard size={18} /> Abonnement & Statut</div>
                <div className="um-form-grid">
                  <div className="um-field">
                    <label>Plan Actuel</label>
                    <Select 
                      value={selectedUser.subscription_tier || 'decouverte'} 
                      onValueChange={(val) => handleUpdateSubscription(selectedUser.id, 'subscription_tier', val)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="decouverte">Découverte (Gratuit)</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="premium_plus">Premium+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="um-field">
                    <label>Statut du Compte</label>
                    <Select 
                      value={selectedUser.subscription_status || 'active'} 
                      onValueChange={(val) => handleUpdateSubscription(selectedUser.id, 'subscription_status', val)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="suspended">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    Dernière mise à jour: {new Date(selectedUser.updated_at || selectedUser.created_at).toLocaleString()}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 size={16} /> Supprimer l'utilisateur
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="um-empty-state">
              <User size={64} strokeWidth={1} className="mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-700">Sélectionnez un utilisateur</h3>
              <p>Cliquez sur un utilisateur dans la liste pour voir les détails et gérer son compte.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le profil de <strong>{selectedUser?.email}</strong> sera définitivement supprimé de la base de données.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="animate-spin" /> : 'Confirmer la suppression'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;