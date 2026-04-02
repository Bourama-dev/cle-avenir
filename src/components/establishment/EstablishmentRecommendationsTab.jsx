import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentRecommendationsTab = ({ establishmentId }) => {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await establishmentService.getEstablishmentRecommendations(establishmentId);
        setData(result);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger les recommandations', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [establishmentId]);

  if (loading || !data) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analyse des recommandations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top 5 des recommandations</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topCareers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recommandations par classe</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstablishmentRecommendationsTab;