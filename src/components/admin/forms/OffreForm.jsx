import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function OffreForm({ initialData, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: '', company: '', location: '', description: '', salary_range: '', contract_type: 'CDI', is_active: true
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast({ title: "Succès", description: "L'offre a été sauvegardée." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Titre du poste</Label>
          <Input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <Label>Entreprise</Label>
          <Input name="company" value={formData.company} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label>Localisation</Label>
        <Input name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Salaire</Label>
          <Input name="salary_range" placeholder="ex: 35k - 45k €" value={formData.salary_range} onChange={handleChange} />
        </div>
        <div>
          <Label>Type de contrat</Label>
          <Select value={formData.contract_type} onValueChange={(val) => handleSelectChange('contract_type', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="Stage">Stage</SelectItem>
              <SelectItem value="Alternance">Alternance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Statut</Label>
          <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(val) => handleSelectChange('is_active', val === 'active')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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