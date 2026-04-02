import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

import SignupProgressBar from '@/components/signup/SignupProgressBar';
import SignupStep1 from '@/components/signup/SignupStep1';
import SignupStep2 from '@/components/signup/SignupStep2';
import { useSignupForm } from '@/hooks/useSignupForm';
import { Button } from '@/components/ui/button';

const UnifiedSignupPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    currentStep,
    handleFieldChange,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    isLoading,
    successMessage,
    passwordStrength
  } = useSignupForm();

  // If success, show success screen
  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Inscription Réussie !</h2>
          <p className="text-slate-600 mb-8">
            Bienvenue sur CléAvenir. Votre compte a été créé avec succès. Vous allez être redirigé vers votre tableau de bord.
          </p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Accéder à mon espace
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-slate-100 py-12 px-4 flex flex-col items-center">
      
      {/* Header / Logo */}
      <div className="mb-8 text-center cursor-pointer" onClick={() => navigate('/')}>
         <img 
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png" 
            alt="CléAvenir" 
            className="h-12 w-12 mx-auto mb-3 object-contain"
         />
         <h1 className="text-2xl font-bold text-slate-800">CléAvenir</h1>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 w-full max-w-2xl relative overflow-hidden"
      >
        {/* Background Decorative Blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
           <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
             {currentStep === 1 ? "Créer un compte" : "Finaliser votre profil"}
           </h2>
           <p className="text-center text-slate-500 mb-8 text-sm">
             {currentStep === 1 ? "Rejoignez la communauté CléAvenir gratuitement." : "Dites-nous en plus pour personnaliser votre expérience."}
           </p>

           <SignupProgressBar currentStep={currentStep} />

           <AnimatePresence mode="wait">
             {currentStep === 1 && (
               <SignupStep1 
                 key="step1"
                 formData={formData}
                 handleFieldChange={handleFieldChange}
                 errors={errors}
                 onNext={handleNextStep}
                 passwordStrength={passwordStrength}
               />
             )}
             {currentStep === 2 && (
               <SignupStep2 
                 key="step2"
                 formData={formData}
                 handleFieldChange={handleFieldChange}
                 errors={errors}
                 onPrev={handlePrevStep}
                 onSubmit={handleSubmit}
                 isLoading={isLoading}
               />
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer Links */}
      <div className="mt-8 text-center text-xs text-slate-400">
         <p>
           Déjà un compte ? <span onClick={() => navigate('/login')} className="text-purple-600 font-semibold cursor-pointer hover:underline">Se connecter</span>
         </p>
         <div className="mt-4 space-x-4">
            <span className="hover:text-slate-600 cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-slate-600 cursor-pointer">Politique de confidentialité</span>
         </div>
      </div>
    </div>
  );
};

export default UnifiedSignupPage;