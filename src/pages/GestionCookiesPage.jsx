import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const GestionCookiesPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Préférences enregistrées",
      description: "Vos choix en matière de cookies ont été mis à jour.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet>
        <title>Gestion des Cookies - CléAvenir</title>
      </Helmet>

      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Gestion des Cookies</h1>
        <p className="text-slate-600 mb-8">
          Nous utilisons des cookies pour optimiser votre expérience sur CléAvenir. Vous pouvez choisir d'activer ou de désactiver certaines catégories de cookies ci-dessous.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Cookies Essentiels</CardTitle>
                <CardDescription>Nécessaires au fonctionnement du site.</CardDescription>
              </div>
              <Switch checked={true} disabled />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Ces cookies sont indispensables pour vous permettre de naviguer sur le site et d'utiliser ses fonctionnalités (connexion, sécurité, mémorisation de votre panier). Ils ne peuvent pas être désactivés.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Cookies Analytiques</CardTitle>
                <CardDescription>Pour améliorer nos services.</CardDescription>
              </div>
              <Switch defaultChecked={true} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Ces cookies nous permettent de mesurer l'audience du site, de comprendre comment les visiteurs l'utilisent et de détecter d'éventuels problèmes de navigation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Cookies Marketing</CardTitle>
                <CardDescription>Pour des publicités pertinentes.</CardDescription>
              </div>
              <Switch defaultChecked={false} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Ces cookies sont utilisés pour vous présenter des publicités adaptées à vos centres d'intérêt sur d'autres sites.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
              Enregistrer mes préférences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionCookiesPage;