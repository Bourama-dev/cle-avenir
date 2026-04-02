import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

const RGPDPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    data_consent: false,
    marketing_consent: false,
    analytics_consent: false,
    third_party_sharing: false
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('data_consent, marketing_consent, privacy_settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setPreferences({
        data_consent: data?.data_consent || false,
        marketing_consent: data?.marketing_consent || false,
        analytics_consent: data?.privacy_settings?.analytics_consent || false,
        third_party_sharing: data?.privacy_settings?.third_party_sharing || false
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          data_consent: preferences.data_consent,
          marketing_consent: preferences.marketing_consent,
          privacy_settings: {
            analytics_consent: preferences.analytics_consent,
            third_party_sharing: preferences.third_party_sharing,
            last_updated: new Date().toISOString()
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      // Log consent change if needed
      await supabase.from('consent_logs').insert({
        user_id: user.id,
        consent_type: 'rgpd_preferences_update',
        agreed: true,
        preferences: preferences,
        created_at: new Date().toISOString()
      });

      toast({
        title: "Préférences mises à jour",
        description: "Vos choix de confidentialité ont été enregistrés avec succès.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
        <div className="space-y-1">
          <h4 className="font-medium text-slate-900">Consentement au traitement des données</h4>
          <p className="text-sm text-slate-500">Autoriser CléAvenir à traiter mes données pour le service.</p>
        </div>
        <Switch 
          checked={preferences.data_consent} 
          onCheckedChange={() => handleToggle('data_consent')} 
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
        <div className="space-y-1">
          <h4 className="font-medium text-slate-900">Communications marketing</h4>
          <p className="text-sm text-slate-500">Recevoir des offres et actualités par email.</p>
        </div>
        <Switch 
          checked={preferences.marketing_consent} 
          onCheckedChange={() => handleToggle('marketing_consent')} 
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
        <div className="space-y-1">
          <h4 className="font-medium text-slate-900">Analytique produit</h4>
          <p className="text-sm text-slate-500">Autoriser l'analyse de mon utilisation pour améliorer le service.</p>
        </div>
        <Switch 
          checked={preferences.analytics_consent} 
          onCheckedChange={() => handleToggle('analytics_consent')} 
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
        <div className="space-y-1">
          <h4 className="font-medium text-slate-900">Partage partenaires</h4>
          <p className="text-sm text-slate-500">Partager mes résultats avec les établissements partenaires.</p>
        </div>
        <Switch 
          checked={preferences.third_party_sharing} 
          onCheckedChange={() => handleToggle('third_party_sharing')} 
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default RGPDPreferences;