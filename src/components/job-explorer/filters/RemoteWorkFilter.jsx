import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const RemoteWorkFilter = ({ isRemote, onChange }) => {
  return (
    <div className="flex items-center space-x-2 py-1 group">
      <Checkbox
        id="remote-work"
        checked={isRemote}
        onCheckedChange={(checked) => onChange(checked)}
        className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 border-slate-300 w-5 h-5 rounded"
      />
      <Label
        htmlFor="remote-work"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700 group-hover:text-slate-900 transition-colors"
      >
        Télétravail uniquement
      </Label>
    </div>
  );
};

export default RemoteWorkFilter;