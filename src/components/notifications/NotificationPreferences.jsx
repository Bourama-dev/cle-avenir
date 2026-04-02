import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Bell, Mail, Smartphone, Save } from 'lucide-react';

const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    email_notifications: true,
    push_notifications: false,
    in_app_notifications: true,
    notify_test_completed: true,
    notify_plan_created: true,
    notify_milestone_completed: true,
    notify_job_offer: true,
    notify_formation_available: true,
    notify_feedback_received: true,
    notification_frequency: 'immediate'
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    setLoading(true);
    const res = await notificationService.getNotificationPreferences(user.id);
    if (res.success && res.data) {
      setPrefs(res.data);
    }
    setLoading(false);
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await notificationService.updateNotificationPreferences(user.id, prefs);
    if (res.success) {
      toast({ title: "Préférences enregistrées", description: "Vos paramètres de notification ont été mis à jour." });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer vos préférences." });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Canaux de communication
          </CardTitle>
          <CardDescription>Où souhaitez-vous recevoir nos alertes ?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> Email</Label>
              <p className="text-sm text-slate-500">Recevez un résumé par courrier électronique.</p>
            </div>
            <Switch checked={prefs.email_notifications} onCheckedChange={() => handleToggle('email_notifications')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2"><Smartphone className="w-4 h-4 text-slate-500" /> Notifications Push</Label>
              <p className="text-sm text-slate-500">Alertes directes sur votre appareil.</p>
            </div>
            <Switch checked={prefs.push_notifications} onCheckedChange={() => handleToggle('push_notifications')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-slate-500" /> In-App</Label>
              <p className="text-sm text-slate-500">Alertes dans le centre de notifications de la plateforme.</p>
            </div>
            <Switch checked={prefs.in_app_notifications} onCheckedChange={() => handleToggle('in_app_notifications')} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Types de notifications</CardTitle>
          <CardDescription>Quels événements doivent déclencher une alerte ?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'notify_test_completed', label: 'Tests complétés' },
            { key: 'notify_plan_created', label: 'Création de plan personnalisé' },
            { key: 'notify_milestone_completed', label: 'Étapes de plan franchies' },
            { key: 'notify_job_offer', label: 'Nouvelles offres d\'emploi pertinentes' },
            { key: 'notify_formation_available', label: 'Nouvelles formations suggérées' },
            { key: 'notify_feedback_received', label: 'Retours ou messages système' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">{item.label}</Label>
              <Switch checked={prefs[item.key]} onCheckedChange={() => handleToggle(item.key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Fréquence des Emails</CardTitle>
          <CardDescription>À quelle fréquence souhaitez-vous être contacté ?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={prefs.notification_frequency} 
            onValueChange={(val) => setPrefs(prev => ({ ...prev, notification_frequency: val }))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="immediate" id="freq-imm" />
              <Label htmlFor="freq-imm" className="cursor-pointer">Immédiatement (dès l'événement)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="daily" id="freq-daily" />
              <Label htmlFor="freq-daily" className="cursor-pointer">Résumé quotidien</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="weekly" id="freq-weekly" />
              <Label htmlFor="freq-weekly" className="cursor-pointer">Résumé hebdomadaire</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer mes préférences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;