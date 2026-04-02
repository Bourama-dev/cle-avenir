import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BugReportToggle from '@/components/dashboard/settings/BugReportToggle';

const SettingsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Paramètres</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Préférences de l'interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <BugReportToggle />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-slate-500">Gérez vos préférences de notification dans la section "Mon Compte".</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;