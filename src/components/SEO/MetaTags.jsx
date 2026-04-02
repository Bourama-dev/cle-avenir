import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ 
  title = "CléAvenir - Orientation Professionnelle par IA", 
  description = "Trouvez votre voie professionnelle grâce à notre IA avancée. Tests d'orientation, fiches métiers et conseils personnalisés pour votre carrière.",
  image = "https://cleavenir.com/og-image.jpg",
  url = "https://cleavenir.com",
  type = "website"
}) => {
  const siteTitle = title.includes("CléAvenir") ? title : `${title} | CléAvenir`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="CléAvenir" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default MetaTags;