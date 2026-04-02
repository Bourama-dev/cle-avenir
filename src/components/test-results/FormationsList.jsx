import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, GraduationCap, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const FormationsList = ({ romeCode }) => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('formations')
          .select('*')
          .eq('rome_code', romeCode)
          .limit(5);

        if (error) throw error;
        setFormations(data || []);
      } catch (err) {
        console.error('Error fetching formations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (romeCode) fetchFormations();
  }, [romeCode]);

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-slate-400"><Loader2 className="animate-spin h-6 w-6 mr-2" /> Chargement des formations...</div>;
  }

  if (formations.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-100">
        <GraduationCap className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Aucune formation spécifique trouvée pour ce métier dans notre base de données pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {formations.map((form) => (
        <Card key={form.id || form.name} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">{form.nom || form.name}</h4>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                {(form.niveau || form.level) && (
                  <span className="flex items-center"><GraduationCap className="h-3 w-3 mr-1" /> {form.niveau || form.level}</span>
                )}
                {(form.duree || form.duration) && (
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {form.duree || form.duration}</span>
                )}
                {form.type && (
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">{form.type}</Badge>
                )}
              </div>
            </div>
            {(form.lien || form.location) && (
              <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open(form.lien || '#', '_blank')}>
                Voir plus <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormationsList;