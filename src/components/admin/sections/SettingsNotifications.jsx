import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useSettingsNotifications = () => {
  const { toast } = useToast();

  const notifySuccess = (message = "Settings saved successfully") => {
    toast({
      title: "Succès",
      description: message,
      className: "bg-green-50 border-green-200 text-green-900",
      duration: 3000,
    });
  };

  const notifyError = (error = "An error occurred") => {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error,
      duration: 5000,
    });
  };

  const notifyInfo = (message) => {
    toast({
      title: "Information",
      description: message,
      className: "bg-blue-50 border-blue-200 text-blue-900",
    });
  };

  return { notifySuccess, notifyError, notifyInfo };
};

// Return empty component if used in JSX
const SettingsNotifications = () => null;
export default SettingsNotifications;