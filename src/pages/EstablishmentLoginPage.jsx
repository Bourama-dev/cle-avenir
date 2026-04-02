import React from 'react';
import { Helmet } from 'react-helmet';
import EstablishmentLoginForm from '@/components/establishment/EstablishmentLoginForm';
import { motion } from 'framer-motion';

const EstablishmentLoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Connexion Établissement | CléAvenir</title>
        <meta name="description" content="Portail de connexion pour les établissements scolaires et partenaires." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
        >
          <EstablishmentLoginForm />
        </motion.div>
      </div>
    </>
  );
};

export default EstablishmentLoginPage;