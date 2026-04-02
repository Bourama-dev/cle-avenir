import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react'; // Import the Home icon
import { authStyles } from '@/styles/authStyles';

const AuthLayout = ({ children, title = "CléAvenir", subtitle = "Votre futur professionnel commence ici." }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative bg-gray-50 transition-colors duration-300" // Changed background to light
    >
      {/* Overlay - removed dark gradient, as a light background is requested */}
      {/* Home Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link 
          to="/" 
          aria-label="Retour à l'accueil"
          className="p-2 rounded-full bg-slate-100/70 text-slate-800 hover:bg-slate-200/80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-all duration-200" // Adjusted colors for light background
        >
          <Home className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
             <div className="h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
               <img 
                 src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png" 
                 alt="Logo" 
                 className="h-8 w-8 object-contain" 
               />
             </div>
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight drop-shadow-sm">{title}</h1> {/* Changed text color to dark */}
           <p className="text-slate-600 mt-2 font-medium drop-shadow-sm">{subtitle}</p> {/* Changed text color to dark */}
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-slate-200"> {/* Adjusted border for consistency */}
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-600 space-x-4"> {/* Changed text color to dark */}
          <Link to="/legal?tab=terms" className="hover:text-purple-600 transition-colors">Conditions d'utilisation</Link>
          <span>•</span>
          <Link to="/legal?tab=privacy" className="hover:text-purple-600 transition-colors">Politique de confidentialité</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;