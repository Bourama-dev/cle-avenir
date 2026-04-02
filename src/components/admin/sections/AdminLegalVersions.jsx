import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLegalVersions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Versions Légales</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gestion des versions des documents légaux en construction.</p>
      </CardContent>
    </Card>
  );
};

export default AdminLegalVersions;