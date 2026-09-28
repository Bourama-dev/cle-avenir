import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Lets a student join (or leave) their school's space with the establishment
 * code. The database resolves the code into profiles.establishment_id; the
 * school then sees the student's orientation progress in its dashboard.
 */
const EstablishmentLinkCard = ({ userId }) => {
  const { toast } = useToast();
  const [linked, setLinked] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('profiles')
      .select('establishment_id, institution_name')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setLinked(data?.establishment_id ? { name: data.institution_name } : null);
        setLoading(false);
      });
  }, [userId]);

  const saveCode = async (value) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ institution_code: value })
        .eq('id', userId)
        .select('establishment_id, institution_name')
        .single();
      if (error) throw error;

      if (value && !data.establishment_id) {
        toast({ variant: 'destructive', title: 'Code inconnu', description: "Vérifie le code transmis par ton établissement." });
        return;
      }
      setLinked(data.establishment_id ? { name: data.institution_name } : null);
      setCode('');
      toast({
        title: data.establishment_id ? 'Établissement rattaché' : 'Rattachement supprimé',
        description: data.establishment_id
          ? `${data.institution_name} peut maintenant suivre ta progression d'orientation.`
          : "Ton établissement n'a plus accès à ta progression.",
      });
    } catch (err) {
      console.error('Establishment link error:', err);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer. Réessaie dans un instant." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-slate-500" /> Mon établissement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        ) : linked ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{linked.name}</p>
              <p className="text-sm text-slate-500">
                Ton établissement voit ton nom, ton email, ton niveau et les résultats de tes tests d'orientation.
              </p>
            </div>
            <Button variant="outline" onClick={() => saveCode(null)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Me détacher'}
            </Button>
          </div>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) saveCode(code.trim().toUpperCase());
            }}
          >
            <p className="text-sm text-slate-500">
              Ton lycée ou ton école utilise CléAvenir ? Saisis le code qu'il t'a transmis pour qu'il puisse
              t'accompagner dans ton orientation.
            </p>
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code établissement"
                maxLength={20}
                className="uppercase"
                aria-label="Code établissement"
              />
              <Button type="submit" disabled={saving || !code.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default EstablishmentLinkCard;
