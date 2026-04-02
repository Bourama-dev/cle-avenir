import React from 'react';
import { cn } from '@/lib/utils';
import { authStyles } from '@/styles/authStyles';

const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex w-full border-b border-slate-100">
      <button
        type="button"
        onClick={() => onTabChange('login')}
        className={cn(
          "flex-1 py-4 text-sm font-medium text-center transition-all relative",
          activeTab === 'login' 
            ? "text-purple-600 bg-purple-50/50" // Adjusted for light background
            : "text-slate-700 hover:text-purple-600 hover:bg-slate-50" // Adjusted for light background
        )}
      >
        Se connecter
        {activeTab === 'login' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full mx-auto w-full" />
        )}
      </button>
      
      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={cn(
          "flex-1 py-4 text-sm font-medium text-center transition-all relative",
          activeTab === 'signup' 
            ? "text-purple-600 bg-purple-50/50" // Adjusted for light background
            : "text-slate-700 hover:text-purple-600 hover:bg-slate-50" // Adjusted for light background
        )}
      >
        Créer un compte
        {activeTab === 'signup' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full mx-auto w-full" />
        )}
      </button>
    </div>
  );
};

export default AuthTabs;