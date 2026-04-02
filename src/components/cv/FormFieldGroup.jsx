import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const FormFieldGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  multiline = false,
  rows = 4,
  className 
}) => {
  return (
    <div className={cn("space-y-2 mb-4", className)}>
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      {multiline ? (
        <Textarea 
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-y min-h-[88px] text-base p-3 focus:ring-purple-500 rounded-xl"
        />
      ) : (
        <Input 
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-[48px] text-base px-4 focus:ring-purple-500 rounded-xl"
        />
      )}
    </div>
  );
};

export default FormFieldGroup;