import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://cleavenir.com';

const MetaTags = ({
  title = "CléAvenir - Orientation Professionnelle par IA",
  description = "Trouvez votre voie professionnelle grâce à notre IA avancée. Tests d'orientation, fiches métiers et conseils personnalisés pour votre carrière.",
  image = "https://cleavenir.com/og-image.jpg",
  type = "website"
}) => {
  const location = useLocation();
  const siteTitle = title.includes("CléAvenir") ? title : `${title} | CléAvenir`;
  const canonicalUrl = `${BASE_URL}${location.pathname}`;

  return (
    <Helmet>
      {/* Métadonnées de base */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="CléAvenir" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default MetaTags;