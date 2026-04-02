import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RefreshCw } from 'lucide-react';
import { SettingsService } from '@/services/SettingsService';
import { useSettingsNotifications } from './SettingsNotifications';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsImportExport = ({ currentSettings, onSettingsChanged }) => {
  const fileInputRef = useRef(null);
  const { notifySuccess, notifyError, notifyInfo } = useSettingsNotifications();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentSettings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `settings_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    notifyInfo("Settings exported successfully.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const result = await SettingsService.importSettings(json);
        if (result.success) {
          notifySuccess("Settings imported successfully. Reloading...");
          if (onSettingsChanged) onSettingsChanged();
        } else {
          notifyError("Import failed: " + result.errors.join(', '));
        }
      } catch (err) {
        notifyError("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = null;
  };

  const handleReset = async () => {
    try {
      const result = await SettingsService.resetToDefaults();
      if (result.success) {
        notifySuccess("Settings reset to defaults.");
        if (onSettingsChanged) onSettingsChanged();
      } else {
        notifyError("Reset failed.");
      }
    } catch (e) {
      notifyError(e.message);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-slate-200">
       <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept=".json"
       />

       <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" /> Exporter Configuration
       </Button>

       <Button variant="outline" onClick={handleImportClick} className="gap-2">
          <Upload className="w-4 h-4" /> Importer Configuration
       </Button>

       <div className="flex-1"></div>

       <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="destructive" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Réinitialiser par défaut
             </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
             <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                   Cette action réinitialisera tous les paramètres du système à leurs valeurs par défaut. 
                   Cette action est irréversible.
                </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">Réinitialiser</AlertDialogAction>
             </AlertDialogFooter>
          </AlertDialogContent>
       </AlertDialog>
    </div>
  );
};

export default SettingsImportExport;