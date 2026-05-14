import React from 'react';
import JobExplorer from '@/components/JobExplorer';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { useNavigate } from 'react-router-dom';

const JobOffersPage = () => {
  const navigate = useNavigate();
  
  const jobOffersSEO = categoryPageSEO({
    title: "Offres d'emploi, Stages et Alternances en France | CléAvenir",
    description: "Parcourez des milliers d'offres d'emploi, de stages et d'alternances en France. Trouvez votre prochain poste grâce à notre moteur de recherche intelligent.",
    keywords: "offres d'emploi, recherche emploi, offres emploi France, alternance, stage, apprentissage, recrutement, CDI, CDD, intérim, freelance, emploi Paris, emploi Lyon, emploi Bordeaux, trouver un travail, offre de stage, offre alternance 2025",
    category: "Offres d'emploi",
    categoryPath: "/offres-emploi"
  });

  return (
    <>
      <PageHelmet {...jobOffersSEO} />
      <JobExplorer onNavigate={navigate} />
    </>
  );
};

export default JobOffersPage;