#!/usr/bin/env node
/**
 * generate-seo-headers.js
 * Génère une configuration Vercel vercel.json avec les headers SEO optimisés.
 * Exécuté lors du build pour s'assurer que les robots et crawlers reçoivent
 * les bons headers HTTP pour l'indexation.
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.cleavenir.com';

// Routes publiques à indexer
const PUBLIC_ROUTES = [
  '/',
  '/test',
  '/metiers',
  '/formations',
  '/offres-emploi',
  '/careers',
  '/actualites',
  '/how-it-works',
  '/plans',
  '/about',
  '/contact',
  '/faq',
  '/documentation',
  '/roadmap',
  '/status',
  '/privacy',
  '/terms',
  '/legal',
];

// Routes privées à ne PAS indexer
const PRIVATE_ROUTES = [
  '/admin',
  '/dashboard',
  '/profile',
  '/account',
  '/settings',
  '/my-documents',
  '/cv-builder',
  '/cover-letter-builder',
  '/interview',
  '/cleo',
  '/upgrade',
  '/manage-subscription',
  '/notifications',
  '/recommendations',
  '/offers-formations',
  '/personalized-plan',
  '/action-plan',
  '/results',
  '/test-history',
  '/apprentissage',
  '/user',
  '/establishment',
  '/institution',
  '/auth',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/maintenance',
];

function buildVercelJson() {
  const headers = [
    // ──── Headers par défaut (tout public) ────
    {
      source: '/:path((?!.*\\.(js|css|gif|png|jpg|jpeg|webp|woff|woff2|svg|ico|eot|ttf)$).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()'
        }
      ]
    },

    // ──── Static assets (long cache) ────
    {
      source: '/assets/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },

    // ──── Sitemap & robots.txt ────
    {
      source: '/(sitemap\\.xml|robots\\.txt)',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/xml; charset=utf-8'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400'
        }
      ]
    },

    // ──── Pages privées - NO INDEX ────
    ...PRIVATE_ROUTES.map(route => ({
      source: `${route}/:path*`,
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow'
        },
        {
          key: 'Cache-Control',
          value: 'private, no-cache'
        }
      ]
    })),

    // ──── Pages publiques - INDEX ────
    ...PUBLIC_ROUTES.map(route => ({
      source: route === '/' ? '/' : `${route}/:path*`,
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'index, follow'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate'
        }
      ]
    })),

    // ──── Redirects avec header approprié ────
    {
      source: '/tarifs',
      headers: [
        {
          key: 'Link',
          value: `<${BASE_URL}/plans>; rel="canonical"`
        }
      ]
    },
    {
      source: '/test-orientation',
      headers: [
        {
          key: 'Link',
          value: `<${BASE_URL}/test>; rel="canonical"`
        }
      ]
    },
  ];

  return { headers };
}

function main() {
  const configPath = path.join(process.cwd(), 'vercel.json');

  try {
    // Essaye de lire la config existante
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }

    // Fusionner avec nos headers
    config.headers = buildVercelJson().headers;

    // Écrire la config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`✅ vercel.json généré — ${config.headers.length} headers configurés`);
  } catch (error) {
    console.warn('⚠️  vercel.json not needed locally (Vercel uses this on deployment)');
  }
}

main();
