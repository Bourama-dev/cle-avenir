import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Download, Trash2, Eye } from 'lucide-react';

const PrivacyDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestion de la Confidentialité</h1>
        <p className="text-slate-600">Gérez vos données personnelles et vos préférences de confidentialité.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Préférences de Consentement</CardTitle>
            <CardDescription>Choisissez quelles données nous pouvons collecter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">Cookies Essentiels</div>
                <div className="text-sm text-slate-500">Nécessaires au fonctionnement du site.</div>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">Analytique</div>
                <div className="text-sm text-slate-500">Nous aide à améliorer nos services.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">Marketing</div>
                <div className="text-sm text-slate-500">Pour des offres personnalisées.</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vos Données</CardTitle>
            <CardDescription>Accédez à vos données ou demandez leur suppression.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                   <Download className="mr-2 h-4 w-4" /> Exporter mes données (JSON)
                </Button>
                <Button variant="outline" className="flex-1">
                   <Eye className="mr-2 h-4 w-4" /> Voir mon profil public
                </Button>
             </div>
             <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full sm:w-auto">
                   <Trash2 className="mr-2 h-4 w-4" /> Supprimer mon compte
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                   Attention : cette action est irréversible. Toutes vos données seront effacées sous 30 jours.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyDashboard;