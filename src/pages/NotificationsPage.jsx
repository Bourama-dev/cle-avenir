import React from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';

const NotificationsPage = () => {
  const notificationsSEO = categoryPageSEO({
    title: "Centre de notifications - CléAvenir",
    description: "Gérez vos alertes et préférences de communication pour rester informé.",
    keywords: "notifications, alertes, préférences, communication",
    category: "Compte",
    categoryPath: "/notifications"
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <PageHelmet {...notificationsSEO} />
      <NotificationCenter />
    </div>
  );
};

export default NotificationsPage;