#!/usr/bin/env node
/**
 * audit-seo.js
 * Post-build: Audit SEO complet du site généré
 * Vérifie : sitemap, robots.txt, métadonnées, canonical URLs, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DIST_DIR = path.resolve(__dirname, '../dist');

const BASE_URL = 'https://www.cleavenir.com';

class SEOAuditor {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }

  // ──── Vérifications du sitemap ────
  validateSitemap() {
    const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');

    if (!fs.existsSync(sitemapPath)) {
      this.errors.push('❌ sitemap.xml est manquant');
      return;
    }

    try {
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      const urlCount = (content.match(/<url>/g) || []).length;

      if (urlCount < 10) {
        this.warnings.push(`⚠️  Sitemap contient seulement ${urlCount} URLs (attendu: 20+)`);
      }

      if (!content.includes('<?xml version="1.0"')) {
        this.errors.push('❌ Sitemap ne commence pas par la déclaration XML');
      }

      if (!content.includes('xmlns="http://www.sitemaps.org')) {
        this.errors.push('❌ Sitemap manque la namespace XML');
      }

      this.successes.push(`✅ sitemap.xml valide (${urlCount} URLs)`);
    } catch (error) {
      this.errors.push(`❌ Erreur de lecture sitemap: ${error.message}`);
    }
  }

  // ──── Vérifications du robots.txt ────
  validateRobots() {
    const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');

    if (!fs.existsSync(robotsPath)) {
      this.errors.push('❌ robots.txt est manquant');
      return;
    }

    try {
      const content = fs.readFileSync(robotsPath, 'utf-8');

      if (!content.includes('User-agent: *')) {
        this.errors.push('❌ robots.txt ne contient pas User-agent: *');
      }

      if (!content.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)) {
        this.errors.push('❌ robots.txt ne déclare pas le sitemap');
      }

      if (!content.includes('Disallow:')) {
        this.warnings.push('⚠️  robots.txt ne contient pas de Disallow');
      }

      this.successes.push('✅ robots.txt valide');
    } catch (error) {
      this.errors.push(`❌ Erreur de lecture robots.txt: ${error.message}`);
    }
  }

  // ──── Vérifications des métadonnées ────
  validateMetadata() {
    const indexPath = path.join(DIST_DIR, 'index.html');

    if (!fs.existsSync(indexPath)) {
      this.errors.push('❌ dist/index.html est manquant');
      return;
    }

    try {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const checklist = {
        '<title>': /<title>[^<]+<\/title>/.test(content),
        'og:title': /property="og:title"/.test(content),
        'og:description': /property="og:description"/.test(content),
        'og:image': /property="og:image"/.test(content),
        'og:url': /property="og:url"/.test(content),
        'description': /name="description"/.test(content),
        'canonical': /rel="canonical"/.test(content),
        'viewport': /name="viewport"/.test(content),
        'json-ld': /application\/ld\+json/.test(content),
      };

      const missing = Object.entries(checklist)
        .filter(([_, present]) => !present)
        .map(([tag]) => tag);

      if (missing.length > 0) {
        this.errors.push(`❌ Métadonnées manquantes: ${missing.join(', ')}`);
      } else {
        this.successes.push('✅ Toutes les métadonnées essentielles présentes');
      }

      // Vérifie les balises prérendues
      if (!content.includes('Prerendered meta')) {
        this.warnings.push('⚠️  Les métadonnées prérendues ne sont pas détectées');
      } else {
        this.successes.push('✅ Métadonnées prérendues injectées');
      }
    } catch (error) {
      this.errors.push(`❌ Erreur de lecture métadonnées: ${error.message}`);
    }
  }

  // ──── Vérifications des routes statiques ────
  validateStaticRoutes() {
    const routes = ['/', '/test', '/metiers', '/formations', '/offres-emploi', '/plans', '/about', '/privacy', '/terms'];
    const missingRoutes = [];

    for (const route of routes) {
      const routePath = route === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route.slice(1), 'index.html');

      if (!fs.existsSync(routePath)) {
        missingRoutes.push(route);
      }
    }

    if (missingRoutes.length > 0) {
      this.warnings.push(`⚠️  Routes manquantes: ${missingRoutes.join(', ')}`);
    } else {
      this.successes.push(`✅ Toutes les ${routes.length} routes principales présentes`);
    }
  }

  // ──── Rapport final ────
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 AUDIT SEO — CléAvenir');
    console.log('='.repeat(60) + '\n');

    if (this.successes.length > 0) {
      console.log('✅ SUCCÈS:');
      this.successes.forEach(msg => console.log(`  ${msg}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  AVERTISSEMENTS:');
      this.warnings.forEach(msg => console.log(`  ${msg}`));
      console.log();
    }

    if (this.errors.length > 0) {
      console.log('❌ ERREURS:');
      this.errors.forEach(msg => console.log(`  ${msg}`));
      console.log();
      process.exit(1);
    }

    console.log('='.repeat(60));
    console.log('🎉 SEO audit réussi!');
    console.log('='.repeat(60) + '\n');
  }

  run() {
    this.validateSitemap();
    this.validateRobots();
    this.validateMetadata();
    this.validateStaticRoutes();
    this.generateReport();
  }
}

const auditor = new SEOAuditor();
auditor.run();
