/**
 * SEO Preset Configurations for Common Page Types
 * Use these to quickly implement SEO on different page templates
 */

const baseUrl = 'https://cleavenir.com';

/**
 * Job Detail Page SEO Config
 * @param {Object} jobData - { title, description, company, city, type, salary, expiresAt, image, id }
 * @returns {Object} PageHelmet props
 */
export const jobDetailSEO = (jobData) => ({
  title: jobData.title,
  description: jobData.description || `Découvrez l'offre d'emploi: ${jobData.title} chez ${jobData.company}`,
  keywords: `${jobData.title}, offre emploi, ${jobData.company}, ${jobData.city}, recrutement`,
  image: jobData.image || 'https://cleavenir.com/og-image.jpg',
  schemaType: 'job',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Offres d\'emploi', url: '/jobs' },
    { name: jobData.title, url: `/jobs/${jobData.id}` }
  ],
  jobData: {
    hiringOrganization: {
      "@type": "Organization",
      "name": jobData.company
    },
    jobLocation: {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": jobData.city,
        "addressCountry": "FR"
      }
    },
    employmentType: jobData.type || 'FULL_TIME',
    baseSalary: jobData.salary,
    priceCurrency: 'EUR',
    validThrough: jobData.expiresAt
  }
});

/**
 * Formation/Course Detail Page SEO Config
 * @param {Object} formationData - { name, description, domain, level, provider, id, rating, reviewCount, image }
 * @returns {Object} PageHelmet props
 */
export const formationDetailSEO = (formationData) => ({
  title: formationData.name,
  description: formationData.description || `Formation ${formationData.level} en ${formationData.domain}`,
  keywords: `formation, ${formationData.domain}, apprentissage, ${formationData.level}, développement professionnel`,
  image: formationData.image || 'https://cleavenir.com/og-image.jpg',
  schemaType: 'course',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Formations', url: '/formations' },
    { name: formationData.domain, url: `/formations?domain=${formationData.domain}` },
    { name: formationData.name, url: `/formations/${formationData.id}` }
  ],
  courseData: {
    provider: formationData.provider,
    rating: formationData.rating,
    ratingCount: formationData.reviewCount || 1
  }
});

/**
 * Career/Métier Detail Page SEO Config
 * @param {Object} metierData - { name, description, id, sector, salaryRange, image }
 * @returns {Object} PageHelmet props
 */
export const metierDetailSEO = (metierData) => ({
  title: `${metierData.name} - Guide Complet du Métier`,
  description: metierData.description || `Découvrez le métier de ${metierData.name}. Formations, salaires, évolutions de carrière et offres d'emploi.`,
  keywords: `${metierData.name}, métier, carrière, formation, salaire, emploi, ${metierData.sector}`,
  image: metierData.image || 'https://cleavenir.com/og-image.jpg',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Explorer les Métiers', url: '/metiers' },
    { name: metierData.sector, url: `/metiers?sector=${metierData.sector}` },
    { name: metierData.name, url: `/metiers/${metierData.id}` }
  ]
});

/**
 * Blog Article Page SEO Config
 * @param {Object} articleData - { title, excerpt, slug, authorName, publishedDate, updatedDate, category, tags, imageUrl }
 * @returns {Object} PageHelmet props
 */
export const blogArticleSEO = (articleData) => ({
  title: articleData.title,
  description: articleData.excerpt || `Lire l'article: ${articleData.title}`,
  keywords: articleData.tags?.join(', ') || 'blog, carrière, orientation',
  image: articleData.imageUrl || 'https://cleavenir.com/og-image.jpg',
  type: 'article',
  schemaType: 'article',
  publishedTime: articleData.publishedDate,
  modifiedTime: articleData.updatedDate,
  author: articleData.authorName || 'CléAvenir',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: articleData.category, url: `/blog?category=${articleData.category}` },
    { name: articleData.title, url: `/blog/${articleData.slug}` }
  ]
});

/**
 * Static Landing Page SEO Config
 * @param {Object} pageData - { title, description, keywords, image, breadcrumbName, breadcrumbPath }
 * @returns {Object} PageHelmet props
 */
export const landingPageSEO = (pageData) => ({
  title: pageData.title,
  description: pageData.description,
  keywords: pageData.keywords,
  image: pageData.image || 'https://cleavenir.com/og-image.jpg',
  breadcrumbs: pageData.breadcrumbName ? [
    { name: 'Accueil', url: '/' },
    { name: pageData.breadcrumbName, url: pageData.breadcrumbPath }
  ] : null
});

/**
 * FAQ Page SEO Config
 * @param {Array} faqs - [{ question, answer }, ...]
 * @returns {Object} PageHelmet props
 */
export const faqPageSEO = (faqs) => ({
  title: 'Questions Fréquemment Posées - CléAvenir',
  description: 'Réponses aux questions fréquemment posées sur CléAvenir, les tests d\'orientation, les formations et les offres d\'emploi.',
  keywords: 'FAQ, questions, orientation, formation, carrière, emploi',
  image: 'https://cleavenir.com/og-image.jpg',
  schemaType: 'faq',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'FAQ', url: '/faq' }
  ],
  faqData: faqs.map(item => ({
    question: item.question,
    answer: item.answer
  }))
});

/**
 * Category/List Page SEO Config
 * @param {Object} pageData - { title, description, keywords, category, categoryPath, image }
 * @returns {Object} PageHelmet props
 */
export const categoryPageSEO = (pageData) => ({
  title: pageData.title,
  description: pageData.description,
  keywords: pageData.keywords,
  image: pageData.image || 'https://cleavenir.com/og-image.jpg',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: pageData.category, url: pageData.categoryPath }
  ]
});

/**
 * Test Page SEO Config (For Orientation Test)
 * @returns {Object} PageHelmet props
 */
export const testPageSEO = () => ({
  title: 'Test d\'Orientation Professionnel Gratuit - CléAvenir',
  description: 'Découvrez votre orientation professionnelle avec notre test gratuit alimenté par l\'IA. Analysez vos compétences et trouvez les métiers qui vous conviennent.',
  keywords: 'test orientation, test métier, orientation professionnel, carrière, IA, parcoursup',
  image: 'https://cleavenir.com/og-image.jpg',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Test d\'Orientation', url: '/test' }
  ]
});

/**
 * Authentication Pages SEO Config
 * @param {string} page - 'login' or 'signup'
 * @returns {Object} PageHelmet props
 */
export const authPageSEO = (page = 'login') => ({
  title: page === 'login' ? 'Connexion - CléAvenir' : 'Créer un Compte - CléAvenir',
  description: page === 'login'
    ? 'Connectez-vous à votre compte CléAvenir pour accéder à vos tests et résultats.'
    : 'Créez un compte CléAvenir gratuit pour démarrer votre test d\'orientation professionnel.',
  keywords: page === 'login' ? 'connexion, login' : 'inscription, créer compte, enregistrement',
  image: 'https://cleavenir.com/og-image.jpg',
  noIndex: true // Don't index auth pages
});

/**
 * Dashboard/User Pages SEO Config
 * @returns {Object} PageHelmet props
 */
export const dashboardPageSEO = () => ({
  title: 'Mon Tableau de Bord - CléAvenir',
  description: 'Consultez vos résultats d\'orientation, vos formations recommandées et vos offres d\'emploi personnalisées.',
  keywords: 'tableau de bord, mes résultats, formations recommandées, offres emploi',
  image: 'https://cleavenir.com/og-image.jpg',
  noIndex: true // Don't index user-specific pages
});
