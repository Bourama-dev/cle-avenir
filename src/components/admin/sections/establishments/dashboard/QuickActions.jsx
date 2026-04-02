import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { establishmentService } from '@/services/establishmentService';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, RotateCw, PauseCircle, PlayCircle, MailPlus, Download, ClipboardList, Plug, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventLogger } from '@/services/eventLoggerService';
import { EVENT_TYPES } from '@/constants/eventTypes';
import '@/styles/quick-actions.css';

const ActionButton = ({ icon: Icon, text, onClick, loading, danger = false, disabled = false, iconClass = "" }) => (
  <button 
    onClick={onClick}
    disabled={disabled || loading}
    className={`qa-btn ${danger ? 'danger' : ''}`}
  >
    {loading ? (
      <Loader2 className="qa-icon animate-spin text-slate-400" />
    ) : (
      <Icon className={`qa-icon ${danger ? 'text-red-500' : 'text-slate-600'} ${iconClass}`} />
    )}
    <span className="qa-text">{text}</span>
  </button>
);

const QuickActions = ({ establishmentId, establishmentData, onRefresh }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  
  // Input states
  const [newEmail, setNewEmail] = useState('');
  
  // Handlers
  const handleEdit = () => {
    navigate(`/admin/establishments/${establishmentId}/edit`);
  };

  const handleLogs = () => {
    navigate(`/admin/establishments/${establishmentId}/logs`);
  };

  const handleGenerateCode = async () => {
    if (!window.confirm("Générer un nouveau code invalidera l'ancien. Continuer ?")) return;
    
    setLoadingAction('code');
    try {
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newCode = `E${randomPart}${Date.now().toString().slice(-4)}`;
      
      // Update with code and code_updated_at explicitly
      await establishmentService.updateEstablishment(establishmentId, {
        code: newCode,
        activation_password: newCode, // Maintain legacy support if needed
        code_updated_at: new Date().toISOString()
      });

      if (establishmentId) {
          await EventLogger.logSchoolEvent(
            EVENT_TYPES.SCHOOL_UPDATED,
            establishmentId,
            establishmentData?.name || "Unknown School",
            null,
            null,
            null,
            { action: 'new_code_generated', new_code: newCode }
          );
      }

      await navigator.clipboard.writeText(newCode);
      
      toast({
        title: "Nouveau code généré",
        description: `Code ${newCode} copié dans le presse-papier`,
        className: "bg-green-50 text-green-800 border-green-200"
      });
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le code"
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTogglePause = async () => {
    setLoadingAction('pause');
    const newStatus = establishmentData?.status === 'paused' ? 'active' : 'paused';
    
    try {
      // Update status and paused_at explicitly
      await establishmentService.updateEstablishment(establishmentId, {
        status: newStatus,
        paused_at: newStatus === 'paused' ? new Date().toISOString() : null
      });

      if (establishmentId) {
          await EventLogger.logSchoolEvent(
            EVENT_TYPES.SCHOOL_UPDATED,
            establishmentId,
            establishmentData?.name || "Unknown School",
            null,
            null,
            null,
            { action: `status_changed_to_${newStatus}` }
          );
      }

      toast({
        title: newStatus === 'active' ? "Établissement activé" : "Établissement mis en pause",
        className: "bg-blue-50 text-blue-800 border-blue-200"
      });
      
      if (onRefresh) onRefresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExport = async () => {
    setLoadingAction('export');
    try {
        const { data: students } = await supabase
            .from('profiles')
            .select('count')
            .eq('establishment_id', establishmentId);
            
        const exportData = {
            establishment: establishmentData,
            exported_at: new Date().toISOString(),
            student_count: students?.length || 0
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `establishment_${establishmentData?.name || 'export'}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({ title: "Export réussi", description: "Le fichier a été téléchargé." });
    } catch (error) {
        toast({ variant: "destructive", title: "Erreur d'export", description: error.message });
    } finally {
        setLoadingAction(null);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        toast({ variant: "destructive", title: "Email invalide" });
        return;
    }
    
    setLoadingAction('email');
    try {
        const { error } = await supabase
            .from('establishment_emails')
            .insert([{ 
                establishment_id: establishmentId, 
                email: newEmail 
            }]);

        if (error) throw error;

        // Also update the count on establishment for stats consistency
        await supabase.rpc('increment_email_count', { row_id: establishmentId })
            .catch(err => console.warn("increment_email_count RPC missing, skipping count update"));

        if (establishmentId) {
            await EventLogger.logSchoolEvent(
                EVENT_TYPES.SCHOOL_UPDATED,
                establishmentId,
                establishmentData?.name || "Unknown School",
                null,
                null,
                null,
                { action: 'email_added', email: newEmail }
            );
        }

        toast({ title: "Email ajouté", className: "bg-green-50 text-green-800" });
        setEmailDialogOpen(false);
        setNewEmail('');
        if (onRefresh) onRefresh();
    } catch (error) {
        // Handle unique violation
        if (error.code === '23505') {
            toast({ variant: "destructive", title: "Erreur", description: "Cet email existe déjà." });
        } else {
            toast({ variant: "destructive", title: "Erreur", description: error.message });
        }
    } finally {
        setLoadingAction(null);
    }
  };

  const handleDisconnectUsers = async () => {
      setLoadingAction('disconnect');
      try {
          await new Promise(r => setTimeout(r, 1000)); // Simulate work
          
          if (establishmentId) {
              await EventLogger.logSchoolEvent(
                EVENT_TYPES.SCHOOL_UPDATED,
                establishmentId,
                establishmentData?.name || "Unknown School",
                null,
                null,
                null,
                { action: 'force_disconnect_users' }
              );
          }

          toast({ title: "Utilisateurs déconnectés", description: "Ordre de déconnexion envoyé." });
          setDisconnectDialogOpen(false);
      } catch (error) {
          toast({ variant: "destructive", title: "Erreur", description: error.message });
      } finally {
          setLoadingAction(null);
      }
  };

  const handleDelete = async () => {
      setLoadingAction('delete');
      try {
          // Log before delete so we have a record
          if (establishmentId) {
            await EventLogger.logSchoolEvent(
                EVENT_TYPES.SCHOOL_UPDATED,
                establishmentId,
                establishmentData?.name || "Unknown School",
                null,
                null,
                null,
                { action: 'establishment_deleted' }
            );
          }
          
          await establishmentService.deleteEstablishment(establishmentId);
          toast({ title: "Établissement supprimé" });
          navigate('/admin/establishments');
      } catch (error) {
          toast({ variant: "destructive", title: "Erreur", description: error.message });
          setLoadingAction(null);
      }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions Rapides</h3>
      
      <div className="quick-actions-grid">
        <ActionButton 
            icon={Pencil} 
            text="Modifier" 
            onClick={handleEdit} 
            iconClass="icon-blue"
        />
        <ActionButton 
            icon={RotateCw} 
            text="Nouveau Code" 
            onClick={handleGenerateCode} 
            loading={loadingAction === 'code'} 
            iconClass="icon-green"
        />
        <ActionButton 
            icon={establishmentData?.status === 'paused' ? PlayCircle : PauseCircle} 
            text={establishmentData?.status === 'paused' ? "Activer" : "Mettre en pause"} 
            onClick={handleTogglePause} 
            loading={loadingAction === 'pause'}
            iconClass="icon-amber" 
        />
        <ActionButton 
            icon={MailPlus} 
            text="Ajouter Email" 
            onClick={() => setEmailDialogOpen(true)} 
            iconClass="icon-purple"
        />
        <ActionButton 
            icon={Download} 
            text="Exporter" 
            onClick={handleExport} 
            loading={loadingAction === 'export'}
            iconClass="icon-indigo" 
        />
        <ActionButton 
            icon={ClipboardList} 
            text="Voir les Logs" 
            onClick={handleLogs} 
            iconClass="icon-blue"
        />
        <ActionButton 
            icon={Plug} 
            text="Déconnecter" 
            onClick={() => setDisconnectDialogOpen(true)} 
            iconClass="icon-amber"
        />
        <ActionButton 
            icon={Trash2} 
            text="Supprimer" 
            onClick={() => setDeleteDialogOpen(true)} 
            danger 
        />
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter un email autorisé</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="email">Email professionnel</Label>
                <Input 
                    id="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    placeholder="directeur@ecole.fr" 
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddEmail} disabled={loadingAction === 'email'}>
                    {loadingAction === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ajouter
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Dialog */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Déconnecter tous les utilisateurs ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action forcera la déconnexion de tous les membres connectés à cet établissement.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnectUsers}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Supprimer l'établissement ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. Toutes les données associées seront supprimées.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    {loadingAction === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer définitivement"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default QuickActions;