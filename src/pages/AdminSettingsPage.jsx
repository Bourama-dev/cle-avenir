import React, { useState, useEffect } from 'react';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { systemSettingsService } from '@/services/systemSettingsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import AdminSidebar from '@/components/admin/AdminSidebar';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import ThemeSettings from '@/components/admin/settings/ThemeSettings';
import MaintenanceSettings from '@/components/admin/settings/MaintenanceSettings';
import ColorSettings from '@/components/admin/settings/ColorSettings';
import LanguageSettings from '@/components/admin/settings/LanguageSettings';

export default function AdminSettingsPage() {
  const { settings: globalSettings, loading: contextLoading } = useSystemSettings();
  const [localSettings, setLocalSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (globalSettings && !localSettings) {
      setLocalSettings(JSON.parse(JSON.stringify(globalSettings)));
    }
  }, [globalSettings]);

  const handleSettingChange = (category, updatedValues) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: updatedValues
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await systemSettingsService.updateSystemSettings(localSettings);
      toast({
        title: "Paramètres sauvegardés",
        description: "Les modifications ont été appliquées avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (contextLoading || !localSettings) {
    return (
      <div className="admin-layout flex min-h-screen bg-[var(--bg-secondary)] flex-col md:flex-row">
        <AdminSidebar currentPath="/admin/settings" />
        <div className="admin-content flex-1 flex items-center justify-center p-12 w-full pt-16 md:pt-0">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout flex min-h-screen bg-[var(--bg-secondary)] w-full flex-col md:flex-row overflow-hidden">
      <AdminSidebar currentPath="/admin/settings" />
      
      {/* Main Content Area - with mobile header padding compensation */}
      <div className="admin-content flex-1 w-full min-w-0 overflow-x-hidden pt-16 md:pt-0 pb-12">
        <div className="container-responsive py-6 md:py-8 w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 md:pb-6 bg-[var(--bg-secondary)] sticky top-16 md:top-0 z-10 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] truncate">Paramètres du Système</h1>
              <p className="text-sm md:text-base text-[var(--text-secondary)] mt-1 truncate">Gérez la configuration globale de l'application.</p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-medium shrink-0 shadow-sm"
            >
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />}
              <span>Sauvegarder</span>
            </Button>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <div className="w-full overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="flex md:grid md:grid-cols-5 h-auto bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm min-w-max md:min-w-0">
                <TabsTrigger value="general" className="data-[state=active]:bg-[var(--bg-secondary)]">Général</TabsTrigger>
                <TabsTrigger value="theme" className="data-[state=active]:bg-[var(--bg-secondary)]">Thème</TabsTrigger>
                <TabsTrigger value="colors" className="data-[state=active]:bg-[var(--bg-secondary)]">Couleurs</TabsTrigger>
                <TabsTrigger value="language" className="data-[state=active]:bg-[var(--bg-secondary)]">Langue</TabsTrigger>
                <TabsTrigger value="maintenance" className="data-[state=active]:bg-[var(--bg-secondary)]">Maintenance</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-6 lg:p-8 rounded-xl border border-[var(--border-color)] shadow-sm w-full mt-2 md:mt-6 overflow-hidden">
              <TabsContent value="general" className="m-0 focus-visible:outline-none w-full">
                <GeneralSettings settings={localSettings.general || {}} onChange={handleSettingChange} />
              </TabsContent>
              <TabsContent value="theme" className="m-0 focus-visible:outline-none w-full">
                <ThemeSettings settings={localSettings.theme || {}} onChange={handleSettingChange} />
              </TabsContent>
              <TabsContent value="colors" className="m-0 focus-visible:outline-none w-full">
                <ColorSettings settings={localSettings.colors || {}} onChange={handleSettingChange} />
              </TabsContent>
              <TabsContent value="language" className="m-0 focus-visible:outline-none w-full">
                <LanguageSettings settings={localSettings.language || {}} onChange={handleSettingChange} />
              </TabsContent>
              <TabsContent value="maintenance" className="m-0 focus-visible:outline-none w-full">
                <MaintenanceSettings settings={localSettings.maintenance || {}} onChange={handleSettingChange} />
              </TabsContent>
            </div>
          </Tabs>

        </div>
      </div>
    </div>
  );
}