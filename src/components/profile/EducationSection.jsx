import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react';

const EducationSection = ({ education = [], onChange }) => {
  const handleAdd = () => {
    const newItem = { school: '', degree: '', year: '', description: '' };
    onChange([...education, newItem]);
  };

  const handleRemove = (index) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    onChange(newEducation);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange(newEducation);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
           <GraduationCap className="h-5 w-5 text-indigo-500" />
           Diplômes & Formations
        </h3>
        <Button onClick={handleAdd} size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed text-slate-500">
          Aucune formation renseignée.
        </div>
      )}

      {education.map((item, index) => (
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
                 <Label>École / Organisme</Label>
                 <Input 
                    value={item.school || ''} 
                    onChange={(e) => handleChange(index, 'school', e.target.value)}
                    placeholder="Ex: Université de Lyon"
                 />
              </div>
              <div className="space-y-2">
                 <Label>Diplôme / Intitulé</Label>
                 <Input 
                    value={item.degree || ''} 
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    placeholder="Ex: Master Marketing"
                 />
              </div>
              <div className="space-y-2">
                 <Label>Année / Période</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        className="pl-9"
                        value={item.year || ''} 
                        onChange={(e) => handleChange(index, 'year', e.target.value)}
                        placeholder="Ex: 2020 - 2022"
                    />
                 </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                 <Label>Description (optionnel)</Label>
                 <Input 
                    value={item.description || ''} 
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="Spécialité, mention, sujets clés..."
                 />
              </div>
           </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EducationSection;