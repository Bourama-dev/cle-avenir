import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { EventLogger } from '@/services/eventLoggerService';
import { EVENT_TYPES } from '@/constants/eventTypes';
import '@/styles/AuthorizedEmails.css';

const AuthorizedEmails = ({ establishmentId }) => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (establishmentId) {
      fetchEmails();
    }
  }, [establishmentId]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .eq('establishment_id', establishmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching authorized emails:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des emails autorisés."
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    // 1. Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Format d'email invalide." };
    }
    
    // 2. Duplication check
    if (emails.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      return { isValid: false, message: "Cet email est déjà autorisé." };
    }

    return { isValid: true };
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    const trimmedEmail = newEmail.trim().toLowerCase();
    
    // Validate
    const validation = validateEmail(trimmedEmail);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Email invalide",
        description: validation.message
      });
      return;
    }

    try {
      setAdding(true);
      
      const { data, error } = await supabase
        .from('authorized_emails')
        .insert([{
          establishment_id: establishmentId,
          email: trimmedEmail,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setEmails([data, ...emails]);
      setNewEmail('');
      
      if (establishmentId) {
          // Log event
          await EventLogger.logSchoolEvent(
            EVENT_TYPES.SCHOOL_UPDATED,
            establishmentId,
            "Unknown School Name", 
            null, null, null,
            { 
              action: 'email_added', 
              email_added: trimmedEmail 
            }
          );
      }

      toast({
        title: "Email ajouté",
        description: `${trimmedEmail} a été ajouté aux emails autorisés.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

    } catch (error) {
      console.error('Error adding email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter cet email."
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveEmail = async (id, emailToRemove) => {
    try {
      const { error } = await supabase
        .from('authorized_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmails(emails.filter(e => e.id !== id));

      if (establishmentId) {
          // Log event
          await EventLogger.logSchoolEvent(
            EVENT_TYPES.SCHOOL_UPDATED,
            establishmentId,
            "Unknown School Name",
            null, null, null,
            { 
              action: 'email_removed', 
              email_removed: emailToRemove 
            }
          );
      }

      toast({
        title: "Email supprimé",
        description: "L'autorisation a été révoquée avec succès."
      });

    } catch (error) {
      console.error('Error removing email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet email."
      });
    }
  };

  return (
    <Card className="authorized-emails-card border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            Emails Autorisés ({emails.length})
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
            <ShieldCheck className="w-3 h-3" />
            Tous les domaines acceptés
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-slate-600 mb-4 -mt-2">
          Configurez les adresses emails autorisées pour accéder à l'interface de cet établissement.
        </p>
        <form onSubmit={handleAddEmail} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              placeholder="enseignant@ecole.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500"
              disabled={adding || loading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!newEmail || adding || loading}
            className="ae-add-btn bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Ajouter</>}
          </Button>
        </form>

        <div className="ae-list-container space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center py-8 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : emails.length > 0 ? (
            emails.map((item) => (
              <div 
                key={item.id} 
                className="ae-list-item group flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200"
              >
                <span className="text-sm font-medium text-slate-700 font-mono">
                  {item.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEmail(item.id, item.email)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Révoquer l'accès"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="ae-empty-state text-center py-8 px-4 rounded-lg border border-dashed border-slate-200 bg-slate-50">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">Aucun email configuré</p>
              <p className="text-xs text-slate-400 mt-1">Ajoutez les adresses email des enseignants autorisés à rejoindre cet établissement.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedEmails;