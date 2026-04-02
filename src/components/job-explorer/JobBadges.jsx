import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getJobIcon } from './JobIcons';

export const ContractBadge = ({ type }) => {
  const styles = {
    'CDI': 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
    'CDD': 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200',
    'Stage': 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
    'Alternance': 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
    'Freelance': 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200',
    'Intérim': 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200',
  };

  const defaultStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
  
  // Normalize type
  const normalizedType = type === 'INDÉPENDANT' ? 'Freelance' : type;

  return (
    <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${styles[normalizedType] || defaultStyle}`}>
      {getJobIcon('contract', 'w-3 h-3')}
      {normalizedType}
    </Badge>
  );
};

export const ExperienceBadge = ({ level }) => {
  const styles = {
    'Débutant': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Junior': 'bg-teal-50 text-teal-700 border-teal-200',
    'Confirmé': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Senior': 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${styles[level] || 'bg-gray-100 text-gray-700'}`}>
      {getJobIcon('experience', 'w-3 h-3')}
      {level || 'Non spécifié'}
    </Badge>
  );
};

export const SectorBadge = ({ sector }) => {
  // Simple hashing for consistent colors if not mapped
  const colors = [
    'text-pink-700 bg-pink-50 border-pink-200',
    'text-indigo-700 bg-indigo-50 border-indigo-200',
    'text-violet-700 bg-violet-50 border-violet-200', 
    'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200'
  ];
  
  const colorClass = colors[sector?.length % colors.length] || colors[0];

  return (
    <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${colorClass}`}>
      {getJobIcon('sector', 'w-3 h-3')}
      {sector}
    </Badge>
  );
};

export default { ContractBadge, ExperienceBadge, SectorBadge };