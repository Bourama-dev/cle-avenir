import React from 'react';
import { Helmet } from 'react-helmet-async';
import PrivacyDashboard from '@/pages/PrivacyDashboard';

const PreferencesRGPDPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Mes Préférences RGPD - CléAvenir</title>
        <meta name="description" content="Gérez vos données personnelles, exportez vos informations et contrôlez vos consentements." />
      </Helmet>
      
      <div className="pt-8">
         <PrivacyDashboard />
      </div>
    </div>
  );
};

export default PreferencesRGPDPage;