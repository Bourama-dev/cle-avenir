#!/usr/bin/env node
/**
 * prerender-meta.js
 * Post-build: génère dist/<route>/index.html avec <title>, <meta>, og: et
 * canonical hardcodés dans le HTML statique.
 * Google lit ces balises immédiatement, sans exécuter JavaScript.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST      = path.resolve(__dirname, '../dist');
const BASE_URL  = 'https://cleavenir.com';
const OG_IMAGE  = `${BASE_URL}/og-image.jpg`;

// ─── Méta par route ───────────────────────────────────────────────────────────
const ROUTES = [
  {
    path: '/',
    title: 'CléAvenir - Test de Carrière Intelligent & Orientation IA',
    description: "CléAvenir : test d'orientation professionnel gratuit, analyse IA de vos compétences, milliers de formations (Parcoursup, alternance) et offres d'emploi en France.",
    keywords: 'orientation, orientation professionnelle, test orientation gratuit, quel métier faire, recherche métier, offres d\'emploi, carrière, formation, Parcoursup, alternance, stage, reconversion professionnelle, emploi',
  },
  {
    path: '/test',
    title: "Test d'Orientation Professionnel Gratuit - CléAvenir",
    description: "Découvrez votre orientation professionnelle avec notre test gratuit alimenté par l'IA. Analysez vos compétences, trouvez les métiers et formations qui vous correspondent.",
    keywords: 'test orientation gratuit, test métier, quel métier me convient, trouver sa voie, IA orientation, Parcoursup, orientation après bac, reconversion professionnelle, bilan de compétences',
  },
  {
    path: '/metiers',
    title: 'Explorer les métiers - Fiches métiers détaillées | CléAvenir',
    description: 'Découvrez des centaines de fiches métiers détaillées : missions, compétences requises, salaires et opportunités d\'emploi en France.',
    keywords: 'recherche métier, fiches métiers, orientation professionnelle, quel métier choisir, métiers d\'avenir, salaires par métier, fiche ROME, reconversion professionnelle, changer de métier',
  },
  {
    path: '/formations',
    title: 'Formations en France - BTS, Licences, Masters | CléAvenir',
    description: 'Explorez des milliers de formations en France : BTS, licence, master, CAP, bachelor et plus. Trouvez la formation qui correspond à votre projet professionnel.',
    keywords: 'recherche formation, BTS, licence, master, CAP, bachelor, alternance, apprentissage, Parcoursup, école, université, CFA, formation professionnelle, orientation après bac',
  },
  {
    path: '/offres-emploi',
    title: "Offres d'emploi, Stages et Alternances en France | CléAvenir",
    description: "Parcourez des milliers d'offres d'emploi, de stages et d'alternances en France. Trouvez votre prochain poste grâce à notre moteur de recherche intelligent.",
    keywords: "offres d'emploi, recherche emploi, offres emploi France, alternance, stage, apprentissage, recrutement, CDI, CDD, intérim, freelance, emploi Paris, emploi Lyon, offre alternance 2025",
  },
  {
    path: '/blog',
    title: 'Blog Carrière & Orientation | CléAvenir',
    description: 'Conseils carrière, guides orientation, actualités emploi et formation. Restez informé pour prendre les meilleures décisions professionnelles.',
    keywords: 'blog carrière, conseils orientation, guide emploi, actualités formation, reconversion, alternance, bilan de compétences',
  },
  {
    path: '/how-it-works',
    title: 'Comment ça marche ? - CléAvenir',
    description: "Découvrez notre méthode unique d'orientation en 5 étapes. Test adaptatif, IA et données marché pour trouver votre voie.",
    keywords: 'orientation, comment fonctionne orientation, test carrière IA, méthode orientation professionnelle, trouver sa voie, bilan de compétences gratuit, reconversion',
  },
  {
    path: '/careers',
    title: 'Toutes les Carrières & Secteurs | CléAvenir',
    description: 'Explorez toutes les carrières disponibles par secteur d\'activité. Trouvez votre voie professionnelle grâce à notre catalogue complet de métiers.',
    keywords: 'carrières, secteurs d\'activité, liste carrières, orientation professionnelle, métiers par secteur, emploi, reconversion',
  },
  {
    path: '/plans',
    title: 'Nos Offres & Forfaits - CléAvenir',
    description: 'Découvrez les forfaits CléAvenir : Découverte gratuit, Premium et Premium+ pour un accompagnement complet dans votre orientation et carrière.',
    keywords: 'tarifs, forfaits, abonnement gratuit, premium, orientation professionnelle, test métier, prix CléAvenir',
  },
  {
    path: '/about',
    title: 'À propos de CléAvenir - Notre Mission',
    description: "Découvrez CléAvenir, la plateforme d'orientation professionnelle propulsée par l'IA. Notre mission : aider chacun à trouver sa voie.",
    keywords: 'à propos CléAvenir, mission, équipe, orientation IA, plateforme carrière',
  },
  {
    path: '/contact',
    title: 'Contactez CléAvenir - Support & Questions',
    description: "Besoin d'aide ? Contactez l'équipe CléAvenir pour toute question sur l'orientation, nos formations, vos offres d'emploi ou votre compte.",
    keywords: "contact CléAvenir, support, aide orientation, question offres emploi, question formation, assistance",
  },
  {
    path: '/faq',
    title: "Centre d'aide & FAQ - CléAvenir",
    description: "Trouvez des réponses à vos questions sur l'orientation, le test CléAvenir, la gestion de compte et nos services.",
    keywords: "FAQ, aide, questions fréquentes, orientation, offres d'emploi, recherche métier, formation alternance, test carrière",
  },
  {
    path: '/roadmap',
    title: 'Feuille de Route - CléAvenir',
    description: 'Découvrez les fonctionnalités à venir sur CléAvenir : nouvelles intégrations, améliorations du test d\'orientation IA et outils carrière.',
    keywords: 'roadmap, feuille de route, nouveautés, fonctionnalités, CléAvenir',
  },
  {
    path: '/privacy',
    title: 'Politique de Confidentialité - CléAvenir',
    description: 'Découvrez comment CléAvenir collecte, utilise et protège vos données personnelles, conformément au RGPD.',
    keywords: 'politique confidentialité, RGPD, données personnelles, vie privée, CléAvenir',
  },
  {
    path: '/terms',
    title: "Conditions Générales d'Utilisation - CléAvenir",
    description: "Lisez les conditions générales d'utilisation de CléAvenir : droits, obligations, abonnements et règles d'utilisation de la plateforme.",
    keywords: 'CGU, conditions utilisation, mentions légales, abonnement, CléAvenir',
  },
  {
    path: '/legal',
    title: 'Mentions Légales - CléAvenir',
    description: "Mentions légales de CléAvenir : éditeur, hébergeur, propriété intellectuelle et informations légales obligatoires.",
    keywords: 'mentions légales, éditeur, hébergeur, SIRET, CléAvenir',
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

  const metaBlock = `
    <!-- Prerendered meta — injected at build time -->
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="keywords" content="${kw}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
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
  const html   = injectMeta(template, route);
  const outDir = route.path === '/' ? DIST : path.join(DIST, route.path);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  generated++;
  console.log(`[prerender-meta] ✓ ${route.path}`);
}

console.log(`[prerender-meta] ${generated} routes générées.`);
