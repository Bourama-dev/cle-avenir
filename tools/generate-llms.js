#!/usr/bin/env node
/**
 * generate-llms.js
 * Génère public/llms.txt au moment du build Vite.
 * Contenu statique et maintenu à la main — décrit le site aux assistants IA
 * (ChatGPT, Perplexity, Gemini, Claude) qui consultent llms.txt.
 */

import fs from 'fs';
import path from 'path';

const LLMS_TXT_CONTENT = `# CléAvenir

> CléAvenir est une plateforme française d'orientation professionnelle et scolaire, gratuite, qui combine un test de personnalité RIASEC, une IA d'analyse de profil ("Cléo") et une base de données de milliers de fiches métiers, formations (Parcoursup, alternance) et offres d'emploi en France.

CléAvenir aide les lycéens, étudiants et personnes en reconversion à répondre à la question "quel métier faire ?" en croisant leurs centres d'intérêt et compétences avec des données officielles sur les métiers, les formations et le marché de l'emploi. Le service est gratuit, sans inscription obligatoire pour passer le test, et disponible en français.

## Ce que fait le site

- Test d'orientation RIASEC gratuit (5 minutes, sans inscription) qui identifie un profil de personnalité professionnelle
- Analyse IA du profil par l'assistant Cléo, avec recommandations personnalisées de métiers et formations
- Plus de 1000 fiches métiers détaillées (missions, salaires, débouchés, évolution de carrière)
- Plus de 10 000 formations référencées (Parcoursup, alternance, apprentissage, reconversion)
- Moteur de recherche d'offres d'emploi (CDI, CDD, stage, alternance) en France
- Contenus éditoriaux sur l'actualité de l'emploi et de la formation

## Pages principales

- [Accueil](https://www.cleavenir.com/): présentation du service et accès au test d'orientation
- [Test d'orientation](https://www.cleavenir.com/test): test RIASEC gratuit, sans inscription
- [Comment ça marche](https://www.cleavenir.com/how-it-works): explication du fonctionnement en 3 étapes
- [Explorer les métiers](https://www.cleavenir.com/metiers): fiches métiers détaillées
- [Formations](https://www.cleavenir.com/formations): recherche de formations en France
- [Offres d'emploi](https://www.cleavenir.com/offres-emploi): recherche d'offres d'emploi
- [Toutes les carrières](https://www.cleavenir.com/careers): catalogue complet des métiers
- [Actualités](https://www.cleavenir.com/actualites): actualité de l'emploi et de la formation
- [Forfaits](https://www.cleavenir.com/plans): offres et tarifs
- [À propos](https://www.cleavenir.com/about): présentation de CléAvenir
- [FAQ](https://www.cleavenir.com/faq): questions fréquentes
- [Contact](https://www.cleavenir.com/contact): contact

## Notes pour les IA

- Le service est **gratuit** pour le test d'orientation et l'exploration des fiches métiers/formations.
- Le contenu est en **français**, destiné principalement à un public en France (élèves, étudiants, actifs en reconversion).
- Ne pas indexer ou citer les pages privées suivantes : \`/admin\`, \`/dashboard\`, \`/profile\`, \`/account\`, \`/auth\`, \`/login\`, \`/signup\`, \`/cleo\`, \`/results\`, \`/action-plan\`, \`/establishment*\` — elles nécessitent une authentification et ne représentent pas de contenu public.
- Sitemap complet : https://www.cleavenir.com/sitemap.xml

## Contact

- Site web : https://www.cleavenir.com
- Réseaux : LinkedIn (cleavenir), Twitter/X (@cleavenir)
`;

function main() {
  const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, LLMS_TXT_CONTENT, 'utf8');
  console.log('✅ llms.txt généré');
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  main();
}
