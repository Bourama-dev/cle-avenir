import React from 'react';
import { Badge } from '@/components/ui/badge';

export const SectorBadge = ({ sector }) => {
  if (!sector) return null;
  return <Badge variant="secondary" className="text-xs">{sector}</Badge>;
};

const formatSalaryLabel = (salary) => {
  if (!salary) return null;
  if (typeof salary === 'object' && salary !== null) {
    const { min, max } = salary;
    if (min && max) return `${min.toLocaleString('fr-FR')} – ${max.toLocaleString('fr-FR')} €`;
    if (min) return `≥ ${min.toLocaleString('fr-FR')} €`;
    if (max) return `≤ ${max.toLocaleString('fr-FR')} €`;
    return null;
  }
  return String(salary);
};

export const SalaryBadge = ({ salary }) => {
  const label = formatSalaryLabel(salary);
  if (!label) return null;
  return <Badge variant="outline" className="text-xs text-green-700 border-green-200">{label}</Badge>;
};

export const RomeBadge = ({ code }) => {
  if (!code) return null;
  return <Badge variant="outline" className="text-xs font-mono text-slate-500">{code}</Badge>;
};
