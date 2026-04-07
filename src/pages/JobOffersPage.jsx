import React from 'react';
import JobExplorer from '@/components/JobExplorer';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

const JobOffersPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <SEOHead
        title="Offres d'emploi, Stages et Alternances en France | CléAvenir"
        description="Parcourez des milliers d'offres d'emploi, de stages et d'alternances en France. Trouvez votre prochain poste grâce à notre moteur de recherche intelligent."
        keywords="offres emploi, alternance, stage, recrutement, CDI, CDD, France"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Offres d'emploi et Alternances - CléAvenir",
          "description": "Moteur de recherche d'offres d'emploi, stages et alternances en France.",
          "url": "https://cleavenir.com/offres-emploi",
          "publisher": { "@type": "Organization", "name": "CléAvenir", "url": "https://cleavenir.com" }
        }}
      />
      <JobExplorer onNavigate={navigate} />
    </>
  );
};

export default JobOffersPage;