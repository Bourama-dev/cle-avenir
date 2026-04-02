export const formatDiplomaLevel = (levelCode) => {
  if (!levelCode) return "Niveau inconnu";
  // Normalize display
  const map = {
    '3': 'CAP / BEP',
    '4': 'BAC',
    '5': 'BAC +2 (BTS/DUT)',
    '6': 'BAC +3 (Licence)',
    '7': 'BAC +5 (Master)',
    '8': 'Doctorat'
  };
  // If api returns numeric levels
  if (map[levelCode]) return map[levelCode];
  
  return levelCode; // Return as is if already text like 'Master'
};

export const getDiplomaColor = (level) => {
  const l = (level || '').toLowerCase();
  if (l.includes('cap') || l.includes('bep')) return "bg-green-100 text-green-700 border-green-200";
  if (l.includes('bac')) return "bg-blue-100 text-blue-700 border-blue-200";
  if (l.includes('licence') || l.includes('bts')) return "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (l.includes('master') || l.includes('ingénieur')) return "bg-purple-100 text-purple-700 border-purple-200";
  if (l.includes('doctorat')) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const LEVELS_OPTIONS = [
  "CAP", "BEP", "BAC", "BP", "BTS", "DUT", "Licence", "Licence Pro", "Master", "Ingénieur", "Doctorat"
];