import React from 'react';
import { Briefcase } from 'lucide-react';

export const SECTORS = [
  { id: 'all',          label: 'Tous secteurs',                romes: null },
  { id: 'informatique', label: 'Informatique & Digital',       romes: 'M1805,M1806,M1810,M1802,M1801' },
  { id: 'commerce',     label: 'Commerce & Vente',             romes: 'D1401,D1403,D1502,D1211' },
  { id: 'marketing',    label: 'Marketing & Communication',    romes: 'M1705,E1103,M1707,M1704' },
  { id: 'finance',      label: 'Finance & Comptabilité',       romes: 'M1203,M1202,M1205,M1204' },
  { id: 'rh',           label: 'Ressources Humaines',          romes: 'M1502,M1503,M1501' },
  { id: 'sante',        label: 'Santé & Social',               romes: 'J1302,J1303,K1201,K1302' },
  { id: 'logistique',   label: 'Logistique & Transport',       romes: 'N1301,N1101,N4105,N4403' },
  { id: 'industrie',    label: 'Industrie & Production',       romes: 'H2902,H2912,I1304,H2603' },
  { id: 'restauration', label: 'Restauration & Hôtellerie',    romes: 'G1401,G1404,G1603,G1802' },
  { id: 'btp',          label: 'BTP & Immobilier',             romes: 'F1101,F1103,F1201,C1501' },
  { id: 'education',    label: 'Enseignement & Formation',     romes: 'K2108,K2101,K2103' },
];

const CompanySectorFilter = ({ selectedSector, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
      <Briefcase className="w-4 h-4 text-slate-500" />
      Secteur d'activité
    </label>
    <select
      value={selectedSector}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
    >
      {SECTORS.map((s) => (
        <option key={s.id} value={s.id}>{s.label}</option>
      ))}
    </select>
  </div>
);

export default CompanySectorFilter;
