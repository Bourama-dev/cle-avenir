import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Briefcase, Calendar } from 'lucide-react';

const ExperienceSection = ({ experience = [], onChange }) => {
  const handleAdd = () => {
    const newItem = { company: '', role: '', duration: '', description: '' };
    onChange([...experience, newItem]);
  };

  const handleRemove = (index) => {
    const newExp = [...experience];
    newExp.splice(index, 1);
    onChange(newExp);
  };

  const handleChange = (index, field, value) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange(newExp);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
           <Briefcase className="h-5 w-5 text-indigo-500" />
           Expériences Professionnelles
        </h3>
        <Button onClick={handleAdd} size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed text-slate-500">
          Aucune expérience renseignée.
        </div>
      )}

      {experience.map((item, index) => (
        <Card key={index} className="relative group">
           <Button 
             variant="ghost" 
             size="icon"
             className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={() => handleRemove(index)}
           >
             <Trash2 className="h-4 w-4" />
           </Button>
           <CardContent className="pt-6 grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Poste / Rôle</Label>
                 <Input 
                    value={item.role || ''} 
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    placeholder="Ex: Chef de projet"
                 />
              </div>
              <div className="space-y-2">
                 <Label>Entreprise</Label>
                 <Input 
                    value={item.company || ''} 
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    placeholder="Ex: Tech Solutions"
                 />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <Label>Période</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        className="pl-9"
                        value={item.duration || ''} 
                        onChange={(e) => handleChange(index, 'duration', e.target.value)}
                        placeholder="Ex: Jan 2021 - Aujourd'hui"
                    />
                 </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                 <Label>Description des missions</Label>
                 <Textarea 
                    value={item.description || ''} 
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="Décrivez vos responsabilités et réalisations..."
                    rows={3}
                 />
              </div>
           </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExperienceSection;