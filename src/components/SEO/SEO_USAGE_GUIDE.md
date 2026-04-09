# PageHelmet SEO Usage Guide

Enhanced PageHelmet component with support for multiple schema types, breadcrumbs, and hreflang tags.

## Basic Usage (All Pages)

```jsx
import PageHelmet from '@/components/SEO/PageHelmet';

function MyPage() {
  return (
    <>
      <PageHelmet
        title="Page Title"
        description="Page description for search engines"
        keywords="keyword1, keyword2, keyword3"
        image="https://cleavenir.com/og-image-custom.jpg"
      />
      {/* Page content */}
    </>
  );
}
```

## JobDetailPage Example

For job listings (critical for job search visibility):

```jsx
<PageHelmet
  title={job.title}
  description={job.description}
  keywords={`${job.title}, emploi, formation, ${job.sector}`}
  image={job.image || 'https://cleavenir.com/og-image.jpg'}
  schemaType="job"
  breadcrumbs={[
    { name: 'Accueil', url: '/' },
    { name: 'Offres d\'emploi', url: '/jobs' },
    { name: job.title, url: `/jobs/${job.id}` }
  ]}
  jobData={{
    hiringOrganization: {
      "@type": "Organization",
      "name": job.company
    },
    jobLocation: {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressCountry": "FR"
      }
    },
    employmentType: job.type, // FULL_TIME, PART_TIME, CONTRACT
    baseSalary: job.salary,
    priceCurrency: "EUR",
    validThrough: job.expiresAt
  }}
/>
```

## FormationDetailPage Example

For course/training pages:

```jsx
<PageHelmet
  title={formation.name}
  description={formation.description}
  keywords={`formation, ${formation.domain}, apprentissage, ${formation.level}`}
  schemaType="course"
  breadcrumbs={[
    { name: 'Accueil', url: '/' },
    { name: 'Formations', url: '/formations' },
    { name: formation.domain, url: `/formations?domain=${formation.domain}` },
    { name: formation.name, url: `/formations/${formation.id}` }
  ]}
  courseData={{
    provider: formation.provider,
    rating: formation.rating,
    ratingCount: formation.reviewCount
  }}
/>
```

## BlogArticlePage Example

For blog articles:

```jsx
<PageHelmet
  title={article.title}
  description={article.excerpt}
  keywords={article.tags.join(', ')}
  image={article.imageUrl}
  schemaType="article"
  publishedTime={article.publishedDate}
  modifiedTime={article.updatedDate}
  author={article.authorName}
  breadcrumbs={[
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: article.category, url: `/blog?category=${article.category}` },
    { name: article.title, url: `/blog/${article.slug}` }
  ]}
/>
```

## MetierDetailPage Example

For career/job role pages:

```jsx
<PageHelmet
  title={`${metier.name} - Guide Complet du Métier`}
  description={`Découvrez le métier de ${metier.name}. Formations, salaires, évolutions de carrière et offres d'emploi.`}
  keywords={`${metier.name}, métier, carrière, formation, salaire, emploi`}
  breadcrumbs={[
    { name: 'Accueil', url: '/' },
    { name: 'Explorer les Métiers', url: '/metiers' },
    { name: metier.sector, url: `/metiers?sector=${metier.sector}` },
    { name: metier.name, url: `/metiers/${metier.id}` }
  ]}
/>
```

## FAQPage Example

For FAQ pages:

```jsx
<PageHelmet
  title="Questions Fréquentes - CléAvenir"
  description="Réponses aux questions fréquemment posées sur CléAvenir, les tests d'orientation et les formations."
  keywords="FAQ, questions, orientation, formation, carrière"
  schemaType="faq"
  faqData={[
    {
      question: "Comment fonctionne le test d'orientation?",
      answer: "Notre test analyse vos compétences..."
    },
    {
      question: "Est-ce gratuit?",
      answer: "Oui, le test est entièrement gratuit..."
    }
  ]}
/>
```

## With Multi-Language Support

Add alternative language versions for SEO:

```jsx
<PageHelmet
  title={title}
  description={description}
  keywords={keywords}
  hreflangAlternates={[
    { lang: "en", href: `https://cleavenir.com/en${location.pathname}` },
    { lang: "es", href: `https://cleavenir.com/es${location.pathname}` }
  ]}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | Required | Page title |
| description | string | Required | Meta description |
| keywords | string | Required | Comma-separated keywords |
| image | string | og-image.jpg | OG image URL |
| type | string | 'website' | OG type |
| schemaType | string | null | Schema.org type: 'article', 'job', 'course', 'faq', 'localbusiness' |
| breadcrumbs | array | null | [{name, url}] for BreadcrumbList schema |
| hreflangAlternates | array | null | [{lang, href}] for language alternates |
| jobData | object | null | JobPosting-specific data |
| courseData | object | null | Course-specific data |
| faqData | array | null | FAQ items [{question, answer}] |
| publishedTime | string | null | ISO date for article:published_time |
| modifiedTime | string | null | ISO date for article:modified_time |
| author | string | 'CléAvenir' | Article author name |
| noIndex | boolean | false | Set robots to noindex, nofollow |

## Best Practices

1. **Always include breadcrumbs** for better UX signals and SEO
2. **Use appropriate schemaType** for each page - improves rich snippets
3. **Add hreflang** if you plan multi-language versions
4. **Update modifiedTime** when content changes - signals freshness
5. **Use high-quality OG images** - improves social sharing CTR
6. **Keep descriptions 150-160 characters** - optimal for search results
7. **Include 5-8 targeted keywords** - relevant to page content

## Schema.org Types Supported

- **article**: Blog posts and news articles
- **job**: Job listings and job offer pages
- **course**: Training and educational courses
- **faq**: FAQ pages
- **localbusiness**: Company/service location information
