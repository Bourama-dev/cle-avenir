import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function FormationForm({ initialData, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    name: '', description: '', level: 'BAC', duration: '', type: 'Privée', provider: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast({ title: "Succès", description: "La formation a été sauvegardée." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Titre de la formation</Label>
        <Input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label>Organisme / École</Label>
        <Input name="provider" value={formData.provider} onChange={handleChange} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Niveau</Label>
          <Select value={formData.level} onValueChange={(val) => handleSelectChange('level', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BAC">BAC</SelectItem>
              <SelectItem value="BAC+1">BAC+1</SelectItem>
              <SelectItem value="BAC+2">BAC+2</SelectItem>
              <SelectItem value="BAC+3">BAC+3</SelectItem>
              <SelectItem value="BAC+4">BAC+4</SelectItem>
              <SelectItem value="BAC+5">BAC+5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Durée</Label>
          <Input name="duration" placeholder="ex: 1 an, 500 heures" value={formData.duration} onChange={handleChange} required />
        </div>
        <div>
          <Label>Type de reconnaissance</Label>
          <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="État">Reconnue par l'État (RNCP)</SelectItem>
              <SelectItem value="Privée">Privée / Certifiante</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Annuler</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
        </Button>
      </div>
    </form>
  );
}