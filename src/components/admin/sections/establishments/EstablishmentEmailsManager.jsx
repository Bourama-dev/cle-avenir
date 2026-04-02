import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { EstablishmentActivationService } from '@/services/EstablishmentActivationService';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentEmailsManager = ({ emails = [], onChange, establishmentId }) => {
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleAddEmail = () => {
    setError('');
    const trimmed = newEmail.trim();
    
    if (!trimmed) return;
    
    if (!EstablishmentActivationService.validateEmailDomain(trimmed)) {
      setError('L\'email doit appartenir au domaine @ac-versailles.fr');
      return;
    }

    if (emails.some(e => e.email === trimmed)) {
      setError('Cet email est déjà ajouté.');
      return;
    }

    // Fixed: Include establishment_id if available to prevent FK violations during insert
    const newEmailObj = { 
      email: trimmed, 
      verified_at: null, 
      is_new: true 
    };

    if (establishmentId) {
      newEmailObj.establishment_id = establishmentId;
    }

    // Add to list
    const updatedEmails = [...emails, newEmailObj];
    onChange(updatedEmails);
    setNewEmail('');
    toast({ title: "Email ajouté", description: "N'oubliez pas d'enregistrer les modifications." });
  };

  const handleRemoveEmail = (emailToRemove) => {
    const updatedEmails = emails.filter(e => e.email !== emailToRemove);
    onChange(updatedEmails);
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-slate-50/50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" />
          Emails Autorisés ({emails.length})
        </h4>
        <Badge variant="outline" className="bg-white">ac-versailles.fr uniquement</Badge>
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="contact@ac-versailles.fr" 
          value={newEmail}
          onChange={(e) => { setNewEmail(e.target.value); setError(''); }}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
        <Button 
          type="button" 
          onClick={handleAddEmail}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}

      <div className="space-y-2 mt-2">
        {emails.length === 0 ? (
           <div className="text-center py-4 text-slate-400 text-sm italic border-2 border-dashed rounded-lg">
              Aucun email configuré
           </div>
        ) : (
          emails.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="text-xs font-bold">{item.email.substring(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.email}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {item.verified_at ? (
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Vérifié</span>
                    ) : (
                      <span className="text-amber-600">En attente</span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveEmail(item.email)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EstablishmentEmailsManager;