import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

// This component is no longer used directly as its logic has been integrated into JobExplorer.jsx
// It is kept here for reference of the filter options.

const contractTypes = [
  { code: 'all', libelle: 'Tous contrats' },
  { code: 'CDI', libelle: 'CDI' },
  { code: 'CDD', libelle: 'CDD' },
  { code: 'INTERIM', libelle: 'Intérim' }, // Grouping MIS, TTI, DIN
  { code: 'ALTERNANCE', libelle: 'Alternance' }, // Special handling if needed
  { code: 'SAI', libelle: 'Contrat saisonnier' },
];

const experienceLevels = [
  { code: 'all', libelle: 'Toute expérience' },
  { code: '0', libelle: 'Débutant (moins de 1 an)' },
  { code: '1', libelle: '1 à 2 ans' },
  { code: '2', libelle: '3 à 5 ans' },
  { code: '3', libelle: '5 à 10 ans' },
  { code: '4', libelle: 'Plus de 10 ans' },
];

const secteursActivite = [
  { code: 'all', libelle: 'Tous secteurs' },
  { code: 'A', libelle: 'Agriculture, sylviculture et pêche' },
  { code: 'B', libelle: 'Industries extractives' },
  { code: 'C', libelle: 'Fabrication' },
  { code: 'D', libelle: 'Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné' },
  { code: 'E', libelle: 'Production et distribution d\'eau; assainissement, gestion des déchets et dépollution' },
  { code: 'F', 'libelle': 'Construction' },
  { code: 'G', libelle: 'Commerce; réparation d\'automobiles et de motocycles' },
  { code: 'H', libelle: 'Transports et entreposage' },
  { code: 'I', libelle: 'Hébergement et restauration' },
  { code: 'J', libelle: 'Information et communication' },
  { code: 'K', libelle: 'Activités financières et d\'assurance' },
  { code: 'L', libelle: 'Activités immobilières' },
  { code: 'M', libelle: 'Activités spécialisées, scientifiques et techniques' },
  { code: 'N', libelle: 'Activités de services administratifs et de soutien' },
  { code: 'O', libelle: 'Administration publique' },
  { code: 'P', libelle: 'Enseignement' },
  { code: 'Q', libelle: 'Santé humaine et action sociale' },
  { code: 'R', libelle: 'Arts, spectacles et activités récréatives' },
  { code: 'S', libelle: 'Autres activités de services' },
  { code: 'T', libelle: 'Activités des ménages en tant qu\'employeurs; activités indifférenciées de production de biens et services pour usage propre des ménages' },
  { code: 'U', libelle: 'Activités des organisations et organismes extraterritoriaux' },
];


const JobFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
      <Select onValueChange={(val) => handleFilterChange('secteurActivite', val === 'all' ? '' : val)} value={filters.secteurActivite || 'all'}>
        <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/20">
          <SelectValue placeholder="Secteur d'activité" />
        </SelectTrigger>
        <SelectContent>
          {secteursActivite.map(s => <SelectItem key={s.code} value={s.code}>{s.libelle}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleFilterChange('typeContrat', val === 'all' ? '' : val)} value={filters.typeContrat || 'all'}>
        <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/20">
          <SelectValue placeholder="Type de contrat" />
        </SelectTrigger>
        <SelectContent>
          {contractTypes.map(c => <SelectItem key={c.code} value={c.code}>{c.libelle}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleFilterChange('experience', val === 'all' ? '' : val)} value={filters.experience || 'all'}>
        <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/20">
          <SelectValue placeholder="Niveau d'expérience" />
        </SelectTrigger>
        <SelectContent>
          {experienceLevels.map(e => <SelectItem key={e.code} value={e.code}>{e.libelle}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Ville (pour rayon)"
        value={filters.city}
        onChange={(e) => handleFilterChange('city', e.target.value)}
        className="w-full sm:w-[150px] bg-card border-border/20"
      />
      <div className="flex items-center space-x-2 w-full sm:w-[150px]">
        <Slider
          value={[filters.distance]}
          max={100}
          step={5}
          onValueChange={(val) => handleFilterChange('distance', val[0])}
          className="w-full"
        />
        <span className="text-sm">{filters.distance} km</span>
      </div>
    </div>
  );
};

export default JobFilters;