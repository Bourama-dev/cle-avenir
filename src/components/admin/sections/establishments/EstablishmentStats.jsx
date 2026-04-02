import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const EstablishmentStats = ({ stats, loading }) => {
  if (loading) {
    return (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {[1, 2, 3, 4].map(i => (
           <Skeleton key={i} className="h-32 rounded-xl" />
         ))}
       </div>
    );
  }

  const safeStats = stats || { total: 0, active: 0, inactive: 0 };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Établissements</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.total}</div>
          <p className="text-xs text-muted-foreground">Inscrits dans la base</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.active}</div>
          <p className="text-xs text-muted-foreground">Actuellement en service</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactifs / Archivés</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.inactive}</div>
          <p className="text-xs text-muted-foreground">Fermés ou supprimés</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Étudiants (Est.)</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Donnée non disponible</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstablishmentStats;