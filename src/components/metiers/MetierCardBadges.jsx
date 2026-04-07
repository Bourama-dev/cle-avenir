import React from 'react';
import { Badge } from '@/components/ui/badge';

export const SectorBadge = ({ sector }) => {
  if (!sector) return null;
  return <Badge variant="secondary" className="text-xs">{sector}</Badge>;
};

export const SalaryBadge = ({ salary }) => {
  if (!salary) return null;
  return <Badge variant="outline" className="text-xs text-green-700 border-green-200">{salary}</Badge>;
};

export const RomeBadge = ({ code }) => {
  if (!code) return null;
  return <Badge variant="outline" className="text-xs font-mono text-slate-500">{code}</Badge>;
};
