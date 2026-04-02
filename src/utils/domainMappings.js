import { Cpu, FlaskConical, HeartPulse, ShoppingBag, Palette, BookOpen, Wrench, Scale, Trophy, Map, MoonStar as CalendarStar, Leaf } from 'lucide-react';

export const DOMAIN_MAPPINGS = {
  technology: {
    id: 'technology', label: 'Technologie & Digital', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50',
    codes: ['M1805', 'M1801', 'M1802', 'M1806', 'E1104']
  },
  sciences: {
    id: 'sciences', label: 'Sciences & Recherche', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-50',
    codes: ['H1206', 'H1208', 'K2402']
  },
  health: {
    id: 'health', label: 'Santé & Soin', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50',
    codes: ['J1102', 'J1506', 'J1301', 'J1103']
  },
  commerce: {
    id: 'commerce', label: 'Commerce & Vente', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50',
    codes: ['D1401', 'D1301', 'D1502', 'D1201']
  },
  arts: {
    id: 'arts', label: 'Arts & Création', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50',
    codes: ['E1104', 'E1205', 'L1304', 'B1101']
  },
  education: {
    id: 'education', label: 'Éducation & Formation', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50',
    codes: ['K2107', 'K2104', 'K2109', 'K2111']
  },
  industry: {
    id: 'industry', label: 'Industrie & Ingénierie', icon: Wrench, color: 'text-slate-500', bg: 'bg-slate-50',
    codes: ['H1402', 'H1102', 'H1203', 'H1502']
  },
  law: {
    id: 'law', label: 'Droit & Justice', icon: Scale, color: 'text-slate-800', bg: 'bg-slate-100',
    codes: ['K1903', 'K1904', 'K1902']
  },
  sport: {
    id: 'sport', label: 'Sport & Performance', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50',
    codes: ['G1204', 'G1203', 'G1201', 'K2111']
  },
  tourism: {
    id: 'tourism', label: 'Tourisme & Loisirs', icon: Map, color: 'text-sky-500', bg: 'bg-sky-50',
    codes: ['G1101', 'G1102', 'G1201', 'G1205']
  },
  events: {
    id: 'events', label: 'Événementiel', icon: CalendarStar, color: 'text-purple-500', bg: 'bg-purple-50',
    codes: ['E1107', 'G1103', 'L1509', 'L1303']
  },
  environment: {
    id: 'environment', label: 'Environnement & Nature', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50',
    codes: ['A1201', 'A1204', 'A1303', 'K2301', 'K2302']
  }
};

export const getMetiersForDomains = (domainIds) => {
  const codes = new Set();
  domainIds.forEach(id => {
    if (DOMAIN_MAPPINGS[id]) {
      DOMAIN_MAPPINGS[id].codes.forEach(code => codes.add(code));
    }
  });
  return Array.from(codes);
};

export const getDomainById = (id) => DOMAIN_MAPPINGS[id];