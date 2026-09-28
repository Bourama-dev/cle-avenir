// Question bank for the daily interview practice (/interview/entrainement).
// Ids are stable: progress is stored against them, so never renumber —
// append new questions with new ids instead.

export const PRACTICE_CATEGORIES = [
  { key: 'classiques', label: 'Questions classiques', emoji: '💬', description: 'Les incontournables de tout entretien.' },
  { key: 'soft_skills', label: 'Soft skills', emoji: '🤝', description: "Travail d'équipe, communication, adaptabilité." },
  { key: 'comportementales', label: 'Comportementales', emoji: '🎯', description: 'Raconte une situation vécue avec la méthode STAR.' },
  { key: 'techniques', label: 'Techniques', emoji: '⚙️', description: 'Compétences, outils et façon de travailler.' },
  { key: 'pieges', label: 'Pièges', emoji: '⚠️', description: 'Les questions qui déstabilisent : garde ton calme.' },
  { key: 'situations', label: 'Mises en situation', emoji: '🎭', description: 'Réagis à un cas concret comme au travail.' },
];

export const PRACTICE_QUESTIONS = [
  // ── Classiques ────────────────────────────────────────────────
  { id: 'cla-01', category: 'classiques', text: 'Présente-toi en deux minutes.', tip: 'Passé → présent → futur : ton parcours, ce que tu fais aujourd’hui, pourquoi ce poste.' },
  { id: 'cla-02', category: 'classiques', text: 'Pourquoi veux-tu travailler dans notre entreprise ?', tip: 'Cite un élément précis de l’entreprise (valeur, produit, projet) et relie-le à toi.' },
  { id: 'cla-03', category: 'classiques', text: 'Pourquoi ce poste t’intéresse-t-il ?', tip: 'Relie deux missions du poste à tes compétences ou à ton projet.' },
  { id: 'cla-04', category: 'classiques', text: 'Quelles sont tes trois principales qualités ?', tip: 'Chaque qualité doit s’appuyer sur un exemple court et concret.' },
  { id: 'cla-05', category: 'classiques', text: 'Où te vois-tu dans cinq ans ?', tip: 'Montre de l’ambition réaliste, cohérente avec le poste.' },
  { id: 'cla-06', category: 'classiques', text: 'Qu’est-ce que tu sais de notre secteur ?', tip: 'Une tendance du marché + ce qu’elle implique pour le poste.' },
  { id: 'cla-07', category: 'classiques', text: 'Pourquoi as-tu choisi ta formation ?', tip: 'Explique le déclic, puis ce que la formation t’a apporté concrètement.' },
  { id: 'cla-08', category: 'classiques', text: 'As-tu des questions à nous poser ?', tip: 'Prépare toujours 2 questions sur l’équipe, les missions ou l’intégration.' },

  // ── Soft skills ───────────────────────────────────────────────
  { id: 'sof-01', category: 'soft_skills', text: 'Comment te décrirait ton entourage ou tes collègues ?', tip: 'Choisis des traits utiles pour le poste et illustre-les.' },
  { id: 'sof-02', category: 'soft_skills', text: 'Préfères-tu travailler seul ou en équipe ?', tip: 'Montre que tu sais faire les deux, avec un exemple de chaque.' },
  { id: 'sof-03', category: 'soft_skills', text: 'Comment gères-tu le stress et les délais serrés ?', tip: 'Donne ta méthode (priorisation, découpage) et un exemple réel.' },
  { id: 'sof-04', category: 'soft_skills', text: 'Comment t’adaptes-tu à un changement imprévu ?', tip: 'Situation, ta réaction, ce que tu as appris.' },
  { id: 'sof-05', category: 'soft_skills', text: 'Comment réagis-tu face à une critique ?', tip: 'Montre que tu écoutes, que tu analyses et que tu progresses.' },
  { id: 'sof-06', category: 'soft_skills', text: 'Comment t’organises-tu quand tu as plusieurs tâches en même temps ?', tip: 'Cite un outil ou une méthode : liste, urgence/importance, agenda.' },
  { id: 'sof-07', category: 'soft_skills', text: 'Qu’est-ce qui te motive au quotidien ?', tip: 'Sois sincère et relie ta motivation au contenu du poste.' },
  { id: 'sof-08', category: 'soft_skills', text: 'Comment convaincs-tu quelqu’un qui n’est pas d’accord avec toi ?', tip: 'Écoute, arguments factuels, recherche d’un terrain d’entente.' },

  // ── Comportementales ──────────────────────────────────────────
  { id: 'com-01', category: 'comportementales', text: 'Parle-moi d’une fois où tu t’es planté. Qu’est-ce que tu en as retenu ?', tip: 'Assume l’erreur, décris l’action corrective et la leçon tirée.' },
  { id: 'com-02', category: 'comportementales', text: 'Raconte une situation où tu as pris une initiative.', tip: 'STAR : Situation, Tâche, Action, Résultat — chiffre le résultat si possible.' },
  { id: 'com-03', category: 'comportementales', text: 'Décris un conflit dans une équipe et comment tu l’as géré.', tip: 'Reste factuel, ne blâme personne, insiste sur la solution.' },
  { id: 'com-04', category: 'comportementales', text: 'Parle-moi d’un projet dont tu es fier.', tip: 'Ton rôle précis, la difficulté, le résultat concret.' },
  { id: 'com-05', category: 'comportementales', text: 'Raconte une fois où tu as dû apprendre quelque chose très vite.', tip: 'Montre ta méthode d’apprentissage et le résultat obtenu.' },
  { id: 'com-06', category: 'comportementales', text: 'Décris une situation où tu as aidé quelqu’un à réussir.', tip: 'Ce que tu as fait concrètement, et l’impact pour l’autre personne.' },
  { id: 'com-07', category: 'comportementales', text: 'Raconte un moment où tu as dû respecter une consigne avec laquelle tu n’étais pas d’accord.', tip: 'Montre ton professionnalisme et comment tu as exprimé ton avis.' },
  { id: 'com-08', category: 'comportementales', text: 'Parle-moi d’un objectif difficile que tu as atteint.', tip: 'L’objectif, les obstacles, tes actions, le résultat mesurable.' },

  // ── Techniques ────────────────────────────────────────────────
  { id: 'tec-01', category: 'techniques', text: 'Quels outils ou logiciels maîtrises-tu, et à quel niveau ?', tip: 'Sois honnête sur ton niveau et cite un usage concret pour chacun.' },
  { id: 'tec-02', category: 'techniques', text: 'Explique un sujet complexe de ton domaine à quelqu’un qui n’y connaît rien.', tip: 'Une analogie simple + un exemple du quotidien.' },
  { id: 'tec-03', category: 'techniques', text: 'Comment te tiens-tu à jour dans ton domaine ?', tip: 'Cite des sources précises : sites, newsletters, formations, réseaux.' },
  { id: 'tec-04', category: 'techniques', text: 'Décris ta méthode pour résoudre un problème que tu ne connais pas.', tip: 'Étapes : comprendre, chercher, tester, vérifier, demander de l’aide si besoin.' },
  { id: 'tec-05', category: 'techniques', text: 'Quelle compétence du poste dois-tu encore développer, et comment vas-tu faire ?', tip: 'Choisis une vraie compétence et présente un plan concret.' },
  { id: 'tec-06', category: 'techniques', text: 'Qu’as-tu appris de plus utile pendant ton dernier stage ou ta formation ?', tip: 'Une compétence précise + comment tu l’utiliseras dans ce poste.' },
  { id: 'tec-07', category: 'techniques', text: 'Comment vérifies-tu la qualité de ton travail avant de le rendre ?', tip: 'Relecture, check-list, tests, retour d’un collègue.' },
  { id: 'tec-08', category: 'techniques', text: 'Si tu arrivais demain, quelles seraient tes priorités pendant le premier mois ?', tip: 'Comprendre, s’intégrer, livrer un premier résultat concret.' },

  // ── Pièges ────────────────────────────────────────────────────
  { id: 'pie-01', category: 'pieges', text: 'Quel est ton plus grand défaut ?', tip: 'Un vrai défaut, non rédhibitoire, avec ce que tu fais pour l’améliorer.' },
  { id: 'pie-02', category: 'pieges', text: 'Pourquoi devrions-nous te choisir plutôt qu’un autre candidat ?', tip: 'Tes 2-3 atouts les plus alignés avec le poste, prouvés par des faits.' },
  { id: 'pie-03', category: 'pieges', text: 'Quelles sont tes prétentions salariales ?', tip: 'Donne une fourchette réaliste basée sur le marché, reste ouvert.' },
  { id: 'pie-04', category: 'pieges', text: 'Tu n’as pas beaucoup d’expérience. Pourquoi te faire confiance ?', tip: 'Transforme-le en atout : motivation, capacité d’apprentissage, projets.' },
  { id: 'pie-05', category: 'pieges', text: 'Passes-tu d’autres entretiens en ce moment ?', tip: 'Sois honnête sans détails, et redis ton intérêt pour ce poste.' },
  { id: 'pie-06', category: 'pieges', text: 'Pourquoi y a-t-il un trou dans ton CV ?', tip: 'Explication courte et positive : ce que tu as fait ou appris pendant ce temps.' },
  { id: 'pie-07', category: 'pieges', text: 'Qu’est-ce que tu n’aimerais pas faire dans ce poste ?', tip: 'Reste honnête mais choisis une tâche mineure, et montre que tu t’adaptes.' },
  { id: 'pie-08', category: 'pieges', text: 'Vends-moi ce stylo.', tip: 'Pose d’abord une question sur le besoin, puis présente un bénéfice.' },

  // ── Mises en situation ────────────────────────────────────────
  { id: 'sit-01', category: 'situations', text: 'Un client mécontent t’appelle et hausse le ton. Que fais-tu ?', tip: 'Écouter, reformuler, s’excuser pour la gêne, proposer une solution.' },
  { id: 'sit-02', category: 'situations', text: 'Ton responsable est absent et une décision urgente doit être prise. Comment réagis-tu ?', tip: 'Évalue l’urgence, cherche un relais, décide dans ton périmètre, informe.' },
  { id: 'sit-03', category: 'situations', text: 'Tu te rends compte que tu ne pourras pas tenir un délai. Que fais-tu ?', tip: 'Préviens tôt, explique, propose un nouveau délai ou une solution partielle.' },
  { id: 'sit-04', category: 'situations', text: 'Un collègue ne fait pas sa part du travail sur un projet commun. Comment gères-tu ça ?', tip: 'D’abord un échange direct et bienveillant, puis escalade si nécessaire.' },
  { id: 'sit-05', category: 'situations', text: 'On te confie une mission que tu ne sais pas faire. Comment t’y prends-tu ?', tip: 'Le dire honnêtement, se renseigner, demander un exemple, essayer, faire valider.' },
  { id: 'sit-06', category: 'situations', text: 'Tu as fait une erreur qui a un impact sur un client. Que fais-tu ?', tip: 'Prévenir immédiatement, corriger, expliquer comment éviter que ça se reproduise.' },
  { id: 'sit-07', category: 'situations', text: 'Deux responsables te demandent en même temps une tâche urgente. Comment choisis-tu ?', tip: 'Clarifier les priorités avec eux plutôt que de choisir seul.' },
  { id: 'sit-08', category: 'situations', text: 'Tu as une idée pour améliorer un processus de l’équipe. Comment la proposes-tu ?', tip: 'Constat chiffré, proposition simple, test à petite échelle.' },
];
