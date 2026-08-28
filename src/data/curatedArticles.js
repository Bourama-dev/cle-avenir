// Curated editorial articles — Rapport Annuel CléAvenir 2026
// Source: Mutations Conjoncturelles, Réformes de l'Orientation et Gouvernance de l'Emploi en France
// Categories: marche-travail | emploi | formation | orientation | economie | alternance

export const CURATED_ARTICLES = [
  {
    id: 'curated_chomage_2026_q1',
    title: 'Marché du travail : le taux de chômage atteint 8,1 % au T1 2026',
    excerpt: 'Le chômage atteint 8,1 % au premier trimestre 2026, son plus haut niveau depuis début 2021. Analyse des données BIT, des catégories France Travail et des populations les plus touchées.',
    link: '/actualites/curated_chomage_2026_q1',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '📊',
    category: 'marche-travail',
    published_at: '2026-05-22T08:00:00.000Z',
    keywords: ['chômage', 'BIT', 'France Travail', 'marché du travail', 'seniors', 'jeunes NEET'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Taux de chômage T1 2026', value: '8,1 %', trend: 1, trendLabel: '+0,2 pt en un trimestre' },
      { label: "Demandeurs d'emploi", value: '5,73 M', trend: -1, trendLabel: '−0,3 % sur trois mois' },
      { label: 'Chômage des 15–24 ans', value: '21,1 %', trend: null, trendLabel: 'niveau préoccupant' },
      { label: 'Halo du chômage', value: '1,86 M', trend: null, trendLabel: 'personnes exclues du BIT' },
    ],
    full_description: `
<h2>Conjoncture économique et dynamique du chômage</h2>

<p>Le marché du travail français traverse une phase de transition caractérisée par des vents contraires au premier trimestre 2026. L'économie stagne à <strong>0,0 % de croissance</strong>, dans un contexte d'inflation persistante à 2,2 % et pour une population nationale estimée à 69,08 millions d'habitants. Le taux de chômage au sens du Bureau international du travail (BIT) a augmenté de <strong>0,2 point</strong> pour atteindre <strong>8,1 %</strong> de la population active en France hors Mayotte — son niveau le plus élevé depuis le premier trimestre 2021.</p>

<p>La hausse s'explique en partie par des effets réglementaires : le cinquième trimestre consécutif d'application de la loi pour le plein emploi a conduit à l'inscription automatique des bénéficiaires du RSA et à l'intégration renforcée des jeunes de 15 à 29 ans dans France Travail. Ces mécanismes expliquent <strong>près de la moitié de la hausse</strong> du taux de chômage global.</p>

<h3>Évolution comparative du taux de chômage au sens du BIT (2024–2026)</h3>

<table>
  <thead>
    <tr>
      <th>Trimestre</th>
      <th>France hors Mayotte (%)</th>
      <th>France métropolitaine (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>T1 2024</td><td>7,5</td><td>7,2</td></tr>
    <tr><td>T2 2024</td><td>7,3</td><td>7,1</td></tr>
    <tr><td>T3 2024</td><td>7,4</td><td>7,2</td></tr>
    <tr><td>T4 2024</td><td>7,3</td><td>7,1</td></tr>
    <tr><td>T1 2025</td><td>7,4</td><td>7,2</td></tr>
    <tr><td>T2 2025</td><td>7,6</td><td>7,4</td></tr>
    <tr><td>T3 2025</td><td>7,7</td><td>7,5</td></tr>
    <tr><td>T4 2025</td><td>7,9</td><td>7,7</td></tr>
    <tr><td><strong>T1 2026</strong></td><td><strong>8,1</strong></td><td><strong>7,9</strong></td></tr>
  </tbody>
</table>

<h3>Demandeurs d'emploi inscrits à France Travail au T1 2026</h3>

<p>Les données DARES indiquent <strong>5 728 000</strong> demandeurs d'emploi inscrits en catégories A, B et C au T1 2026, soit un recul marginal de 0,3 % sur trois mois mais une hausse de 0,1 % sur un an. En excluant les bénéficiaires du RSA et les jeunes nouvellement intégrés, la baisse sous-jacente s'établit à 1,0 % sur le trimestre.</p>

<table>
  <thead>
    <tr>
      <th>Catégorie</th>
      <th>Effectifs (milliers)</th>
      <th>Évol. trimestrielle</th>
      <th>Évol. annuelle</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>A — Sans emploi</td><td>3 295,1</td><td>−1,2 %</td><td>−2,8 %</td></tr>
    <tr><td>B — Activité réduite courte (cumul B+C)</td><td rowspan="2">2 432,9</td><td rowspan="2">−0,3 %</td><td rowspan="2">+0,1 %</td></tr>
    <tr><td>C — Activité réduite longue</td></tr>
    <tr><td>D — En formation</td><td>344,5</td><td>−0,8 %</td><td>−2,3 %</td></tr>
    <tr><td>E — En emploi (non tenus de chercher)</td><td>387,9</td><td>0,0 %</td><td>−3,7 %</td></tr>
  </tbody>
</table>

<p>Les effectifs en activité réduite (catégories B et C) représentent désormais <strong>45,5 %</strong> du total A–B–C, un niveau structurellement élevé qui pèse sur les conditions de vie des ménages.</p>

<h3>Populations les plus vulnérables</h3>

<ul>
  <li><strong>Seniors (50 ans et +) :</strong> 772 000 personnes en catégorie A, soit 27,0 % du total (contre 23,8 % il y a dix ans), corrélé au recul de l'âge légal de retraite.</li>
  <li><strong>Chômage de longue durée :</strong> 45,2 % des inscrits en catégorie A présents depuis plus d'un an — soit <strong>1,29 million de personnes</strong> éloignées durablement de l'emploi.</li>
  <li><strong>Jeunes (15–24 ans) :</strong> taux de chômage à <strong>21,1 %</strong>, avec 13 % de jeunes NEET (ni en emploi, ni en études, ni en formation) à l'échelle nationale, dépassant 20 % en Occitanie.</li>
  <li><strong>Halo du chômage :</strong> 1,86 million de personnes souhaitant travailler sans satisfaire formellement aux critères BIT.</li>
</ul>

<p>Cumulés aux chômeurs officiels, environ <strong>4,2 millions d'actifs</strong> — soit 12,6 % de la population active élargie — sont insatisfaits de leur situation d'emploi, témoignant des défis structurels majeurs à relever.</p>
`,
  },

  {
    id: 'curated_plan_avenir_2026',
    title: 'Le Plan Avenir : la nouvelle politique nationale d\'orientation scolaire',
    excerpt: 'Déployé depuis la rentrée 2025, le Plan Avenir transforme l\'orientation de la 5e à la terminale : plateforme Avenir(s), certification de compétences, stage obligatoire en seconde, mixité dans les filières scientifiques.',
    link: '/actualites/curated_plan_avenir_2026',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '🎓',
    category: 'orientation',
    published_at: '2026-05-22T08:10:00.000Z',
    keywords: ['Plan Avenir', 'orientation scolaire', 'Onisep', 'Parcoursup', 'mixité', 'STI2D'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Élèves concernés (stage)', value: '560 000', trend: null, trendLabel: 'stage entreprise obligatoire' },
      { label: "Demi-journées d'orientation/an", value: '4', trend: null, trendLabel: 'par élève de 5e à Terminale' },
      { label: 'Mise en place', value: 'Rentrée 2025', trend: null, trendLabel: 'plateforme Avenir(s)' },
      { label: 'Classes prépa ≥50 % filles', value: '1/dépt.', trend: null, trendLabel: 'objectif rentrée 2026' },
    ],
    full_description: `
<h2>Qu'est-ce que le Plan Avenir ?</h2>

<p>Déployé depuis la rentrée scolaire 2025, le <strong>Plan Avenir</strong> est la nouvelle politique nationale d'orientation scolaire et professionnelle. Son ambition : construire un système fondé sur l'équité, l'émancipation individuelle et le droit à l'erreur, pour lutter contre les déterminismes sociaux et de genre.</p>

<h3>Un parcours progressif de la 5e à la Terminale</h3>

<p>Chaque élève bénéficie désormais d'un parcours d'éducation à l'orientation structuré en <strong>quatre demi-journées dédiées par an</strong>, complété par les heures de vie de classe. Ce parcours s'appuie sur la plateforme numérique d'État <strong>Avenir(s)</strong>, développée par l'Onisep en synergie avec les Régions, offrant un accès centralisé à des offres de stages, des opportunités de mentorat et des outils de découverte des métiers.</p>

<p>Les familles sont intégrées au dispositif : le Guide des parents de l'Onisep est mis à disposition et des espaces numériques dédiés sont ouverts sur la plateforme Avenir(s) depuis janvier 2026.</p>

<h3>Nouveautés à la rentrée 2026</h3>

<ul>
  <li><strong>Certification de compétences :</strong> les élèves volontaires peuvent valider leurs acquis en construction de projet grâce à la nouvelle certification « orientation, parcours, insertion ».</li>
  <li><strong>Bonification d'accès :</strong> les élèves de 3e ayant finalisé leur parcours sur Avenir(s) obtiennent une bonification de points pour favoriser l'accès en seconde professionnelle.</li>
  <li><strong>Simplification des filières :</strong> les intitulés des voies technologique et professionnelle sont simplifiés pour améliorer la lisibilité de l'offre de formation.</li>
  <li><strong>Valorisation de la césure :</strong> l'IGÉSR expérimente l'attribution de crédits ECTS pour les années de césure, favorisant la mobilité internationale.</li>
</ul>

<h3>Mixité sociale et de genre dans les filières d'excellence</h3>

<ul>
  <li>Le programme <strong>SNT</strong> (Sciences Numériques et Technologiques) en seconde est rénové à la rentrée 2026 pour susciter des vocations vers l'industrie, le code et l'ingénierie.</li>
  <li>La filière <strong>STI2D</strong> est repensée en première (rentrée 2026) et en terminale (rentrée 2027) pour attirer davantage de filles.</li>
  <li>Généralisation de classes préparatoires scientifiques et technologiques accueillant <strong>au moins 50 % de filles</strong>, avec l'objectif d'ouvrir au moins une classe par département à la rentrée 2026.</li>
</ul>

<h3>Stage obligatoire pour tous les lycéens de seconde</h3>

<p>Le stage d'observation en entreprise est désormais <strong>obligatoire pour les 560 000 élèves de seconde</strong> générale et technologique. Pour l'année scolaire 2025-2026, il se déroule du <strong>15 au 26 juin 2026</strong>, matérialisant l'ouverture de l'école sur le monde économique.</p>

<blockquote>L'académie de Versailles, qui gère près de 9 % des effectifs scolarisés en France, organise ce stage pour l'ensemble de ses lycéens dans le même calendrier national.</blockquote>
`,
  },

  {
    id: 'curated_voie_pro_2026',
    title: 'Bac professionnel 2026 : ce qui change pour la terminale',
    excerpt: 'Examens repositionnés à la mi-juin, suppression du parcours en Y, deux semaines d\'accompagnement personnalisé en mars, et 10 000 places en certificats de spécialisation post-bac.',
    link: '/actualites/curated_voie_pro_2026',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '📚',
    category: 'formation',
    published_at: '2026-05-22T08:20:00.000Z',
    keywords: ['bac professionnel', 'voie professionnelle', 'terminale', 'BTS', 'alternance', 'Parcoursup'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Places Bac+1 spécialisation', value: '10 000', trend: null, trendLabel: 'rentrée 2026' },
      { label: 'Objectif places 2027', value: '15 000', trend: null, trendLabel: 'certificats de spécialisation' },
      { label: 'Accompagnement personnalisé', value: '2 semaines', trend: null, trendLabel: 'en mars, avant Parcoursup' },
      { label: 'Note oral de projet', value: '50 %', trend: null, trendLabel: 'de la note globale du projet' },
    ],
    full_description: `
<h2>La réforme de la terminale professionnelle pour 2026-2027</h2>

<p>La transformation de la voie professionnelle, engagée depuis 2023, franchit une étape décisive pour l'année scolaire 2026-2027. Le ministère de l'Éducation nationale déploie deux ajustements majeurs pour la classe de <strong>terminale professionnelle</strong>.</p>

<h3>1. Repositionnement des examens à la mi-juin</h3>

<p>Les épreuves écrites du baccalauréat professionnel sont repositionnées à <strong>la mi-juin</strong>, alignant la voie professionnelle sur les calendriers des voies générale et technologique. Les équipes pédagogiques disposent ainsi de l'intégralité de l'année scolaire pour dispenser les enseignements et consolider les savoirs fondamentaux.</p>

<p>La période suivant les épreuves écrites est consacrée à la préparation intensive de l'oral de projet et aux épreuves de contrôle. L'<strong>oral de projet</strong> dure 15 minutes, s'appuie sur un support de 5 pages maximum et représente <strong>50 % de la note globale du projet</strong> pour les candidats sous statut scolaire.</p>

<h3>2. Deux semaines d'accompagnement personnalisé en mars</h3>

<p>Le <strong>parcours différencié</strong> (ou « parcours en Y », 4 à 6 semaines en fin d'année) est définitivement supprimé. Il est remplacé par deux semaines d'accompagnement personnalisé positionnées en <strong>mars</strong>, juste avant la clôture des vœux sur Parcoursup.</p>

<p>Chaque lycée organise ces deux semaines selon le tissu économique local. Les élèves choisissent entre deux options :</p>

<ul>
  <li><strong>Option professionnelle (insertion immédiate) :</strong> deux semaines de PFMP (formation en milieu professionnel) supplémentaires, entièrement gratifiées par l'État, s'ajoutant aux 18 à 28 semaines obligatoires de stage. Des bureaux des entreprises implantés dans chaque lycée professionnel ouvrent un réseau aux élèves.</li>
  <li><strong>Option poursuite d'études :</strong> accompagnement méthodologique, initiation aux exigences du supérieur et découverte des formations post-bac pour sécuriser la transition académique.</li>
</ul>

<h3>Renforcement massif des formations courtes post-bac</h3>

<table>
  <thead>
    <tr>
      <th>Dispositif</th>
      <th>Places rentrée 2026</th>
      <th>Objectif</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Certificats de spécialisation (Bac+1)</td>
      <td>10 000</td>
      <td>15 000 en 2027 · 20 000 à terme</td>
    </tr>
    <tr>
      <td>BTS en 3 ans (expérimentation)</td>
      <td>Au moins 1 établissement/académie</td>
      <td>Sécuriser les parcours des bacheliers professionnels fragiles</td>
    </tr>
  </tbody>
</table>

<p>Le BTS en trois ans intègre une <strong>année de propédeutique</strong> pour sécuriser le parcours des bacheliers professionnels les plus fragiles, avec une passerelle vers un BTS classique en deux ans.</p>
`,
  },

  {
    id: 'curated_cpf_2026',
    title: 'CPF 2026 : reste à charge à 150 €, plafonds et nouvelles règles',
    excerpt: 'Depuis le 2 avril 2026, le reste à charge du CPF est porté à 150 €. Découvrez les nouveaux plafonds par type de formation, les exemptions et les 25 000 POEC industrielles ciblées par France Travail.',
    link: '/actualites/curated_cpf_2026',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '💡',
    category: 'formation',
    published_at: '2026-05-22T08:30:00.000Z',
    keywords: ['CPF', 'compte personnel formation', 'reste à charge', 'bilan compétences', 'RNCP', 'POEC', 'France Travail'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Reste à charge (depuis avril)', value: '150 €', trend: 1, trendLabel: '+46,8 € vs début 2026' },
      { label: 'Plafond bilan de compétences', value: '1 600 €', trend: null, trendLabel: "heures d'accompagnement direct" },
      { label: 'POEC industrielles 2026', value: '25 000', trend: 1, trendLabel: '+50 % vs 2025' },
      { label: 'Retour à emploi post-POEC', value: '68 %', trend: null, trendLabel: 'en 6 mois post-formation' },
    ],
    full_description: `
<h2>Les nouvelles règles du CPF en 2026</h2>

<p>Dans un effort de rationalisation des finances publiques, le <strong>Compte Personnel de Formation (CPF)</strong> subit une profonde refonte réglementaire en 2026. Les nouvelles règles issues de la loi de finances pour 2026 et de plusieurs décrets entrés en vigueur fin février 2026 introduisent des barrières financières et des plafonds de prise en charge inédits.</p>

<h3>Hausse du reste à charge</h3>

<p>La participation financière forfaitaire obligatoire a été portée à <strong>150 € depuis le 2 avril 2026</strong> (décret n° 2026-234), contre 103,20 € en début d'année.</p>

<p>Cette participation ne s'applique pas :</p>
<ul>
  <li>aux <strong>demandeurs d'emploi</strong> inscrits à France Travail ;</li>
  <li>aux salariés bénéficiant d'un <strong>cofinancement</strong> de leur employeur ou de leur OPCO ;</li>
  <li>aux personnes mobilisant des droits issus du <strong>C2P</strong> (compte professionnel de prévention) ou liés à un accident du travail / maladie professionnelle.</li>
</ul>

<h3>Plafonds de prise en charge par type de formation</h3>

<table>
  <thead>
    <tr>
      <th>Type de formation</th>
      <th>Plafond maximum</th>
      <th>Conditions et restrictions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Bilan de compétences</strong></td>
      <td>1 600 €</td>
      <td>Seules les heures d'accompagnement direct sont financées (recherches personnelles exclues). Délai de carence obligatoire de <strong>5 ans</strong> entre deux bilans.</td>
    </tr>
    <tr>
      <td><strong>Certifications du Répertoire Spécifique (RS)</strong></td>
      <td>1 500 €</td>
      <td>Habilitations, certifications linguistiques ou informatiques transversales. Le socle <strong>CléA est exclu</strong> et reste finançable en totalité.</td>
    </tr>
    <tr>
      <td><strong>Permis de conduire légers</strong> (A1, A2, B, B1, BE)</td>
      <td>900 €</td>
      <td>Réservé aux demandeurs d'emploi ou aux salariés avec un cofinancement tiers ≥ 100 €. <strong>Projet professionnel requis.</strong></td>
    </tr>
    <tr>
      <td><strong>Permis poids lourds et transport de personnes</strong></td>
      <td>Pas de plafond</td>
      <td>Accessible à tous les actifs sans restriction ni cofinancement tiers.</td>
    </tr>
    <tr>
      <td><strong>Certifications RNCP</strong> (CAP, licences, masters…)</td>
      <td>Pas de plafond</td>
      <td>Diplômes et titres enregistrés au Répertoire National, finançables sans restriction.</td>
    </tr>
  </tbody>
</table>

<h3>Nouveaux dispositifs d'activation et de réorientation</h3>

<h4>POEC industrielles — objectif 25 000 en 2026</h4>
<p>France Travail mise sur la <strong>Préparation Opérationnelle à l'Emploi Collective (POEC)</strong>, formation courte (jusqu'à 400 h) liée à un besoin de recrutement identifié par une branche. En 2026, l'objectif est de déployer <strong>25 000 POEC dans les seuls secteurs industriels</strong> (maintenance, nucléaire, logistique, électricité), soit +50 % vs 2025. Taux de retour à l'emploi : <strong>68 % en six mois</strong>.</p>

<h4>Abondements CPF ciblés sur les métiers d'avenir</h4>
<p>Un programme expérimental piloté par le SGPI et France Travail prévoit des abondements spécifiques de CPF pour financer environ <strong>10 000 parcours de formation</strong> dédiés aux métiers d'avenir dans les filières industrielles clés (transition énergétique, numérique, santé).</p>

<h4>Encadrement de la promotion des formations</h4>
<p>Un décret du 25 février 2026 encadre rigoureusement la promotion des formations professionnelles par les influenceurs sur les réseaux sociaux, afin d'assainir le marché des organismes de formation.</p>
`,
  },

  {
    id: 'curated_bmo_metiers_2026',
    title: 'BMO 2026 : 2,28 M de recrutements et les métiers les plus en tension',
    excerpt: 'France Travail recense 2,28 millions de projets de recrutement pour 2026. Restauration, agriculture, BTP, santé et numérique : analyse sectorielle des métiers les plus recherchés et les plus difficiles à pourvoir.',
    link: '/actualites/curated_bmo_metiers_2026',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '💼',
    category: 'emploi',
    published_at: '2026-05-22T08:40:00.000Z',
    keywords: ['BMO', 'recrutement', 'métiers en tension', 'BTP', 'santé', 'informatique', 'Apec', 'Data Engineer'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Projets de recrutement', value: '2,28 M', trend: null, trendLabel: 'en France pour 2026' },
      { label: 'Taux de difficulté global', value: '43,8 %', trend: -1, trendLabel: '−6,3 pts vs 2025' },
      { label: 'Postes vacants informatique', value: '25 500', trend: 1, trendLabel: 'projection: 180 000 en 2030' },
      { label: 'BTP — difficulté recrutement', value: '65 %', trend: null, trendLabel: 'secteur le plus tendu' },
    ],
    full_description: `
<h2>2,28 millions de projets de recrutement en 2026</h2>

<p>L'enquête <strong>Besoins en Main-d'œuvre (BMO)</strong> de France Travail pour 2026 recense <strong>2,28 millions de projets de recrutement</strong>, en léger repli par rapport aux sommets historiques des années précédentes. Les difficultés à recruter diminuent sensiblement : <strong>43,8 % des projets sont jugés difficiles</strong> à pourvoir en 2026, contre 50,1 % en 2025. Deux recrutements sur trois émanent de structures de moins de 50 salariés.</p>

<h3>Top 9 des métiers les plus recherchés (volume de projets)</h3>

<table>
  <thead>
    <tr>
      <th>Rang</th>
      <th>Métier</th>
      <th>Projets de recrutement</th>
      <th>Particularité</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Aides de cuisine, employés polyvalents de restauration</td><td>97 100</td><td>Forte tension sur les compétences de base</td></tr>
    <tr><td>2</td><td>Serveurs de cafés et restaurants</td><td>93 800</td><td>Forte composante relationnelle</td></tr>
    <tr><td>3</td><td>Viticulteurs et arboriculteurs salariés</td><td>83 800</td><td>&gt;95 % de contrats saisonniers</td></tr>
    <tr><td>4</td><td>Agriculteurs salariés et ouvriers agricoles</td><td>82 000</td><td>Renouvellement générationnel critique d'ici 2030</td></tr>
    <tr><td>5</td><td>Agents d'entretien de locaux</td><td>80 900</td><td>Demande stable public et privé</td></tr>
    <tr><td>6</td><td>Aides à domicile et auxiliaires de vie</td><td>69 500</td><td><strong>+13,3 % sur un an</strong></td></tr>
    <tr><td>7</td><td>Aides-soignants</td><td>62 100</td><td>Pression démographique et salariale</td></tr>
    <tr><td>8</td><td>Employés de libre-service</td><td>59 900</td><td>Rôle pivot grande distribution</td></tr>
    <tr><td>9</td><td>Cuisiniers</td><td>51 600</td><td>57,6 % de difficulté de recrutement</td></tr>
  </tbody>
</table>

<h3>Tensions sectorielles</h3>

<h4>Bâtiment et Travaux Publics (BTP) — 65 % de projets difficiles</h4>
<p>Secteur le plus tendu, avec des pénuries de main-d'œuvre qualifiée dans toutes les spécialités :</p>
<ul>
  <li>Couvreurs : <strong>79,7 %</strong> de projets difficiles</li>
  <li>Charpentiers métal et bois : <strong>74,8 %</strong></li>
  <li>Menuisiers-agenceurs : <strong>71,2 %</strong></li>
  <li>Maçons qualifiés : <strong>70,5 %</strong></li>
</ul>

<h4>Santé et aide à la personne — 54 % de difficulté globale</h4>
<ul>
  <li>Médecins spécialistes et généralistes : <strong>78,8 %</strong></li>
  <li>Auxiliaires de vie à domicile : <strong>62,3 %</strong></li>
  <li>Infirmiers / sages-femmes : <strong>60,2 %</strong></li>
</ul>

<h4>Industrie et énergie — accélération portée par la transition</h4>
<p>Le secteur représente 9,3 % des projets, avec une baisse d'intention d'embauche la plus modérée (−2,4 % vs 2025). La construction de réacteurs EPR (<strong>100 000 recrutements dans le nucléaire d'ici 2035</strong>) et les gigafactories de batteries dynamisent les besoins.</p>
<ul>
  <li>Conducteurs d'équipements d'usinage : <strong>80,6 %</strong> de tension</li>
  <li>Chaudronniers : <strong>77,7 %</strong></li>
  <li>Soudeurs : <strong>71,3 %</strong></li>
</ul>

<h4>Informatique et numérique — 25 500 postes vacants</h4>
<p>La pénurie de profils qualifiés s'accentue : <strong>25 500 postes vacants en 2026</strong>, susceptibles d'atteindre <strong>180 000 en 2030</strong> malgré la diplomation attendue de 120 000 ingénieurs. Les profils les plus recherchés : architectes cloud, ingénieurs IA, directeurs de l'IA.</p>

<h3>Métiers cadres : poids lourds et formules 1 (Apec 2026)</h3>

<table>
  <thead>
    <tr>
      <th>Métiers "Poids Lourds" (volumes massifs)</th>
      <th>Métiers "Formules 1" (accélération rapide)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Chefs de projet informatique</td><td>Data Engineers</td></tr>
    <tr><td>Développeurs web et logiciels</td><td>Directeurs de travaux / Économistes de la construction</td></tr>
    <tr><td>Conducteurs de travaux BTP</td><td>Business Managers / Directeurs commerciaux &amp; marketing</td></tr>
    <tr><td>Comptables et Experts-comptables</td><td>Gestionnaires de copropriété / Directeurs comptables</td></tr>
    <tr><td>Responsables comptables / Contrôleurs de gestion</td><td>Infirmiers coordinateurs / Médecins de prévention</td></tr>
    <tr><td>Chargés d'affaires et Commerciaux</td><td>Psychologues du travail et d'accompagnement</td></tr>
  </tbody>
</table>

<p>La transition écologique stimule également l'émergence de métiers « verts » : coordinateurs environnementaux HSE, responsables QHSE, et ingénieurs spécialisés dans les énergies renouvelables.</p>
`,
  },

  {
    id: 'curated_calendrier_2026',
    title: 'Calendrier emploi & orientation 2026 : salons et Parcoursup',
    excerpt: 'Tous les salons emploi et orientation de 2026 (Salon du Travail, Paris pour l\'emploi, Mondial des Métiers), plus le calendrier complet de la procédure Parcoursup 2026.',
    link: '/actualites/curated_calendrier_2026',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '📅',
    category: 'emploi',
    published_at: '2026-05-22T08:50:00.000Z',
    keywords: ['Parcoursup', 'salons emploi', 'orientation', 'Paris pour l\'emploi', 'Studyrama', 'calendrier 2026'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Salons emploi & orientation', value: '8+', trend: null, trendLabel: 'événements clés en 2026' },
      { label: 'Vœux Parcoursup max', value: '10', trend: null, trendLabel: 'sans classement obligatoire' },
      { label: 'Clôture des vœux', value: '12 mars', trend: null, trendLabel: 'Parcoursup 2026' },
      { label: 'Phase complémentaire', value: 'jusqu\'au 10 sept.', trend: null, trendLabel: 'nouveaux vœux possibles' },
    ],
    full_description: `
<h2>Les événements emploi et orientation à ne pas manquer en 2026</h2>

<p>L'année 2026 est jalonnée de salons professionnels, de forums de recrutement et d'étapes administratives incontournables. Ces rencontres physiques et virtuelles constituent des moments décisifs pour la mise en relation entre candidats, organismes de formation et recruteurs.</p>

<h3>Janvier 2026</h3>
<ul>
  <li><strong>9–10 janvier :</strong> <em>Salon Postbac</em> — Grande Halle de la Villette, Paris. Moment d'information crucial pour les bacheliers avant les inscriptions Parcoursup.</li>
  <li><strong>17 janvier :</strong> <em>Salons Studyrama</em> spécialisés (sport, tourisme, code informatique, cybersécurité, défense) — Espace Champerret, Paris.</li>
  <li><strong>22–23 janvier :</strong> <em>Salon du Travail et de la Mobilité Professionnelle</em> — Grande Halle de la Villette, Paris. Axé sur l'évolution professionnelle, la formation continue et la reconversion.</li>
  <li><strong>28 jan. – 4 fév. :</strong> <em>44e Forum Recrutement de Paris Dauphine-PSL</em> — format hybride : présentiel les 28–29 jan. à l'université, virtuel du 2 au 4 fév. via Seekube (étudiants Master + ~100 entreprises).</li>
</ul>

<h3>Février 2026</h3>
<ul>
  <li><strong>5–7 février :</strong> <em>Salon Régional de l'Orientation et des Métiers</em> — Parc des Expositions de Caen. Plus de 150 métiers représentés, organisé par l'Agence régionale de l'orientation de Normandie.</li>
  <li><strong>14 février :</strong> <em>Salon Studyrama des Masters, Mastères Spécialisés et MBA</em> — Cité Internationale Universitaire, Paris.</li>
</ul>

<h3>Mars 2026</h3>
<ul>
  <li><strong>13–14 mars :</strong> <em>Salon des formations et du recrutement en alternance</em> — Porte de Versailles, Paris.</li>
</ul>

<h3>Juin 2026</h3>
<ul>
  <li><strong>20 juin :</strong> <em>« Cap sur la rentrée »</em> (L'Étudiant) et <em>« Où s'inscrire encore ? »</em> (Studyrama) — Paris Event Center et Espace Champerret. Inscriptions de dernière minute en alternance.</li>
</ul>

<h3>Novembre 2026</h3>
<ul>
  <li><strong>5–6 novembre :</strong> <em>24e édition de « Paris pour l'emploi »</em> — Place de la Concorde, Paris. Plus de 300 métiers représentés, ouvert gratuitement à tous les publics. Principal carrefour national de l'emploi et de la formation.</li>
</ul>

<h3>Décembre 2026</h3>
<ul>
  <li><strong>10–13 décembre :</strong> <em>Mondial des Métiers d'Auvergne-Rhône-Alpes</em> — Eurexpo Lyon. Événement régional d'envergure réunissant l'ensemble des acteurs de l'orientation et des branches professionnelles.</li>
</ul>

<hr>

<h2>Calendrier officiel Parcoursup 2026</h2>

<p>La procédure nationale de préinscription en première année de l'enseignement supérieur est rythmée par des échéances précises que les lycéens de terminale et les étudiants en réorientation doivent respecter.</p>

<table>
  <thead>
    <tr>
      <th>Étape</th>
      <th>Date clé</th>
      <th>Action requise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ouverture du site</td>
      <td>17 décembre 2025</td>
      <td>Découverte de l'offre de formation, des critères d'admission et des journées portes ouvertes.</td>
    </tr>
    <tr>
      <td>Inscriptions et vœux</td>
      <td>19 janvier – 12 mars 2026</td>
      <td>Création du dossier candidat et saisie des vœux (10 vœux maximum, sans classement).</td>
    </tr>
    <tr>
      <td>Finalisation du dossier</td>
      <td>Jusqu'au 1er avril 2026</td>
      <td>Complétion des projets de formation motivés et confirmation définitive de chaque vœu.</td>
    </tr>
    <tr>
      <td>Phase d'admission principale</td>
      <td>2 juin – 11 juillet 2026</td>
      <td>Consultation des réponses et validation des propositions reçues.</td>
    </tr>
    <tr>
      <td>Classement des vœux</td>
      <td>5–8 juin 2026</td>
      <td>Hiérarchisation par ordre de préférence des vœux en liste d'attente.</td>
    </tr>
    <tr>
      <td>Phase complémentaire</td>
      <td>11 juin – 10 septembre 2026</td>
      <td>Formulation de nouveaux vœux (jusqu'à 10) sur les places restées vacantes.</td>
    </tr>
  </tbody>
</table>

<p>Pour 2026, Parcoursup enrichit les fiches de formation d'une rubrique <strong>« Visualiser les chiffres d'accès »</strong> permettant de comparer son profil scolaire aux candidats admis les années précédentes. Les candidats en réorientation accèdent au portail dédié <strong>Parcours+</strong>.</p>

<p>L'emploi public recrute également de manière importante : la Ville de Paris déploie en 2026 d'importantes campagnes de recrutement par concours pour des postes de jardiniers, arboristes-élagueurs et infirmiers municipaux.</p>
`,
  },
  {
    id: 'curated_alternance_2026_bilan',
    title: 'Alternance 2026 : 980 000 contrats signés, le cap du million en vue',
    excerpt: 'Le bilan de l\'alternance confirme son dynamisme malgré un léger fléchissement. L\'apprentissage représente désormais 7 % des diplômes de l\'enseignement supérieur. Décryptage des secteurs porteurs et des aides maintenues.',
    link: '/actualites/curated_alternance_2026_bilan',
    is_internal: true,
    source: 'Rapport CléAvenir 2026',
    source_logo: '🎓',
    category: 'alternance',
    published_at: '2026-06-15T08:00:00.000Z',
    keywords: ['alternance', 'apprentissage', 'contrat de professionnalisation', 'CFA', 'aide employeur', 'OPCO'],
    publisher: 'CléAvenir — Rapport Annuel 2026',
    kpis: [
      { label: 'Contrats signés en 2025', value: '980 000', trend: -1, trendLabel: '−3 % vs 2024' },
      { label: 'Part dans l\'enseignement supérieur', value: '7 %', trend: 1, trendLabel: '+1 pt en deux ans' },
      { label: 'Taux d\'insertion à 6 mois', value: '70 %', trend: 1, trendLabel: 'stable, supérieur voie scolaire' },
      { label: 'Aide employeur (< 250 sal.)', value: '6 000 €', trend: null, trendLabel: 'maintenue en 2026' },
    ],
    full_description: `
<h2>Un marché en légère correction après les records de 2022–2023</h2>

<p>Après le pic historique de <strong>1,05 million de contrats</strong> signé en 2023, l'alternance connaît un léger repli qui s'explique par le recentrage des aides gouvernementales et la prudence des entreprises dans un contexte économique incertain. Avec <strong>980 000 contrats</strong> signés en 2025, dont environ 850 000 contrats d'apprentissage et 130 000 contrats de professionnalisation, le dispositif reste largement au-dessus de son niveau d'avant la réforme 2018.</p>

<h3>Répartition par niveau de diplôme préparé</h3>

<ul>
  <li><strong>CAP / BEP</strong> : 18 % des contrats — stable, portés par l'hôtellerie-restauration, le BTP et les métiers de bouche.</li>
  <li><strong>Bac Pro / Bac Tech</strong> : 12 % — en légère hausse grâce au plan « 1 jeune, 1 solution ».</li>
  <li><strong>BTS / BUT</strong> : 24 % — premier niveau en volume absolu, avec une forte demande en commerce, gestion et numérique.</li>
  <li><strong>Licence Pro / Bac +3</strong> : 11 % — en croissance, notamment dans les filières santé-social et ingénierie.</li>
  <li><strong>Master / Bac +4 et +5</strong> : 29 % — progression continue, portée par les grandes écoles et les universités qui développent leurs CFA internes.</li>
  <li><strong>Doctorat / CIFRE</strong> : 6 % — niche mais en hausse de 18 % sur deux ans.</li>
</ul>

<h2>Secteurs porteurs en 2026</h2>

<p>L'analyse des offres en alternance sur les principales plateformes (Indeed, Welcome to the Jungle, Alternance.gouv) fait ressortir cinq secteurs en forte tension :</p>

<ol>
  <li><strong>Numérique et Tech</strong> : développement logiciel, cybersécurité, data science — taux de vacance des postes supérieur à 35 %.</li>
  <li><strong>Transition énergétique</strong> : installateurs de panneaux photovoltaïques, techniciens en réseaux électriques, auditeurs énergétiques.</li>
  <li><strong>Santé et Grand âge</strong> : aides-soignants, auxiliaires de vie, infirmiers — forte demande due au vieillissement de la population.</li>
  <li><strong>Commerce et Vente</strong> : secteur historiquement premier en volume, reste dynamique malgré la montée du e-commerce.</li>
  <li><strong>Industrie 4.0</strong> : maintenance des robots industriels, impression 3D, contrôle qualité numérique.</li>
</ol>

<h2>Aides financières maintenues en 2026</h2>

<table>
  <thead>
    <tr>
      <th>Dispositif</th>
      <th>Bénéficiaire</th>
      <th>Montant</th>
      <th>Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Aide à l'embauche alternance</td>
      <td>Employeur (< 250 salariés)</td>
      <td><strong>6 000 €</strong> / an</td>
      <td>Contrat signé avant le 31/12/2026</td>
    </tr>
    <tr>
      <td>Aide renforcée (grandes entreprises)</td>
      <td>Employeur (≥ 250 salariés)</td>
      <td><strong>2 000 €</strong> / an</td>
      <td>Sous condition de quota de 5 % d'alternants</td>
    </tr>
    <tr>
      <td>Prime équipement CFA</td>
      <td>Apprenti</td>
      <td>Jusqu'à <strong>500 €</strong></td>
      <td>Selon le CFA et la région</td>
    </tr>
    <tr>
      <td>Carte Étudiant des Métiers</td>
      <td>Apprenti</td>
      <td>Réductions et avantages</td>
      <td>Automatique à l'entrée en CFA</td>
    </tr>
  </tbody>
</table>

<h2>Comment trouver une alternance en 2026 ?</h2>

<p>Le portail officiel <strong>Alternance.gouv.fr</strong> centralise les offres des OPCO (opérateurs de compétences) et des CFA. En parallèle, plusieurs démarches augmentent significativement les chances de trouver un employeur :</p>

<ul>
  <li><strong>Démarche directe</strong> : contacter les RH des entreprises ciblées sans attendre les offres publiées — 40 % des contrats sont signés hors offres formelles.</li>
  <li><strong>Réseaux d'alumni</strong> : les anciens étudiants d'un CFA ou d'une école recrutent en priorité dans leur réseau.</li>
  <li><strong>Salons spécialisés</strong> : Studyrama Alternance, Salon de l'Apprentissage (Paris, Lyon, Bordeaux) en mars–avril 2026.</li>
  <li><strong>LinkedIn</strong> : hashtag #alternance2026 et activation du filtre « Alternance/Apprentissage » dans la recherche d'emploi.</li>
</ul>

<p><em>Source : DARES, DGEFP, France Compétences — données compilées par CléAvenir (juin 2026).</em></p>
`,
  },

  // ── Août 2026 ──────────────────────────────────────────────────────────────

  {
    id: 'curated_chomage_t2_2026',
    title: 'Chômage T2 2026 : 8,3 %, la hausse se confirme malgré les créations d\'emploi',
    excerpt: 'Le taux de chômage progresse à 8,3 % au deuxième trimestre 2026. Si les créations nettes d\'emploi salarié restent positives (+38 000), l\'afflux de nouveaux entrants sur le marché du travail et la hausse de l\'inactivité contrainte tirent les chiffres vers le haut.',
    link: '/actualites/curated_chomage_t2_2026',
    is_internal: true,
    source: 'CléAvenir — Flash Conjoncture',
    source_logo: '📊',
    category: 'marche-travail',
    published_at: '2026-08-20T07:00:00.000Z',
    keywords: ['chômage', 'T2 2026', 'emploi salarié', 'France Travail', 'marché du travail', 'DARES'],
    publisher: 'CléAvenir — Flash Conjoncture août 2026',
    kpis: [
      { label: 'Taux de chômage T2 2026', value: '8,3 %', trend: 1, trendLabel: '+0,2 pt vs T1 2026' },
      { label: 'Créations emploi salarié (T2)', value: '+38 000', trend: 1, trendLabel: 'secteur privé' },
      { label: 'Taux d\'emploi 15–64 ans', value: '68,1 %', trend: -1, trendLabel: '−0,2 pt en un an' },
      { label: 'Chômage longue durée', value: '43,2 %', trend: 1, trendLabel: 'des chômeurs > 1 an' },
    ],
    full_description: `
<h2>Conjoncture T2 2026 : entre dynamisme de l'emploi et hausse du chômage</h2>

<p>Le paradoxe du deuxième trimestre 2026 se confirme : malgré <strong>38 000 créations nettes d'emplois salariés</strong> dans le secteur privé (dont +12 000 dans les services aux entreprises, +9 000 dans le commerce et +8 000 dans la construction), le taux de chômage au sens du BIT continue de progresser pour atteindre <strong>8,3 %</strong> de la population active.</p>

<p>Cette apparente contradiction s'explique par trois facteurs structurels :</p>
<ul>
  <li><strong>Accroissement de la population active</strong> : l'arrivée sur le marché de la génération née entre 2001 et 2005 génère mécaniquement plus de demandeurs d'emploi que les postes créés ne peuvent en absorber.</li>
  <li><strong>Effets de la loi Plein Emploi (2023)</strong> : le sixième trimestre consécutif d'inscription automatique des bénéficiaires du RSA gonfle les statistiques de demandeurs d'emploi en catégorie A.</li>
  <li><strong>Réduction des contrats aidés</strong> : le plan d'économies budgétaires 2026 a réduit de 15 % les dotations aux Parcours Emploi Compétences (PEC), notamment dans le secteur associatif.</li>
</ul>

<h3>Secteurs à la traîne vs secteurs porteurs</h3>

<table>
  <thead>
    <tr><th>Secteur</th><th>Évolution emploi T2 2026</th><th>Tendance</th></tr>
  </thead>
  <tbody>
    <tr><td>Services aux entreprises</td><td>+12 000</td><td>↑ dynamique</td></tr>
    <tr><td>Commerce de détail</td><td>+9 000</td><td>↑ stable</td></tr>
    <tr><td>Construction & BTP</td><td>+8 000</td><td>↑ portée par rénovation énergétique</td></tr>
    <tr><td>Industrie manufacturière</td><td>−4 000</td><td>↓ désindustrialisation résiduelle</td></tr>
    <tr><td>Finance & assurance</td><td>−2 000</td><td>↓ automatisation des back-offices</td></tr>
    <tr><td>Hébergement-restauration</td><td>+6 000</td><td>↑ saison estivale</td></tr>
  </tbody>
</table>

<h2>Chômage des jeunes : légère amélioration mais niveau élevé</h2>

<p>Le taux de chômage des 15–24 ans recule de <strong>0,3 point</strong> à <strong>20,8 %</strong> grâce à l'essor de l'alternance et aux contrats saisonniers d'été. Toutefois, le <em>halo du chômage</em> des jeunes (personnes souhaitant travailler sans être comptabilisées comme chômeurs BIT) reste estimé à <strong>450 000 personnes</strong>, dont une majorité de femmes peu qualifiées en zone rurale ou péri-urbaine.</p>

<h2>Perspectives pour l'automne 2026</h2>

<p>La DARES anticipe un taux de chômage stable autour de <strong>8,2–8,4 %</strong> au T3 2026, avec un léger rebond post-rentrée dû aux fins de CDD saisonniers. Le vrai test viendra au T4 2026, dépendant de l'exécution du budget et de l'évolution des taux directeurs de la BCE.</p>

<p><em>Source : DARES Résultats, INSEE Enquête Emploi T2 2026 — compilé par CléAvenir (août 2026).</em></p>
`,
  },

  {
    id: 'curated_rentree_2026_orientation',
    title: 'Rentrée 2026 : Parcoursup, résultats et guide des dernières places disponibles',
    excerpt: 'La phase complémentaire de Parcoursup se termine le 12 septembre 2026. Plus de 42 000 candidats cherchent encore une formation. Tour d\'horizon des filières qui ont encore des places, des stratégies de recours et des alternatives à ne pas négliger.',
    link: '/actualites/curated_rentree_2026_orientation',
    is_internal: true,
    source: 'CléAvenir — Dossier Rentrée',
    source_logo: '🎯',
    category: 'orientation',
    published_at: '2026-08-18T08:00:00.000Z',
    keywords: ['Parcoursup', 'rentrée 2026', 'phase complémentaire', 'orientation', 'BTS', 'BUT', 'réorientation'],
    publisher: 'CléAvenir — Dossier Rentrée 2026',
    kpis: [
      { label: 'Candidats encore sans affectation', value: '42 000', trend: -1, trendLabel: 'vs 67 000 en 2025' },
      { label: 'Places disponibles phase complémentaire', value: '~120 000', trend: null, trendLabel: 'toutes formations' },
      { label: 'Taux d\'admission global', value: '92,4 %', trend: 1, trendLabel: '+0,8 pt vs 2025' },
      { label: 'Date clôture phase complémentaire', value: '12 sept.', trend: null, trendLabel: '2026' },
    ],
    full_description: `
<h2>Bilan de la session 2026 de Parcoursup</h2>

<p>La session 2026 de Parcoursup s'achève sur un bilan globalement positif : <strong>92,4 %</strong> des candidats ayant formulé au moins un vœu ont reçu une proposition, contre 91,6 % en 2025. La plateforme a traité <strong>1,03 million de dossiers</strong> pour environ 23 000 formations répertoriées, dont 8 200 en apprentissage.</p>

<h2>Phase complémentaire : mode d'emploi</h2>

<p>Pour les <strong>42 000 candidats</strong> encore sans affectation au 20 août 2026, la phase complémentaire reste ouverte jusqu'au <strong>12 septembre 2026</strong>. Voici les étapes clés :</p>

<ol>
  <li><strong>Accéder à « Parcoursup Complémentaire »</strong> via le même compte. Les formations affichant « places disponibles » sont visibles en temps réel.</li>
  <li><strong>Formuler jusqu'à 10 nouveaux vœux</strong> parmi les formations ayant encore de la capacité.</li>
  <li><strong>Contacter directement les établissements</strong> : beaucoup de lycées en BTS, IUT en BUT et écoles privées hors Parcoursup acceptent des dossiers en direct.</li>
  <li><strong>Solliciter un rendez-vous AVENIR</strong> auprès du conseiller France Travail ou de Psy-EN de son lycée.</li>
</ol>

<h3>Filières ayant encore des places au 20 août 2026</h3>

<table>
  <thead>
    <tr><th>Filière</th><th>Places estimées</th><th>Profil adapté</th></tr>
  </thead>
  <tbody>
    <tr><td>BTS Services à la personne</td><td>~8 000</td><td>Bac Pro, STI2D, STMG</td></tr>
    <tr><td>BTS Gestion de la PME</td><td>~5 500</td><td>Bac STMG, Général (SES)</td></tr>
    <tr><td>BUT Génie Civil</td><td>~3 200</td><td>Bac STI2D, Général (Math)</td></tr>
    <tr><td>Licence Pro Management</td><td>~4 800</td><td>BTS/BUT validé, Bac +2</td></tr>
    <tr><td>Formations en alternance (hors Parcoursup)</td><td>~45 000</td><td>Tous profils</td></tr>
    <tr><td>Écoles de commerce post-bac (hors PC)</td><td>~12 000</td><td>Tous bacs avec mention</td></tr>
    <tr><td>BTS Informatique (SIO, SLAM)</td><td>~6 000</td><td>Bac Général, STI2D, NSI</td></tr>
  </tbody>
</table>

<h2>Alternatives à Parcoursup</h2>

<h3>1. L'apprentissage hors plateforme</h3>
<p>Plus de <strong>45 000 contrats d'apprentissage</strong> sont encore à pourvoir fin août 2026. Les CFA recrutent directement : pas besoin de Parcoursup, le contrat se signe entre l'apprenti et l'employeur. Les plateformes Alternance.gouv.fr, 1jeune1solution.gouv.fr et les OPCO sectoriels listent ces offres.</p>

<h3>2. La prépa intégrée</h3>
<p>Plusieurs écoles d'ingénieurs et de commerce proposent des <strong>prépas intégrées</strong> (bac +1 interne) qui ouvrent leurs recrutements complémentaires en septembre. C'est une voie souvent sous-estimée qui offre un diplôme Bac +5 sans passer par les classes prépas CPGE.</p>

<h3>3. L'année de césure ou de service civique</h3>
<p>Le Service National Universel (SNU) et le Service Civique accueillent les jeunes 16–25 ans. Une mission de 6 à 12 mois permet de mûrir son projet d'orientation et de revenir en position de force pour la session Parcoursup 2027.</p>

<p><em>Source : MESRI / Parcoursup, ONISEP, France Travail — données au 20 août 2026, compilées par CléAvenir.</em></p>
`,
  },

  {
    id: 'curated_ia_emploi_aout_2026',
    title: 'IA et marché du travail : 1,2 million de postes transformés d\'ici 2028 en France',
    excerpt: 'Un rapport conjoint DARES-France Stratégie publié en août 2026 recense les métiers les plus exposés à l\'automatisation par l\'IA générative. Comptables, assistants juridiques, gestionnaires de paie : les cols blancs répétitifs sont en première ligne. Mais de nouveaux métiers émergent.',
    link: '/actualites/curated_ia_emploi_aout_2026',
    is_internal: true,
    source: 'CléAvenir — Analyses & Tendances',
    source_logo: '🤖',
    category: 'marche-travail',
    published_at: '2026-08-12T09:00:00.000Z',
    keywords: ['intelligence artificielle', 'automatisation', 'emploi', 'DARES', 'France Stratégie', 'reconversion', 'métiers du futur'],
    publisher: 'CléAvenir — Analyses & Tendances août 2026',
    kpis: [
      { label: 'Postes transformés d\'ici 2028', value: '1,2 M', trend: null, trendLabel: 'France, tous secteurs' },
      { label: 'Postes créés (IA & tech)', value: '+340 000', trend: 1, trendLabel: 'net positif sur 3 ans' },
      { label: 'Salariés à former en urgence', value: '860 000', trend: null, trendLabel: 'compétences IA de base' },
      { label: 'Secteur le plus exposé', value: 'Finance', trend: null, trendLabel: '38 % des postes touchés' },
    ],
    full_description: `
<h2>Le rapport DARES-France Stratégie : méthode et périmètre</h2>

<p>Publié le 5 août 2026, le rapport <em>« Intelligence artificielle et transformations du marché du travail en France (2026–2030) »</em> s'appuie sur l'analyse de <strong>22 millions de fiches de poste</strong> couplée aux capacités actuelles des LLM (grands modèles de langage) de dernière génération. Il identifie trois niveaux d'exposition :</p>

<ul>
  <li><strong>Fortement exposé</strong> : tâches entièrement automatisables par l'IA dans les 24 mois.</li>
  <li><strong>Partiellement exposé</strong> : tâches augmentées par l'IA (l'humain supervise et valide).</li>
  <li><strong>Peu exposé</strong> : tâches nécessitant présence physique, empathie ou créativité non reproductible.</li>
</ul>

<h3>Métiers les plus exposés à une transformation profonde</h3>

<table>
  <thead>
    <tr><th>Métier</th><th>Niveau d'exposition</th><th>Horizon de transformation</th></tr>
  </thead>
  <tbody>
    <tr><td>Comptable / aide-comptable</td><td>🔴 Fort</td><td>Dès 2026–2027</td></tr>
    <tr><td>Gestionnaire de paie</td><td>🔴 Fort</td><td>Dès 2026–2027</td></tr>
    <tr><td>Assistant juridique / paralégal</td><td>🔴 Fort</td><td>2027</td></tr>
    <tr><td>Téléconseiller / chargé de relation client</td><td>🟠 Moyen</td><td>2027–2028</td></tr>
    <tr><td>Rédacteur technique / traducteur</td><td>🟠 Moyen</td><td>2026–2027</td></tr>
    <tr><td>Analyste de données junior</td><td>🟠 Moyen</td><td>2027</td></tr>
    <tr><td>Infirmier / aide-soignant</td><td>🟢 Faible</td><td>Augmentation, pas remplacement</td></tr>
    <tr><td>Plombier / électricien</td><td>🟢 Faible</td><td>Peu d'impact direct</td></tr>
    <tr><td>Enseignant / formateur</td><td>🟢 Faible</td><td>Outils IA complémentaires</td></tr>
  </tbody>
</table>

<h2>Les métiers qui émergent grâce à l'IA</h2>

<p>Le rapport recense <strong>340 000 postes nets créés</strong> sur la période 2026–2028 dans l'écosystème IA :</p>

<ul>
  <li><strong>Prompt engineer / ingénieur de dialogue</strong> : conception et optimisation des interactions avec les LLM — 18 000 postes estimés.</li>
  <li><strong>Auditeur algorithmique / AI compliance officer</strong> : vérification de la conformité des systèmes d'IA au règlement européen IA Act — 12 000 postes.</li>
  <li><strong>Spécialiste en cybersécurité IA</strong> : protection des modèles contre les attaques adversariales — 25 000 postes.</li>
  <li><strong>Coordinateur humain-IA</strong> : supervision des workflows hybrides (humain + IA) dans les grandes organisations — 45 000 postes.</li>
  <li><strong>Formateur en compétences numériques</strong> : accompagnement à la montée en compétence — 22 000 postes.</li>
</ul>

<h2>Que faire si votre métier est exposé ?</h2>

<p>France Compétences et les OPCO ont lancé en juillet 2026 le dispositif <strong>« Compétences IA »</strong> : un parcours de formation certifiant de 70 heures (éligible CPF) permettant à tout salarié de maîtriser les bases des outils IA appliqués à son métier. Renseignez-vous auprès de votre OPCO ou sur <em>moncompteformation.gouv.fr</em>.</p>

<p><em>Source : DARES / France Stratégie — rapport publié le 5 août 2026. Données compilées par CléAvenir.</em></p>
`,
  },

  {
    id: 'curated_metiers_tension_ete_2026',
    title: 'Les 10 métiers les plus recherchés en France — été 2026',
    excerpt: 'France Travail publie son baromètre estival des tensions de recrutement. Certains secteurs affichent des taux de vacance record : numérique, santé, BTP et services à la personne peinent à trouver des candidats malgré un chômage en hausse. Décryptage et conseils.',
    link: '/actualites/curated_metiers_tension_ete_2026',
    is_internal: true,
    source: 'CléAvenir — Baromètre Emploi',
    source_logo: '💼',
    category: 'emploi',
    published_at: '2026-08-05T08:00:00.000Z',
    keywords: ['métiers en tension', 'recrutement', 'offres d\'emploi', 'France Travail', 'numérique', 'santé', 'BTP'],
    publisher: 'CléAvenir — Baromètre Emploi été 2026',
    kpis: [
      { label: 'Offres d\'emploi non pourvues', value: '382 000', trend: 1, trendLabel: '+4 % vs été 2025' },
      { label: 'Délai moyen de recrutement', value: '6,2 sem.', trend: 1, trendLabel: '+0,8 sem. en un an' },
      { label: 'Métiers en tension critique', value: '47', trend: 1, trendLabel: 'liste DARES 2026' },
      { label: 'Offres > 3 mois sans candidat', value: '28 %', trend: 1, trendLabel: 'des offres actives' },
    ],
    full_description: `
<h2>Baromètre des tensions de recrutement — été 2026</h2>

<p>France Travail publie chaque trimestre son <em>Baromètre des tensions de recrutement</em>. L'édition de l'été 2026 révèle une situation paradoxale : avec un chômage à 8,3 %, on pourrait s'attendre à une facilité accrue de recrutement. Or, <strong>382 000 offres d'emploi</strong> restent non pourvues, soit 4 % de plus qu'à l'été 2025. Ce décalage structurel entre l'offre et la demande de travail témoigne d'un grave <em>mismatch de compétences</em>.</p>

<h3>Top 10 des métiers les plus recherchés (été 2026)</h3>

<table>
  <thead>
    <tr><th>Rang</th><th>Métier</th><th>Offres actives</th><th>Salaire médian</th><th>Formation recommandée</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Développeur logiciel / full-stack</td><td>41 200</td><td>42 000 € brut/an</td><td>Bac +3 à +5 (informatique)</td></tr>
    <tr><td>2</td><td>Aide-soignant / auxiliaire de vie</td><td>38 700</td><td>22 000 € brut/an</td><td>DEAVS, DEAES (1 an)</td></tr>
    <tr><td>3</td><td>Électricien (tertiaire & résidentiel)</td><td>29 500</td><td>30 000 € brut/an</td><td>CAP / Bac Pro MELEC</td></tr>
    <tr><td>4</td><td>Infirmier(e) diplômé(e) d'État</td><td>27 300</td><td>32 000 € brut/an</td><td>IFSI (3 ans, Parcoursup)</td></tr>
    <tr><td>5</td><td>Technicien maintenance industrielle</td><td>24 800</td><td>32 500 € brut/an</td><td>BTS MI, BUT GIM</td></tr>
    <tr><td>6</td><td>Data engineer / data analyst</td><td>22 100</td><td>44 000 € brut/an</td><td>Bac +3 à +5 (data)</td></tr>
    <tr><td>7</td><td>Plombier-chauffagiste</td><td>19 600</td><td>28 000 € brut/an</td><td>CAP / Bac Pro TISEC</td></tr>
    <tr><td>8</td><td>Commercial terrain (B2B)</td><td>18 900</td><td>35 000 € (fixe + var.)</td><td>BTS NDRC, BUT TC</td></tr>
    <tr><td>9</td><td>Technicien photovoltaïque</td><td>16 400</td><td>29 000 € brut/an</td><td>Habilitation électrique + QUALIFELEC</td></tr>
    <tr><td>10</td><td>Cuisinier / chef de partie</td><td>15 800</td><td>24 000 € brut/an</td><td>CAP Cuisine, Bac Pro Cuisine</td></tr>
  </tbody>
</table>

<h2>Pourquoi ces postes restent-ils vacants ?</h2>

<p>Les employeurs interrogés citent trois obstacles principaux :</p>

<ol>
  <li><strong>Manque de candidats qualifiés</strong> (64 % des employeurs) : les formations spécialisées produisent moins de diplômés que le marché n'en absorbe, notamment en numérique et en santé.</li>
  <li><strong>Conditions de travail perçues comme difficiles</strong> (48 %) : horaires décalés, travail de nuit, pénibilité physique — en particulier dans l'aide à domicile et la restauration.</li>
  <li><strong>Salaires insuffisants</strong> (39 %) : le salaire proposé est jugé non compétitif face au coût de la vie, surtout dans les grandes métropoles.</li>
</ol>

<h2>Comment candidater sur ces postes ?</h2>

<p>Si vous êtes en recherche d'emploi ou en reconversion, ces métiers en tension offrent de vraies opportunités :</p>
<ul>
  <li><strong>Aide à la formation</strong> : la plupart sont éligibles aux aides CPF, Pro-A ou Transitions Collectives.</li>
  <li><strong>Immersion professionnelle</strong> : France Travail propose des PMSMP (Périodes de Mise en Situation en Milieu Professionnel) de 1 à 30 jours pour tester un métier avant de s'engager.</li>
  <li><strong>Candidature spontanée</strong> : avec un taux de vacance élevé, la démarche directe est plus efficace que les jobboards — contactez les entreprises de votre bassin d'emploi.</li>
</ul>

<p><em>Source : France Travail — Baromètre des tensions de recrutement, juillet 2026. Compilé par CléAvenir.</em></p>
`,
  },

  {
    id: 'curated_reforme_cpf_2026',
    title: 'CPF en 2026 : participation de 100 € maintenue, nouvelles formations éligibles',
    excerpt: 'Depuis le 2 mai 2024, les titulaires d\'un CPF doivent s\'acquitter d\'une participation de 100 € (sauf cas d\'exonération). En août 2026, le gouvernement annonce l\'élargissement des formations éligibles : cybersécurité, IA générative et transition écologique rejoignent le catalogue.',
    link: '/actualites/curated_reforme_cpf_2026',
    is_internal: true,
    source: 'CléAvenir — Flash Formation',
    source_logo: '📚',
    category: 'formation',
    published_at: '2026-08-01T08:30:00.000Z',
    keywords: ['CPF', 'formation professionnelle', 'financement', 'cybersécurité', 'IA', 'transition écologique', 'Mon Compte Formation'],
    publisher: 'CléAvenir — Flash Formation août 2026',
    kpis: [
      { label: 'Participation obligatoire CPF', value: '100 €', trend: null, trendLabel: 'maintenue en 2026' },
      { label: 'Nouvelles formations éligibles', value: '+1 240', trend: 1, trendLabel: 'catalogue 2026' },
      { label: 'Budget moyen CPF / actif', value: '860 €', trend: 1, trendLabel: '+60 € vs 2025' },
      { label: 'Formations IA éligibles CPF', value: '318', trend: 1, trendLabel: 'dont 12 certifiantes' },
    ],
    full_description: `
<h2>Le CPF en 2026 : ce qui change, ce qui reste</h2>

<p>Le Compte Personnel de Formation (CPF) reste le principal outil de financement de la formation individuelle en France. En 2026, les règles de base sont maintenues avec quelques ajustements :</p>

<ul>
  <li><strong>Participation de 100 €</strong> : instaurée en mai 2024, elle reste en vigueur. Elle est exonérée pour les demandeurs d'emploi, les personnes en reconversion via Transitions Pro, les bénéficiaires du RSA et les personnes en situation de handicap.</li>
  <li><strong>Alimentation du compte</strong> : les salariés à temps plein accumulent <strong>500 €/an</strong> (plafonné à 5 000 €), et les peu qualifiés <strong>800 €/an</strong> (plafonné à 8 000 €).</li>
  <li><strong>Abondement employeur</strong> : les entreprises peuvent compléter le CPF de leurs salariés — une pratique en hausse (+22 % en 2025).</li>
</ul>

<h2>Nouvelles formations éligibles : les grandes catégories</h2>

<p>À partir du 1er septembre 2026, <strong>1 240 nouvelles formations</strong> entrent dans le catalogue CPF, organisées autour de trois thématiques prioritaires :</p>

<h3>1. Cybersécurité et protection des données</h3>
<p>Face à l'explosion des cyberattaques (coût estimé à 5,5 Mds€ pour les entreprises françaises en 2025), France Compétences a labellisé 420 formations en sécurité informatique, dont :</p>
<ul>
  <li>Certification ANSSI SecNumedu (niveau initiation à expert)</li>
  <li>CompTIA Security+ et CySA+ en version française</li>
  <li>RGPD Practitioner (DPO de proximité)</li>
</ul>

<h3>2. Intelligence artificielle générative</h3>
<p>318 formations couvrant l'usage professionnel des LLM, le prompt engineering, l'éthique de l'IA et l'IA Act européen. Parmi les certifications emblématiques :</p>
<ul>
  <li>AI Foundations (France Compétences / INRIA)</li>
  <li>Utiliser l'IA dans mon métier — parcours métier (comptabilité, RH, marketing, droit)</li>
  <li>Machine Learning pour non-développeurs (DataScientest, OpenClassrooms)</li>
</ul>

<h3>3. Transition écologique et compétences vertes</h3>
<p>502 formations sur les métiers de la rénovation énergétique, la mobilité décarbonée et le management environnemental :</p>
<ul>
  <li>RGE Qualibat (rénovation énergétique des bâtiments)</li>
  <li>Bilan carbone de territoire (méthode ADEME)</li>
  <li>Monteur en systèmes photovoltaïques (habilitation + QUALIFELEC)</li>
</ul>

<h2>Comment mobiliser votre CPF ?</h2>

<ol>
  <li>Rendez-vous sur <strong>moncompteformation.gouv.fr</strong> et connectez-vous avec France Connect.</li>
  <li>Consultez votre solde — il est exprimé en euros depuis 2019.</li>
  <li>Recherchez une formation par mot-clé, certification ou RNCP.</li>
  <li>Vérifiez l'éligibilité à l'exonération des 100 € si vous êtes demandeur d'emploi.</li>
  <li>Validez en ligne : aucun dossier papier n'est requis.</li>
</ol>

<p><em>Source : France Compétences, DGEFP, Caisse des Dépôts — données août 2026. Compilé par CléAvenir.</em></p>
`,
  },

  // ── Aides régionales Île-de-France — août 2026 ──────────────────────────────

  {
    id: 'curated_ara_idf_2026',
    title: "Aide Régionale à l'Apprentissage (ARA) : jusqu'à 200 € pour les apprentis franciliens en 1re année",
    excerpt: "La Région Île-de-France reconduit son aide aux apprentis de niveaux 3 à 5 (CAP, Bac, BTS) en première année de formation : 200 € pour les CAP/Bac Pro, 115 € pour les BTS. La demande est portée par le CFA, pas par l'apprenti.",
    link: '/actualites/curated_ara_idf_2026',
    is_internal: true,
    source: 'CléAvenir — Aides & Dispositifs',
    source_logo: '🎓',
    category: 'alternance',
    published_at: '2026-08-28T08:00:00.000Z',
    keywords: ['ARA', 'aide apprentissage', 'Île-de-France', 'CFA', 'CAP', 'BTS', 'apprentis'],
    publisher: 'CléAvenir — Aides & Dispositifs août 2026',
    kpis: [
      { label: 'CAP / Bac Pro (niveaux 3-4)', value: '200 €', trend: null, trendLabel: 'versés en 1 fois' },
      { label: 'BTS (niveau 5)', value: '115 €', trend: null, trendLabel: 'versés en 1 fois' },
      { label: 'Démarche', value: 'via le CFA', trend: null, trendLabel: 'aucune demande individuelle' },
      { label: 'Renouvellement', value: 'Non', trend: null, trendLabel: '1 seule fois par apprenti' },
    ],
    full_description: `
<h2>Une aide pour couvrir les premiers frais de l'apprentissage</h2>

<p>La Région Île-de-France reconduit l'<strong>Aide Régionale à l'Apprentissage (ARA)</strong>, destinée aux apprentis débutant leur formation en <strong>première année</strong>, aux niveaux 3 (CAP), 4 (Bac professionnel) et 5 (BTS). Elle vise à financer l'achat de livres, de matériel professionnel, ainsi que les frais de transport, de restauration ou d'hébergement liés à la formation.</p>

<h3>Qui est concerné ?</h3>

<ul>
  <li>Apprentis en <strong>1re année</strong> de contrat d'apprentissage.</li>
  <li>Formation suivie dans un <strong>CFA implanté en Île-de-France</strong>, de niveau 3, 4 ou 5.</li>
  <li>Contrat d'apprentissage en cours de validité.</li>
  <li>Ne pas avoir déjà bénéficié de cette aide auparavant.</li>
</ul>

<h3>Montant</h3>

<p><strong>200 €</strong> pour les apprentis de niveaux 3 (CAP) et 4 (Bac), <strong>115 €</strong> pour les apprentis de niveau 5 (BTS). Le versement se fait en une seule fois, indépendamment de la rémunération d'apprentissage.</p>

<h3>Comment en bénéficier ?</h3>

<p>Aucune démarche individuelle à effectuer : c'est le <strong>CFA</strong> qui dépose la demande pour le compte de ses apprentis éligibles, via la plateforme <strong>mesdemarches.iledefrance.fr</strong>, pendant les périodes de dépôt fixées par la Région. Renseignez-vous directement auprès de votre CFA pour savoir si la demande a été effectuée.</p>

<p><em>Source : Région Île-de-France — dispositif ARA. Compilé par CléAvenir.</em></p>
`,
  },

  {
    id: 'curated_recrutup_idf_2026',
    title: "Recrut'Up : jusqu'à 12 000 € pour former un demandeur d'emploi avant embauche",
    excerpt: "La Région Île-de-France finance jusqu'à 70 % du coût d'une formation destinée à un demandeur d'emploi recruté par une entreprise sur des compétences prioritaires (secteurs techniques et industriels). Dépôt des dossiers ouvert jusqu'au 31 janvier 2027.",
    link: '/actualites/curated_recrutup_idf_2026',
    is_internal: true,
    source: 'CléAvenir — Aides & Dispositifs',
    source_logo: '💼',
    category: 'emploi',
    published_at: '2026-08-28T08:10:00.000Z',
    keywords: ["Recrut'Up", 'Île-de-France', "demandeur d'emploi", 'formation', 'recrutement', 'entreprise'],
    publisher: 'CléAvenir — Aides & Dispositifs août 2026',
    kpis: [
      { label: 'Aide maximale', value: '12 000 €', trend: null, trendLabel: "par demandeur d'emploi" },
      { label: 'Prise en charge régionale', value: '70 %', trend: null, trendLabel: 'max. du coût de formation' },
      { label: 'Cofinancement entreprise', value: '30 %', trend: null, trendLabel: 'minimum' },
      { label: 'Clôture des dépôts', value: '31 janv. 2027', trend: null, trendLabel: 'sur mesdemarches.iledefrance.fr' },
    ],
    full_description: `
<h2>Former un demandeur d'emploi avant son embauche</h2>

<p><strong>Recrut'Up</strong> est le dispositif de la Région Île-de-France qui finance la formation d'un demandeur d'emploi sur des compétences identifiées comme prioritaires, notamment dans les secteurs techniques et industriels, en vue d'un recrutement par une entreprise partenaire.</p>

<h3>Montant et financement</h3>

<ul>
  <li>Aide régionale plafonnée à <strong>12 000 €</strong> par demandeur d'emploi.</li>
  <li>Prise en charge dans la limite de <strong>70 %</strong> du coût total de la formation.</li>
  <li>L'entreprise qui recrute cofinance au minimum <strong>30 %</strong> du coût de la formation.</li>
  <li>L'aide est versée par subrogation à l'organisme de formation.</li>
</ul>

<h3>Comment déposer un dossier ?</h3>

<p>C'est l'<strong>organisme de formation</strong> qui dépose la demande, accompagnée des pièces justificatives, sur <strong>mesdemarches.iledefrance.fr</strong>, pour le compte du demandeur d'emploi et en lien avec l'entreprise qui recrute. Le dépôt des dossiers est ouvert jusqu'au <strong>31 janvier 2027</strong>.</p>

<p>Pour toute question : <strong>recrutup@iledefrance.fr</strong></p>

<p><em>Source : Région Île-de-France — dispositif Recrut'Up. Compilé par CléAvenir.</em></p>
`,
  },

  {
    id: 'curated_bacheliers_meritants_idf_2026',
    title: "Aide aux bacheliers méritants : 1 000 € pour les boursiers mention Très Bien",
    excerpt: "Les bacheliers franciliens boursiers ayant obtenu la mention « Très Bien » au bac 2026 et poursuivant leurs études en Île-de-France perçoivent automatiquement 1 000 € au cours de l'année 2026-2027, sans aucune démarche à effectuer.",
    link: '/actualites/curated_bacheliers_meritants_idf_2026',
    is_internal: true,
    source: 'CléAvenir — Aides & Dispositifs',
    source_logo: '🏅',
    category: 'formation',
    published_at: '2026-08-28T08:20:00.000Z',
    keywords: ['bacheliers méritants', 'mention très bien', 'Île-de-France', 'bourse', 'Crous', 'aide au mérite'],
    publisher: 'CléAvenir — Aides & Dispositifs août 2026',
    kpis: [
      { label: "Montant de l'aide", value: '1 000 €', trend: null, trendLabel: 'versé en 2026-2027' },
      { label: 'Démarche à effectuer', value: 'Aucune', trend: null, trendLabel: 'versement automatique' },
      { label: 'Condition mention', value: 'Très Bien', trend: null, trendLabel: 'au bac 2026' },
      { label: 'Condition ressources', value: 'Boursier BCS', trend: null, trendLabel: 'bourse sur critères sociaux' },
    ],
    full_description: `
<h2>Une reconnaissance financière pour les meilleurs bacheliers boursiers</h2>

<p>La Région Île-de-France verse une <strong>aide aux bacheliers méritants</strong> d'un montant de <strong>1 000 €</strong> aux lycéens ayant obtenu leur baccalauréat 2026 avec la mention <strong>« Très Bien »</strong>, sous conditions de ressources.</p>

<h3>Conditions d'éligibilité</h3>

<ul>
  <li>Avoir obtenu le <strong>bac 2026 avec mention Très Bien</strong> dans un établissement d'Île-de-France.</li>
  <li>Être inscrit à la rentrée <strong>2026-2027</strong> dans un établissement d'enseignement supérieur, ou de formation sanitaire et sociale, situé en Île-de-France.</li>
  <li>Être bénéficiaire de la <strong>bourse sur critères sociaux (BCS)</strong> versée par les Crous des académies de Paris, Versailles ou Créteil.</li>
</ul>

<h3>Aucune démarche à effectuer</h3>

<p>Si toutes les conditions sont réunies, l'aide est versée <strong>automatiquement</strong> — par le Crous de Paris pour la majorité des étudiants, ou directement par la Région pour les formations sanitaires et sociales. Il n'y a donc pas de dossier à constituer.</p>

<p><em>Source : Région Île-de-France — Aide aux bacheliers méritants. Compilé par CléAvenir.</em></p>
`,
  },
];
