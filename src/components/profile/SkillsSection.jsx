import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, X, Plus } from 'lucide-react';

const SkillsSection = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onChange([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-4 animate-in fade-in">
       <div className="flex items-center gap-2 mb-2">
           <Zap className="h-5 w-5 text-indigo-500" />
           <h3 className="text-lg font-medium">Compétences</h3>
       </div>
       
       <div className="flex gap-2">
          <Input 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Ajouter une compétence (ex: React, Gestion de projet...)"
             className="max-w-md"
          />
          <Button onClick={handleAdd} variant="secondary">
             <Plus className="h-4 w-4" />
          </Button>
       </div>

       <div className="flex flex-wrap gap-2 min-h-[50px] bg-slate-50 p-4 rounded-lg border border-slate-100">
          {skills.length === 0 && <span className="text-slate-400 text-sm">Aucune compétence ajoutée.</span>}
          {skills.map((skill, index) => (
             <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
                {skill}
                <button onClick={() => handleRemove(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                   <X className="h-3 w-3" />
                </button>
             </Badge>
          ))}
       </div>
    </div>
  );
};

export default SkillsSection;