import React from 'react';
import JobDetailPage from './JobDetailPage';

// Wrapper to reuse JobDetailPage logic for /offre/:id route or alternative offers
const OfferDetailPage = () => {
  return <JobDetailPage />;
};

export default OfferDetailPage;