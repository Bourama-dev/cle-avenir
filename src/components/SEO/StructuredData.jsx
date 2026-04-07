import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CléAvenir",
    "url": "https://cleavenir.com",
    "logo": "https://cleavenir.com/logo.png",
    "description": "Plateforme d'orientation professionnelle et scolaire assistée par intelligence artificielle.",
    "sameAs": [
      "https://www.facebook.com/cleavenir",
      "https://www.linkedin.com/company/cleavenir",
      "https://twitter.com/cleavenir"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-1-00-00-00-00",
      "contactType": "customer service",
      "areaServed": "FR",
      "availableLanguage": "French"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;