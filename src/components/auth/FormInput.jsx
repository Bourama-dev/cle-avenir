import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authStyles } from '@/styles/authStyles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormInput = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className, 
  options = [],
  placeholder,
  ...props 
}, ref) => {
  
  if (type === 'select') {
    return (
      <div className="space-y-1.5 w-full">
        {label && <Label className={authStyles.typography.label}>{label}</Label>}
        <Select onValueChange={props.onChange} value={props.value}>
          <SelectTrigger 
            className={cn(
              "w-full bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 transition-all", // Changed bg-slate-50 to bg-white
              error && "border-red-500 focus:ring-red-500",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className={authStyles.typography.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 w-full">
      {label && <Label className={authStyles.typography.label}>{label}</Label>}
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          className={cn(
            "bg-white border-slate-200 focus-visible:ring-purple-500 focus-visible:border-purple-500 placeholder:text-slate-400 h-10 transition-all", // Changed bg-slate-50 to bg-white
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        {props.rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {props.rightIcon}
          </div>
        )}
      </div>
      {error && <p className={authStyles.typography.error}>{error}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;