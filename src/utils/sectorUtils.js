import React from 'react';
import { Briefcase } from 'lucide-react';
import { SECTORS } from '@/constants/sectors';

export function getSectorById(sectorId) {
  return SECTORS.find(s => s.id === sectorId || s.name === sectorId);
}

export function getSectorIcon(sectorId, className = "w-4 h-4") {
  const sector = getSectorById(sectorId);
  const Icon = sector?.icon || Briefcase;
  return <Icon className={className} />;
}

export function getSectorColor(sectorId) {
  const sector = getSectorById(sectorId);
  return sector ? `${sector.color} ${sector.bg}` : 'text-slate-500 bg-slate-50';
}

export function getSectorDescription(sectorId) {
  const sector = getSectorById(sectorId);
  return sector?.description || 'Domaine d\'activité';
}

export function getFormationCountBySector(formations, sectorId) {
  const sector = getSectorById(sectorId);
  if (!sector || !formations) return 0;
  return formations.filter(f => f.sector === sector.id || f.sector === sector.name).length;
}

export function filterFormationsBySectors(formations, selectedSectors) {
  if (!selectedSectors || selectedSectors.length === 0) return formations;
  return formations.filter(f => selectedSectors.includes(f.sector));
}