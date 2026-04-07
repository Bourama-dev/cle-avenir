import React from 'react';
import { Helmet } from 'react-helmet-async';
import FormationFinder from '@/components/FormationFinder';

const TrouverFormationPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Trouver une Formation - CléAvenir</title>
        <meta name="description" content="Recherchez la formation idéale parmi des milliers d'offres (Parcoursup, France Travail) pour concrétiser votre projet professionnel." />
      </Helmet>

      <div className="pt-8">
        <FormationFinder />
      </div>
    </div>
  );
};

export default TrouverFormationPage;