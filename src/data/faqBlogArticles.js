import { getPublicBlogImageUrl } from '@/utils/blogImages';

/**
 * Helper to get image URL with fallback to placeholder
 */
const getImageUrl = (path) => {
  return getPublicBlogImageUrl(path) || 'https://images.unsplash.com/photo-1499750310159-52f0f83463cc?auto=format&fit=crop&q=80&w=1000';
};

export const faqBlogArticles = [
  {
    id: 'faq-1',
    title: 'Licence vs BTS : Quelles différences et comment choisir ?',
    slug: 'licence-vs-bts-differences-choix',
    category: 'orientation',
    excerpt: 'Comprendre les différences fondamentales entre la Licence universitaire et le BTS pour faire le meilleur choix post-bac selon votre profil.',
    content: `
      <p class="lead">Choisir entre une Licence et un BTS est un dilemme classique pour de nombreux lycéens. Ces deux formations mènent à des diplômes reconnus mais proposent des pédagogies, des rythmes et des débouchés très différents. Voici notre guide complet pour faire le bon choix.</p>
      <h2>1. La philosophie de la formation</h2>
      <p>La différence majeure réside dans l'approche pédagogique :</p>
      <ul>
        <li><strong>La Licence (Université) :</strong> C'est une formation généraliste et théorique. Elle vise à vous donner un socle de connaissances solides dans un domaine (Droit, Psychologie, Économie...) pour vous préparer généralement à une poursuite d'études en Master (Bac+5). L'autonomie est le maître-mot.</li>
        <li><strong>Le BTS (Brevet de Technicien Supérieur) :</strong> C'est une formation professionnalisante courte (2 ans). L'objectif est de vous rendre opérationnel sur le marché du travail rapidement. L'encadrement est proche de celui du lycée, avec des classes de 30 élèves environ.</li>
      </ul>
      <h2>2. Le rythme de travail et l'encadrement</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 rounded-lg">
          <thead>
            <tr class="bg-slate-50">
              <th class="border border-slate-200 p-3 text-left">Critère</th>
              <th class="border border-slate-200 p-3 text-left">Licence</th>
              <th class="border border-slate-200 p-3 text-left">BTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-200 p-3 font-medium">Volume horaire</td>
              <td class="border border-slate-200 p-3">15h à 20h de cours / semaine + beaucoup de travail personnel</td>
              <td class="border border-slate-200 p-3">30h à 35h de cours / semaine (rythme lycée)</td>
            </tr>
            <tr>
              <td class="border border-slate-200 p-3 font-medium">Encadrement</td>
              <td class="border border-slate-200 p-3">Autonomie totale, amphis de 100+ étudiants</td>
              <td class="border border-slate-200 p-3">Suivi personnalisé, assiduité contrôlée</td>
            </tr>
            <tr>
              <td class="border border-slate-200 p-3 font-medium">Évaluation</td>
              <td class="border border-slate-200 p-3">Partiels semestriels (stressant)</td>
              <td class="border border-slate-200 p-3">Contrôle continu + Examen final national</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    author: 'Sophie Martin',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Licence, BTS, Orientation, Post-bac, Université, Comparatif études',
    tags: ['études supérieures', 'comparatif', 'bac+3', 'orientation'],
    reading_time: 8,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 98
  },
  {
    id: 'faq-2',
    title: 'Comment choisir le métier qui me correspond vraiment ?',
    slug: 'comment-choisir-metier-correspond',
    category: 'conseils',
    excerpt: 'Découvrez notre méthode en 4 étapes pour identifier vos forces, vos passions et trouver la carrière alignée avec votre personnalité.',
    content: `
      <p class="lead">"Qu'est-ce que tu veux faire plus tard ?" Cette question angoissante revient sans cesse. Trouver sa voie n'est pas une illumination soudaine, mais le fruit d'une démarche structurée. Voici notre méthode en 4 étapes pour y voir plus clair.</p>
      <h2>Étape 1 : L'introspection (Qui suis-je ?)</h2>
      <p>Avant de regarder les métiers, regardez-vous. Prenez une feuille et répondez honnêtement :</p>
      <ul>
        <li><strong>Vos intérêts :</strong> Qu'est-ce que vous faites sans voir le temps passer ?</li>
        <li><strong>Vos valeurs :</strong> Qu'est-ce qui est non-négociable ?</li>
        <li><strong>Vos talents naturels :</strong> Que disent vos amis de vous ?</li>
      </ul>
    `,
    author: 'Thomas Dubois',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Orientation, Carrière, Choix métier, Ikigai, Bilan de compétences',
    tags: ['conseil carrière', 'introspection', 'projet pro', 'coaching'],
    reading_time: 10,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 95
  },
  {
    id: 'faq-3',
    title: 'Parcoursup : Les règles d\'or pour vos vœux',
    slug: 'parcoursup-regles-or-voeux',
    category: 'parcoursup',
    excerpt: 'Maximisez vos chances d\'admission en comprenant l\'algorithme et en suivant nos conseils stratégiques pour la formulation de vos vœux.',
    content: `
      <p class="lead">Parcoursup est souvent source d'angoisse pour les lycéens et leurs parents. Pourtant, c'est avant tout un outil qui obéit à des règles précises. Comprendre la stratégie est indispensable pour ne pas se retrouver "sur le carreau". Voici les règles d'or.</p>
      <h2>Règle N°1 : Ne vous autocensurez pas, mais soyez réaliste</h2>
      <p>Vous avez le droit à 10 vœux (et 20 sous-vœux). Utilisez-les !</p>
    `,
    author: 'Marie Leroy',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Parcoursup, Voeux, Inscription, Dossier, Stratégie, Admission Post-Bac',
    tags: ['admission', 'stratégie', 'dossier', 'lycée'],
    reading_time: 12,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 94
  },
  {
    id: 'faq-4',
    title: 'Quel salaire pour mon métier ? Guide des rémunérations 2024',
    slug: 'salaire-metier',
    category: 'metiers',
    excerpt: 'Analyse détaillée des grilles de salaires junior, facteurs d\'influence et conseils de négociation pour bien démarrer votre carrière.',
    content: `
      <p class="lead">Le salaire ne fait pas tout, mais il reste un critère de choix essentiel. En 2024, l'inflation et la pénurie de talents dans certains secteurs ont fait bouger les lignes. À quoi pouvez-vous prétendre en sortie d'études ? Voici les réalités du marché.</p>
      <h2>Les salaires médians par niveau d'études (Débutant)</h2>
      <p>Il s'agit de moyennes nationales (brut annuel), qui cachent de fortes disparités selon les secteurs.</p>
    `,
    author: 'Lucas Bernard',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Salaire, Rémunération, Premier emploi, Grille salariale, Négociation',
    tags: ['emploi', 'marché du travail', 'rémunération', 'finance'],
    reading_time: 10,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 92
  },
  {
    id: 'faq-5',
    title: 'Comment rédiger une lettre de motivation efficace ?',
    slug: 'lettre-motivation',
    category: 'conseils',
    excerpt: 'Fini les lettres types copiées-collées ! Apprenez à structurer votre discours, éviter les pièges et captiver le recruteur dès la première ligne.',
    content: `
      <p class="lead">"Madame, Monsieur, je suis dynamique et motivé..." Stop ! Les recruteurs lisent cette phrase 50 fois par jour. Une bonne lettre de motivation ne doit pas répéter votre CV, mais raconter une histoire : la rencontre entre votre projet et leur besoin.</p>
      <h2>La structure idéale : Le "Vous / Moi / Nous"</h2>
      <p>C'est la méthode classique car elle fonctionne redoutablement bien.</p>
    `,
    author: 'Julie Moreau',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Lettre de motivation, Recrutement, Candidature, Emploi, Modèle',
    tags: ['candidature', 'soft skills', 'écriture', 'conseils'],
    reading_time: 15,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 96
  },
  {
    id: 'faq-6',
    title: 'Les métiers qui recrutent le plus en 2024',
    slug: 'metiers-qui-recrutent',
    category: 'metiers',
    excerpt: 'Pénurie de talents, nouveaux besoins... Découvrez le Top 20 des secteurs en tension qui offrent le plus d\'opportunités d\'emploi immédiates.',
    content: `
      <p class="lead">Le marché du travail évolue vite. Entre la transition écologique, le vieillissement de la population et la révolution numérique, certains secteurs crient famine et peinent à recruter. Pour vous, c'est une aubaine : CDI rapide et salaires en hausse.</p>
    `,
    author: 'Antoine Petit',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Recrutement, Pénurie, Marché emploi, 2024, Top métiers, Avenir',
    tags: ['tendances', 'emploi', 'avenir', 'marché du travail'],
    reading_time: 8,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 98
  },
  {
    id: 'faq-7',
    title: 'Réussir votre stage : Le guide complet de A à Z',
    slug: 'reussir-stage',
    category: 'formations',
    excerpt: 'Le stage est souvent le premier pas vers l\'emploi. Comment le trouver, briller pendant la mission et le transformer en opportunité d\'embauche ?',
    content: `
      <p class="lead">Le stage n'est pas "juste pour valider l'année". C'est votre meilleure carte de visite. Un stage réussi, c'est souvent une proposition de CDD/CDI à la clé, ou à défaut, une recommandation en or pour votre futur employeur. Voici comment maximiser cette expérience.</p>
    `,
    author: 'Sarah Cohen',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Stage, Expérience, Réseau, Premier emploi, Conseils',
    tags: ['stage', 'expérience', 'insertion', 'réussite'],
    reading_time: 12,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 90
  },
  {
    id: 'faq-8',
    title: 'Financer vos études : Toutes les solutions (Bourses, Aides)',
    slug: 'financer-etudes',
    category: 'formations',
    excerpt: 'L\'argent ne doit pas être un frein. Bourses sur critères sociaux, alternance, prêts étudiants garantis... Guide complet des aides disponibles en 2024.',
    content: `
      <p class="lead">Le coût de la vie étudiante explose. Loyer, nourriture, transports, frais de scolarité... Étudier est un investissement. Heureusement, la France dispose d'un large éventail d'aides pour vous soutenir. Voici le tour d'horizon complet pour ne passer à côté d'aucun droit.</p>
    `,
    author: 'Nicolas Roux',
    featured_image: getImageUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000'),
    keywords: 'Financement, Bourse, CROUS, Alternance, Prêt étudiant, Aides CAF',
    tags: ['budget', 'aides', 'vie étudiante', 'financement'],
    reading_time: 14,
    published: true,
    published_at: new Date('2024-01-28').toISOString(),
    relevance: 93
  }
];