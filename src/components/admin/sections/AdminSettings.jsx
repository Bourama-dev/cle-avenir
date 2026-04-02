import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Globe, Mail, Shield, CreditCard, Palette, ToggleLeft, Database, Lock } from 'lucide-react';
import { SettingsService, DEFAULT_SETTINGS } from '@/services/SettingsService';
import { SettingsValidator } from '@/services/SettingsValidator';
import { useSettingsNotifications } from './SettingsNotifications';
import SettingsPreview from './SettingsPreview';
import SettingsImportExport from './SettingsImportExport';
import AuthorizedEmails from './AuthorizedEmails'; // Import new component
import HelpButton from '@/components/ui/HelpButton';

const AdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { notifySuccess, notifyError } = useSettingsNotifications();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getSettings();
      setSettings(data);
    } catch (error) {
      notifyError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user types
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleFeatureToggle = (feature, enabled) => {
    setSettings(prev => ({
      ...prev,
      feature_toggles: {
        ...prev.feature_toggles,
        [feature]: enabled
      }
    }));
  };

  const saveSettings = async (category = null) => {
    setSaving(true);
    setErrors({});
    
    // Validate
    let validationErrors = {};
    if (category) {
       validationErrors = SettingsValidator.validate(category, settings);
    } else {
       // Validate all if global save
       ['general', 'email', 'security', 'payment'].forEach(cat => {
          validationErrors = { ...validationErrors, ...SettingsValidator.validate(cat, settings) };
       });
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      notifyError("Please fix validation errors.");
      return;
    }

    try {
      const result = await SettingsService.updateSettings(settings);
      if (result.success) {
        notifySuccess();
      } else {
        notifyError("Some settings failed to save.");
      }
    } catch (e) {
      notifyError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-slate-900">Paramètres Système</h2>
             <HelpButton section="SETTINGS" />
          </div>
          <p className="text-slate-500">Configuration globale de la plateforme</p>
        </div>
        <Button onClick={() => saveSettings()} disabled={saving} className="gap-2">
           {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
           Sauvegarder Tout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="access" className="w-full">
            <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0 mb-6">
              <TabsTrigger value="access" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Lock className="w-4 h-4"/> Accès & Whitelist
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Globe className="w-4 h-4"/> Général
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Mail className="w-4 h-4"/> Email
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Shield className="w-4 h-4"/> Sécurité
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <CreditCard className="w-4 h-4"/> Paiement
              </TabsTrigger>
              <TabsTrigger value="theme" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Palette className="w-4 h-4"/> Thème
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <ToggleLeft className="w-4 h-4"/> Features
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                <Database className="w-4 h-4"/> Avancé
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Access & Whitelist Tab - New! */}
              <TabsContent value="access" className="space-y-4 animate-in fade-in-50">
                 <AuthorizedEmails />
              </TabsContent>

              {/* General Tab */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Générales</CardTitle>
                    <CardDescription>Détails de base de votre application visible par les utilisateurs.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="site_name">Nom du Site</Label>
                      <Input 
                        id="site_name" 
                        value={settings.site_name} 
                        onChange={e => handleInputChange('site_name', e.target.value)}
                        className={errors.site_name ? "border-red-500" : ""}
                      />
                      {errors.site_name && <span className="text-xs text-red-500">{errors.site_name}</span>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="site_description">Description</Label>
                      <Textarea 
                        id="site_description" 
                        value={settings.site_description}
                        onChange={e => handleInputChange('site_description', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="logo_url">URL du Logo</Label>
                      <Input 
                        id="logo_url" 
                        value={settings.logo_url} 
                        onChange={e => handleInputChange('logo_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email">
                 <Card>
                  <CardHeader>
                    <CardTitle>Configuration SMTP</CardTitle>
                    <CardDescription>Paramètres pour l'envoi des emails transactionnels.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="grid gap-2">
                          <Label htmlFor="smtp_host">Hôte SMTP</Label>
                          <Input id="smtp_host" value={settings.smtp_host} onChange={e => handleInputChange('smtp_host', e.target.value)} />
                       </div>
                       <div className="grid gap-2">
                          <Label htmlFor="smtp_port">Port</Label>
                          <Input id="smtp_port" value={settings.smtp_port} onChange={e => handleInputChange('smtp_port', e.target.value)} />
                       </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="smtp_user">Utilisateur SMTP</Label>
                        <Input id="smtp_user" value={settings.smtp_user} onChange={e => handleInputChange('smtp_user', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="smtp_password">Mot de passe SMTP</Label>
                        <Input id="smtp_password" type="password" value={settings.smtp_password} onChange={e => handleInputChange('smtp_password', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="smtp_from">Email Expéditeur</Label>
                        <Input id="smtp_from" value={settings.smtp_from_email} onChange={e => handleInputChange('smtp_from_email', e.target.value)} />
                    </div>
                  </CardContent>
                 </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                 <Card>
                    <CardHeader><CardTitle>Politiques de Sécurité</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                <Label>Authentification à deux facteurs (2FA)</Label>
                                <p className="text-sm text-muted-foreground">Forcer la 2FA pour les administrateurs.</p>
                             </div>
                             <Switch 
                                checked={settings.two_factor_enabled} 
                                onCheckedChange={c => handleInputChange('two_factor_enabled', c)}
                             />
                          </div>
                          <Separator />
                          <div className="grid gap-2">
                             <Label>Longueur minimale mot de passe</Label>
                             <Input 
                                type="number" 
                                value={settings.password_min_length} 
                                onChange={e => handleInputChange('password_min_length', parseInt(e.target.value))} 
                                className="w-32"
                             />
                          </div>
                          <div className="flex items-center space-x-2">
                              <Switch 
                                 checked={settings.password_require_special_chars} 
                                 onCheckedChange={c => handleInputChange('password_require_special_chars', c)}
                              />
                              <Label>Exiger des caractères spéciaux</Label>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment">
                 <Card>
                    <CardHeader><CardTitle>Configuration Stripe</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid gap-2">
                          <Label>Clé Publique</Label>
                          <Input 
                             value={settings.stripe_public_key} 
                             onChange={e => handleInputChange('stripe_public_key', e.target.value)}
                             className={errors.stripe_public_key ? "border-red-500" : "font-mono text-sm"}
                          />
                          {errors.stripe_public_key && <span className="text-xs text-red-500">{errors.stripe_public_key}</span>}
                       </div>
                       <div className="grid gap-2">
                          <Label>Clé Secrète</Label>
                          <Input 
                             type="password"
                             value={settings.stripe_secret_key} 
                             onChange={e => handleInputChange('stripe_secret_key', e.target.value)}
                             className={errors.stripe_secret_key ? "border-red-500" : "font-mono text-sm"}
                          />
                       </div>
                       <div className="grid gap-2">
                          <Label>Devise</Label>
                          <Input value={settings.currency} onChange={e => handleInputChange('currency', e.target.value)} className="w-24" />
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              {/* Theme Tab */}
              <TabsContent value="theme">
                 <Card>
                    <CardHeader><CardTitle>Apparence & Branding</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                             <div className="grid gap-2">
                                <Label>Couleur Primaire</Label>
                                <div className="flex gap-2">
                                   <Input type="color" className="w-12 h-10 p-1" value={settings.theme_primary_color} onChange={e => handleInputChange('theme_primary_color', e.target.value)} />
                                   <Input value={settings.theme_primary_color} onChange={e => handleInputChange('theme_primary_color', e.target.value)} />
                                </div>
                             </div>
                             <div className="grid gap-2">
                                <Label>Police (Google Fonts)</Label>
                                <Input value={settings.theme_font_family} onChange={e => handleInputChange('theme_font_family', e.target.value)} />
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features">
                 <Card>
                    <CardHeader><CardTitle>Feature Toggles</CardTitle><CardDescription>Activer ou désactiver des modules de la plateforme.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                       {Object.entries(settings.feature_toggles || {}).map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="capitalize font-medium">{key.replace(/_/g, ' ')}</div>
                             <Switch checked={enabled} onCheckedChange={c => handleFeatureToggle(key, c)} />
                          </div>
                       ))}
                       {Object.keys(settings.feature_toggles || {}).length === 0 && <p className="text-slate-500 italic">Aucune feature flag définie.</p>}
                    </CardContent>
                 </Card>
              </TabsContent>

               {/* Advanced Tab */}
               <TabsContent value="advanced">
                 <Card>
                    <CardHeader><CardTitle>Zone de Danger</CardTitle></CardHeader>
                    <CardContent>
                        <SettingsImportExport currentSettings={settings} onSettingsChanged={loadSettings} />
                    </CardContent>
                 </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Sidebar Preview */}
        <div className="hidden lg:block lg:col-span-1">
           <div className="sticky top-6">
              <SettingsPreview settings={settings} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;