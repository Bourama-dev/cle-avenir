import React from 'react';
import MetiersExplorer from '@/components/MetiersExplorer';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

const ExploreMetiersPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Explorer les métiers - Fiches métiers détaillées | CléAvenir"
        description="Découvrez des centaines de fiches métiers détaillées : missions, compétences requises, salaires et opportunités d'emploi en France."
        keywords="fiches métiers, orientation professionnelle, liste métiers, compétences, salaires"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Explorer les métiers - CléAvenir",
          "description": "Catalogue de fiches métiers détaillées avec missions, compétences et débouchés.",
          "url": "https://cleavenir.com/metiers",
          "publisher": { "@type": "Organization", "name": "CléAvenir", "url": "https://cleavenir.com" }
        }}
      />
      <MetiersExplorer onNavigate={navigate} />
    </>
  );
};

export default ExploreMetiersPage;