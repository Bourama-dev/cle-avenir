import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const WelcomePage = ({ onNavigate, userProfile }) => {
  const firstName = userProfile?.first_name || 'nouvel utilisateur';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg text-center bg-card/80 backdrop-blur-lg rounded-2xl border border-border/50 shadow-2xl p-8 md:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-6">
          Bienvenue, {firstName} !
        </h1>
        
        <p className="text-muted-foreground mt-4 text-lg">
          Votre compte a été créé avec succès. Vous êtes prêt à construire votre avenir professionnel.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            onClick={() => onNavigate('/dashboard')} 
            className="mt-8 w-full md:w-auto"
            size="lg"
          >
            Aller à mon tableau de bord
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;