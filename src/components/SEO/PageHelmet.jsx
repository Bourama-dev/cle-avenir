import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const PageHelmet = ({
  title,
  description,
  keywords,
  image = 'https://cleavenir.com/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'CléAvenir',
  article = false,
  noIndex = false
}) => {
  const location = useLocation();
  const baseUrl = 'https://cleavenir.com';
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  
  // Clean up title
  const siteTitle = 'CléAvenir';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  
  const metaRobots = noIndex ? 'noindex, nofollow' : 'index, follow';

  // JSON-LD for Articles
  const structuredData = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": [image],
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": [{
      "@type": "Person",
      "name": author
    }],
    "publisher": {
      "@type": "Organization",
      "name": "CléAvenir",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cleavenir.com/favicon.png"
      }
    },
    "description": description
  } : null;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={metaRobots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="fr_FR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default PageHelmet;