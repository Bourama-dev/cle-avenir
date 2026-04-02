import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { systemSettingsService } from '@/services/systemSettingsService';
import { applyTheme } from '@/utils/themeUtils';

const SystemSettingsContext = createContext();

const defaultSettings = {
  general: { 
    siteName: 'CléAvenir', 
    logo_url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png', 
    favicon_url: '/favicon.svg' 
  },
  theme: { mode: 'light' },
  maintenance: { enabled: false, message: 'Nous sommes actuellement en maintenance pour améliorer nos services.', eta: '' },
  colors: { primary: '#4f46e5', secondary: '#f3f4f6', accent: '#ec4899' },
  language: { default: 'fr' }
};

export const SystemSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await systemSettingsService.fetchSystemSettings();
      const mergedSettings = { ...defaultSettings };
      
      // Merge fetched data with defaults
      Object.keys(defaultSettings).forEach(key => {
        if (data[key]) {
          mergedSettings[key] = { ...defaultSettings[key], ...data[key] };
        }
      });
      
      setSettings(mergedSettings);
      
      // Apply theme and colors immediately
      applyTheme(mergedSettings.theme.mode, mergedSettings.colors);
      
      // Apply Document settings
      document.title = mergedSettings.general.siteName || 'CléAvenir';
      
      const faviconLink = document.querySelector("link[rel~='icon']");
      if (faviconLink && mergedSettings.general.favicon_url) {
        faviconLink.href = mergedSettings.general.favicon_url;
      }

    } catch (error) {
      console.error('Failed to load system settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    const subscription = systemSettingsService.subscribeToSettings(() => {
      // Reload on any change
      loadSettings();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSettings]);

  return (
    <SystemSettingsContext.Provider value={{ settings, loading, reloadSettings: loadSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};