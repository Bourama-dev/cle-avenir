import { getPublicBlogImageUrl } from '@/utils/blogImages';

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
              <td class="border border-slate-200 p-3">15h à 20h de cours / semaine + travail personnel intensif</td>
              <td class="border border-slate-200 p-3">30h à 35h de cours / semaine (rythme lycée)</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="border border-slate-200 p-3 font-medium">Encadrement</td>
              <td class="border border-slate-200 p-3">Autonomie totale, amphis de 100+ étudiants</td>
              <td class="border border-slate-200 p-3">Suivi personnalisé, assiduité contrôlée</td>
            </tr>
            <tr>
              <td class="border border-slate-200 p-3 font-medium">Évaluation</td>
              <td class="border border-slate-200 p-3">Partiels semestriels (stressant)</td>
              <td class="border border-slate-200 p-3">Contrôle continu + Examen final national</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="border border-slate-200 p-3 font-medium">Stage</td>
              <td class="border border-slate-200 p-3">Souvent optionnel (selon parcours)</td>
              <td class="border border-slate-200 p-3">Obligatoire (2 mois minimum)</td>
            </tr>
            <tr>
              <td class="border border-slate-200 p-3 font-medium">Coût</td>
              <td class="border border-slate-200 p-3">Frais d'inscription ~400–700€/an (université publique)</td>
              <td class="border border-slate-200 p-3">Gratuit en lycée public ; ~5 000–12 000€/an en école privée</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Les débouchés après chaque diplôme</h2>
      <h3>Après un BTS (Bac+2)</h3>
      <p>Le BTS vous donne accès immédiat au marché du travail. C'est son grand atout. Cependant, attention aux <strong>plafonds de verre</strong> : sans poursuite d'études, l'évolution vers des postes de management peut être plus lente. Les options après un BTS :</p>
      <ul>
        <li>✅ <strong>Insertion directe :</strong> Technicien, assistant, chargé de clientèle... avec un salaire débutant entre 22 000€ et 28 000€/an.</li>
        <li>📚 <strong>Poursuite en Licence Pro (Bac+3) :</strong> La passerelle la plus courante pour acquérir un niveau supplémentaire.</li>
        <li>🎓 <strong>Intégrer une École en 3ème année :</strong> Certaines Écoles de Commerce ou d'Ingénieurs recrutent des BTS sur concours.</li>
      </ul>

      <h3>Après une Licence (Bac+3)</h3>
      <p>La Licence est avant tout un tremplin vers le Master. La grande majorité des licenciés poursuivent en Master 1 et 2, car le marché de l'emploi valorise peu le Bac+3 seul (sauf Licence Pro). Les options :</p>
      <ul>
        <li>📚 <strong>Continuer en Master :</strong> La trajectoire classique. Les masters sélectifs ouvrent les portes des grandes entreprises.</li>
        <li>🏫 <strong>Intégrer une Grande École :</strong> Via des concours post-licence (Sciences Po, Dauphine, etc.).</li>
        <li>✅ <strong>Insertion directe avec Licence Pro :</strong> La Licence Pro (Bac+3 professionnel) est la seule licence vraiment reconnue pour l'insertion rapide.</li>
      </ul>

      <h2>4. Pour quel profil choisir quoi ?</h2>
      <blockquote>
        <strong>Choisissez le BTS si :</strong> Vous êtes concret, vous avez un projet professionnel clair, vous aimez les cours encadrés, vous souhaitez travailler rapidement ou financer vos études via l'alternance.
      </blockquote>
      <blockquote>
        <strong>Choisissez la Licence si :</strong> Vous aimez réfléchir, analyser, vous êtes à l'aise avec l'autonomie, vous avez une passion pour une discipline (Littérature, Sciences...) et vous envisagez de poursuivre longtemps.
      </blockquote>

      <h2>5. L'astuce : la Licence Pro, le meilleur des deux mondes ?</h2>
      <p>La <strong>Licence Professionnelle</strong> (Bac+3) mérite une attention particulière. Accessible après un BTS ou une L2, elle est <strong>professionnalisante</strong> (comme le BTS) mais à un niveau supérieur (comme la Licence). Son taux d'insertion à 6 mois avoisine les <strong>90%</strong>. C'est souvent la stratégie optimale : BTS → Licence Pro → emploi ou Master.</p>

      <h2>Conclusion</h2>
      <p>Il n'y a pas de "meilleure" voie universelle. La meilleure formation est celle qui correspond à <em>votre</em> personnalité, <em>votre</em> projet et <em>votre</em> situation. N'hésitez pas à utiliser les journées portes ouvertes et à rencontrer des professionnels du secteur avant de décider.</p>
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
        <li><strong>Vos valeurs :</strong> Qu'est-ce qui est non-négociable pour vous ? (Autonomie, Sécurité, Impact social, Créativité...)</li>
        <li><strong>Vos talents naturels :</strong> Que disent vos amis de vous ? Dans quoi réussissez-vous sans effort ?</li>
        <li><strong>Vos contraintes :</strong> Êtes-vous prêt à bouger ? Accepter des horaires décalés ? Travailler en équipe ?</li>
      </ul>
      <p>Outil utile : le <strong>bilan RIASEC</strong> (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel) est un test psychologique reconnu pour identifier vos préférences professionnelles. CléAvenir vous propose de le passer gratuitement.</p>

      <h2>Étape 2 : Explorer le marché (Qu'existe-t-il ?)</h2>
      <p>Le monde du travail compte plus de <strong>10 000 métiers référencés</strong> en France. La plupart des gens n'en connaissent qu'une centaine. Pour explorer :</p>
      <ul>
        <li>🗺️ <strong>Utilisez CléAvenir :</strong> Notre section "Métiers" vous permet d'explorer par secteur, niveau d'études requis et salaire.</li>
        <li>💬 <strong>Faites des entretiens informationnels :</strong> Contactez des professionnels sur LinkedIn et demandez-leur 20 minutes pour parler de leur quotidien. 80% des gens disent oui.</li>
        <li>🎥 <strong>Regardez des "Une journée avec..." :</strong> De nombreux YouTubeurs documentent leur métier au quotidien.</li>
        <li>📖 <strong>Consultez le ROME :</strong> Le référentiel officiel des métiers de France Travail (ex-Pôle Emploi).</li>
      </ul>

      <h2>Étape 3 : Confronter vos idées à la réalité (Test & Learn)</h2>
      <p>Avant de vous lancer dans 5 ans de formation, <strong>testez</strong> !</p>
      <ul>
        <li><strong>Stage d'observation :</strong> Même une semaine suffit pour savoir si un environnement vous attire ou vous rebute.</li>
        <li><strong>Bénévolat / associatif :</strong> Excellent pour tester des compétences sans risque.</li>
        <li><strong>Projet personnel :</strong> Si vous voulez être développeur web, créez un site. Si vous voulez être journaliste, lancez un blog.</li>
        <li><strong>Formations courtes en ligne :</strong> Avant de vous engager dans un Master de 2 ans, suivez un MOOC de 10 heures sur le sujet.</li>
      </ul>

      <h2>Étape 4 : Décider (et accepter l'incertitude)</h2>
      <p>Voici la vérité inconfortable : <strong>vous n'aurez jamais une certitude absolue</strong> avant de vous lancer. Et c'est normal. Les études montrent que 60% des actifs changeront de voie professionnelle au moins une fois dans leur vie.</p>
      <blockquote>
        "La pire décision n'est pas de choisir la "mauvaise" voie, c'est de ne pas choisir et de rester bloqué." — Coach carrière
      </blockquote>
      <p>Utilisez la méthode de l'<strong>ikigai</strong> japonais : trouvez l'intersection entre ce que vous aimez, ce pour quoi vous êtes doué, ce dont le monde a besoin et ce pour quoi vous pouvez être payé. Cette intersection est votre voie.</p>

      <h2>Et si je me trompe ?</h2>
      <p>La réorientation n'est pas un échec. C'est une donnée normale du parcours professionnel. En France, le <strong>Bilan de Compétences</strong> (financé par le CPF) vous accompagne à tout âge pour faire le point et redéfinir votre projet. N'attendez pas de toucher le fond pour faire ce bilan.</p>
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
      <p>Vous avez le droit à <strong>10 vœux</strong> (et 20 sous-vœux pour les formations sans classement). Utilisez-les tous ! Le fait de formuler un vœu pour une formation très sélective ne pénalise en aucun cas vos autres vœux. En revanche, formulez un <strong>spectre de vœux équilibré</strong> :</p>
      <ul>
        <li>🎯 <strong>2-3 vœux ambitieux :</strong> Formations dont vous êtes en dessous du profil médian.</li>
        <li>✅ <strong>4-5 vœux réalistes :</strong> Formations correspondant exactement à votre profil.</li>
        <li>🛡️ <strong>2-3 vœux sécurisés :</strong> Formations où vous êtes largement au-dessus du profil médian (filets de sécurité).</li>
      </ul>

      <h2>Règle N°2 : Soignez votre lettre de motivation (Projet de formation motivé)</h2>
      <p>Ce document est <strong>crucial</strong>. Les examinateurs le lisent, surtout dans les filières sélectives. Une bonne lettre répond à deux questions :</p>
      <ul>
        <li><strong>Pourquoi cette formation ?</strong> Montrez que vous connaissez le programme, les débouchés, la pédagogie de l'établissement.</li>
        <li><strong>Pourquoi vous ?</strong> Reliez votre parcours, vos compétences et vos projets aux attendus de la formation.</li>
      </ul>
      <p>⚠️ <strong>Évitez absolument</strong> les lettres génériques copiées-collées. Un jury repère immédiatement un texte passe-partout.</p>

      <h2>Règle N°3 : Comprenez les "attendus"</h2>
      <p>Chaque formation publie sur Parcoursup ses <strong>critères d'examen des dossiers</strong> (de 20% à 60% selon les formations). Consultez-les méticuleusement :</p>
      <ul>
        <li>Les matières valorisées (ex: Maths pour un BTS Comptabilité, SVT pour une Licence Sciences)</li>
        <li>Le niveau de résultats attendu (moyenne générale, résultats dans les matières clés)</li>
        <li>Les activités extrascolaires valorisées</li>
        <li>La rubrique "Savoir-faire et savoir-être" dans votre dossier</li>
      </ul>

      <h2>Règle N°4 : Renseignez-vous sur le taux d'accès</h2>
      <p>Parcoursup affiche les <strong>statistiques d'admission de l'année précédente</strong> (taux d'accès, profil des admis). Utilisez ces données pour calibrer votre stratégie. Un taux d'accès de 12% signifie qu'il y a 8 fois plus de candidats que de places. Un taux de 95% signifie que presque tout le monde est admis.</p>

      <h2>Règle N°5 : La phase complémentaire, dernier recours ou vraie chance ?</h2>
      <p>Si vous n'avez reçu aucune proposition satisfaisante en phase principale (ou si vous avez refusé toutes vos admissions), la <strong>Phase Complémentaire</strong> (ouvre en juin) permet de candidater sur des formations avec des places disponibles. Ne la sous-estimez pas : des milliers d'étudiants trouvent leur voie ici chaque année.</p>

      <h2>Le calendrier clé de Parcoursup 2025</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 rounded-lg">
          <thead>
            <tr class="bg-indigo-50">
              <th class="border border-slate-200 p-3 text-left text-indigo-800">Période</th>
              <th class="border border-slate-200 p-3 text-left text-indigo-800">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-slate-200 p-3 font-medium">Janvier — Février</td><td class="border border-slate-200 p-3">Ouverture de la plateforme, saisie des vœux</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Février — Mars</td><td class="border border-slate-200 p-3">Finalisation des dossiers et lettres de motivation</td></tr>
            <tr><td class="border border-slate-200 p-3 font-medium">Mi-Mars</td><td class="border border-slate-200 p-3">Date limite de confirmation des vœux</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Fin mars — Juin</td><td class="border border-slate-200 p-3">Étude des dossiers par les établissements</td></tr>
            <tr><td class="border border-slate-200 p-3 font-medium">Début Juin</td><td class="border border-slate-200 p-3">Début de la phase principale (réponses)</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Fin Juin</td><td class="border border-slate-200 p-3">Phase Complémentaire</td></tr>
            <tr><td class="border border-slate-200 p-3 font-medium">Juillet</td><td class="border border-slate-200 p-3">Commission d'accès à l'enseignement supérieur (recours)</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Conclusion : Parcoursup n'est qu'un outil</h2>
      <p>Parcoursup ne définit pas votre valeur, ni votre avenir. Des milliers d'étudiants ont tracé des parcours brillants depuis des formations qu'ils n'avaient pas choisies en premier. Ce qui compte, c'est ce que vous faites une fois que vous êtes là-dedans. Bonne chance !</p>
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

      <h2>Les salaires médians par niveau d'études (Débutant, brut annuel)</h2>
      <p>Il s'agit de moyennes nationales (brut annuel), qui cachent de fortes disparités selon les secteurs et les régions.</p>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 rounded-lg">
          <thead>
            <tr class="bg-emerald-50">
              <th class="border border-slate-200 p-3 text-left">Niveau de diplôme</th>
              <th class="border border-slate-200 p-3 text-left">Salaire médian débutant</th>
              <th class="border border-slate-200 p-3 text-left">Fourchette courante</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-slate-200 p-3 font-medium">CAP / BEP</td><td class="border border-slate-200 p-3">~21 000 €</td><td class="border border-slate-200 p-3">18 000 — 25 000 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Bac</td><td class="border border-slate-200 p-3">~21 500 €</td><td class="border border-slate-200 p-3">19 000 — 26 000 €</td></tr>
            <tr><td class="border border-slate-200 p-3 font-medium">BTS / DUT / BUT (Bac+2/3)</td><td class="border border-slate-200 p-3">~25 500 €</td><td class="border border-slate-200 p-3">22 000 — 30 000 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Licence Pro (Bac+3)</td><td class="border border-slate-200 p-3">~27 000 €</td><td class="border border-slate-200 p-3">24 000 — 33 000 €</td></tr>
            <tr><td class="border border-slate-200 p-3 font-medium">Master / Grande École (Bac+5)</td><td class="border border-slate-200 p-3">~37 000 €</td><td class="border border-slate-200 p-3">30 000 — 55 000 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-medium">Bac+5 Ingénieur</td><td class="border border-slate-200 p-3">~42 000 €</td><td class="border border-slate-200 p-3">36 000 — 60 000 €</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Les secteurs qui paient le mieux les débutants</h2>
      <ul>
        <li>💻 <strong>Tech & Informatique :</strong> Les développeurs, data scientists et ingénieurs cloud démarrent souvent entre 35 000€ et 48 000€. Les profils rares (IA, cybersécurité) peuvent dépasser les 55 000€ dès la sortie d'école.</li>
        <li>💰 <strong>Finance & Banque d'investissement :</strong> Les "Grandes Lignes" des banques d'affaires paient les juniors 55 000€ à 80 000€ avec bonus, mais les horaires sont extrêmes.</li>
        <li>⚕️ <strong>Pharmacie & Médical :</strong> Les pharmaciens et médecins ont des salaires élevés mais après de longues études (8–10 ans).</li>
        <li>⚙️ <strong>Ingénierie industrielle :</strong> Aéronautique (Airbus, Safran), Défense, Énergie : 38 000 — 52 000€ pour un ingénieur débutant.</li>
        <li>📊 <strong>Conseil (Consulting) :</strong> Les grands cabinets (McKinsey, BCG, Accenture...) rémunèrent les juniors de 45 000€ à 60 000€.</li>
      </ul>

      <h2>Les 5 facteurs qui font vraiment varier le salaire</h2>
      <ul>
        <li>📍 <strong>La localisation :</strong> Paris paie en moyenne 20% de plus que la province, mais le coût de la vie est aussi bien plus élevé.</li>
        <li>🏢 <strong>La taille de l'entreprise :</strong> Les grandes entreprises (CAC 40) rémunèrent mieux que les PME, mais les PME et startups compensent parfois avec des stock-options.</li>
        <li>🔥 <strong>La rareté du profil :</strong> Dans un secteur en tension (dev, data, cybersécurité), votre valeur monte automatiquement.</li>
        <li>🤝 <strong>Votre capacité à négocier :</strong> Voir section suivante.</li>
        <li>🎓 <strong>La réputation de l'école ou de l'université :</strong> HEC, Polytechnique, Sciences Po ouvrent des portes différentes des universités de province (même à diplôme équivalent).</li>
      </ul>

      <h2>Comment négocier son salaire sans se planter ?</h2>
      <ol>
        <li><strong>Faites vos recherches avant l'entretien :</strong> Utilisez des sites comme Glassdoor, LinkedIn Salaires, Welcome to the Jungle pour connaître les fourchettes du marché.</li>
        <li><strong>Annoncez une fourchette, pas un chiffre fixe :</strong> "Je vise entre 32 000 et 36 000€" laisse de la marge de négociation des deux côtés.</li>
        <li><strong>Valorisez les compétences rares :</strong> Si vous maîtrisez un outil rare (Salesforce, certifications cloud, langues exotiques), mentionnez-le explicitement.</li>
        <li><strong>N'oubliez pas le package :</strong> Télétravail, tickets restaurant, mutuelle, intéressement, formations... Un package à 30 000€ + 3 000€ d'avantages peut valoir un salaire de 33 000€ brut.</li>
        <li><strong>Sachez quand ne pas insister :</strong> Si l'employeur est à sa limite budgétaire, négociez une clause de révision à 6 mois plutôt qu'un refus définitif.</li>
      </ol>

      <h2>SMIC, brut, net : décryptage des termes</h2>
      <ul>
        <li>💶 <strong>SMIC 2024 :</strong> 1 766,92 € brut / mois soit 21 203 € brut / an (11,65 €/h).</li>
        <li>📉 <strong>Brut → Net :</strong> En France, le net représente environ <strong>75-78% du brut</strong> (cotisations salariales). Ex : 30 000€ brut ≈ 22 500-23 400€ net.</li>
        <li>🏦 <strong>Net à déclarer :</strong> Le net fiscal (avant impôt sur le revenu) est légèrement supérieur au net perçu.</li>
      </ul>
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
      <p>C'est la méthode classique car elle fonctionne redoutablement bien :</p>
      <ul>
        <li><strong>VOUS (1er paragraphe) :</strong> Parlez de l'entreprise. Montrez que vous la connaissez (un projet récent, une valeur qui vous attire, un produit que vous appréciez). Vous captez immédiatement l'attention.</li>
        <li><strong>MOI (2ème paragraphe) :</strong> Présentez vos compétences et expériences les plus pertinentes <em>pour ce poste précis</em>. Ne résumez pas votre CV — illustrez avec un résultat concret.</li>
        <li><strong>NOUS (3ème paragraphe) :</strong> Projetez-vous ensemble. Comment votre profil répond-il exactement au besoin exprimé ? Quel est votre apport spécifique ?</li>
      </ul>

      <h2>Les erreurs qui tuent une candidature</h2>
      <ul>
        <li>❌ <strong>La lettre générique :</strong> "Je postule pour le poste de [NOM DU POSTE] dans votre entreprise". Si on voit que vous avez juste changé le nom, c'est terminé.</li>
        <li>❌ <strong>Répéter le CV :</strong> La lettre complète le CV, elle ne le recopie pas. Pas besoin d'écrire "J'ai obtenu mon BTS en 2023" si c'est dans le CV.</li>
        <li>❌ <strong>Les adjectifs vides :</strong> "Je suis sérieux, rigoureux, dynamique..." → Tout le monde le dit. Prouvez-le avec un exemple concret.</li>
        <li>❌ <strong>La longueur excessive :</strong> Une page maximum, idéalement 3-4 paragraphes. Les recruteurs passent moins de 30 secondes sur une lettre en première lecture.</li>
        <li>❌ <strong>Les fautes :</strong> Relisez 3 fois. Faites relire par quelqu'un d'autre. Une faute d'orthographe sur "Madame la Directrice" et votre lettre finit à la corbeille.</li>
      </ul>

      <h2>L'accroche : la phrase qui change tout</h2>
      <p>Les 15 premières secondes de lecture déterminent si le recruteur continue. Voici des types d'accroches qui fonctionnent :</p>
      <ul>
        <li>🔍 <strong>L'accroche chiffre :</strong> "Votre startup a multiplié son CA par 3 en 2 ans. En tant que passionné de growth, cette trajectoire me motive profondément."</li>
        <li>💡 <strong>L'accroche problème/solution :</strong> "Le secteur logistique fait face à une pénurie de 10 000 chauffeurs. C'est précisément pour contribuer à ce défi que je vous contacte."</li>
        <li>🎯 <strong>L'accroche connexion personnelle :</strong> "J'utilise votre application depuis 3 ans. En tant qu'UX designer, je vois chaque jour comment vous avez simplifié la vie de vos utilisateurs — et j'aimerais y contribuer."</li>
      </ul>

      <h2>Adapter la lettre selon le canal de candidature</h2>
      <p>La lettre ne s'écrit pas de la même façon selon le contexte :</p>
      <ul>
        <li>📧 <strong>Email de candidature :</strong> Plus court (5-8 lignes), moins formel. L'objet est crucial.</li>
        <li>📄 <strong>Candidature classique (PDF) :</strong> Format lettre standard, une page.</li>
        <li>💼 <strong>LinkedIn :</strong> Un message court (200 mots max) + lien vers votre profil complet.</li>
        <li>🎓 <strong>Parcoursup (Projet de formation motivé) :</strong> Plus personnel, parlez de votre projet de vie et de vos aspirations, pas seulement de vos compétences.</li>
      </ul>

      <h2>Exemple de lettre réussie (extrait)</h2>
      <blockquote>
        "J'ai suivi avec intérêt le lancement de votre gamme de produits éco-responsables, qui illustre parfaitement comment concilier performance commerciale et engagement environnemental. C'est exactement la philosophie que je souhaite défendre dans ma carrière.<br/><br/>
        Au cours de mon alternance chez [Entreprise X], j'ai contribué à réduire de 18% le taux d'abandon panier grâce à une refonte de l'UX du tunnel de commande. Cette expérience m'a convaincu que l'analyse des données comportementales est un levier sous-exploité dans la distribution.<br/><br/>
        Je serais heureux d'échanger sur la façon dont mon expertise en analyse e-commerce pourrait renforcer votre équipe digitale."
      </blockquote>
      <p><em>Remarquez : concret, chiffré, centré sur la valeur apportée — pas sur les qualités personnelles.</em></p>

      <h2>Le mot de la fin</h2>
      <p>Une lettre de motivation efficace n'est pas une formule magique, c'est un exercice de <strong>communication ciblée</strong>. Prenez le temps de personnaliser chaque lettre. Oui, ça prend du temps. Mais envoyer 10 lettres ciblées vaut mieux que 100 lettres génériques.</p>
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

      <h2>🏆 Le Top 10 des métiers les plus recherchés en 2024</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 rounded-lg">
          <thead>
            <tr class="bg-rose-50">
              <th class="border border-slate-200 p-3 text-left">#</th>
              <th class="border border-slate-200 p-3 text-left">Métier</th>
              <th class="border border-slate-200 p-3 text-left">Secteur</th>
              <th class="border border-slate-200 p-3 text-left">Salaire débutant</th>
              <th class="border border-slate-200 p-3 text-left">Tension</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-slate-200 p-3 font-bold text-rose-600">1</td><td class="border border-slate-200 p-3 font-medium">Infirmier(ère)</td><td class="border border-slate-200 p-3">Santé</td><td class="border border-slate-200 p-3">28–32k€</td><td class="border border-slate-200 p-3 text-red-600 font-semibold">⬆⬆ Très élevée</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-bold text-rose-600">2</td><td class="border border-slate-200 p-3 font-medium">Développeur Logiciel / Web</td><td class="border border-slate-200 p-3">Tech</td><td class="border border-slate-200 p-3">35–48k€</td><td class="border border-slate-200 p-3 text-red-600 font-semibold">⬆⬆ Très élevée</td></tr>
            <tr><td class="border border-slate-200 p-3 font-bold text-rose-600">3</td><td class="border border-slate-200 p-3 font-medium">Aide-Soignant(e)</td><td class="border border-slate-200 p-3">Santé</td><td class="border border-slate-200 p-3">21–26k€</td><td class="border border-slate-200 p-3 text-red-600 font-semibold">⬆⬆ Très élevée</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-bold text-rose-600">4</td><td class="border border-slate-200 p-3 font-medium">Expert Cybersécurité</td><td class="border border-slate-200 p-3">Tech</td><td class="border border-slate-200 p-3">40–58k€</td><td class="border border-slate-200 p-3 text-red-600 font-semibold">⬆⬆ Très élevée</td></tr>
            <tr><td class="border border-slate-200 p-3 font-bold text-rose-600">5</td><td class="border border-slate-200 p-3 font-medium">Conducteur de Travaux BTP</td><td class="border border-slate-200 p-3">BTP</td><td class="border border-slate-200 p-3">32–42k€</td><td class="border border-slate-200 p-3 text-orange-600 font-semibold">⬆ Élevée</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-bold text-rose-600">6</td><td class="border border-slate-200 p-3 font-medium">Data Scientist / Analyste</td><td class="border border-slate-200 p-3">Tech / Finance</td><td class="border border-slate-200 p-3">38–52k€</td><td class="border border-slate-200 p-3 text-red-600 font-semibold">⬆⬆ Très élevée</td></tr>
            <tr><td class="border border-slate-200 p-3 font-bold text-rose-600">7</td><td class="border border-slate-200 p-3 font-medium">Technicien de Maintenance Industrielle</td><td class="border border-slate-200 p-3">Industrie</td><td class="border border-slate-200 p-3">26–36k€</td><td class="border border-slate-200 p-3 text-orange-600 font-semibold">⬆ Élevée</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-bold text-rose-600">8</td><td class="border border-slate-200 p-3 font-medium">Commercial(e) / Chargé(e) de Clientèle</td><td class="border border-slate-200 p-3">Tous secteurs</td><td class="border border-slate-200 p-3">26–38k€</td><td class="border border-slate-200 p-3 text-orange-600 font-semibold">⬆ Élevée</td></tr>
            <tr><td class="border border-slate-200 p-3 font-bold text-rose-600">9</td><td class="border border-slate-200 p-3 font-medium">Ingénieur en Énergies Renouvelables</td><td class="border border-slate-200 p-3">Énergie</td><td class="border border-slate-200 p-3">36–50k€</td><td class="border border-slate-200 p-3 text-orange-600 font-semibold">⬆ Élevée</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-bold text-rose-600">10</td><td class="border border-slate-200 p-3 font-medium">Logisticien / Supply Chain Manager</td><td class="border border-slate-200 p-3">Logistique</td><td class="border border-slate-200 p-3">28–40k€</td><td class="border border-slate-200 p-3 text-orange-600 font-semibold">⬆ Élevée</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Focus sur les 3 secteurs à surveiller de près</h2>

      <h3>🏥 La Santé : la demande qui ne faiblit pas</h3>
      <p>Le vieillissement de la population française (1 Français sur 4 aura plus de 65 ans d'ici 2035) crée une demande structurelle en personnels de santé. Il manque actuellement <strong>plus de 100 000 infirmiers et aides-soignants</strong> en France. Si vous souhaitez un emploi garanti et un métier à fort impact humain, c'est le secteur à considérer.</p>

      <h3>💻 La Tech : des salaires en hausse, malgré les coupes</h3>
      <p>Après une vague de licenciements chez les GAFAM en 2023, le marché de la tech a bien rebondi. Les profils en <strong>intelligence artificielle, MLOps, et cybersécurité</strong> restent ultra-demandés, avec des salaires qui progressent de 8 à 15% par an selon les spécialités.</p>

      <h3>🌱 La Transition Écologique : le secteur du futur</h3>
      <p>Le plan France 2030 et les objectifs climatiques européens ont lancé une vague d'investissements dans la rénovation énergétique, l'éolien, le photovoltaïque et la mobilité propre. Les métiers d'ingénieurs en énergie, de techniciens en rénovation et d'experts en bilan carbone sont parmi les plus prometteurs pour les 10 prochaines années.</p>

      <h2>Les compétences qui font la différence en 2024</h2>
      <ul>
        <li>🤖 <strong>Intelligence Artificielle générative :</strong> Savoir utiliser et prompter les outils IA (ChatGPT, Copilot, Gemini) est désormais attendu dans tous les secteurs.</li>
        <li>📊 <strong>Analyse de données :</strong> Excel avancé, Python basique, lecture de tableaux de bord — indispensable même hors Tech.</li>
        <li>🌐 <strong>Anglais professionnel :</strong> Le niveau C1 ouvre des portes vers les multinationales et double souvent le salaire accessible.</li>
        <li>💬 <strong>Communication écrite :</strong> Avec le télétravail, savoir rédiger clairement est plus précieux que jamais.</li>
      </ul>

      <h2>Notre conseil</h2>
      <p>Ne cherchez pas le "métier le plus payé" ou "le plus demandé" de façon abstraite. Cherchez l'intersection entre <strong>ce qui vous motive</strong>, <strong>ce dans quoi vous êtes doué(e)</strong> et <strong>ce que le marché recherche</strong>. C'est à cette intersection que vous trouverez une carrière durable et épanouissante.</p>
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

      <h2>Avant le stage : Bien le choisir et le décrocher</h2>

      <h3>Définir ce que vous voulez tester</h3>
      <p>Un stage est une hypothèse à vérifier. Avant de postuler, demandez-vous : "Qu'est-ce que je veux valider ou invalider ?" Vouloir "faire du marketing" c'est trop vague. Vouloir "tester si j'aime la création de contenu B2B dans une startup tech", c'est exploitable.</p>

      <h3>Où trouver un bon stage</h3>
      <ul>
        <li>💼 <strong>LinkedIn :</strong> Le meilleur canal. Activez les alertes "Stage" + votre domaine. Personnalisez chaque candidature.</li>
        <li>🌐 <strong>Indeed, Welcome to the Jungle, Jobteaser :</strong> Agrégateurs spécialisés avec de nombreuses offres de stage.</li>
        <li>🎓 <strong>Le réseau de votre école :</strong> Les anciens élèves répondent bien aux étudiants de leur école. Utilisez LinkedIn pour les trouver.</li>
        <li>📩 <strong>La candidature spontanée :</strong> 30% des stages ne sont jamais publiés. Identifiez les entreprises qui vous intéressent et contactez directement les RH ou managers.</li>
      </ul>

      <h3>La convention de stage</h3>
      <p>Obligatoire en France pour tout stage de plus d'une semaine, la convention est signée par l'étudiant, l'école et l'entreprise. Elle définit les <strong>missions, la durée, la rémunération</strong> (obligatoire au-delà de 2 mois) et les conditions de travail. Lisez-la attentivement.</p>
      <p>📌 <strong>Gratification obligatoire depuis 2015 :</strong> Tout stage de plus de 2 mois consécutifs doit être rémunéré au minimum à <strong>15% du plafond horaire de la Sécurité Sociale</strong> (environ 4,05€/h en 2024, soit ~630€/mois pour un temps plein).</p>

      <h2>Pendant le stage : Comment briller</h2>

      <h3>La première semaine est cruciale</h3>
      <ul>
        <li>👁️ <strong>Observez avant d'agir :</strong> Comprenez la culture de l'entreprise, les codes de communication, la hiérarchie implicite.</li>
        <li>📝 <strong>Notez tout :</strong> Les noms, les processus, les outils. Vous éviterez de poser deux fois la même question.</li>
        <li>🤝 <strong>Présentez-vous activement :</strong> N'attendez pas qu'on vous présente. Allez vers les équipes.</li>
        <li>🎯 <strong>Clarifiez vos objectifs avec votre maître de stage :</strong> "Quels sont les 3 résultats concrets que vous attendez de moi d'ici la fin du stage ?"</li>
      </ul>

      <h3>Les attitudes qui font la différence</h3>
      <ul>
        <li>✅ <strong>Proactivité :</strong> Ne pas attendre qu'on vous donne du travail. Si vous avez fini une tâche, proposez d'en faire une autre ou demandez si vous pouvez assister à une réunion.</li>
        <li>✅ <strong>Poser des questions intelligentes :</strong> Pas "comment ça marche ?" mais "J'ai essayé X et Y, mais je bloque sur Z. Est-ce que mon approche est correcte ?"</li>
        <li>✅ <strong>Tenir ses engagements :</strong> Si vous dites que vous livrez quelque chose vendredi, livrez-le jeudi.</li>
        <li>✅ <strong>Documenter :</strong> Notez vos apprentissages, vos réalisations, les chiffres. Votre rapport de stage et votre futur CV en dépendent.</li>
      </ul>

      <h2>Transformer le stage en embauche</h2>
      <p>Statistiquement, <strong>30 à 40% des stages se transforment en CDD/CDI</strong>. Voici comment mettre toutes les chances de votre côté :</p>
      <ul>
        <li>💬 <strong>Exprimez clairement votre intérêt :</strong> "Si l'opportunité se présentait, je serais très intéressé(e) de rejoindre l'équipe." Les managers n'ont pas forcément le budget pour recruter mais si un bon stagiaire le demande explicitement, ils font souvent l'effort.</li>
        <li>📊 <strong>Montrez vos résultats :</strong> En fin de stage, préparez un bilan avec des indicateurs concrets. "J'ai contribué à X, ce qui a généré Y."</li>
        <li>🔗 <strong>Construisez votre réseau :</strong> Ajoutez vos collègues sur LinkedIn. Restez en contact même après le stage.</li>
        <li>🙏 <strong>Demandez une recommandation :</strong> Une recommandation LinkedIn de votre maître de stage est une preuve sociale très puissante pour la suite.</li>
      </ul>

      <h2>En résumé</h2>
      <p>Un stage réussi repose sur 3 piliers : <strong>préparation</strong> (savoir ce que vous cherchez), <strong>attitude</strong> (proactivité et sérieux) et <strong>réseautage</strong> (tirer parti des connexions créées). Traitez chaque stage comme si c'était votre premier jour de CDI.</p>
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

      <h2>1. Les bourses sur critères sociaux (CROUS)</h2>
      <p>C'est l'aide principale pour les étudiants boursiers. Elle est versée par le CROUS (Centre Régional des Œuvres Universitaires et Scolaires) et dépend des <strong>ressources de vos parents</strong> et du <strong>nombre de frères et sœurs</strong>.</p>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 rounded-lg">
          <thead>
            <tr class="bg-blue-50">
              <th class="border border-slate-200 p-3 text-left">Échelon</th>
              <th class="border border-slate-200 p-3 text-left">Montant annuel 2023-2024</th>
              <th class="border border-slate-200 p-3 text-left">Mensuel</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-slate-200 p-3">Échelon 0bis</td><td class="border border-slate-200 p-3">1 009 €</td><td class="border border-slate-200 p-3">~100 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3">Échelon 1</td><td class="border border-slate-200 p-3">1 702 €</td><td class="border border-slate-200 p-3">~170 €</td></tr>
            <tr><td class="border border-slate-200 p-3">Échelon 2</td><td class="border border-slate-200 p-3">2 522 €</td><td class="border border-slate-200 p-3">~252 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3">Échelon 3</td><td class="border border-slate-200 p-3">3 099 €</td><td class="border border-slate-200 p-3">~310 €</td></tr>
            <tr><td class="border border-slate-200 p-3">Échelon 4</td><td class="border border-slate-200 p-3">3 677 €</td><td class="border border-slate-200 p-3">~368 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3">Échelon 5</td><td class="border border-slate-200 p-3">4 255 €</td><td class="border border-slate-200 p-3">~426 €</td></tr>
            <tr><td class="border border-slate-200 p-3 font-semibold text-blue-700">Échelon 6</td><td class="border border-slate-200 p-3 font-semibold">5 612 €</td><td class="border border-slate-200 p-3 font-semibold text-blue-700">~561 €</td></tr>
            <tr class="bg-slate-50"><td class="border border-slate-200 p-3 font-semibold text-blue-700">Échelon 7</td><td class="border border-slate-200 p-3 font-semibold">5 894 €</td><td class="border border-slate-200 p-3 font-semibold text-blue-700">~589 €</td></tr>
          </tbody>
        </table>
      </div>
      <p>📌 <strong>Comment postuler :</strong> Faites votre demande de bourse sur <strong>messervices.etudiant.gouv.fr</strong> avant le 31 mai pour la rentrée suivante. Ne ratez jamais cette date !</p>

      <h2>2. L'alternance : la solution la plus rentable</h2>
      <p>L'<strong>alternance</strong> (contrat d'apprentissage ou contrat de professionnalisation) est souvent la meilleure solution globale : vous êtes <strong>payé pour apprendre</strong>, vous ne payez pas les frais de scolarité (pris en charge par l'OPCO de l'entreprise) et vous avez un pied dans le monde professionnel dès la 1ère année.</p>
      <p>📊 <strong>Salaire d'un apprenti en 2024 :</strong></p>
      <ul>
        <li>16-17 ans : 27% du SMIC (477 €/mois)</li>
        <li>18-20 ans : 43% du SMIC (759 €/mois)</li>
        <li>21-25 ans : 53% du SMIC (936 €/mois)</li>
        <li>26 ans et plus : 100% du SMIC (1 766 €/mois minimum)</li>
      </ul>
      <p>Pour les formations très techniques (ingénieur, grande école), les salaires peuvent monter à <strong>1 200-2 000€/mois</strong> selon l'entreprise et le secteur.</p>

      <h2>3. Les aides au logement (APL)</h2>
      <p>Si vous déménagez pour vos études, vous avez probablement droit aux <strong>Aides Personnalisées au Logement (APL)</strong> versées par la CAF. Le montant dépend de vos revenus, de votre loyer et de votre département.</p>
      <ul>
        <li>🏠 Les APL se demandent sur <strong>caf.fr</strong> directement après votre entrée dans le logement.</li>
        <li>💡 Vous pouvez simuler votre droit en avance sur le simulateur CAF en ligne.</li>
        <li>⚡ Pensez à demander la garantie Visale (zéro caution demandée au propriétaire) si vous cherchez un logement privé.</li>
      </ul>

      <h2>4. Le prêt étudiant garanti par l'État</h2>
      <p>Pour les étudiants qui ont besoin de liquidités sans ressources suffisantes, l'État garantit des prêts étudiants auprès des banques partenaires :</p>
      <ul>
        <li>Montant : jusqu'à <strong>20 000 €</strong> sur 10 ans</li>
        <li>Taux : souvent entre 2% et 3.5% (selon les banques)</li>
        <li>Différé de remboursement : vous commencez à rembourser après la fin de vos études</li>
        <li>Pas de caution parentale requise (l'État se porte garant)</li>
      </ul>
      <p>Les banques habilitées : Crédit Agricole, BNP Paribas, Société Générale, Banque Populaire, entre autres.</p>

      <h2>5. Les aides régionales et des collectivités</h2>
      <p>Chaque région en France propose ses propres aides spécifiques :</p>
      <ul>
        <li>🚌 <strong>Réduction transports :</strong> Tarifs étudiants négociés sur les abonnements SNCF/TER (ex: carte Avantage Jeune).</li>
        <li>📚 <strong>Aide à l'achat de matériel :</strong> Certaines régions subventionnent l'achat d'ordinateurs ou de manuels scolaires.</li>
        <li>🌍 <strong>Aides à la mobilité internationale :</strong> Erasmus+ (jusqu'à 500€/mois), bourses de la Fondation de France...</li>
        <li>🏢 <strong>Aides de la ville :</strong> Certaines métropoles (Paris, Lyon, Bordeaux) ont leurs propres fonds de soutien aux étudiants.</li>
      </ul>
      <p>📌 Consultez le site de votre région et de votre CROUS pour la liste complète des aides disponibles.</p>

      <h2>6. Les fonds d'urgence et aides exceptionnelles</h2>
      <p>Si vous vous trouvez dans une situation d'urgence financière en cours d'études :</p>
      <ul>
        <li>🆘 <strong>FSDIE (Fonds de Solidarité et de Développement des Initiatives Étudiantes) :</strong> Aide d'urgence versée par votre université ou IUT, accessible en cas de difficultés soudaines.</li>
        <li>🆘 <strong>Fonds National d'Aide d'Urgence (FNAU) :</strong> Pour les situations exceptionnelles non couvertes par la bourse classique, versé par le CROUS.</li>
        <li>🍽️ <strong>Épiceries solidaires / Restaurants CROUS :</strong> Les RU (restaurants universitaires) proposent des repas à 1€ pour les boursiers.</li>
      </ul>

      <h2>Récapitulatif : le parcours du combattant simplifié</h2>
      <ul>
        <li>📅 <strong>Avant le 31 mai :</strong> Faire sa demande de bourse CROUS sur messervices.etudiant.gouv.fr</li>
        <li>🏠 <strong>Dès l'entrée dans le logement :</strong> Demander les APL sur caf.fr</li>
        <li>🤝 <strong>Dès que possible :</strong> Chercher une alternance pour financer sa formation sans dettes</li>
        <li>💳 <strong>Si besoin :</strong> Contacter sa banque pour un prêt étudiant garanti par l'État</li>
        <li>🌍 <strong>Pour un séjour à l'étranger :</strong> Se renseigner sur Erasmus+ auprès du service international de son établissement</li>
      </ul>
      <p>L'argent ne doit jamais être un frein à l'éducation. Toutes ces aides existent pour ça. Prenez le temps de les explorer et de faire valoir vos droits.</p>
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
