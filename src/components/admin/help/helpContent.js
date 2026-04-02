export const HELP_SECTIONS = {
  DASHBOARD: {
    title: "Tableau de bord",
    description: "Vue d'ensemble de l'activité de la plateforme, incluant les statistiques clés sur les utilisateurs, les tests effectués et les revenus.",
    utility: "Permet de surveiller la santé globale du service et d'identifier les tendances importantes en un coup d'œil.",
    actions: [
      "Consulter les métriques clés (KPIs)",
      "Voir les graphiques d'évolution",
      "Accéder rapidement aux sections principales"
    ],
    tips: "Les statistiques sont mises à jour en temps réel. Utilisez les filtres de date pour analyser des périodes spécifiques."
  },
  ESTABLISHMENTS: {
    title: "Gestion des établissements",
    description: "Interface d'administration pour la base de données des établissements scolaires (Universités, Grandes Écoles, Lycées, etc.).",
    utility: "Centralise toutes les informations sur les partenaires éducatifs et permet leur mise à jour.",
    actions: [
      "Ajouter ou supprimer un établissement",
      "Modifier les informations (adresse, contact, description)",
      "Gérer le statut (actif/inactif)",
      "Exporter la liste des établissements"
    ],
    tips: "Utilisez la recherche pour trouver rapidement un établissement par son nom ou sa ville."
  },
  USERS: {
    title: "Gestion des utilisateurs",
    description: "Administration complète des comptes utilisateurs enregistrés sur la plateforme.",
    utility: "Permet de gérer l'accès, les rôles et d'assister les utilisateurs en cas de problème.",
    actions: [
      "Rechercher un utilisateur spécifique",
      "Modifier les rôles (Admin, Utilisateur)",
      "Gérer les abonnements",
      "Supprimer ou bannir des comptes"
    ],
    tips: "Attention aux suppressions de compte qui sont irréversibles. Privilégiez la désactivation si possible."
  },
  FORMATIONS: {
    title: "Gestion des formations",
    description: "Catalogue des programmes éducatifs et diplômes disponibles.",
    utility: "Assure que l'offre de formation présentée aux étudiants est à jour et complète.",
    actions: [
      "Ajouter de nouvelles formations",
      "Lier des formations aux établissements",
      "Mettre à jour les débouchés",
      "Gérer les tags et catégories"
    ],
    tips: "Une fiche formation bien détaillée augmente la pertinence des résultats de matching pour les étudiants."
  },
  TESTS: {
    title: "Gestion des tests",
    description: "Suivi et analyse des tests d'orientation passés par les utilisateurs.",
    utility: "Permet de comprendre les profils des utilisateurs et d'améliorer les algorithmes de recommandation.",
    actions: [
      "Voir les résultats individuels",
      "Analyser les statistiques globales",
      "Filtrer par type de test ou score",
      "Exporter les données de résultats"
    ],
    tips: "Utilisez les filtres de score pour identifier les utilisateurs ayant besoin d'un accompagnement spécifique."
  },
  SETTINGS: {
    title: "Paramètres",
    description: "Configuration globale technique et fonctionnelle de la plateforme.",
    utility: "Permet d'ajuster le comportement du site sans déploiement de code.",
    actions: [
      "Configurer les emails (SMTP)",
      "Gérer les clés API (Stripe, OpenAI)",
      "Activer/Désactiver des fonctionnalités",
      "Personnaliser l'apparence (Thème)"
    ],
    tips: "Certaines modifications peuvent impacter immédiatement l'expérience utilisateur. Procédez avec précaution."
  },
  AUDIT_LOGS: {
    title: "Journaux d'audit",
    description: "Historique technique des actions effectuées sur la plateforme et événements système.",
    utility: "Indispensable pour la sécurité, le débogage et la traçabilité des modifications.",
    actions: [
      "Consulter les erreurs API",
      "Voir les connexions et actions admin",
      "Vérifier les performances",
      "Filtrer par date ou type d'événement"
    ],
    tips: "En cas de problème signalé par un utilisateur, commencez par vérifier les logs d'erreurs récents ici."
  },
  REPORTS: {
    title: "Rapports et statistiques",
    description: "Section dédiée à l'analyse approfondie des données.",
    utility: "Fournit des insights pour la prise de décision stratégique.",
    actions: [
      "Générer des rapports PDF",
      "Analyser la rétention utilisateur",
      "Voir les tendances de carrière"
    ],
    tips: "Les rapports mensuels sont générés automatiquement le 1er de chaque mois."
  }
};