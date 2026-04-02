import React from 'react';
import MetiersExplorer from '@/components/MetiersExplorer';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

const ExploreMetiersPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Explorer les métiers - CléAvenir" 
        description="Découvrez des centaines de fiches métiers détaillées, les compétences requises et les opportunités du marché." 
      />
      <MetiersExplorer onNavigate={navigate} />
    </>
  );
};

export default ExploreMetiersPage;