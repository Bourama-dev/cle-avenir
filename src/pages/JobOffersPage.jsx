import React from 'react';
import JobExplorer from '@/components/JobExplorer';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

const JobOffersPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <SEOHead 
        title="Offres d'emploi et Alternances - CléAvenir" 
        description="Parcourez des milliers d'offres d'emploi, de stages et d'alternances sélectionnées pour vous." 
      />
      <JobExplorer onNavigate={navigate} />
    </>
  );
};

export default JobOffersPage;