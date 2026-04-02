import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { securityService, initializeSecurity } from '@/services/securityService';

const SEOHead = ({ title, description, image, type = 'website' }) => {
  const siteTitle = 'CléAvenir';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || 'La première plateforme d\'orientation propulsée par l\'IA.';
  const metaImage = image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40';

  useEffect(() => {
    const cleanup = initializeSecurity();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const securityTags = securityService.getSecurityMetaTags();

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Security Headers (Simulated via Meta) */}
      {securityTags.map((tag, i) => (
        <meta key={i} httpEquiv={tag.httpEquiv} content={tag.content} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEOHead;