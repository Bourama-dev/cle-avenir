export const jobsDatabase = [
  {
    id: 'dev_web',
    title: 'Développeur Web',
    description: 'Conçoit et réalise des sites et applications web.',
    tags: { tech: 10, analytical: 8, creative: 6, solo: 4, office: 10, business: 2 },
    salary: '35k€ - 65k€',
    education: 'Bac+2 à Bac+5',
    emoji: '💻',
    code: 'M1805', // ROME Code for hydration
    outlook: 'Très favorable',
    pathway: {
      duration: '2 à 5 ans',
      cost: 'Gratuit (Alternance) à 8000€/an',
      steps: [
        { title: 'Baccalauréat', desc: 'Général (Maths/NSI) ou STI2D' },
        { title: 'Formation Supérieure', desc: 'BTS SIO, BUT Informatique ou École d\'ingénieur' },
        { title: 'Spécialisation', desc: 'Bootcamp ou Master (Fullstack, Front-end)' },
        { title: 'Premier Emploi', desc: 'Junior en ESN ou Startup' }
      ],
      schools: ['Epitech', '42', 'IUT Informatique', 'OpenClassrooms']
    },
    mockOffers: [
      { id: 'off_1', title: 'Développeur React Junior', company: 'TechStart', location: 'Paris', contract: 'CDI', salary: '38k€' }
    ]
  },
  {
    id: 'ux_designer',
    title: 'UX/UI Designer',
    description: 'Imagine l\'interface et l\'expérience utilisateur des produits digitaux.',
    tags: { creative: 10, tech: 7, social: 5, empathy: 9, analytical: 5, office: 10 },
    salary: '32k€ - 55k€',
    education: 'Bac+3 à Bac+5',
    emoji: '🎨',
    code: 'E1104',
    outlook: 'Favorable'
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    description: 'Fait parler les données pour aider à la prise de décision.',
    tags: { analytical: 10, tech: 8, solo: 6, business: 7, office: 10 },
    salary: '38k€ - 60k€',
    education: 'Bac+5',
    emoji: '📊',
    code: 'M1403',
    outlook: 'Très favorable'
  },
  {
    id: 'nurse',
    title: 'Infirmier(ère)',
    description: 'Dispense des soins et accompagne les patients au quotidien.',
    tags: { social: 10, empathy: 10, manual: 7, health: 10, resilience: 9, office: 0 },
    salary: '25k€ - 35k€',
    education: 'Bac+3 (DE)',
    emoji: '🏥',
    code: 'J1506',
    outlook: 'En tension'
  },
  {
    id: 'sales_rep',
    title: 'Business Developer',
    description: 'Développe le chiffre d\'affaires de l\'entreprise.',
    tags: { business: 10, social: 9, resilience: 9, leadership: 6, money: 8, office: 5, outdoor: 4 },
    salary: '30k€ - 80k€ (avec variables)',
    education: 'Bac+2 à Bac+5',
    emoji: '🤝',
    code: 'D1402',
    outlook: 'Très favorable'
  },
  {
    id: 'teacher',
    title: 'Enseignant',
    description: 'Transmet des connaissances et accompagne les élèves.',
    tags: { social: 9, empathy: 8, leadership: 7, education: 10, resilience: 8, office: 8 },
    salary: '25k€ - 45k€',
    education: 'Bac+5',
    emoji: '📚',
    code: 'K2107',
    outlook: 'Stable'
  },
  {
    id: 'electrician',
    title: 'Électricien',
    description: 'Installe et répare les systèmes électriques.',
    tags: { manual: 10, tech: 6, analytical: 6, outdoor: 7, solo: 6, business: 4 },
    salary: '22k€ - 40k€',
    education: 'CAP à Bac',
    emoji: '⚡',
    code: 'F1602',
    outlook: 'En tension'
  },
  {
    id: 'architect',
    title: 'Architecte',
    description: 'Conçoit des bâtiments alliant esthétique et technique.',
    tags: { creative: 9, technical: 8, analytical: 7, outdoor: 4, office: 6, business: 5 },
    salary: '30k€ - 70k€',
    education: 'Bac+5 (DE)',
    emoji: '🏗️',
    code: 'F1101',
    outlook: 'Stable'
  },
  {
    id: 'marketing_manager',
    title: 'Responsable Marketing',
    description: 'Définit la stratégie commerciale et l\'image de marque.',
    tags: { business: 9, creative: 8, social: 6, analytical: 7, leadership: 7 },
    salary: '40k€ - 80k€',
    education: 'Bac+5',
    emoji: '📢',
    code: 'M1705',
    outlook: 'Favorable'
  },
  {
    id: 'coach_sportif',
    title: 'Coach Sportif',
    description: 'Accompagne les clients dans leur remise en forme.',
    tags: { outdoor: 8, health: 9, social: 9, leadership: 7, manual: 6, business: 4 },
    salary: '25k€ - 50k€',
    education: 'BPJEPS (Bac)',
    emoji: '⚽',
    code: 'G1204',
    outlook: 'Croissance'
  },
  {
    id: 'boulanger',
    title: 'Artisan Boulanger',
    description: 'Fabrique pains et viennoiseries avec savoir-faire.',
    tags: { manual: 10, creative: 6, solo: 5, business: 6, resilience: 8 },
    salary: '24k€ - 45k€',
    education: 'CAP',
    emoji: '🥖',
    code: 'D1102',
    outlook: 'Stable'
  },
  {
    id: 'avocat',
    title: 'Avocat',
    description: 'Conseille et défend ses clients en justice.',
    tags: { analytical: 9, social: 7, resilience: 8, business: 7, leadership: 6 },
    salary: '40k€ - 100k€+',
    education: 'Bac+6 (CAPA)',
    emoji: '⚖️',
    code: 'K1903',
    outlook: 'Compétitif'
  }
];