import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import SettingsSection from '@/components/dashboard/sections/SettingsSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const settingsSEO = categoryPageSEO({
    title: "Paramètres - CléAvenir",
    description: "Gérez les paramètres de votre compte, vos préférences et vos données personnelles.",
    keywords: "paramètres, compte, préférences, confidentialité",
    category: "Compte",
    categoryPath: "/settings"
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHelmet {...settingsSEO} />
      <Header onNavigate={(path) => navigate(path)} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-bold text-slate-900 mb-8"
        >
          Paramètres du compte
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <SettingsSection userProfile={userProfile || {}} />
        </motion.div>
      </main>
      
      <Footer onNavigate={(path) => navigate(path)} />
    </div>
  );
};

export default SettingsPage;