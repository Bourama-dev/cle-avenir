import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

// Replaces the old EstablishmentPasswordManager (admin-generated password
// stored on the establishment record, never actually verified by any login
// flow). Staff now get a real Supabase Auth account via invitation email,
// created by the create-establishment-staff edge function.
const EstablishmentStaffInvite = ({ establishmentId, disabled }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!establishmentId) {
      toast({
        variant: "destructive",
        title: "Établissement non enregistré",
        description: "Enregistrez d'abord l'établissement avant d'inviter du staff.",
      });
      return;
    }
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Email requis" });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-establishment-staff', {
        body: { establishment_id: establishmentId, email: email.trim(), role },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Échec de l'invitation");
      }

      toast({
        title: "Invitation envoyée",
        description: `${email} recevra un email pour créer son mot de passe.`,
        className: "bg-green-50 border-green-200",
      });
      setEmail('');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur d'invitation",
        description: err.message,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-xl bg-slate-50/50">
      <Label className="flex items-center gap-2 text-slate-900 font-medium">
        <UserPlus className="w-4 h-4 text-slate-500" />
        Inviter un membre du staff
      </Label>
      <p className="text-sm text-slate-500">
        La personne recevra un email pour créer son propre mot de passe et se connecter avec son compte.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="email"
            placeholder="prenom.nom@etablissement.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled || sending}
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole} disabled={disabled || sending}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="teacher">Enseignant</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleInvite} disabled={disabled || sending || !establishmentId}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Inviter'}
        </Button>
      </div>
      {!establishmentId && (
        <p className="text-xs text-amber-600">Enregistrez l'établissement avant de pouvoir inviter du staff.</p>
      )}
    </div>
  );
};

export default EstablishmentStaffInvite;
