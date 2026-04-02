import React from 'react';
import { Helmet } from 'react-helmet';
import Blog from '@/components/Blog';

const ConseilsCarrierePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Conseils Carrière - CléAvenir</title>
        <meta name="description" content="Articles, guides et conseils d'experts pour booster votre carrière, réussir vos entretiens et bien choisir votre orientation." />
      </Helmet>

      <div className="pt-8">
        <Blog />
      </div>
    </div>
  );
};

export default ConseilsCarrierePage;