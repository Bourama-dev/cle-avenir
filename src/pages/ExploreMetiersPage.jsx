import React from 'react';
import MetiersExplorer from '@/components/MetiersExplorer';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { useNavigate } from 'react-router-dom';

const ExploreMetiersPage = () => {
  const navigate = useNavigate();

  const metiersSEO = categoryPageSEO({
    title: "Explorer les métiers - Fiches métiers détaillées | CléAvenir",
    description: "Découvrez des centaines de fiches métiers détaillées : missions, compétences requises, salaires et opportunités d'emploi en France.",
    keywords: "fiches métiers, orientation professionnelle, liste métiers, compétences, salaires",
    category: "Métiers",
    categoryPath: "/metiers"
  });

  return (
    <>
      <PageHelmet {...metiersSEO} />
      <MetiersExplorer onNavigate={navigate} />
    </>
  );
};

export default ExploreMetiersPage;