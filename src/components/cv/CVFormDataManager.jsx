import React, { useState, useEffect } from 'react';
import { cvFormDataService } from '@/services/cvFormDataService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const CVFormDataManager = ({ children, cvId, onDataLoaded, onSaveComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (user && !cvId) {
        setLoading(true);
        const response = await cvFormDataService.fetchUserData(user.id);
        
        if (!isMounted) return;
        
        if (response.success) {
          if (response.data) {
            onDataLoaded(response.data);
          }
        } else {
          toast({ 
            variant: "destructive", 
            title: "Erreur de chargement", 
            description: response.error || "Impossible de charger les données de profil." 
          });
        }
        setLoading(false);
      } else {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [user, cvId]);

  const saveForm = async (formData, templateId) => {
    if (!user) return;
    setSaving(true);
    
    const response = await cvFormDataService.saveUserData(user.id, formData, cvId, templateId);
    
    if (response.success && response.data) {
      toast({ title: "CV sauvegardé avec succès" });
      if (onSaveComplete) onSaveComplete(response.data.id);
    } else {
      toast({ 
        variant: "destructive", 
        title: "Erreur lors de la sauvegarde", 
        description: response.error || "Une erreur inattendue s'est produite."
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm font-medium">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  return children({ saveForm, saving });
};