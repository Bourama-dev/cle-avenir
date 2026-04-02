import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentTestResultsTab = ({ establishmentId }) => {
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await establishmentService.getEstablishmentTestResults(establishmentId);
        setResults(data);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger les résultats', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [establishmentId]);

  if (loading || !results) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analyse des tests d'orientation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Résultats par profil</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.byProfile}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tests complétés par classe</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.byClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstablishmentTestResultsTab;