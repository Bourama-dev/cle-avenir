import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SectorBadge = ({ sector }) => {
  if (!sector) return null;
  return (
    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200/60 text-slate-700 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
      {sector}
    </Badge>
  );
};

export const SalaryBadge = ({ salary }) => {
  if (!salary) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
            {salary}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Estimation du salaire annuel brut</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const RomeBadge = ({ code }) => {
  if (!code) return null;
  return (
    <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100/80 text-slate-500 border-slate-200/50">
      ROME {code}
    </Badge>
  );
};