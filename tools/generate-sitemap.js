#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Génère public/sitemap.xml et public/robots.txt au moment du build Vite.
 * Lancé automatiquement via le script "build" dans package.json.
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.cleavenir.com';
const TODAY = new Date().toISOString().split('T')[0];

// ─── Routes statiques publiques ──────────────────────────────────────────────
// Exclure : /admin/*, /dashboard, /account, /settings, /maintenance,
//           /auth/*, /login, /signup, redirects, pages privées
const STATIC_ROUTES = [
  // Accueil et navigation principale
  { url: '/',              changefreq: 'weekly',  priority: '1.0' },

  // Explorateurs (haute priorité)
  { url: '/metiers',       changefreq: 'weekly',  priority: '0.95' },
  { url: '/formations',    changefreq: 'weekly',  priority: '0.95' },
  { url: '/offres-emploi', changefreq: 'daily',   priority: '0.95' },
  { url: '/careers',       changefreq: 'weekly',  priority: '0.9' },

  // Test et orientation
  { url: '/test',          changefreq: 'daily',   priority: '0.92' },
  { url: '/how-it-works',  changefreq: 'monthly', priority: '0.8' },

  // Contenu éditorial
  { url: '/blog',          changefreq: 'weekly',  priority: '0.85' },
  { url: '/actualites',    changefreq: 'weekly',  priority: '0.85' },
  { url: '/documentation', changefreq: 'monthly', priority: '0.7' },

  // Pages commerciales
  { url: '/plans',         changefreq: 'monthly', priority: '0.8' },
  { url: '/about',         changefreq: 'monthly', priority: '0.75' },
  { url: '/contact',       changefreq: 'monthly', priority: '0.7' },
  { url: '/faq',           changefreq: 'monthly', priority: '0.7' },

  // Pages de statut
  { url: '/status',        changefreq: 'weekly',  priority: '0.5' },
  { url: '/roadmap',       changefreq: 'monthly', priority: '0.6' },

  // Pages légales
  { url: '/privacy',       changefreq: 'yearly',  priority: '0.4' },
  { url: '/terms',         changefreq: 'yearly',  priority: '0.4' },
  { url: '/legal',         changefreq: 'yearly',  priority: '0.4' },
  { url: '/legal/cookies', changefreq: 'yearly',  priority: '0.3' },

  // Anciennes URLs avec redirects (les crawlers les suivront)
  { url: '/test-orientation', changefreq: 'monthly', priority: '0.1' },
  { url: '/all-careers',      changefreq: 'monthly', priority: '0.1' },
  { url: '/tarifs',           changefreq: 'monthly', priority: '0.1' },
];

function buildSitemapXml(routes) {
  const urlEntries = routes.map(({ url, changefreq, priority }) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

function buildRobotsTxt() {
  return `# Robots.txt - CléAvenir
# Auto-généré lors du build

# Règles par défaut - Allow everything public
User-agent: *
Allow: /
Allow: /sitemap.xml

# ─── Pages à ne pas indexer ──────────────────────────────────────────────

# Espaces d'authentification
Disallow: /auth
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /update-password
Disallow: /email-confirmation-pending
Disallow: /oauth/

# Espaces privés (connectés)
Disallow: /admin/
Disallow: /dashboard
Disallow: /profile/
Disallow: /account
Disallow: /settings
Disallow: /my-documents
Disallow: /cv-builder
Disallow: /cover-letter-builder
Disallow: /interview
Disallow: /cleo
Disallow: /upgrade
Disallow: /manage-subscription
Disallow: /notifications
Disallow: /recommendations
Disallow: /offers-formations
Disallow: /personalized-plan
Disallow: /action-plan
Disallow: /results
Disallow: /test-history
Disallow: /apprentissage
Disallow: /user/
Disallow: /establishment/
Disallow: /institution/

# Pages de maintenance et dev
Disallow: /maintenance
Disallow: /edge-function-diagnostics

# ─── Règles spécifiques aux crawlers ──────────────────────────

# Crawlers rapides/agressifs
User-agent: MJ12bot
Crawl-delay: 2

User-agent: AhrefsBot
Crawl-delay: 1

User-agent: SemrushBot
Crawl-delay: 1

# ─── Sitemap ──────────────────────────────────────────────────

Sitemap: ${BASE_URL}/sitemap.xml

# ─── Cache Control ───────────────────────────────────────────

# Suggère aux crawlers une fréquence de rechéck
# (Non normalisé mais respecté par les bons crawlers)
`;
}

function main() {
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Sitemap
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildSitemapXml(STATIC_ROUTES), 'utf8');
  console.log(`✅ sitemap.xml généré — ${STATIC_ROUTES.length} URLs`);

  // robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, buildRobotsTxt(), 'utf8');
  console.log(`✅ robots.txt généré (SEO optimisé)`);
}

main();
