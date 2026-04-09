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
  noIndex = false,
  schemaType = null, // 'article', 'job', 'course', 'faq', 'localbusiness'
  breadcrumbs = null, // Array of {name, url}
  hreflangAlternates = null, // Array of {lang, href}
  jobData = null, // For JobPosting schema
  courseData = null, // For Course schema
  faqData = null // For FAQPage schema
}) => {
  const location = useLocation();
  const baseUrl = 'https://cleavenir.com';
  const canonicalUrl = `${baseUrl}${location.pathname}`;

  const siteTitle = 'CléAvenir';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  const metaRobots = noIndex ? 'noindex, nofollow' : 'index, follow';

  // Build structured data based on schemaType
  const buildStructuredData = () => {
    const type = schemaType || (article ? 'article' : null);

    switch (type) {
      case 'article':
        return {
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
        };

      case 'job':
        return jobData ? {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": title,
          "description": description,
          "image": image,
          "datePosted": publishedTime,
          "validThrough": jobData.validThrough || new Date(new Date().getTime() + 30*24*60*60*1000).toISOString(),
          "hiringOrganization": jobData.hiringOrganization || {
            "@type": "Organization",
            "name": "CléAvenir"
          },
          "jobLocation": jobData.jobLocation || {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "FR"
            }
          },
          "employmentType": jobData.employmentType || "FULL_TIME",
          "baseSalary": jobData.baseSalary && {
            "@type": "PriceSpecification",
            "priceCurrency": jobData.priceCurrency || "EUR",
            "price": jobData.baseSalary
          }
        } : null;

      case 'course':
        return courseData ? {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": title,
          "description": description,
          "image": image,
          "provider": {
            "@type": "Organization",
            "name": courseData.provider || "CléAvenir"
          },
          "aggregateRating": courseData.rating && {
            "@type": "AggregateRating",
            "ratingValue": courseData.rating,
            "ratingCount": courseData.ratingCount || 1
          }
        } : null;

      case 'faq':
        return faqData ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        } : null;

      case 'localbusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "CléAvenir",
          "description": description,
          "url": baseUrl,
          "image": image,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR"
          },
          "sameAs": [
            "https://twitter.com/cleavenir",
            "https://www.linkedin.com/company/cleavenir"
          ]
        };

      default:
        return null;
    }
  };

  // Build breadcrumb schema
  const buildBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${baseUrl}${crumb.url}`
      }))
    };
  };

  const structuredData = buildStructuredData();
  const breadcrumbData = buildBreadcrumbs();

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={metaRobots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang Alternates */}
      {hreflangAlternates && hreflangAlternates.map((alt) => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.href} />
      ))}
      {/* Default hreflang for French */}
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

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

      {/* Breadcrumb Schema */}
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
    </Helmet>
  );
};

export default PageHelmet;