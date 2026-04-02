import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formats a salary range or value for display
 */
export const formatSalary = (salary) => {
  if (!salary) return 'Salaire non spécifié';
  // If it's a string that already looks formatted
  if (typeof salary === 'string' && (salary.includes('€') || salary.toLowerCase().includes('eur'))) {
    return salary;
  }
  // If it's a number
  if (typeof salary === 'number') {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(salary);
  }
  // Return as is if unknown format
  return salary;
};

/**
 * Formats the publication date
 */
export const formatPublicationDate = (date) => {
  if (!date) return 'Date inconnue';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  } catch (e) {
    return 'Récemment';
  }
};

/**
 * Formats contract type for badges (short version)
 */
export const formatContractType = (type) => {
  if (!type) return 'N/A';
  const upper = type.toUpperCase();
  if (upper.includes('CDI')) return 'CDI';
  if (upper.includes('CDD')) return 'CDD';
  if (upper.includes('INTERIM')) return 'Intérim';
  if (upper.includes('FREELANCE')) return 'Freelance';
  if (upper.includes('ALTERNANCE') || upper.includes('APPRENTISSAGE')) return 'Alternance';
  if (upper.includes('STAGE')) return 'Stage';
  return type;
};

/**
 * Returns a color class for contract type badges
 */
export const getContractColor = (type) => {
  if (!type) return 'bg-slate-100 text-slate-700 border-slate-200';
  const upper = type.toUpperCase();
  if (upper.includes('CDI')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (upper.includes('CDD')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (upper.includes('INTERIM')) return 'bg-orange-50 text-orange-700 border-orange-200';
  if (upper.includes('FREELANCE')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (upper.includes('ALTERNANCE')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};