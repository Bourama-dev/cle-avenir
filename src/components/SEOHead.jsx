import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { securityService, initializeSecurity } from '@/services/securityService';

const BASE_URL = 'https://cleavenir.com';
const DEFAULT_IMAGE = 'https://cleavenir.com/og-image.jpg';

const SEOHead = ({
  title,
  description,
  image,
  type = 'website',
  noIndex = false,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  structuredData,
}) => {
  const location = useLocation();
  const siteTitle = 'CléAvenir';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Orientation Professionnelle par IA`;
  const metaDescription = description || 'Trouvez votre voie professionnelle grâce à notre IA avancée. Tests d\'orientation, fiches métiers et conseils personnalisés pour votre carrière.';
  const metaImage = image || DEFAULT_IMAGE;
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';

  useEffect(() => {
    const cleanup = initializeSecurity();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const securityTags = securityService.getSecurityMetaTags();

  return (
    <Helmet>
      {/* Titre & description */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical — URL exacte de la page courante */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Security Headers */}
      {securityTags.map((tag, i) => (
        <meta key={i} httpEquiv={tag.httpEquiv} content={tag.content} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="fr_FR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Données structurées JSON-LD (optionnel, passé en prop) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;