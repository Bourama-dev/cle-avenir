import React from 'react';
import { X, Target, Calendar } from 'lucide-react';
import DiplomaSearch from './DiplomaSearch';
import { formatDiplomaLevel } from '@/utils/diplomaUtils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const DiplomaGoals = ({ goals = [], onChange }) => {

  const handleAdd = (diploma) => {
    if (goals.some(g => g.id === diploma.id)) return;
    // Add with default target: 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    onChange([
      ...goals, 
      { 
        ...diploma, 
        targetDate: nextYear.toISOString().split('T')[0],
        priority: 'medium' 
      }
    ]);
  };

  const updateGoal = (id, field, value) => {
    onChange(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const removeGoal = (id) => {
    onChange(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Quels diplômes visez-vous ?</Label>
        <DiplomaSearch onSelect={handleAdd} placeholder="Ex: Master Marketing..." />
      </div>

      {goals.length > 0 && (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              className="p-3 bg-white border border-dashed border-purple-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <div>
                       <div className="font-medium text-sm text-slate-900">{goal.name}</div>
                       <div className="text-xs text-slate-500">{formatDiplomaLevel(goal.level)}</div>
                    </div>
                 </div>
                 <button onClick={() => removeGoal(goal.id)} className="text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500">Date cible</Label>
                    <div className="relative">
                       <Input 
                          type="date" 
                          value={goal.targetDate}
                          onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                          className="h-8 text-xs"
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500">Priorité</Label>
                    <Select 
                      value={goal.priority} 
                      onValueChange={(val) => updateGoal(goal.id, 'priority', val)}
                    >
                       <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiplomaGoals;