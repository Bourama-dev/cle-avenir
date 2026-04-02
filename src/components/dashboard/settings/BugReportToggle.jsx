import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bug, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BugReportToggle = () => {
  const { showBugReportButton, toggleBugReportButton } = useAuth();

  const handleToggle = (checked) => {
    toggleBugReportButton(checked);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${showBugReportButton ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
          <Bug className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="bug-toggle" className="text-base font-medium text-slate-900 cursor-pointer">
            Afficher le bouton "Signaler un bug"
          </Label>
          <p className="text-sm text-slate-500 max-w-[300px] md:max-w-md">
            Activez cette option pour voir le bouton flottant permettant de nous signaler rapidement des problèmes.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${showBugReportButton ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {showBugReportButton ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {showBugReportButton ? 'Visible' : 'Masqué'}
            </span>
          </div>
        </div>
      </div>
      <Switch 
        id="bug-toggle" 
        checked={showBugReportButton}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-purple-600"
      />
    </div>
  );
};

export default BugReportToggle;