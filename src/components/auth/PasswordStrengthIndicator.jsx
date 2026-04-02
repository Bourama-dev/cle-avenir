import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: "Minimum 12 caractères", valid: password.length >= 12 },
    { label: "Au moins 1 majuscule", valid: /[A-Z]/.test(password) },
    { label: "Au moins 1 minuscule", valid: /[a-z]/.test(password) },
    { label: "Au moins 1 chiffre", valid: /[0-9]/.test(password) },
    { label: "Au moins 1 caractère spécial", valid: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password) },
  ];

  const allValid = checks.every(c => c.valid);

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in duration-300">
      <div className="space-y-1.5">
        {checks.map((check, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
              check.valid ? 'text-green-600 font-medium' : 'text-slate-400'
            }`}
          >
            {check.valid ? (
              <Check className="w-3 h-3 flex-shrink-0" />
            ) : (
              <X className="w-3 h-3 flex-shrink-0 text-red-400" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;