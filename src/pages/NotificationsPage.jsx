import React from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import SEOHead from '@/components/SEOHead';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <SEOHead 
        title="Centre de notifications - CléAvenir"
        description="Gérez vos alertes et préférences de communication."
      />
      <NotificationCenter />
    </div>
  );
};

export default NotificationsPage;