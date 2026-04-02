import { cleoService } from './cleoService';

export const cleoResponseService = {
  
  async generateResponse(intent, query, context) {
    const baseResponse = {
      text: "",
      components: [],
      xpReward: 10,
      skillDeveloped: 'recherche'
    };

    switch (intent) {
      case 'metier_search':
        return await this.generateMetierResponse(query, context);
      case 'formation_search':
        return await this.generateFormationResponse(query);
      case 'salary_question':
        return await this.generateSalaryResponse(query);
      case 'test_recommendation':
        return this.generateTestResponse(context);
      case 'parcoursup_help':
        return this.generateParcoursupResponse();
      case 'blog_search':
        return await this.generateBlogResponse();
      case 'general_question':
      default:
        return this.generateGeneralResponse(context);
    }
  },

  async generateMetierResponse(query, context) {
    const metiers = await cleoService.searchMetiers(query || '');
    
    if (!metiers || metiers.length === 0) {
      return {
        text: `Je n'ai pas trouvé de métier correspondant à "${query}" 😕. Veux-tu essayer une autre recherche ou passer notre test d'orientation ?`,
        components: [
          { type: 'action_buttons', data: { actions: [
            { label: "Passer le test", action: "start_test" },
            { label: "Explorer les secteurs", action: "explore_sectors" }
          ]}}
        ],
        xpReward: 5,
        skillDeveloped: 'recherche'
      };
    }

    return {
      text: `Voici quelques métiers qui pourraient t'intéresser pour "${query}" 🚀 :`,
      components: [
        { type: 'metier_cards', data: { metiers: metiers.slice(0, 3) } },
        { type: 'quick_actions', data: { actions: [
          { label: "Voir les salaires", query: `salaire ${query}` },
          { label: "Formations liées", query: `formation ${query}` }
        ]}}
      ],
      xpReward: 20,
      skillDeveloped: 'connaissance_soi'
    };
  },

  async generateFormationResponse(query) {
    const formations = await cleoService.searchFormations(query || '');
    
    if (!formations || formations.length === 0) {
      return {
        text: "Je ne trouve pas de formation spécifique pour le moment. As-tu essayé de rechercher un métier d'abord ?",
        components: [],
        xpReward: 5,
        skillDeveloped: 'recherche'
      };
    }

    return {
      text: "J'ai trouvé ces formations pour toi 🎓. Elles sont disponibles dans plusieurs établissements :",
      components: [
        { type: 'formation_cards', data: { formations: formations.slice(0, 3) } },
        { type: 'info_box', data: { title: "Conseil Cléo", content: "Pense à vérifier les dates limites d'inscription sur Parcoursup !" } }
      ],
      xpReward: 15,
      skillDeveloped: 'orientation'
    };
  },

  async generateSalaryResponse(query) {
    // Mock salary data generation for demo
    const data = [
      { name: 'Junior', min: 24000, max: 32000 },
      { name: 'Confirmé', min: 32000, max: 45000 },
      { name: 'Senior', min: 45000, max: 65000 },
    ];

    return {
      text: `Voici une estimation des salaires pour ce type de poste. Note que cela varie selon la région et l'entreprise 💰.`,
      components: [
        { type: 'salary_chart', data: { jobTitle: query, salaryData: data } },
        { type: 'cta_card', data: { 
            title: "Négociation Salariale", 
            description: "Apprends à négocier ton premier salaire avec notre module interactif.",
            duration: "5 min",
            xp: 50,
            actionLabel: "Lancer le module",
            action: "start_negotiation_module"
        }}
      ],
      xpReward: 25,
      skillDeveloped: 'monde_pro'
    };
  },

  generateTestResponse(context) {
    if (context.hasTakenTest) {
      return {
        text: `Tu as déjà passé le test ! 🎉 Voici tes résultats principaux :`,
        components: [
          { type: 'stats_display', data: { 
              stats: [
                { label: "Profil", value: "Créatif" },
                { label: "Secteur", value: "Design" }
              ]
          }},
          { type: 'metier_cards', data: { metiers: context.topCareers || [] } }
        ],
        xpReward: 0,
        skillDeveloped: 'connaissance_soi'
      };
    }

    return {
      text: "Tu sembles te poser des questions sur ton avenir. C'est normal ! 😊 Je te recommande notre test d'orientation gratuit.",
      components: [
        { type: 'cta_card', data: {
            title: "Test d'Orientation IA",
            description: "Découvre tes forces et les métiers faits pour toi en 5 minutes.",
            duration: "5 min",
            xp: 100,
            actionLabel: "Commencer le test",
            action: "start_test"
        }}
      ],
      xpReward: 5,
      skillDeveloped: 'connaissance_soi'
    };
  },

  generateParcoursupResponse() {
    return {
      text: "Parcoursup : pas de panique ! Voici la stratégie gagnante en 3 étapes :",
      components: [
        { type: 'timeline', data: { events: [
            { date: "Janvier", title: "Ouverture & Voeux", status: "completed" },
            { date: "Mars", title: "Clôture des voeux", status: "active" },
            { date: "Avril", title: "Finalisation dossier", status: "pending" },
            { date: "Juin", title: "Résultats d'admission", status: "pending" }
        ]}},
        { type: 'strategy_card', data: { 
            safe: "2-3 voeux (Licence)", 
            probable: "4-5 voeux (BTS/BUT)", 
            ambitious: "2-3 voeux (Prépas/Écoles)" 
        }}
      ],
      xpReward: 30,
      skillDeveloped: 'orientation'
    };
  },

  async generateBlogResponse() {
    const articles = await cleoService.getBlogArticles();
    return {
      text: "Voici une sélection d'articles pour t'aider dans tes démarches 📚 :",
      components: [
        { type: 'article_cards', data: { articles: articles.slice(0, 3) } }
      ],
      xpReward: 10,
      skillDeveloped: 'recherche'
    };
  },

  generateGeneralResponse(context) {
    return {
      text: `Bonjour ${context.userName} ! 👋 Je suis Cléo. Je peux t'aider à trouver un métier, une formation ou te guider sur Parcoursup. Que veux-tu faire ?`,
      components: [
        { type: 'quick_actions', data: { actions: [
            { label: "🔍 Trouver un métier", query: "trouver un métier" },
            { label: "🎓 Chercher une formation", query: "chercher formation" },
            { label: "🧩 Passer le test", action: "start_test" },
            { label: "📅 Aide Parcoursup", query: "aide parcoursup" }
        ]}}
      ],
      xpReward: 5,
      skillDeveloped: 'communication'
    };
  }
};