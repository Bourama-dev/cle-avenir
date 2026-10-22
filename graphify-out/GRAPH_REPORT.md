# Graph Report - cle-avenir  (2026-10-22)

## Corpus Check
- 936 files · ~442,096 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 43 file(s) not represented in the graph (top: .css 42, (none) 1)

## Summary
- 3433 nodes · 14633 edges · 174 communities (125 shown, 49 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c3d2a0c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- customSupabaseClient.js
- Card
- App.jsx
- react
- EstablishmentDashboard.jsx
- Badge
- careerMatching.js
- dependencies
- cn
- Input
- riasecMatchingAlgorithm.js
- AnimatedItem
- package.json
- framer-motion
- SectorFilterEnhanced.jsx
- employerSummary.js
- LearningPathPage.jsx
- react-router-dom
- PersonalizedPlanPage.jsx
- Label
- CurrentPlanSection.jsx
- DialogContent
- card.jsx
- ChatInterface.jsx
- CardDescription
- ActualitesDetailPage.jsx
- SignupFormValidation.js
- metierService.js
- button.jsx
- Separator
- AdminDashboard.jsx
- MyDocumentsPage.jsx
- LyceeDetailPage.jsx
- PageHelmet
- CleoSidebar.jsx
- matchingUtils.js
- AnalyticsDashboard.jsx
- realDataServices.test.js
- ref_fs
- JobExplorer.jsx
- PreferencesRGPDPage.jsx
- JobDetailPage.jsx
- CVTemplate.jsx
- useDebounce
- linkedData.js
- Button
- LandingHeroPage.jsx
- AuthorizedEmails.jsx
- UserFilterComponent.jsx
- selection-mode-script.js
- ast-utils.js
- RecommendationsSection.jsx
- EnhancedMetierCard.jsx
- HowItWorksPage.jsx
- components.json
- toaster.jsx
- react-helmet-async
- gtmTracking.js
- services/matchingAlgorithm.js
- edit-mode-script.js
- ScrollArea
- devDependencies
- AlternanceFinder.jsx
- useAuth
- vite-plugin-edit-mode.js
- adminAuth.js
- BlogCacheService
- MarcheTravailCard.jsx
- activityService.js
- metierRecommendationService.js
- vite.config.js
- FormationDetailPage.jsx
- ProfileResultsPage.jsx
- metierScoringService.js
- install-missing-components.js
- form.jsx
- emailService.js
- validateSignupForm.js
- SortantsFormationCard.jsx
- useJobFilters.js
- AuthPage.jsx
- adaptiveTestLogic.js
- LyceesPage.jsx
- DashboardOverview.jsx
- AnalyticsCharts.jsx
- SettingsPage.jsx
- FormationDetailsPanel.jsx
- JobDetailDescription.jsx
- JobDetailHero.jsx
- securityService.js
- constellationNodes.js
- ProfilePage.jsx
- careerProfileEmbeddingsService.js
- prerender-meta.js
- utils.js
- navigation-menu.jsx
- ImprovedSignupProgressBar.jsx
- useToast
- chart.jsx
- input-group.jsx
- ResourcesPage.jsx
- educationApi.js
- monitoringService.js
- AdminLogs.jsx
- careerStats.js
- ErrorBoundary
- AdaptiveTestInterface.jsx
- SEOAuditor
- SettingsService.js
- audit-seo.js
- PasswordGenerator.jsx
- AdminGdprDocs.jsx
- JobBadges.jsx
- ResultsDisplay.jsx
- parcoursup.js
- contextualRecommendationService.js
- MobileBottomNav.jsx
- apiQueue
- storageService.js
- serviceWorkerRegistration.js
- scoringAlgorithm.js
- compilerOptions
- AppRouteErrorBoundary
- BlogCarousel.jsx
- dimensions.js
- useAlternanceSearch.js
- invoiceService.js
- planService.js
- semanticMatchingErrorHandler.js
- ThemeContext.jsx
- ReportGenerationService.js
- competenciesService.js
- emailTemplates.js
- semanticSearchService.js
- RGPDCompliance.js
- coverLetterTemplates.js
- expandedQuestions.js
- useFormationFilters.js
- vercel.json
- enrichedQuestions.js
- personalityProfiles.js
- testProfiles.js
- securityHeaders.js
- AggregationService.js
- AlertingService.js
- AnomalyDetectionService.js
- ComparativeAnalysisService.js
- CorrelationAnalysisService.js
- DistributionAnalysisService.js
- DiversityAnalysisService.js
- EngagementAnalysisService.js
- ForecastingService.js
- LevelAnalysisService.js
- PedagogicalAnalysisService.js
- PerformanceAnalysisService.js
- ProfileAnalysisService.js
- RecommendationAnalysisService.js
- SegmentationService.js
- TrendAnalysisService.js
- AnalyticsService.js
- privacyExportService.js

## God Nodes (most connected - your core abstractions)
1. `react` - 625 edges
2. `Button` - 583 edges
3. `lucide-react` - 464 edges
4. `cn()` - 394 edges
5. `Card` - 373 edges
6. `CardContent` - 336 edges
7. `useToast()` - 262 edges
8. `Badge()` - 258 edges
9. `customSupabaseClient` - 220 edges
10. `CardHeader` - 209 edges

## Surprising Connections (you probably didn't know these)
- `AdaptiveOrientationTest()` --calls--> `AdaptiveQuestion()`  [EXTRACTED]
  src/components/AdaptiveOrientationTest.jsx → src/components/AdaptiveQuestion.jsx
- `AdaptiveTestPage()` --calls--> `AdaptiveTestInterface()`  [EXTRACTED]
  src/pages/AdaptiveTestPage.jsx → src/components/adaptive-test/AdaptiveTestInterface.jsx
- `UserProfilePreview()` --calls--> `Card`  [EXTRACTED]
  src/components/adaptive-test/UserProfilePreview.jsx → src/components/ui/card.jsx
- `CleoModeSelector()` --calls--> `cn()`  [EXTRACTED]
  src/components/cleo/CleoModeSelector.jsx → src/lib/utils.js
- `SuggestedFormations()` --calls--> `Button`  [EXTRACTED]
  src/components/dashboard/SuggestedFormations.jsx → src/components/ui/button.jsx

## Import Cycles
- None detected.

## Communities (174 total, 49 thin omitted)

### Community 0 - "customSupabaseClient.js"
Cohesion: 0.04
Nodes (49): bcryptjs, useCVUpload(), customSupabaseClient, EventTracker, NotificationService, WeeklyReportService, initialRomeMetiers, aiAssessmentService (+41 more)

### Community 1 - "Card"
Cohesion: 0.06
Nodes (79): recharts, EstablishmentLinkCard(), AdminAnalytics(), AdminCompliance(), CHECKLIST, AdminMonitoring(), AdminSupport(), EstablishmentActions() (+71 more)

### Community 2 - "App.jsx"
Cohesion: 0.03
Nodes (99): AboutPage, AccountPage, ActionPlanPage, ActualitesDetailPage, ActualitesPage, AdminAnalyticsDashboard, AdminDashboardPage, AdminMetiers (+91 more)

### Community 3 - "react"
Cohesion: 0.05
Nodes (29): lucide-react, react, BlurredMatches(), CareerCard(), CareerDetails(), TestProgressBar(), UnlockCTA(), UserProfilePreview() (+21 more)

### Community 4 - "EstablishmentDashboard.jsx"
Cohesion: 0.06
Nodes (45): mammoth, pdfjs-dist, CVImport(), MetierErrorState(), CVUploadSection(), SetupGuide(), StripeProvider(), Alert (+37 more)

### Community 5 - "Badge"
Cohesion: 0.05
Nodes (46): ProfileSnapshot(), AIInsightsWidget(), JobsSection(), getJobFamily(), JOB_FAMILIES, TrainingsSection(), FeedbackStats(), FeedbackWidget() (+38 more)

### Community 6 - "careerMatching.js"
Cohesion: 0.07
Nodes (57): AdaptiveTestResults(), ResultsHeader(), fetchAllMetiers(), MetierCard(), MetiersExplorer(), ProfileMetierMatcher(), quickMatchTest(), testCareerMatching() (+49 more)

### Community 7 - "dependencies"
Cohesion: 0.03
Nodes (73): dependencies, @babel/generator, @babel/parser, @babel/traverse, @babel/types, bcryptjs, class-variance-authority, clsx (+65 more)

### Community 8 - "cn"
Cohesion: 0.04
Nodes (76): @radix-ui/react-context-menu, @radix-ui/react-menubar, QuestionChoice(), EstablishmentMenu(), MenuItem(), BlogCard, Breadcrumb, BreadcrumbEllipsis() (+68 more)

### Community 9 - "Input"
Cohesion: 0.11
Nodes (48): ALLOWED_TYPES, BlogForm(), FormationForm(), MetierForm(), OffreForm(), AdminQA(), EstablishmentFilters(), AdminTestsFilters() (+40 more)

### Community 10 - "riasecMatchingAlgorithm.js"
Cohesion: 0.07
Nodes (34): AdaptiveOrientationTest(), CAREERS, questions, generateDetailedResults(), buildUserVector(), calculateDomainBonus(), extractUserDomains(), buildRawCareerVectorFromROME() (+26 more)

### Community 11 - "AnimatedItem"
Cohesion: 0.12
Nodes (32): AudienceSection(), SEGMENTS, B2BSection(), BenefitsStatsSection(), CountUp(), STATS, FinalCTASection(), HeroMapSection() (+24 more)

### Community 12 - "package.json"
Cohesion: 0.04
Nodes (55): name, private, scripts, build, dev, eslint, lint, preview (+47 more)

### Community 13 - "framer-motion"
Cohesion: 0.09
Nodes (19): framer-motion, categories, FAQCategories(), FAQHero(), FAQSearch(), MarketTrends(), TrendCard(), steps (+11 more)

### Community 14 - "SectorFilterEnhanced.jsx"
Cohesion: 0.16
Nodes (21): @radix-ui/react-accordion, DebugResponsesSection(), DataUsageExplainer(), FAQAccordion(), SectorFilterEnhanced(), FAQ(), AccordionContent, AccordionItem (+13 more)

### Community 15 - "employerSummary.js"
Cohesion: 0.21
Nodes (17): CompanyCard(), hiringLabel(), EmployerDialog(), EmployerInfo(), EmployerLogo(), departmentOf(), EmployerTile(), FeaturedEmployers() (+9 more)

### Community 16 - "LearningPathPage.jsx"
Cohesion: 0.36
Nodes (9): ActivityCard(), ActivityPlayer(), CleoAvatar(), CleoVoiceStep(), FillBlank(), getDailyTip(), LearningPathPage(), MatchingGame() (+1 more)

### Community 17 - "react-router-dom"
Cohesion: 0.12
Nodes (24): react-router-dom, Breadcrumbs(), routeNameMap, Dashboard(), Header(), NotificationBell(), NotificationContext, useNotifications() (+16 more)

### Community 18 - "PersonalizedPlanPage.jsx"
Cohesion: 0.09
Nodes (35): ImageLoader(), FormationPathSection(), Title(), ProgressionSection(), SUBTITLES, ACTION_BASE, buildSublabel(), getActionsForStatus() (+27 more)

### Community 19 - "Label"
Cohesion: 0.12
Nodes (32): AdaptiveQuestion(), ColorSettings(), GeneralSettings(), MaintenanceSettings(), ThemeSettings(), AuthModal(), RGPDPreferences(), NotificationPreferences() (+24 more)

### Community 20 - "CurrentPlanSection.jsx"
Cohesion: 0.31
Nodes (3): CurrentPlanContent(), CurrentPlanSection(), SubscriptionErrorBoundary

### Community 21 - "DialogContent"
Cohesion: 0.13
Nodes (39): ShareResults(), EtablissementsTab(), AdminEstablishments(), AdminGdprOps(), AdminOpsCenter(), AdminUsers(), EstablishmentModal(), AdminTestsDetailModal() (+31 more)

### Community 22 - "card.jsx"
Cohesion: 0.10
Nodes (20): EstablishmentStats(), StatCard(), CleoUpgradePrompt(), JobCard(), DEMAND_LABELS, generateMatchExplanation(), getCompatibilityLabel(), GROWTH_LABELS (+12 more)

### Community 23 - "ChatInterface.jsx"
Cohesion: 0.05
Nodes (45): ChatInterface(), MessageBubble(), Cleo(), FIELD_LABELS, InteractiveResponse(), renderSimpleMarkdown(), CleoAvatar(), ChoiceGroup() (+37 more)

### Community 24 - "CardDescription"
Cohesion: 0.13
Nodes (16): AdminLaunchControl(), CleoAnalytics(), CustomTooltip(), AICoachWidget(), ClusterAnalysisComponent(), DataDeletionRequest(), CONTRACT_TYPES, EXPERIENCE_LEVELS (+8 more)

### Community 25 - "ActualitesDetailPage.jsx"
Cohesion: 0.07
Nodes (44): ALL_PERKS, CountUp(), FEATURES, generateRandomRiasecProfile(), HomePage(), NewsPreview, Reveal(), SectionHead() (+36 more)

### Community 26 - "SignupFormValidation.js"
Cohesion: 0.40
Nodes (7): useSignupForm(), validateDateOfBirth(), validateEmail(), validateEstablishmentCode(), validatePassword(), validatePhone(), validateStep()

### Community 27 - "metierService.js"
Cohesion: 0.15
Nodes (9): mockMetiers, formationService, getCachedMetier(), isCacheExpired(), setCachedMetier(), queueRequest(), RequestQueue, requestQueueService (+1 more)

### Community 28 - "button.jsx"
Cohesion: 0.20
Nodes (20): AdminBlog(), AdminSettings(), useSettingsNotifications(), TestGateModal(), ActivityCard(), CleoActivitySystem(), SavedItems(), FavoritesSection() (+12 more)

### Community 29 - "Separator"
Cohesion: 0.07
Nodes (34): class-variance-authority, @radix-ui/react-separator, @radix-ui/react-slot, @radix-ui/react-toggle, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+26 more)

### Community 30 - "AdminDashboard.jsx"
Cohesion: 0.06
Nodes (72): date-fns, @radix-ui/react-tooltip, AdminBlogManager(), AdminFormationManager(), AdminMetierManager(), AdminOffreManager(), AdminDataRequests(), STATUS_CONFIG (+64 more)

### Community 31 - "MyDocumentsPage.jsx"
Cohesion: 0.06
Nodes (45): html2canvas, jspdf, AdminEstablishmentDashboard(), ConnectionActivityChart(), DashboardStats(), StatCard(), EstablishmentInfo(), InfoRow() (+37 more)

### Community 32 - "LyceeDetailPage.jsx"
Cohesion: 0.09
Nodes (24): TYPE_BADGE, TYPE_ICON, TYPE_ICON_BG, CATEGORY_STYLES, classifyFormation(), cleanFormationLabel(), detectFilieresFromText(), FORMATION_CATEGORIES (+16 more)

### Community 33 - "PageHelmet"
Cohesion: 0.13
Nodes (19): AboutPage(), Blog(), BlogPost(), buildShareUrls(), estimateReadTime(), stripHtml(), PageHelmet(), categoryPageSEO() (+11 more)

### Community 34 - "CleoSidebar.jsx"
Cohesion: 0.14
Nodes (20): @radix-ui/react-dropdown-menu, AdminTestsExport(), CleoPreferencesModal(), DEFAULT_PREFERENCES, loadPreferences(), OptionCard(), savePreferences(), SectionTitle() (+12 more)

### Community 35 - "matchingUtils.js"
Cohesion: 0.13
Nodes (15): advancedMatchingService, calculateConsistency(), calculateInterestAlignment(), calculateRiasecSimilarity(), calculateSkillCompatibility(), calculateValueAlignment(), detectContradictions(), detectRandomness() (+7 more)

### Community 36 - "AnalyticsDashboard.jsx"
Cohesion: 0.19
Nodes (19): AnalyticsDashboard(), DetailedStatisticsPanel(), FilterBar(), SearchBar(), CareerExplorationTab(), CareerFamilyAnalysisTab(), CareerRecommendationsTab(), DiversityAnalysisTab() (+11 more)

### Community 37 - "realDataServices.test.js"
Cohesion: 0.15
Nodes (14): adaptiveTestQuestions, AdaptiveQuestionEngine, AdaptiveTestValidator, CacheService, realBlogDataService, realCareerDataService, realEstablishmentDataService, realFormationDataService (+6 more)

### Community 38 - "ref_fs"
Cohesion: 0.20
Nodes (8): buildVercelJson(), main(), PRIVATE_ROUTES, PUBLIC_ROUTES, buildRobotsTxt(), buildSitemapXml(), main(), STATIC_ROUTES

### Community 39 - "JobExplorer.jsx"
Cohesion: 0.21
Nodes (16): CompanySectorFilter(), SECTORS, JobCardSkeleton(), Pagination(), ResultsSummary(), ALL_SECTOR_ROMES, AlternanceJobCard(), AlternanceTab() (+8 more)

### Community 40 - "PreferencesRGPDPage.jsx"
Cohesion: 0.18
Nodes (17): DynamicLegalContent(), LegalLayout(), navItems, useLegalDocument(), ConditionsGeneralesPage(), CookiePolicyPage(), PolitiqueConfidentialitePage(), PreferencesRGPDPage() (+9 more)

### Community 41 - "JobDetailPage.jsx"
Cohesion: 0.29
Nodes (11): PrepareInterviewButton(), JobDetailApplication(), JobCard(), jobDetailSEO(), isValidUUID(), JobDetailPage(), assignMockSector(), fetchFormations() (+3 more)

### Community 42 - "CVTemplate.jsx"
Cohesion: 0.13
Nodes (20): uuid, CVErrorBoundary, CVTemplate(), CVTemplateWrapper(), DEFAULT_CV_DATA, CVTemplate1(), CVTemplate2(), CVTemplate3() (+12 more)

### Community 43 - "useDebounce"
Cohesion: 0.14
Nodes (13): fetchCommunes(), LocationFilter(), DiplomaSearch(), DiplomaSelector(), EstablishmentSearch(), InstitutionSearch(), InstitutionSearchSplit(), useDebounce() (+5 more)

### Community 44 - "linkedData.js"
Cohesion: 0.27
Nodes (11): ParcoursupDetailsModal(), CAREER_TO_FORMATIONS, filterFormationsByCareer(), getFormationsForEmploi(), getFormationsForMetier(), getLinkedEmplois(), getLinkedMetiers(), getLinksForFormation() (+3 more)

### Community 45 - "Button"
Cohesion: 0.10
Nodes (19): BlurredMetierCard(), FormInput, LoginForm(), PasswordInput(), CookieConsent(), ProfileEditor(), EstablishmentLoginForm(), SearchBar() (+11 more)

### Community 46 - "LandingHeroPage.jsx"
Cohesion: 0.15
Nodes (17): MaintenanceCountdown(), MaintenancePage(), defaultSettings, SystemSettingsContext, SystemSettingsProvider(), useSystemSettings(), AreaChart(), Badge() (+9 more)

### Community 47 - "AuthorizedEmails.jsx"
Cohesion: 0.22
Nodes (7): EVENT_TYPES, METADATA_EXAMPLES, EDITABLE_FIELDS, ESTABLISHMENT_COLUMNS, EstablishmentService, normalizeEmails(), syncAuthorizedEmails()

### Community 48 - "UserFilterComponent.jsx"
Cohesion: 0.14
Nodes (21): cmdk, @radix-ui/react-avatar, @radix-ui/react-popover, UserFilterComponent(), MessagingSystem(), NotificationBell(), NotificationsSystem(), Avatar (+13 more)

### Community 49 - "selection-mode-script.js"
Cohesion: 0.20
Nodes (21): ALLOWED_PARENT_ORIGINS, createOverlay(), createSelectedOverlay(), disableSelectionMode(), enableSelectionMode(), extractDOMContext(), getComputedStyles(), getFilePathFromNode() (+13 more)

### Community 50 - "ast-utils.js"
Cohesion: 0.17
Nodes (17): COMPONENT_BLACKLIST, __dirname, extractCodeBlocks(), __filename, findJSXElementAtPosition(), generateCode(), generateSourceWithMap(), isBlacklistedComponent() (+9 more)

### Community 51 - "RecommendationsSection.jsx"
Cohesion: 0.24
Nodes (8): DIMENSION_LABELS, ConfidenceIndicator(), InsightsSection(), RecommendationGroup(), RecommendationsSection(), MATCHING_CONFIG, getConfidenceLevel(), getConfidenceRecommendation()

### Community 52 - "EnhancedMetierCard.jsx"
Cohesion: 0.22
Nodes (14): TopMatches(), EnhancedMetierCard(), formatSalaryLabel(), RomeBadge(), SalaryBadge(), SectorBadge(), getMetierIconConfig(), MetierCardIcon() (+6 more)

### Community 53 - "HowItWorksPage.jsx"
Cohesion: 0.15
Nodes (14): classics, moderns, CTASection(), FiveSteps(), steps, HeroSection(), ResultsSection(), stats (+6 more)

### Community 54 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 55 - "toaster.jsx"
Cohesion: 0.17
Nodes (12): @radix-ui/react-toast, Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport (+4 more)

### Community 56 - "react-helmet-async"
Cohesion: 0.09
Nodes (15): react-dom, react-helmet-async, @sentry/react, App(), CookieConsentBanner(), StructuredData(), endDrag(), findScroller() (+7 more)

### Community 57 - "gtmTracking.js"
Cohesion: 0.21
Nodes (19): enqueue(), flushGtmQueue(), flushQueue(), getGtag(), hasAnalyticsConsent(), isBrowser(), _queue, safeNumber() (+11 more)

### Community 58 - "services/matchingAlgorithm.js"
Cohesion: 0.19
Nodes (18): applyCriteriaMultiplier(), calculateAdvancedMatching(), calculateConfidence(), calculateDemandScore(), calculateGrowthScore(), calculateHybridScore(), calculateRIASECScore(), calculateStabilityScore() (+10 more)

### Community 59 - "edit-mode-script.js"
Cohesion: 0.22
Nodes (17): ALLOWED_PARENT_ORIGINS, createDisabledTooltip(), disableEditMode(), enableEditMode(), findDisabledElementAtPoint(), findEditableElementAtPoint(), getParentOrigin(), handleDisabledElementHover() (+9 more)

### Community 60 - "ScrollArea"
Cohesion: 0.12
Nodes (23): @radix-ui/react-dialog, @radix-ui/react-scroll-area, AdminSidebar(), AVAILABLE_DISTANCES, AVAILABLE_LEVELS, AVAILABLE_SECTORS, AVAILABLE_TYPES, EnhancedFormationFilters() (+15 more)

### Community 61 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, eslint-config-react-app, eslint-import-resolver-alias, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks (+9 more)

### Community 62 - "AlternanceFinder.jsx"
Cohesion: 0.35
Nodes (6): AlternanceCard(), AlternanceFinder(), LocationFilter(), Slider, useGeolocation(), getCoordinatesFromLocation()

### Community 63 - "useAuth"
Cohesion: 0.07
Nodes (35): EnhancedSignupForm(), INTERESTS_LIST, SignupForm(), CLEO_FEATURES, CleoWidget(), INITIAL_SUGGESTIONS, TypingIndicator(), UpgradePanel() (+27 more)

### Community 64 - "vite-plugin-edit-mode.js"
Cohesion: 0.29
Nodes (5): EDIT_MODE_STYLES, POPUP_STYLES, __dirname, __filename, inlineEditDevPlugin()

### Community 65 - "adminAuth.js"
Cohesion: 0.22
Nodes (15): ADMIN_EMAILS, createUserProfile(), getDashboardRoute(), getPermissionsByRole(), getRoleByEmail(), getRoleFromSupabaseUser(), guardPermission(), hasPermission() (+7 more)

### Community 66 - "BlogCacheService"
Cohesion: 0.17
Nodes (4): blogCache, BlogCacheService, CACHE_KEYS, TTL

### Community 67 - "MarcheTravailCard.jsx"
Cohesion: 0.36
Nodes (7): colorBar, colorBg, colorText, fmt(), MarcheTravailCard(), Stat(), tensionDisplay()

### Community 68 - "activityService.js"
Cohesion: 0.19
Nodes (11): LOCAL_ACTIVITY_CATALOG, activityService, DIMENSION_LABELS, DOMAIN_TO_SKILL_TAGS, learningPathService, RIASEC_SKILL_MAP, localActivityProgress, readAll() (+3 more)

### Community 69 - "metierRecommendationService.js"
Cohesion: 0.18
Nodes (12): useMetierFeedback(), metierFeedbackService, DIM_LABELS, LIGHT_FIELDS, loadCatalogue(), METIER_FIELDS, metierRecommendationService, romeService (+4 more)

### Community 70 - "vite.config.js"
Cohesion: 0.18
Nodes (8): __dirname, __filename, selectionModePlugin(), iframeRouteRestorationPlugin(), vite, @vitejs/plugin-react, addTransformIndexHtml, logger

### Community 71 - "FormationDetailPage.jsx"
Cohesion: 0.42
Nodes (8): formationDetailSEO(), FormationCertification, FormationDebouches, FormationDetailPage(), FormationOffres, FormationProgramme, FormationStatistiques, SectionSkeleton()

### Community 72 - "ProfileResultsPage.jsx"
Cohesion: 0.18
Nodes (16): testPageSEO(), optimizedQuestions, OPTIONS, RIASEC_MAX_POSSIBLE, RIASEC_META, calcCompletion(), PROFILE_FIELDS, ProfileResultsPage() (+8 more)

### Community 73 - "metierScoringService.js"
Cohesion: 0.23
Nodes (8): ANSWER_TO_METIER_MAPPING, ANSWER_WEIGHTS, METIER_CRITERIA, QUESTION_CATEGORIES, calculateMetierScore(), getMatchingExplanation(), matchMetiersToAnswers(), testMatchingConsistency()

### Community 74 - "install-missing-components.js"
Cohesion: 0.27
Nodes (9): APP_DIR, COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP, componentExists(), FILES_UPDATED_BY_SHADCN_INIT, findImportedComponentNames(), pathExists(), run(), runCommand() (+1 more)

### Community 75 - "form.jsx"
Cohesion: 0.25
Nodes (9): react-hook-form, FormControl, FormDescription, FormFieldContext, FormItem, FormItemContext, FormLabel, FormMessage (+1 more)

### Community 76 - "emailService.js"
Cohesion: 0.29
Nodes (5): EMAIL_TYPES, EmailService, isEmail(), isUrl(), toNumber()

### Community 77 - "validateSignupForm.js"
Cohesion: 0.24
Nodes (7): validateEmail(), validatePassword(), validatePhone(), validateRequired(), validateStep1(), validateStep2(), validateStep3()

### Community 78 - "SortantsFormationCard.jsx"
Cohesion: 0.36
Nodes (7): colorBar, colorBg, colorText, fmtN(), fmtPct(), rateColor(), SortantsFormationCard()

### Community 79 - "useJobFilters.js"
Cohesion: 0.39
Nodes (5): useJobFilters(), calculateDistance(), deg2rad(), filterFormationsByLocation(), NOMINATIM_API_URL

### Community 80 - "AuthPage.jsx"
Cohesion: 0.50
Nodes (4): AuthLayout(), AuthTabs(), AuthPage(), authStyles

### Community 81 - "adaptiveTestLogic.js"
Cohesion: 0.22
Nodes (7): FINAL_CALIBRATION, INITIAL_QUESTIONS, SECTOR_SPECIFIC_QUESTIONS, calculateMatches(), matchesKeywords(), METIER_ENRICHED_DATA, ROME_DOMAINS

### Community 82 - "LyceesPage.jsx"
Cohesion: 0.33
Nodes (6): LyceeCard(), FILIERES_PRO, LyceesPage(), SERIES_TECHNO, STATUT_FILTERS, TYPE_FILTERS

### Community 83 - "DashboardOverview.jsx"
Cohesion: 0.20
Nodes (8): calcCompletion(), DashboardOverview(), onActivate(), PROFILE_FIELDS, RIASEC_COLORS, RIASEC_LABELS, TestHistoryInline(), WidgetErrorBoundary

### Community 84 - "AnalyticsCharts.jsx"
Cohesion: 0.29
Nodes (5): COLORS, ComparisonBarChart(), SkillsRadarChart(), StudentDetailAnalysis(), TemporalComparisonTool()

### Community 85 - "SettingsPage.jsx"
Cohesion: 0.57
Nodes (4): Footer(), FooterBackgroundGradient(), TextHoverEffect(), SettingsPage()

### Community 86 - "FormationDetailsPanel.jsx"
Cohesion: 0.36
Nodes (9): Bar(), fmt(), FormationDetailsPanel(), keywordsOf(), norm(), pct(), Section(), StatCard() (+1 more)

### Community 87 - "JobDetailDescription.jsx"
Cohesion: 0.33
Nodes (9): COLOR_CLASSES, getSectionMeta(), isBulletLine(), isSectionHeader(), JobDetailDescription(), parsePlainText(), SECTION_META, SectionBlock() (+1 more)

### Community 88 - "JobDetailHero.jsx"
Cohesion: 0.40
Nodes (7): JobDetailHero(), JobDetailSummary(), SummaryItem(), formatContractType(), formatPublicationDate(), formatSalary(), getContractColor()

### Community 89 - "securityService.js"
Cohesion: 0.17
Nodes (9): SEOHead(), apiRateLimiter, auditService, RateLimiter, healthCheck(), initializeSecurity(), logSecurityEvent(), rateLimitStore (+1 more)

### Community 90 - "constellationNodes.js"
Cohesion: 0.24
Nodes (6): constellationNodes, formationLabels, formationNodes, metierNodes, jobsDatabase, TRAIT_MAPPING

### Community 91 - "ProfilePage.jsx"
Cohesion: 0.27
Nodes (9): CARD_COLORS, CONSTRAINTS, INTERESTS, PillToggle(), ProfilePage(), StepProgress(), STEPS, STUDY_OPTIONS (+1 more)

### Community 92 - "careerProfileEmbeddingsService.js"
Cohesion: 0.33
Nodes (5): careerProfileEmbeddingsService, embeddingsCacheService, embeddingService, semanticMatchingService, semanticResultsAnalyzer

### Community 93 - "prerender-meta.js"
Cohesion: 0.27
Nodes (9): buildBreadcrumbSchema(), buildOrganizationSchema(), __dirname, DIST, escape(), injectMeta(), ROUTES, template (+1 more)

### Community 94 - "utils.js"
Cohesion: 0.09
Nodes (22): clsx, embla-carousel-react, @radix-ui/react-hover-card, react-day-picker, tailwind-merge, CleoModeSelector(), modes, getStatus() (+14 more)

### Community 95 - "navigation-menu.jsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 96 - "ImprovedSignupProgressBar.jsx"
Cohesion: 0.43
Nodes (3): ImprovedSignupProgressBar(), StepIndicatorCircle(), SIGNUP_STEPS

### Community 97 - "useToast"
Cohesion: 0.10
Nodes (32): EnhancedQuestionCard(), AdminWiki(), PlusIcon(), AuthorizedEmails(), EstablishmentEditForm(), EstablishmentCodeManager(), EstablishmentEmailsManager(), EstablishmentForm() (+24 more)

### Community 98 - "chart.jsx"
Cohesion: 0.36
Nodes (8): ChartContainer, ChartContext, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload(), THEMES, useChart()

### Community 99 - "input-group.jsx"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 100 - "ResourcesPage.jsx"
Cohesion: 0.39
Nodes (7): norm(), RESOURCES, ResourcesPage(), safeStr(), trackEvent(), TrackingService, trackPageView()

### Community 101 - "educationApi.js"
Cohesion: 0.31
Nodes (7): educationApi, err(), log(), normalizeLimitOffset(), normalizeSecteur(), toInt(), toStr()

### Community 102 - "monitoringService.js"
Cohesion: 0.31
Nodes (4): web-vitals, MonitoringService, PerformanceMonitor, reportWebVitals()

### Community 103 - "AdminLogs.jsx"
Cohesion: 0.30
Nodes (6): HELP_SECTIONS, AdminLogs(), AdminOverview(), HelpButton(), HelpIcon(), HelpTooltip()

### Community 104 - "careerStats.js"
Cohesion: 0.29
Nodes (4): TestFlowDebugger(), getCareerStats(), incrementAction(), reinforceCareer()

### Community 106 - "AdaptiveTestInterface.jsx"
Cohesion: 0.29
Nodes (6): AdaptiveTestInterface(), adaptiveQuestionPool, OPTIONS, adaptiveTestEngine, CATEGORIES, TestPhases

### Community 108 - "SettingsService.js"
Cohesion: 0.38
Nodes (4): AuditLoggingService, DEFAULT_SETTINGS, SettingsService, SettingsValidator

### Community 109 - "audit-seo.js"
Cohesion: 0.33
Nodes (4): auditor, __dirname, DIST_DIR, PUBLIC_DIR

### Community 110 - "PasswordGenerator.jsx"
Cohesion: 0.57
Nodes (4): PasswordGenerator(), copyToClipboard(), generateSecurePassword(), validatePassword()

### Community 111 - "AdminGdprDocs.jsx"
Cohesion: 0.40
Nodes (5): AdminGdprDocs(), CATEGORY_COLORS, DocCard(), GDPR_DOCS, INTERNAL_DOCS

### Community 112 - "JobBadges.jsx"
Cohesion: 0.60
Nodes (4): ContractBadge(), ExperienceBadge(), SectorBadge(), getJobIcon()

### Community 113 - "ResultsDisplay.jsx"
Cohesion: 0.60
Nodes (5): getScoreBg(), getScoreColor(), InfoCard(), ResultsDisplay(), ScoreCard()

### Community 114 - "parcoursup.js"
Cohesion: 0.80
Nodes (4): assignMockSector(), fetchFormations(), getFormationById(), invokeParcoursup()

### Community 116 - "MobileBottomNav.jsx"
Cohesion: 0.40
Nodes (5): EXPLORE_MENU, EXPLORE_PATHS, MobileBottomNav(), PROFILE_PATHS, startsWithAny()

### Community 118 - "storageService.js"
Cohesion: 0.53
Nodes (4): handleStorageError(), logStorageError(), parseStorageError(), storageService

### Community 119 - "serviceWorkerRegistration.js"
Cohesion: 0.60
Nodes (5): checkValidServiceWorker(), isLocalhost, register(), registerValidSW(), unregister()

### Community 121 - "scoringAlgorithm.js"
Cohesion: 0.53
Nodes (4): applyBonuses(), applyDominantBonus(), calculateCosineSimilarity(), calculateFinalScore()

### Community 122 - "compilerOptions"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, paths, include

### Community 124 - "BlogCarousel.jsx"
Cohesion: 0.43
Nodes (4): BlogCarousel(), ImageOptimizer(), faqBlogArticles, getImageUrl()

### Community 125 - "dimensions.js"
Cohesion: 0.50
Nodes (4): createEmptyVector(), DIMENSION_KEYS, DIMENSIONS, normalizeVector()

### Community 126 - "useAlternanceSearch.js"
Cohesion: 1.00
Nodes (3): matchesKeywords(), norm(), useAlternanceSearch()

### Community 129 - "semanticMatchingErrorHandler.js"
Cohesion: 0.40
Nodes (3): ErrorTypes, SemanticMatchingError, SemanticMatchingErrorHandler

### Community 139 - "competenciesService.js"
Cohesion: 0.50
Nodes (3): competenciesService, HARD_SKILLS_DICT, SOFT_SKILLS_DICT

### Community 140 - "emailTemplates.js"
Cohesion: 0.67
Nodes (3): emailTemplates, escapeAttr(), escapeHtml()

### Community 145 - "RGPDCompliance.js"
Cohesion: 0.83
Nodes (3): getConsentRequirements(), isEUUser(), validateConsent()

## Knowledge Gaps
- **497 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+492 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 742 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `customSupabaseClient.js`, `Card`, `App.jsx`, `EstablishmentDashboard.jsx`, `Badge`, `careerMatching.js`, `cn`, `Input`, `riasecMatchingAlgorithm.js`, `AnimatedItem`, `package.json`, `framer-motion`, `SectorFilterEnhanced.jsx`, `employerSummary.js`, `LearningPathPage.jsx`, `react-router-dom`, `PersonalizedPlanPage.jsx`, `Label`, `CurrentPlanSection.jsx`, `DialogContent`, `card.jsx`, `ChatInterface.jsx`, `CardDescription`, `ActualitesDetailPage.jsx`, `SignupFormValidation.js`, `button.jsx`, `Separator`, `AdminDashboard.jsx`, `MyDocumentsPage.jsx`, `LyceeDetailPage.jsx`, `PageHelmet`, `CleoSidebar.jsx`, `AnalyticsDashboard.jsx`, `JobExplorer.jsx`, `PreferencesRGPDPage.jsx`, `JobDetailPage.jsx`, `CVTemplate.jsx`, `useDebounce`, `linkedData.js`, `Button`, `LandingHeroPage.jsx`, `AuthorizedEmails.jsx`, `UserFilterComponent.jsx`, `RecommendationsSection.jsx`, `EnhancedMetierCard.jsx`, `HowItWorksPage.jsx`, `toaster.jsx`, `react-helmet-async`, `ScrollArea`, `AlternanceFinder.jsx`, `useAuth`, `MarcheTravailCard.jsx`, `metierRecommendationService.js`, `FormationDetailPage.jsx`, `ProfileResultsPage.jsx`, `form.jsx`, `SortantsFormationCard.jsx`, `useJobFilters.js`, `AuthPage.jsx`, `LyceesPage.jsx`, `DashboardOverview.jsx`, `AnalyticsCharts.jsx`, `SettingsPage.jsx`, `FormationDetailsPanel.jsx`, `JobDetailDescription.jsx`, `JobDetailHero.jsx`, `securityService.js`, `ProfilePage.jsx`, `utils.js`, `navigation-menu.jsx`, `ImprovedSignupProgressBar.jsx`, `useToast`, `chart.jsx`, `input-group.jsx`, `ResourcesPage.jsx`, `AdminLogs.jsx`, `ErrorBoundary`, `AdaptiveTestInterface.jsx`, `PasswordGenerator.jsx`, `AdminGdprDocs.jsx`, `JobBadges.jsx`, `ResultsDisplay.jsx`, `MobileBottomNav.jsx`, `BlogCarousel.jsx`, `useAlternanceSearch.js`, `ThemeContext.jsx`, `useFormationFilters.js`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _497 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `customSupabaseClient.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03859466943579093 - nodes in this community are weakly interconnected._
- **Why does `Button` connect `Button` to `Card`, `App.jsx`, `react`, `EstablishmentDashboard.jsx`, `Badge`, `careerMatching.js`, `cn`, `Input`, `AnimatedItem`, `framer-motion`, `SectorFilterEnhanced.jsx`, `employerSummary.js`, `LearningPathPage.jsx`, `react-router-dom`, `PersonalizedPlanPage.jsx`, `Label`, `CurrentPlanSection.jsx`, `DialogContent`, `card.jsx`, `ChatInterface.jsx`, `CardDescription`, `ActualitesDetailPage.jsx`, `button.jsx`, `AdminDashboard.jsx`, `MyDocumentsPage.jsx`, `LyceeDetailPage.jsx`, `PageHelmet`, `CleoSidebar.jsx`, `AnalyticsDashboard.jsx`, `JobExplorer.jsx`, `PreferencesRGPDPage.jsx`, `JobDetailPage.jsx`, `CVTemplate.jsx`, `useDebounce`, `linkedData.js`, `AuthorizedEmails.jsx`, `UserFilterComponent.jsx`, `RecommendationsSection.jsx`, `EnhancedMetierCard.jsx`, `HowItWorksPage.jsx`, `react-helmet-async`, `ScrollArea`, `AlternanceFinder.jsx`, `useAuth`, `FormationDetailPage.jsx`, `ProfileResultsPage.jsx`, `LyceesPage.jsx`, `DashboardOverview.jsx`, `JobDetailHero.jsx`, `ProfilePage.jsx`, `utils.js`, `useToast`, `input-group.jsx`, `AdminLogs.jsx`, `careerStats.js`, `ErrorBoundary`, `AdaptiveTestInterface.jsx`, `BlogCarousel.jsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Should `Card` be split into smaller, more focused modules?**
  _Cohesion score 0.05801841085271318 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `Card`, `App.jsx`, `EstablishmentDashboard.jsx`, `Badge`, `careerMatching.js`, `cn`, `Input`, `riasecMatchingAlgorithm.js`, `AnimatedItem`, `package.json`, `framer-motion`, `SectorFilterEnhanced.jsx`, `employerSummary.js`, `LearningPathPage.jsx`, `react-router-dom`, `PersonalizedPlanPage.jsx`, `Label`, `CurrentPlanSection.jsx`, `DialogContent`, `card.jsx`, `ChatInterface.jsx`, `CardDescription`, `ActualitesDetailPage.jsx`, `button.jsx`, `AdminDashboard.jsx`, `MyDocumentsPage.jsx`, `LyceeDetailPage.jsx`, `PageHelmet`, `CleoSidebar.jsx`, `AnalyticsDashboard.jsx`, `JobExplorer.jsx`, `PreferencesRGPDPage.jsx`, `JobDetailPage.jsx`, `CVTemplate.jsx`, `useDebounce`, `linkedData.js`, `Button`, `LandingHeroPage.jsx`, `AuthorizedEmails.jsx`, `UserFilterComponent.jsx`, `RecommendationsSection.jsx`, `EnhancedMetierCard.jsx`, `HowItWorksPage.jsx`, `toaster.jsx`, `react-helmet-async`, `ScrollArea`, `AlternanceFinder.jsx`, `useAuth`, `MarcheTravailCard.jsx`, `FormationDetailPage.jsx`, `ProfileResultsPage.jsx`, `SortantsFormationCard.jsx`, `AuthPage.jsx`, `LyceesPage.jsx`, `DashboardOverview.jsx`, `SettingsPage.jsx`, `FormationDetailsPanel.jsx`, `JobDetailDescription.jsx`, `JobDetailHero.jsx`, `ProfilePage.jsx`, `utils.js`, `navigation-menu.jsx`, `ImprovedSignupProgressBar.jsx`, `useToast`, `ResourcesPage.jsx`, `AdminLogs.jsx`, `ErrorBoundary`, `AdaptiveTestInterface.jsx`, `PasswordGenerator.jsx`, `AdminGdprDocs.jsx`, `JobBadges.jsx`, `ResultsDisplay.jsx`, `MobileBottomNav.jsx`, `BlogCarousel.jsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.033535165346995806 - nodes in this community are weakly interconnected._