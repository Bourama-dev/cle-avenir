import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://cleavenir.com';

const BlogSEO = ({ title, description, image, url, type = 'article', publishedTime, modifiedTime, author, tags }) => {
  const location = useLocation();
  const fullUrl = url ? `${BASE_URL}${url}` : `${BASE_URL}${location.pathname}`;
  const defaultImage = 'https://cleavenir.com/og-image.jpg';
  const fullImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | CléAvenir Blog` : 'Le Blog CléAvenir - Conseils Carrière & Orientation'}</title>
      <meta name="description" content={description || "Découvrez nos articles experts sur l'orientation, la reconversion, et l'emploi. Conseils pratiques, tendances du marché et témoignages pour booster votre carrière."} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="CléAvenir" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags && tags.map(tag => <meta property="article:tag" content={tag} key={tag} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? "BlogPosting" : "Blog",
          "headline": title,
          "image": fullImage,
          "author": {
            "@type": "Person",
            "name": author || "Équipe CléAvenir"
          },
          "publisher": {
            "@type": "Organization",
            "name": "CléAvenir",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`
            }
          },
          "url": fullUrl,
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "description": description,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        })}
      </script>
    </Helmet>
  );
};

export default BlogSEO;