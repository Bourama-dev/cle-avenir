#!/usr/bin/env node
/**
 * prerender-meta.js
 * Post-build: génère dist/<route>/index.html avec <title>, <meta>, og: et
 * canonical hardcodés dans le HTML statique.
 * Google lit ces balises immédiatement, sans exécuter JavaScript.
 *
 * Inclut :
 * - Métadonnées OpenGraph (Facebook, LinkedIn)
 * - Métadonnées Twitter Card
 * - Métadonnées Apple
 * - Métadonnées JSON-LD (schema.org)
 * - Canonical URLs
 * - Métadonnées de sécurité (noindex sur pages privées)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST      = path.resolve(__dirname, '../dist');
const BASE_URL  = 'https://www.cleavenir.com';
const OG_IMAGE  = `${BASE_URL}/og-image.jpg`;

// ─── Schémas JSON-LD par page ─────────────────────────────────────────────────
function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CléAvenir',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Plateforme d\'orientation professionnelle propulsée par l\'IA',
    sameAs: [
      'https://www.facebook.com/cleavenir',
      'https://twitter.com/cleavenir',
      'https://www.linkedin.com/company/cleavenir'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      url: `${BASE_URL}/contact`,
      contactType: 'Customer Support'
    }
  };
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`
    }))
  };
}

// ─── Méta par route ───────────────────────────────────────────────────────────
const ROUTES = [
  {
    path: '/',
    title: 'CléAvenir - Test de Carrière Intelligent & Orientation IA',
    description: "CléAvenir : test d'orientation professionnel gratuit, analyse IA de vos compétences, milliers de formations (Parcoursup, alternance) et offres d'emploi en France.",
    keywords: 'orientation, orientation professionnelle, test orientation gratuit, quel métier faire, recherche métier, offres d\'emploi, carrière, formation, Parcoursup, alternance, stage, reconversion professionnelle, emploi',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }],
    schemaType: 'WebSite',
  },
  {
    path: '/test',
    title: "Test d'Orientation Professionnel Gratuit - CléAvenir",
    description: "Découvrez votre orientation professionnelle avec notre test gratuit alimenté par l'IA. Analysez vos compétences, trouvez les métiers et formations qui vous correspondent.",
    keywords: 'test orientation gratuit, test métier, quel métier me convient, trouver sa voie, IA orientation, Parcoursup, orientation après bac, reconversion professionnelle, bilan de compétences',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Test d\'Orientation', url: '/test' }],
    schemaType: 'WebApplication',
  },
  {
    path: '/metiers',
    title: 'Explorer les métiers - Fiches métiers détaillées | CléAvenir',
    description: 'Découvrez des centaines de fiches métiers détaillées : missions, compétences requises, salaires et opportunités d\'emploi en France.',
    keywords: 'recherche métier, fiches métiers, orientation professionnelle, quel métier choisir, métiers d\'avenir, salaires par métier, fiche ROME, reconversion professionnelle, changer de métier',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Métiers', url: '/metiers' }],
  },
  {
    path: '/formations',
    title: 'Formations en France - BTS, Licences, Masters | CléAvenir',
    description: 'Explorez des milliers de formations en France : BTS, licence, master, CAP, bachelor et plus. Trouvez la formation qui correspond à votre projet professionnel.',
    keywords: 'recherche formation, BTS, licence, master, CAP, bachelor, alternance, apprentissage, Parcoursup, école, université, CFA, formation professionnelle, orientation après bac',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Formations', url: '/formations' }],
  },
  {
    path: '/offres-emploi',
    title: "Offres d'emploi, Stages et Alternances en France | CléAvenir",
    description: "Parcourez des milliers d'offres d'emploi, de stages et d'alternances en France. Trouvez votre prochain poste grâce à notre moteur de recherche intelligent.",
    keywords: "offres d'emploi, recherche emploi, offres emploi France, alternance, stage, apprentissage, recrutement, CDI, CDD, intérim, freelance, emploi Paris, emploi Lyon, offre alternance 2025",
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Offres d\'emploi', url: '/offres-emploi' }],
  },
  {
    path: '/careers',
    title: 'Toutes les Carrières & Secteurs | CléAvenir',
    description: 'Explorez toutes les carrières disponibles par secteur d\'activité. Trouvez votre voie professionnelle grâce à notre catalogue complet de métiers.',
    keywords: 'carrières, secteurs d\'activité, liste carrières, orientation professionnelle, métiers par secteur, emploi, reconversion',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Carrières', url: '/careers' }],
  },
  {
    path: '/actualites',
    title: 'Blog Carrière & Orientation | CléAvenir',
    description: 'Conseils carrière, guides orientation, actualités emploi et formation. Restez informé pour prendre les meilleures décisions professionnelles.',
    keywords: 'blog carrière, conseils orientation, guide emploi, actualités formation, reconversion, alternance, bilan de compétences',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Actualités', url: '/actualites' }],
  },
  {
    path: '/blog',
    title: 'Blog Carrière & Orientation | CléAvenir',
    description: 'Conseils carrière, guides orientation, actualités emploi et formation. Restez informé pour prendre les meilleures décisions professionnelles.',
    keywords: 'blog carrière, conseils orientation, guide emploi, actualités formation, reconversion, alternance, bilan de compétences',
    ogType: 'website',
    isRedirect: true,
  },
  {
    path: '/how-it-works',
    title: 'Comment ça marche ? - CléAvenir',
    description: "Découvrez notre méthode unique d'orientation en 5 étapes. Test adaptatif, IA et données marché pour trouver votre voie.",
    keywords: 'orientation, comment fonctionne orientation, test carrière IA, méthode orientation professionnelle, trouver sa voie, bilan de compétences gratuit, reconversion',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Comment ça marche', url: '/how-it-works' }],
  },
  {
    path: '/plans',
    title: 'Nos Offres & Forfaits - CléAvenir',
    description: 'Découvrez les forfaits CléAvenir : Découverte gratuit, Premium et Premium+ pour un accompagnement complet dans votre orientation et carrière.',
    keywords: 'tarifs, forfaits, abonnement gratuit, premium, orientation professionnelle, test métier, prix CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Forfaits', url: '/plans' }],
  },
  {
    path: '/about',
    title: 'À propos de CléAvenir - Notre Mission',
    description: "Découvrez CléAvenir, la plateforme d'orientation professionnelle propulsée par l'IA. Notre mission : aider chacun à trouver sa voie.",
    keywords: 'à propos CléAvenir, mission, équipe, orientation IA, plateforme carrière',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'À propos', url: '/about' }],
  },
  {
    path: '/contact',
    title: 'Contactez CléAvenir - Support & Questions',
    description: "Besoin d'aide ? Contactez l'équipe CléAvenir pour toute question sur l'orientation, nos formations, vos offres d'emploi ou votre compte.",
    keywords: "contact CléAvenir, support, aide orientation, question offres emploi, question formation, assistance",
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Contact', url: '/contact' }],
  },
  {
    path: '/faq',
    title: "Centre d'aide & FAQ - CléAvenir",
    description: "Trouvez des réponses à vos questions sur l'orientation, le test CléAvenir, la gestion de compte et nos services.",
    keywords: "FAQ, aide, questions fréquentes, orientation, offres d'emploi, recherche métier, formation alternance, test carrière",
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'FAQ', url: '/faq' }],
  },
  {
    path: '/documentation',
    title: 'Documentation - CléAvenir',
    description: 'Documentation complète de CléAvenir : guides d\'utilisation, FAQ, tutoriels et ressources pour maximiser votre orientation professionnelle.',
    keywords: 'documentation, guides, tutoriels, ressources, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Documentation', url: '/documentation' }],
  },
  {
    path: '/roadmap',
    title: 'Feuille de Route - CléAvenir',
    description: 'Découvrez les fonctionnalités à venir sur CléAvenir : nouvelles intégrations, améliorations du test d\'orientation IA et outils carrière.',
    keywords: 'roadmap, feuille de route, nouveautés, fonctionnalités, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Feuille de route', url: '/roadmap' }],
  },
  {
    path: '/status',
    title: 'Statut du Service - CléAvenir',
    description: 'Vérifiez le statut en temps réel de la plateforme CléAvenir et consultez l\'historique de fiabilité.',
    keywords: 'statut, status page, disponibilité, fiabilité, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Statut', url: '/status' }],
  },
  {
    path: '/privacy',
    title: 'Politique de Confidentialité - CléAvenir',
    description: 'Découvrez comment CléAvenir collecte, utilise et protège vos données personnelles, conformément au RGPD.',
    keywords: 'politique confidentialité, RGPD, données personnelles, vie privée, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Politique de confidentialité', url: '/privacy' }],
  },
  {
    path: '/terms',
    title: "Conditions Générales d'Utilisation - CléAvenir",
    description: "Lisez les conditions générales d'utilisation de CléAvenir : droits, obligations, abonnements et règles d'utilisation de la plateforme.",
    keywords: 'CGU, conditions utilisation, mentions légales, abonnement, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Conditions générales', url: '/terms' }],
  },
  {
    path: '/legal',
    title: 'Mentions Légales - CléAvenir',
    description: "Mentions légales de CléAvenir : éditeur, hébergeur, propriété intellectuelle et informations légales obligatoires.",
    keywords: 'mentions légales, éditeur, hébergeur, SIRET, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Mentions légales', url: '/legal' }],
  },
  {
    path: '/legal/cookies',
    title: 'Gestion des Cookies - CléAvenir',
    description: 'Gérez vos préférences de cookies sur CléAvenir. Contrôlez quels cookies sont acceptés pour votre confort et votre sécurité.',
    keywords: 'cookies, gestion cookies, préférences, vie privée, CléAvenir',
    ogType: 'website',
    breadcrumb: [{ name: 'Accueil', url: '/' }, { name: 'Gestion des cookies', url: '/legal/cookies' }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectMeta(html, route) {
  const canonical = `${BASE_URL}${route.path}`;
  const title     = escape(route.title);
  const desc      = escape(route.description);
  const kw        = escape(route.keywords);

  // Construit le schéma JSON-LD
  let jsonLd = [buildOrganizationSchema()];
  if (route.breadcrumb) {
    jsonLd.push(buildBreadcrumbSchema(route.breadcrumb));
  }

  const metaBlock = `
    <!-- Prerendered meta — injected at build time -->
    <title>${title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${desc}" />
    <meta name="keywords" content="${kw}" />
    <meta name="author" content="CléAvenir" />
    <meta name="copyright" content="© 2024-2025 CléAvenir. All rights reserved." />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${route.ogType || 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <meta name="twitter:site" content="@cleavenir" />

    <!-- Apple / Mobile -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="CléAvenir" />

    <!-- Additional SEO -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="google-site-verification" content="" />
    <meta name="msvalidate.01" content="" />

    <!-- Preload critical resources -->
    <link rel="dns-prefetch" href="//api.cleavenir.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
    </script>
    <!-- /Prerendered meta -->`;

  // Replace the existing <title> and insert the full block before </head>
  return html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('</head>', `${metaBlock}\n  </head>`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const templatePath = path.join(DIST, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender-meta] dist/index.html not found — run vite build first');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
let generated = 0;

for (const route of ROUTES) {
  if (route.isRedirect) {
    console.log(`[prerender-meta] ⊳ ${route.path} (skipped - redirect)`);
    continue;
  }

  const html   = injectMeta(template, route);
  const outDir = route.path === '/' ? DIST : path.join(DIST, route.path);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  generated++;
  console.log(`[prerender-meta] ✓ ${route.path}`);
}

console.log(`[prerender-meta] ${generated} routes générées avec métadonnées complètes.`);
