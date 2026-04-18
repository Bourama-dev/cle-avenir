import React, { useState, useEffect } from 'react';
import { metierService } from '@/services/metierService';
import { metierSyncService } from '@/services/metierSyncService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, AlertCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { normalizedIncludes } from '@/utils/stringUtils';

const initialFormState = {
  code: '',
  name: '',
  description: '',
  sector: '',
  r_score: 0,
  i_score: 0,
  a_score: 0,
  s_score: 0,
  e_score: 0,
  c_score: 0,
  salary_min: 0,
  salary_max: 0,
  demand_level: 'moyenne',
  growth_trend: 'stable',
  is_active: true
};

const AdminMetiers = () => {
  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  // Sync state
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncClientId, setSyncClientId] = useState('');
  const [syncSecret, setSyncSecret] = useState('');
  const [syncError, setSyncError] = useState('');
  const [metiersCount, setMetiersCount] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    fetchMetiers();
    loadMetiersCount();
  }, []);

  const loadMetiersCount = async () => {
    const count = await metierSyncService.getMetiersCount();
    setMetiersCount(count);
  };

  const fetchMetiers = async () => {
    try {
      setLoading(true);
      const data = await metierService.getAllMetiers();
      setMetiers(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les métiers." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (metier = null) => {
    setFormError('');
    if (metier) {
      setFormData(metier);
      setEditingId(metier.id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.code || !formData.name || !formData.sector) {
      return "Le code, le nom et le secteur sont obligatoires.";
    }
    const scores = ['r_score', 'i_score', 'a_score', 's_score', 'e_score', 'c_score'];
    for (let s of scores) {
      if (formData[s] < 0 || formData[s] > 100) return "Les scores RIASEC doivent être entre 0 et 100.";
    }
    if (formData.salary_min < 0 || formData.salary_max < 0) {
      return "Les salaires ne peuvent pas être négatifs.";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    try {
      setIsSaving(true);
      setFormError('');
      
      if (editingId) {
        await metierService.updateMetier(editingId, formData);
        toast({ title: "Succès", description: "Métier mis à jour." });
      } else {
        await metierService.createMetier(formData);
        toast({ title: "Succès", description: "Métier créé." });
      }
      handleCloseDialog();
      fetchMetiers();
    } catch (error) {
      setFormError(error.message || "Erreur lors de la sauvegarde.");
      toast({ variant: "destructive", title: "Erreur", description: "Erreur lors de la sauvegarde." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver ce métier ? (Suppression logique)")) {
      try {
        await metierService.deactivateMetier(id);
        toast({ title: "Succès", description: "Métier désactivé." });
        fetchMetiers();
      } catch (error) {
        toast({ variant: "destructive", title: "Erreur", description: "Erreur lors de la désactivation." });
      }
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setSyncError('');
      const result = await metierSyncService.syncAllMetiers();

      toast({
        title: "Succès",
        description: `${result.count} métiers synchronisés depuis France Travail API`
      });

      // Refresh the data
      await loadMetiersCount();
      await fetchMetiers();
      setIsSyncDialogOpen(false);
      setSyncClientId('');
      setSyncSecret('');
    } catch (error) {
      setSyncError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredMetiers = metiers.filter(m =>
    normalizedIncludes(m.name, searchTerm) ||
    normalizedIncludes(m.code, searchTerm) ||
    normalizedIncludes(m.sector, searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Métiers (Base de données)</h1>
          <p className="text-sm text-slate-600 mt-2">{metiersCount.toLocaleString()} métiers dans la base de données</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsSyncDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <RefreshCcw className="w-4 h-4 mr-2" /> Synchroniser depuis France Travail
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Ajouter un métier
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Rechercher par nom, code ou secteur..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code ROME</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>Demande</TableHead>
              <TableHead>Tendance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Chargement de la base de données...
                </TableCell>
              </TableRow>
            ) : filteredMetiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Aucun métier trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredMetiers.map((metier) => (
                <TableRow key={metier.id}>
                  <TableCell className="font-medium">{metier.code}</TableCell>
                  <TableCell>{metier.name}</TableCell>
                  <TableCell>{metier.sector}</TableCell>
                  <TableCell className="capitalize">{metier.demand_level?.replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize">{metier.growth_trend}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${metier.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {metier.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(metier)}>
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Button>
                    {metier.is_active && (
                      <Button variant="outline" size="icon" onClick={() => handleDelete(metier.id)} className="hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingId ? 'Modifier le métier' : 'Ajouter un métier'}</DialogTitle>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-8 py-4">
            {/* Informations Générales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Informations Générales</h3>
              <div>
                <label className="text-sm font-medium">Code ROME <span className="text-red-500">*</span></label>
                <Input name="code" value={formData.code} onChange={handleInputChange} placeholder="ex: M1805" />
              </div>
              <div>
                <label className="text-sm font-medium">Nom du métier <span className="text-red-500">*</span></label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="ex: Développeur Web" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 text-sm"
                  placeholder="Brève description du métier..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Secteur <span className="text-red-500">*</span></label>
                <Input name="sector" value={formData.sector} onChange={handleInputChange} placeholder="ex: Informatique" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} 
                  className="rounded text-indigo-600"
                />
                <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">Métier actif et visible dans les résultats</label>
              </div>
            </div>

            {/* Critères Algorithmiques */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg border-b pb-2">Critères de l'Algorithme</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                <h4 className="font-medium text-slate-700 text-sm">Profil RIASEC (0-100)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-red-600">R (Réaliste)</label><Input type="number" name="r_score" value={formData.r_score} onChange={handleInputChange} min="0" max="100" /></div>
                  <div><label className="text-xs font-bold text-blue-600">I (Investigateur)</label><Input type="number" name="i_score" value={formData.i_score} onChange={handleInputChange} min="0" max="100" /></div>
                  <div><label className="text-xs font-bold text-purple-600">A (Artistique)</label><Input type="number" name="a_score" value={formData.a_score} onChange={handleInputChange} min="0" max="100" /></div>
                  <div><label className="text-xs font-bold text-green-600">S (Social)</label><Input type="number" name="s_score" value={formData.s_score} onChange={handleInputChange} min="0" max="100" /></div>
                  <div><label className="text-xs font-bold text-orange-600">E (Entreprenant)</label><Input type="number" name="e_score" value={formData.e_score} onChange={handleInputChange} min="0" max="100" /></div>
                  <div><label className="text-xs font-bold text-yellow-600">C (Conventionnel)</label><Input type="number" name="c_score" value={formData.c_score} onChange={handleInputChange} min="0" max="100" /></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Niveau de demande</label>
                  <Select value={formData.demand_level} onValueChange={(val) => handleSelectChange('demand_level', val)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="très_élevée">Très Élevée</SelectItem>
                      <SelectItem value="élevée">Élevée</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tendance / Croissance</label>
                  <Select value={formData.growth_trend} onValueChange={(val) => handleSelectChange('growth_trend', val)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="croissant">Croissant</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="décroissant">Décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Salaire Min Mensuel (€)</label>
                  <Input type="number" name="salary_min" value={formData.salary_min} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-sm font-medium">Salaire Max Mensuel (€)</label>
                  <Input type="number" name="salary_max" value={formData.salary_max} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>Annuler</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 text-white min-w-[120px]">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Synchroniser avec France Travail</DialogTitle>
          </DialogHeader>

          {syncError && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{syncError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              Cela téléchargera <strong>tous les métiers</strong> du catalogue ROME depuis l'API France Travail et les stockera dans la base de données.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              🔐 Les credentials France Travail sont configurés côté serveur. Aucune saisie requise.
            </div>
            {metiersCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                ⚠️ La base contient déjà <strong>{metiersCount.toLocaleString()} métiers</strong>. La sync mettra à jour les existants et ajoutera les nouveaux.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)} disabled={isSyncing}>
              Annuler
            </Button>
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-green-600 text-white min-w-[120px]"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Synchroniser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMetiers;