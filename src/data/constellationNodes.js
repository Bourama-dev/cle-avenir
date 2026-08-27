import { jobsDatabase } from '@/data/jobsDatabase';

/**
 * Curated node set for the landing page star map (Cartographie direction).
 * Métier nodes are pulled directly from jobsDatabase (real ROME codes) —
 * nothing invented here. Formation nodes are derived from the same
 * entries' `education` field and the Développeur Web pathway's real
 * school names, so every label on the map corresponds to something real.
 */
export const metierNodes = jobsDatabase.map((job) => ({
  type: 'metier',
  id: job.id,
  label: job.title,
  code: job.code,
  description: job.description,
  meta: `ROME ${job.code} · ${job.education}`,
}));

const formationLabels = [
  { id: 'bts-sio', label: 'BTS SIO', meta: 'Bac+2 · Informatique' },
  { id: 'but-info', label: 'BUT Informatique', meta: 'Bac+3 · Informatique' },
  { id: 'epitech', label: 'Epitech', meta: 'École · Développement' },
  { id: '42', label: '42', meta: 'École · Développement' },
  { id: 'openclassrooms', label: 'OpenClassrooms', meta: 'Formation en ligne' },
  { id: 'de-infirmier', label: 'DE Infirmier', meta: 'Bac+3 · Diplôme d’État' },
  { id: 'bpjeps', label: 'BPJEPS', meta: 'Bac · Sport' },
  { id: 'cap-boulanger', label: 'CAP Boulanger', meta: 'CAP · Artisanat' },
  { id: 'cap-electricien', label: 'CAP Électricien', meta: 'CAP à Bac · Technique' },
  { id: 'capa', label: 'CAPA', meta: 'Bac+6 · École d’avocats' },
];

export const formationNodes = formationLabels.map((f) => ({
  type: 'formation',
  ...f,
}));

export const constellationNodes = [...metierNodes, ...formationNodes];
