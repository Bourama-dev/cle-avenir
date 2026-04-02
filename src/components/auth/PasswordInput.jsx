import React, { useState } from 'react';
import FormInput from './FormInput';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length > 6) score += 1;
    if (pwd.length > 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    if (props.onChange) props.onChange(e);
    setStrength(calculateStrength(val));
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="space-y-1">
      <FormInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        onChange={handlePasswordChange}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-purple-600 transition-colors focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
      {props.value && props.value.length > 0 && props.showStrength && (
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-300", getStrengthColor())} 
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          <span className={cn("text-[10px] font-medium", 
             strength <= 2 ? 'text-red-500' : strength <= 3 ? 'text-yellow-500' : 'text-green-500'
          )}>
            {getStrengthText()}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;