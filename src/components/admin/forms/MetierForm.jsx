import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MetierForm({ initialData, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    libelle: '', rome_code: '', description: '', average_salary: 0, salary_min: 0, salary_max: 0, employment_rate: 0, market_demand: 'Moyennes'
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
  };
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast({ title: "Succès", description: "Le métier a été sauvegardé." });
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
          <Label>Titre du Métier</Label>
          <Input name="libelle" value={formData.libelle} onChange={handleChange} required />
        </div>
        <div>
          <Label>Code ROME</Label>
          <Input name="rome_code" value={formData.rome_code} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Salaire Min (€)</Label>
          <Input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} required />
        </div>
        <div>
          <Label>Salaire Moyen (€)</Label>
          <Input type="number" name="average_salary" value={formData.average_salary} onChange={handleChange} required />
        </div>
        <div>
          <Label>Salaire Max (€)</Label>
          <Input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Taux d'insertion (%)</Label>
          <Input type="number" name="employment_rate" value={formData.employment_rate} onChange={handleChange} required />
        </div>
        <div>
          <Label>Perspectives</Label>
          <Select value={formData.market_demand} onValueChange={(val) => handleSelectChange('market_demand', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Bonnes">Bonnes</SelectItem>
              <SelectItem value="Moyennes">Moyennes</SelectItem>
              <SelectItem value="Faibles">Faibles</SelectItem>
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