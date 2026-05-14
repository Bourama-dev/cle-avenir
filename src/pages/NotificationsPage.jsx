import React from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NotificationCenter />
      </motion.div>
    </div>
  );
};

export default NotificationsPage;