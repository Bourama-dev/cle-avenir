#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Génère public/sitemap.xml et public/robots.txt au moment du build Vite.
 * Lancé automatiquement via le script "build" dans package.json.
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://cleavenir.com';
const TODAY = new Date().toISOString().split('T')[0];

// ─── Routes statiques publiques ──────────────────────────────────────────────
// Exclure : /admin/*, /dashboard, /account, /settings, /maintenance,
//           /auth/*, /login, /signup, redirects, pages privées
const STATIC_ROUTES = [
  { url: '/',              changefreq: 'weekly',  priority: '1.0' },
  { url: '/metiers',       changefreq: 'weekly',  priority: '0.9' },
  { url: '/formations',    changefreq: 'weekly',  priority: '0.9' },
  { url: '/offres-emploi', changefreq: 'daily',   priority: '0.9' },
  { url: '/blog',          changefreq: 'weekly',  priority: '0.8' },
  { url: '/how-it-works',  changefreq: 'monthly', priority: '0.8' },
  { url: '/plans',         changefreq: 'monthly', priority: '0.8' },
  { url: '/about',         changefreq: 'monthly', priority: '0.7' },
  { url: '/contact',       changefreq: 'monthly', priority: '0.7' },
  { url: '/faq',           changefreq: 'monthly', priority: '0.7' },
  { url: '/careers',       changefreq: 'weekly',  priority: '0.7' },
  { url: '/test',          changefreq: 'monthly', priority: '0.6' },
  { url: '/privacy',       changefreq: 'yearly',  priority: '0.3' },
  { url: '/terms',         changefreq: 'yearly',  priority: '0.3' },
  { url: '/legal',         changefreq: 'yearly',  priority: '0.3' },
  { url: '/legal/cookies', changefreq: 'yearly',  priority: '0.3' },
  { url: '/status',        changefreq: 'monthly', priority: '0.4' },
  { url: '/roadmap',       changefreq: 'monthly', priority: '0.4' },
  { url: '/documentation', changefreq: 'monthly', priority: '0.5' },
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
  return `User-agent: *
Allow: /

# Exclure les espaces privés
Disallow: /admin/
Disallow: /dashboard
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
Disallow: /user/
Disallow: /establishment/
Disallow: /institution/
Disallow: /maintenance
Disallow: /auth

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
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
  console.log(`✅ robots.txt généré`);
}

main();
