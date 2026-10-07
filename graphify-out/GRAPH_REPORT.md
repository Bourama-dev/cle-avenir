# Graph Report - cle-avenir  (2026-10-07)

## Corpus Check
- 941 files · ~447,350 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 44 file(s) not represented in the graph (top: .css 43, (none) 1)

## Summary
- 3435 nodes · 14704 edges · 179 communities (126 shown, 53 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cf8f668`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- Button
- lucide-react
- dependencies
- customSupabaseClient.js
- AdminDashboard.jsx
- CardContent
- cn
- vite.config.js
- MyDocumentsPage.jsx
- ChatInterface.jsx
- careerMatching.js
- button.jsx
- SelectContent
- AnimatedItem
- Label
- DialogContent
- react
- EnhancedFormationFilters.jsx
- Input
- CVTemplate.jsx
- framer-motion
- CVUploadSection.jsx
- riasecMatchingAlgorithm.js
- components.json
- PageHelmet
- JobExplorer.jsx
- ScrollArea
- PersonalizedPlanPage.jsx
- matchingUtils.js
- utils.js
- devDependencies
- ActualitesDetailPage.jsx
- JobDetailPage.jsx
- realDataServices.test.js
- Header.jsx
- CleoWidget.jsx
- AnalyticsDashboard.jsx
- PreferencesRGPDPage.jsx
- LandingHeroPage.jsx
- EnhancedMetierCard.jsx
- TabsList
- SectorFilterEnhanced.jsx
- providerConfig.jsx
- services/matchingAlgorithm.js
- SEOAuditor
- OffersFormationsPage.jsx
- establishmentService.js
- input-group.jsx
- selection-mode-script.js
- ast-utils.js
- HowItWorksPage.jsx
- HomePage.jsx
- toaster.jsx
- MetierDetailPage.jsx
- gtmTracking.js
- edit-mode-script.js
- CVBuilderPage.jsx
- menubar.jsx
- TestResultsPage.jsx
- LyceeDetailPage.jsx
- franceTravail.js
- adminAuth.js
- BlogCacheService
- linkedData.js
- activityService.js
- CleoPage.jsx
- DashboardOverview.jsx
- FormationsPage.jsx
- AdminTests.jsx
- TestPage.jsx
- metierScoringService.js
- ContentManagementPage.jsx
- Dashboard.jsx
- emailService.js
- install-missing-components.js
- prerender-meta.js
- validateSignupForm.js
- form.jsx
- adaptiveTestLogic.js
- SignupFormValidation.js
- LearningPathPage.jsx
- PartnershipPage.jsx
- supabaseSubscriptions.js
- FormationDetailsPanel.jsx
- securityService.js
- constellationNodes.js
- metierService.js
- useMetierFeedback.js
- ProfilePage.jsx
- careerProfileEmbeddingsService.js
- carousel.jsx
- FormationDetailPage.jsx
- chart.jsx
- PersistenceContext.jsx
- formationService.js
- vite-plugin-edit-mode.js
- PerformanceMonitor.js
- MarcheTravailCard.jsx
- TestFlowDebugger.jsx
- adaptiveQuestions.js
- scripts
- educationApi.js
- BlogCarousel.jsx
- ErrorBoundary
- PasswordGenerator.jsx
- RecommendedActionsSection.jsx
- eventTracker.js
- EstablishmentDashboard.jsx
- supabaseStorageValidator.js
- audit-seo.js
- auth/EnhancedSignupForm.jsx
- WidgetErrorBoundary
- MobileBottomNav.jsx
- apiQueue
- storageService.js
- scoringAlgorithm.js
- dimensions.js
- auditService.js
- invoiceService.js
- planService.js
- semanticMatchingErrorHandler.js
- DynamicBackground.jsx
- PageTransition.jsx
- compilerOptions
- CVManagement.jsx
- RecommendedJobs.jsx
- contextualRecommendationService.js
- useCVUpload.js
- ReportGenerationService.js
- competenciesService.js
- emailTemplates.js
- serviceWorkerRegistration.js
- semanticSearchService.js
- RGPDCompliance.js
- useEstablishmentAuth
- coverLetterTemplates.js
- expandedQuestions.js
- StripeWebhookService
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
- AppRouteErrorBoundary
- ProfileAnalysisService.js
- ref_fs
- RecommendationAnalysisService.js
- SegmentationService.js
- TrendAnalysisService.js
- AnalyticsService.js
- privacyExportService.js
- vercel.json
- react-helmet-async
- package.json
- LyceesPage.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 628 edges
2. `Button` - 597 edges
3. `lucide-react` - 468 edges
4. `cn()` - 395 edges
5. `Card` - 377 edges
6. `CardContent` - 338 edges
7. `useToast()` - 268 edges
8. `Badge()` - 263 edges
9. `customSupabaseClient` - 224 edges
10. `CardHeader` - 209 edges

## Surprising Connections (you probably didn't know these)
- `AdaptiveOrientationTest()` --calls--> `AdaptiveQuestion()`  [EXTRACTED]
  src/components/AdaptiveOrientationTest.jsx → src/components/AdaptiveQuestion.jsx
- `CookieConsent()` --calls--> `Button`  [EXTRACTED]
  src/components/CookieConsent.jsx → src/components/ui/button.jsx
- `AdaptiveTestPage()` --calls--> `AdaptiveTestInterface()`  [EXTRACTED]
  src/pages/AdaptiveTestPage.jsx → src/components/adaptive-test/AdaptiveTestInterface.jsx
- `BlurredMetierCard()` --calls--> `Button`  [EXTRACTED]
  src/components/adaptive-test/BlurredMetierCard.jsx → src/components/ui/button.jsx
- `ConversionCTA()` --calls--> `Button`  [EXTRACTED]
  src/components/adaptive-test/ConversionCTA.jsx → src/components/ui/button.jsx

## Import Cycles
- None detected.

## Communities (179 total, 53 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.04
Nodes (82): AboutPage, AccountPage, ActionPlanPage, AdminAnalyticsDashboard, AdminDashboardPage, AdminMetiers, AdminSettingsPage, AdminWeightAuditPage (+74 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (77): EstablishmentLinkCard(), EnhancedQuestionCard(), AdminOpsCenter(), AdminSettings(), AuthorizedEmails(), EstablishmentEditForm(), EstablishmentEmailsManager(), BlogCommentForm() (+69 more)

### Community 2 - "lucide-react"
Cohesion: 0.05
Nodes (62): lucide-react, ProfileSnapshot(), UserProfilePreview(), AdminLogs(), AdminSupport(), SettingsPreview(), ContextPanel(), AIInsightsWidget() (+54 more)

### Community 3 - "dependencies"
Cohesion: 0.03
Nodes (73): dependencies, @babel/generator, @babel/parser, @babel/traverse, @babel/types, bcryptjs, class-variance-authority, clsx (+65 more)

### Community 4 - "customSupabaseClient.js"
Cohesion: 0.04
Nodes (40): questionIcons, customSupabaseClient, STATUS_CONFIG, SYSTEMS, aiAssessmentService, AICoachService, CareerFamilyAnalysisService, EstablishmentActivityService (+32 more)

### Community 5 - "AdminDashboard.jsx"
Cohesion: 0.06
Nodes (73): date-fns, @radix-ui/react-tooltip, AdminBlogManager(), AdminFormationManager(), AdminMetierManager(), AdminOffreManager(), AdminDataRequests(), STATUS_CONFIG (+65 more)

### Community 6 - "CardContent"
Cohesion: 0.06
Nodes (68): recharts, AdminAnalytics(), AdminCompliance(), CHECKLIST, AdminGdprDocs(), CATEGORY_COLORS, DocCard(), GDPR_DOCS (+60 more)

### Community 7 - "cn"
Cohesion: 0.04
Nodes (84): @radix-ui/react-context-menu, @radix-ui/react-separator, @radix-ui/react-slot, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList (+76 more)

### Community 8 - "vite.config.js"
Cohesion: 0.18
Nodes (8): __dirname, __filename, selectionModePlugin(), iframeRouteRestorationPlugin(), vite, @vitejs/plugin-react, addTransformIndexHtml, logger

### Community 9 - "MyDocumentsPage.jsx"
Cohesion: 0.07
Nodes (49): html2canvas, jspdf, AdminEstablishmentDashboard(), ConnectionActivityChart(), DashboardStats(), StatCard(), EstablishmentInfo(), InfoRow() (+41 more)

### Community 10 - "ChatInterface.jsx"
Cohesion: 0.05
Nodes (47): ChatInterface(), MessageBubble(), Cleo(), FIELD_LABELS, InteractiveResponse(), renderSimpleMarkdown(), CleoAvatar(), ChoiceGroup() (+39 more)

### Community 11 - "careerMatching.js"
Cohesion: 0.06
Nodes (55): AdaptiveTestResults(), ResultsHeader(), AdaptiveOrientationTest(), CAREERS, questions, quickMatchTest(), testCareerMatching(), buildReasons() (+47 more)

### Community 12 - "button.jsx"
Cohesion: 0.05
Nodes (37): react-router-dom, AdaptiveTestInterface(), BlurredMetierCard(), CareerCard(), CareerDetails(), ConversionCTA(), AdminLaunchControl(), CleoProfileWidget() (+29 more)

### Community 13 - "SelectContent"
Cohesion: 0.13
Nodes (36): ALLOWED_TYPES, BlogForm(), FormationForm(), MetierForm(), OffreForm(), AdminQA(), EstablishmentFilters(), EstablishmentForm() (+28 more)

### Community 14 - "AnimatedItem"
Cohesion: 0.10
Nodes (37): AudienceSection(), SEGMENTS, B2BSection(), BenefitsStatsSection(), CountUp(), STATS, FinalCTASection(), HeroMapSection() (+29 more)

### Community 15 - "Label"
Cohesion: 0.11
Nodes (31): @radix-ui/react-radio-group, AdaptiveQuestion(), ColorSettings(), GeneralSettings(), ThemeSettings(), AlternanceCard(), AlternanceFinder(), AuthModal() (+23 more)

### Community 16 - "DialogContent"
Cohesion: 0.18
Nodes (28): ShareResults(), EtablissementsTab(), AdminBlog(), AdminEstablishments(), AdminGdprOps(), AdminUsers(), EstablishmentModal(), UserManagement() (+20 more)

### Community 17 - "react"
Cohesion: 0.07
Nodes (13): react, BlurredMatches(), UnlockCTA(), AuthLayout(), AuthTabs(), LoginForm(), PasswordInput(), BlogLoadingState() (+5 more)

### Community 18 - "EnhancedFormationFilters.jsx"
Cohesion: 0.10
Nodes (29): @radix-ui/react-checkbox, @radix-ui/react-dialog, AdminSidebar(), FilterPanel(), AVAILABLE_DISTANCES, AVAILABLE_LEVELS, AVAILABLE_SECTORS, AVAILABLE_TYPES (+21 more)

### Community 19 - "Input"
Cohesion: 0.11
Nodes (23): EstablishmentCodeManager(), ProfileEditor(), SearchBar(), EducationSection(), ExperienceSection(), PersonalSection(), SkillsSection(), DiplomaGoals() (+15 more)

### Community 20 - "CVTemplate.jsx"
Cohesion: 0.13
Nodes (20): uuid, CVErrorBoundary, CVTemplate(), CVTemplateWrapper(), DEFAULT_CV_DATA, CVTemplate1(), CVTemplate2(), CVTemplate3() (+12 more)

### Community 21 - "framer-motion"
Cohesion: 0.06
Nodes (13): framer-motion, TestProgressBar(), categories, FAQCategories(), FAQHero(), FAQSearch(), MarketTrends(), TrendCard() (+5 more)

### Community 22 - "CVUploadSection.jsx"
Cohesion: 0.14
Nodes (24): mammoth, pdfjs-dist, CVImport(), EstablishmentLoginForm(), MetierErrorState(), CVDataReview(), CVUploadSection(), SetupGuide() (+16 more)

### Community 23 - "riasecMatchingAlgorithm.js"
Cohesion: 0.11
Nodes (26): generateDetailedResults(), buildUserVector(), calculateDomainBonus(), extractUserDomains(), buildRawCareerVectorFromROME(), scoreROME(), DOMAIN_MAPPINGS, getDomainById() (+18 more)

### Community 24 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 25 - "PageHelmet"
Cohesion: 0.14
Nodes (18): AboutPage(), Blog(), BlogPost(), buildShareUrls(), estimateReadTime(), stripHtml(), PageHelmet(), categoryPageSEO() (+10 more)

### Community 26 - "JobExplorer.jsx"
Cohesion: 0.11
Nodes (26): LocationFilter(), CompanyCard(), hiringLabel(), CompanySectorFilter(), SECTORS, JobCardSkeleton(), Pagination(), ResultsSummary() (+18 more)

### Community 27 - "ScrollArea"
Cohesion: 0.14
Nodes (23): cmdk, @radix-ui/react-avatar, @radix-ui/react-popover, @radix-ui/react-scroll-area, UserFilterComponent(), MessagingSystem(), NotificationBell(), NotificationsSystem() (+15 more)

### Community 28 - "PersonalizedPlanPage.jsx"
Cohesion: 0.14
Nodes (25): Breadcrumbs(), routeNameMap, MetierLoadingSpinner(), FormationPathSection(), Title(), ProgressionSection(), SUBTITLES, getEducationGap() (+17 more)

### Community 29 - "matchingUtils.js"
Cohesion: 0.11
Nodes (20): DIMENSION_LABELS, ConfidenceIndicator(), MATCHING_CONFIG, advancedMatchingService, calculateConsistency(), calculateInterestAlignment(), calculateRiasecSimilarity(), calculateSkillCompatibility() (+12 more)

### Community 30 - "utils.js"
Cohesion: 0.08
Nodes (20): clsx, @radix-ui/react-hover-card, react-day-picker, tailwind-merge, QuestionChoice(), EstablishmentMenu(), MenuItem(), EstablishmentStats() (+12 more)

### Community 31 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, eslint-config-react-app, eslint-import-resolver-alias, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks (+9 more)

### Community 32 - "ActualitesDetailPage.jsx"
Cohesion: 0.13
Nodes (27): ActualitesDetailPage, ActualitesPage, MetaTags(), ActualitesDetailPage(), ARTICLE_CHARTS, ArticleChart(), ArticleKPICard(), ArticleView() (+19 more)

### Community 33 - "JobDetailPage.jsx"
Cohesion: 0.14
Nodes (22): PrepareInterviewButton(), JobDetailApplication(), JobDetailCompanyInfo(), COLOR_CLASSES, getSectionMeta(), isBulletLine(), isSectionHeader(), JobDetailDescription() (+14 more)

### Community 34 - "realDataServices.test.js"
Cohesion: 0.13
Nodes (15): adaptiveTestQuestions, CURATED_ARTICLES, AdaptiveQuestionEngine, AdaptiveTestValidator, CacheService, realBlogDataService, realCareerDataService, realEstablishmentDataService (+7 more)

### Community 35 - "Header.jsx"
Cohesion: 0.15
Nodes (21): AdminTestsExport(), CleoPreferencesModal(), DEFAULT_PREFERENCES, loadPreferences(), OptionCard(), savePreferences(), SectionTitle(), ToggleRow() (+13 more)

### Community 36 - "CleoWidget.jsx"
Cohesion: 0.14
Nodes (20): CleoWidget(), INITIAL_SUGGESTIONS, PREMIUM_PLUS_FEATURES, TypingIndicator(), UpgradePanel(), DashboardSidebar(), ALL_FEATURES, FEATURES (+12 more)

### Community 37 - "AnalyticsDashboard.jsx"
Cohesion: 0.17
Nodes (20): AnalyticsDashboard(), DetailedStatisticsPanel(), FilterBar(), SearchBar(), RecommendationList(), CareerExplorationTab(), CareerFamilyAnalysisTab(), CareerRecommendationsTab() (+12 more)

### Community 38 - "PreferencesRGPDPage.jsx"
Cohesion: 0.18
Nodes (17): DynamicLegalContent(), LegalLayout(), navItems, useLegalDocument(), ConditionsGeneralesPage(), CookiePolicyPage(), PolitiqueConfidentialitePage(), PreferencesRGPDPage() (+9 more)

### Community 39 - "LandingHeroPage.jsx"
Cohesion: 0.13
Nodes (20): LandingHeroPage, MaintenancePage, MaintenanceCountdown(), MaintenancePage(), defaultSettings, SystemSettingsContext, SystemSettingsProvider(), useSystemSettings() (+12 more)

### Community 40 - "EnhancedMetierCard.jsx"
Cohesion: 0.18
Nodes (16): TopMatches(), BlurredMetierCard(), EnhancedMetierCard(), formatSalaryLabel(), RomeBadge(), SalaryBadge(), SectorBadge(), getMetierIconConfig() (+8 more)

### Community 41 - "TabsList"
Cohesion: 0.28
Nodes (14): AdminTestsDetailModal(), SavedItems(), FavoritesSection(), IdealJobSection(), CareerFamilyDetailModal(), UserDetailModal(), FeatureGate(), ProfileResults() (+6 more)

### Community 42 - "SectorFilterEnhanced.jsx"
Cohesion: 0.26
Nodes (15): DebugResponsesSection(), DataUsageExplainer(), FAQAccordion(), FormationCard(), FormationFilters(), SectorFilterEnhanced(), FAQ(), AccordionContent (+7 more)

### Community 43 - "providerConfig.jsx"
Cohesion: 0.13
Nodes (16): StripeProvider(), NotificationProvider(), PersistenceProvider(), ACCESS_ERRORS, AUTH_ERRORS, claimAccess(), EstablishmentAuthContext, EstablishmentAuthProvider() (+8 more)

### Community 44 - "services/matchingAlgorithm.js"
Cohesion: 0.15
Nodes (21): applyCriteriaMultiplier(), calculateAdvancedMatching(), calculateConfidence(), calculateDemandScore(), calculateGrowthScore(), calculateHybridScore(), calculateRIASECScore(), calculateStabilityScore() (+13 more)

### Community 46 - "OffersFormationsPage.jsx"
Cohesion: 0.18
Nodes (17): fetchAllMetiers(), MetierCard(), MetiersExplorer(), useNavigation(), contractLabel(), formatDate(), JobCard(), OffersFormationsPage() (+9 more)

### Community 47 - "establishmentService.js"
Cohesion: 0.13
Nodes (9): EVENT_TYPES, METADATA_EXAMPLES, AuthCallback(), EDITABLE_FIELDS, ESTABLISHMENT_COLUMNS, EstablishmentService, normalizeEmails(), syncAuthorizedEmails() (+1 more)

### Community 48 - "input-group.jsx"
Cohesion: 0.11
Nodes (20): class-variance-authority, @radix-ui/react-navigation-menu, @radix-ui/react-toggle, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants (+12 more)

### Community 49 - "selection-mode-script.js"
Cohesion: 0.20
Nodes (21): ALLOWED_PARENT_ORIGINS, createOverlay(), createSelectedOverlay(), disableSelectionMode(), enableSelectionMode(), extractDOMContext(), getComputedStyles(), getFilePathFromNode() (+13 more)

### Community 50 - "ast-utils.js"
Cohesion: 0.17
Nodes (17): COMPONENT_BLACKLIST, __dirname, extractCodeBlocks(), __filename, findJSXElementAtPosition(), generateCode(), generateSourceWithMap(), isBlacklistedComponent() (+9 more)

### Community 51 - "HowItWorksPage.jsx"
Cohesion: 0.15
Nodes (14): classics, moderns, CTASection(), FiveSteps(), steps, HeroSection(), ResultsSection(), stats (+6 more)

### Community 52 - "HomePage.jsx"
Cohesion: 0.14
Nodes (19): HomePage, CountUp(), FEATURES, FREE_PERKS, generateRandomRiasecProfile(), HomePage(), NewsPreview, PREMIUM_PERKS (+11 more)

### Community 53 - "toaster.jsx"
Cohesion: 0.17
Nodes (12): @radix-ui/react-toast, Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport (+4 more)

### Community 54 - "MetierDetailPage.jsx"
Cohesion: 0.18
Nodes (17): OnisepCard(), colorBar, colorBg, colorText, fmtN(), fmtPct(), rateColor(), SortantsFormationCard() (+9 more)

### Community 55 - "gtmTracking.js"
Cohesion: 0.21
Nodes (19): enqueue(), flushGtmQueue(), flushQueue(), getGtag(), hasAnalyticsConsent(), isBrowser(), _queue, safeNumber() (+11 more)

### Community 56 - "edit-mode-script.js"
Cohesion: 0.22
Nodes (17): ALLOWED_PARENT_ORIGINS, createDisabledTooltip(), disableEditMode(), enableEditMode(), findDisabledElementAtPoint(), findEditableElementAtPoint(), getParentOrigin(), handleDisabledElementHover() (+9 more)

### Community 57 - "CVBuilderPage.jsx"
Cohesion: 0.29
Nodes (11): CompactPreview(), CVTemplateGallery(), FloatingActionBar(), FormFieldGroup(), AccordionSection(), MobileFormLayout(), PreviewToggle(), SectionManager() (+3 more)

### Community 58 - "menubar.jsx"
Cohesion: 0.11
Nodes (12): @radix-ui/react-menubar, Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator (+4 more)

### Community 59 - "TestResultsPage.jsx"
Cohesion: 0.19
Nodes (13): DEMAND_LABELS, generateMatchExplanation(), getCompatibilityLabel(), GROWTH_LABELS, MetierCard(), RIASEC_NAMES, ScoreBar(), MetierFilterPanel() (+5 more)

### Community 60 - "LyceeDetailPage.jsx"
Cohesion: 0.17
Nodes (15): LyceeDetailPage, CATEGORY_STYLES, classifyFormation(), cleanFormationLabel(), detectFilieresFromText(), FORMATION_CATEGORIES, InfoRow(), LyceeDetailPage() (+7 more)

### Community 61 - "franceTravail.js"
Cohesion: 0.21
Nodes (12): SECTOR_CATEGORIES, SECTORS, assignMockSector(), fetchFormations(), getFormationById(), getJobDetails(), searchJobs(), getFormationCountBySector() (+4 more)

### Community 62 - "adminAuth.js"
Cohesion: 0.22
Nodes (15): ADMIN_EMAILS, createUserProfile(), getDashboardRoute(), getPermissionsByRole(), getRoleByEmail(), getRoleFromSupabaseUser(), guardPermission(), hasPermission() (+7 more)

### Community 63 - "BlogCacheService"
Cohesion: 0.17
Nodes (4): blogCache, BlogCacheService, CACHE_KEYS, TTL

### Community 64 - "linkedData.js"
Cohesion: 0.26
Nodes (12): ParcoursupDetailsModal(), isValidUUID(), CAREER_TO_FORMATIONS, filterFormationsByCareer(), getFormationsForEmploi(), getFormationsForMetier(), getLinkedEmplois(), getLinkedMetiers() (+4 more)

### Community 65 - "activityService.js"
Cohesion: 0.21
Nodes (10): LOCAL_ACTIVITY_CATALOG, DIMENSION_LABELS, DOMAIN_TO_SKILL_TAGS, learningPathService, RIASEC_SKILL_MAP, localActivityProgress, readAll(), storageKey() (+2 more)

### Community 66 - "CleoPage.jsx"
Cohesion: 0.24
Nodes (11): ActivityCard(), CleoActivitySystem(), getStatus(), LearningRoadmap(), RoadmapNode(), STATUS_NODE, TYPE_ICON, ChatInterface (+3 more)

### Community 67 - "DashboardOverview.jsx"
Cohesion: 0.21
Nodes (10): calcCompletion(), DashboardOverview(), PROFILE_FIELDS, RIASEC_COLORS, RIASEC_LABELS, TestHistoryInline(), SubscriptionDebugPanel(), getDisplayPlanName() (+2 more)

### Community 68 - "FormationsPage.jsx"
Cohesion: 0.23
Nodes (11): UpgradeModal(), FormationExtras(), FormationsPage(), assignMockSector(), fetchFormations(), getFormationById(), invokeParcoursup(), ACRONYM_MAP (+3 more)

### Community 69 - "AdminTests.jsx"
Cohesion: 0.28
Nodes (7): HELP_SECTIONS, AdminTests(), AdminTestsSummaryCards(), SummaryCard(), HelpButton(), HelpIcon(), HelpTooltip()

### Community 70 - "TestPage.jsx"
Cohesion: 0.27
Nodes (11): testPageSEO(), optimizedQuestions, OPTIONS, RIASEC_MAX_POSSIBLE, RIASEC_META, computeProfile(), computeProfileCode(), computeProfileMeta() (+3 more)

### Community 71 - "metierScoringService.js"
Cohesion: 0.23
Nodes (8): ANSWER_TO_METIER_MAPPING, ANSWER_WEIGHTS, METIER_CRITERIA, QUESTION_CATEGORIES, calculateMetierScore(), getMatchingExplanation(), matchMetiersToAnswers(), testMatchingConsistency()

### Community 72 - "ContentManagementPage.jsx"
Cohesion: 0.24
Nodes (9): BlogCard, ALLOWED_IMAGE_TYPES, BLOG_CATEGORIES, BlogSection(), ContentManagementPage(), EMPTY_FORM, LEGAL_DEFAULTS, SECTIONS (+1 more)

### Community 73 - "Dashboard.jsx"
Cohesion: 0.27
Nodes (6): Dashboard(), NotificationBell(), NotificationContext, useNotifications(), DashboardPage(), debugAuth()

### Community 74 - "emailService.js"
Cohesion: 0.29
Nodes (5): EMAIL_TYPES, EmailService, isEmail(), isUrl(), toNumber()

### Community 75 - "install-missing-components.js"
Cohesion: 0.27
Nodes (9): APP_DIR, COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP, componentExists(), FILES_UPDATED_BY_SHADCN_INIT, findImportedComponentNames(), pathExists(), run(), runCommand() (+1 more)

### Community 76 - "prerender-meta.js"
Cohesion: 0.27
Nodes (9): buildBreadcrumbSchema(), buildOrganizationSchema(), __dirname, DIST, escape(), injectMeta(), ROUTES, template (+1 more)

### Community 77 - "validateSignupForm.js"
Cohesion: 0.24
Nodes (7): validateEmail(), validatePassword(), validatePhone(), validateRequired(), validateStep1(), validateStep2(), validateStep3()

### Community 78 - "form.jsx"
Cohesion: 0.25
Nodes (9): react-hook-form, FormControl, FormDescription, FormFieldContext, FormItem, FormItemContext, FormLabel, FormMessage (+1 more)

### Community 79 - "adaptiveTestLogic.js"
Cohesion: 0.22
Nodes (7): FINAL_CALIBRATION, INITIAL_QUESTIONS, SECTOR_SPECIFIC_QUESTIONS, calculateMatches(), matchesKeywords(), METIER_ENRICHED_DATA, ROME_DOMAINS

### Community 80 - "SignupFormValidation.js"
Cohesion: 0.35
Nodes (8): useSignupForm(), SignupService, validateDateOfBirth(), validateEmail(), validateEstablishmentCode(), validatePassword(), validatePhone(), validateStep()

### Community 81 - "LearningPathPage.jsx"
Cohesion: 0.31
Nodes (10): ActivityCard(), ActivityPlayer(), CleoAvatar(), CleoVoiceStep(), FillBlank(), getDailyTip(), LearningPathPage(), MatchingGame() (+2 more)

### Community 82 - "PartnershipPage.jsx"
Cohesion: 0.33
Nodes (8): PartnershipPage(), norm(), RESOURCES, ResourcesPage(), safeStr(), trackEvent(), TrackingService, trackPageView()

### Community 83 - "supabaseSubscriptions.js"
Cohesion: 0.29
Nodes (4): assertNumber(), assertString(), pick(), SubscriptionService

### Community 84 - "FormationDetailsPanel.jsx"
Cohesion: 0.33
Nodes (9): FormationDetailsPanel(), getSector(), REVIEWS, SalaryCard(), Section(), SECTORS, seedRandom(), StarRow() (+1 more)

### Community 85 - "securityService.js"
Cohesion: 0.27
Nodes (7): SEOHead(), auditService, healthCheck(), initializeSecurity(), logSecurityEvent(), rateLimitStore, securityService

### Community 86 - "constellationNodes.js"
Cohesion: 0.24
Nodes (6): constellationNodes, formationLabels, formationNodes, metierNodes, jobsDatabase, TRAIT_MAPPING

### Community 87 - "metierService.js"
Cohesion: 0.31
Nodes (5): mockMetiers, getCachedMetier(), isCacheExpired(), setCachedMetier(), romeApiService

### Community 88 - "useMetierFeedback.js"
Cohesion: 0.40
Nodes (6): useMetierFeedback(), metierFeedbackService, romeService, delay(), parseSupabaseError(), withRetry()

### Community 89 - "ProfilePage.jsx"
Cohesion: 0.27
Nodes (9): CARD_COLORS, CONSTRAINTS, INTERESTS, PillToggle(), ProfilePage(), StepProgress(), STEPS, STUDY_OPTIONS (+1 more)

### Community 90 - "careerProfileEmbeddingsService.js"
Cohesion: 0.33
Nodes (5): careerProfileEmbeddingsService, embeddingsCacheService, embeddingService, semanticMatchingService, semanticResultsAnalyzer

### Community 91 - "carousel.jsx"
Cohesion: 0.33
Nodes (8): embla-carousel-react, Carousel, CarouselContent, CarouselContext, CarouselItem, CarouselNext, CarouselPrevious, useCarousel()

### Community 92 - "FormationDetailPage.jsx"
Cohesion: 0.42
Nodes (8): formationDetailSEO(), FormationCertification, FormationDebouches, FormationDetailPage(), FormationOffres, FormationProgramme, FormationStatistiques, SectionSkeleton()

### Community 93 - "chart.jsx"
Cohesion: 0.36
Nodes (8): ChartContainer, ChartContext, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload(), THEMES, useChart()

### Community 94 - "PersistenceContext.jsx"
Cohesion: 0.33
Nodes (4): PersistenceContext, handleError(), KEYS, StorageManager

### Community 95 - "formationService.js"
Cohesion: 0.28
Nodes (4): formationService, queueRequest(), RequestQueue, requestQueueService

### Community 96 - "vite-plugin-edit-mode.js"
Cohesion: 0.29
Nodes (5): EDIT_MODE_STYLES, POPUP_STYLES, __dirname, __filename, inlineEditDevPlugin()

### Community 97 - "PerformanceMonitor.js"
Cohesion: 0.29
Nodes (4): web-vitals, MonitoringService, PerformanceMonitor, reportWebVitals()

### Community 98 - "MarcheTravailCard.jsx"
Cohesion: 0.36
Nodes (7): colorBar, colorBg, colorText, fmt(), MarcheTravailCard(), Stat(), tensionDisplay()

### Community 99 - "TestFlowDebugger.jsx"
Cohesion: 0.43
Nodes (4): TestFlowDebugger(), getCareerStats(), incrementAction(), reinforceCareer()

### Community 100 - "adaptiveQuestions.js"
Cohesion: 0.29
Nodes (5): adaptiveQuestionPool, OPTIONS, adaptiveTestEngine, CATEGORIES, TestPhases

### Community 101 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, eslint, lint, preview, seo:audit

### Community 102 - "educationApi.js"
Cohesion: 0.36
Nodes (6): educationApi, log(), normalizeLimitOffset(), normalizeSecteur(), toInt(), toStr()

### Community 103 - "BlogCarousel.jsx"
Cohesion: 0.43
Nodes (4): BlogCarousel(), ImageOptimizer(), faqBlogArticles, getImageUrl()

### Community 105 - "PasswordGenerator.jsx"
Cohesion: 0.57
Nodes (4): PasswordGenerator(), copyToClipboard(), generateSecurePassword(), validatePassword()

### Community 106 - "RecommendedActionsSection.jsx"
Cohesion: 0.38
Nodes (6): ACTION_BASE, buildSublabel(), getActionsForStatus(), RecommendedActionsSection(), RIASEC_TRAIT, STATUS_LABEL

### Community 107 - "eventTracker.js"
Cohesion: 0.38
Nodes (3): EventTracker, NotificationService, WeeklyReportService

### Community 108 - "EstablishmentDashboard.jsx"
Cohesion: 0.52
Nodes (6): downloadStudentsCsv(), EstablishmentDashboard(), formatDate(), fullName(), RIASEC_LABELS, StatCard()

### Community 110 - "audit-seo.js"
Cohesion: 0.33
Nodes (4): auditor, __dirname, DIST_DIR, PUBLIC_DIR

### Community 111 - "auth/EnhancedSignupForm.jsx"
Cohesion: 0.47
Nodes (3): EnhancedSignupForm(), INTERESTS_LIST, SignupForm()

### Community 113 - "MobileBottomNav.jsx"
Cohesion: 0.40
Nodes (5): EXPLORE_MENU, EXPLORE_PATHS, MobileBottomNav(), PROFILE_PATHS, startsWithAny()

### Community 115 - "storageService.js"
Cohesion: 0.53
Nodes (4): handleStorageError(), logStorageError(), parseStorageError(), storageService

### Community 117 - "scoringAlgorithm.js"
Cohesion: 0.53
Nodes (4): applyBonuses(), applyDominantBonus(), calculateCosineSimilarity(), calculateFinalScore()

### Community 118 - "dimensions.js"
Cohesion: 0.50
Nodes (4): createEmptyVector(), DIMENSION_KEYS, DIMENSIONS, normalizeVector()

### Community 122 - "semanticMatchingErrorHandler.js"
Cohesion: 0.40
Nodes (3): ErrorTypes, SemanticMatchingError, SemanticMatchingErrorHandler

### Community 124 - "DynamicBackground.jsx"
Cohesion: 0.50
Nodes (3): DynamicBackground(), ORBS, SCROLL_PALETTES

### Community 125 - "PageTransition.jsx"
Cohesion: 0.50
Nodes (3): PageTransition(), reducedVariants, variants

### Community 126 - "compilerOptions"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, paths, include

### Community 128 - "RecommendedJobs.jsx"
Cohesion: 0.83
Nodes (3): JobCard(), RecommendedJobs(), filterAndSortJobs()

### Community 132 - "competenciesService.js"
Cohesion: 0.50
Nodes (3): competenciesService, HARD_SKILLS_DICT, SOFT_SKILLS_DICT

### Community 133 - "emailTemplates.js"
Cohesion: 0.67
Nodes (3): emailTemplates, escapeAttr(), escapeHtml()

### Community 134 - "serviceWorkerRegistration.js"
Cohesion: 0.60
Nodes (5): checkValidServiceWorker(), isLocalhost, register(), registerValidSW(), unregister()

### Community 138 - "RGPDCompliance.js"
Cohesion: 0.83
Nodes (3): getConsentRequirements(), isEUUser(), validateConsent()

### Community 161 - "ref_fs"
Cohesion: 0.20
Nodes (8): buildVercelJson(), main(), PRIVATE_ROUTES, PUBLIC_ROUTES, buildRobotsTxt(), buildSitemapXml(), main(), STATIC_ROUTES

### Community 544 - "react-helmet-async"
Cohesion: 0.11
Nodes (11): react-dom, react-helmet-async, @sentry/react, App(), EnhancedTestPage, StructuredData(), rootElement, AdaptiveTestPage() (+3 more)

### Community 595 - "package.json"
Cohesion: 0.04
Nodes (49): name, private, type, version, autoprefixer, bcryptjs, @dnd-kit/core, @dnd-kit/sortable (+41 more)

### Community 999 - "LyceesPage.jsx"
Cohesion: 0.10
Nodes (20): LyceesPage, Footer(), LyceeCard(), TYPE_BADGE, TYPE_ICON, TYPE_ICON_BG, FooterBackgroundGradient(), TextHoverEffect() (+12 more)

## Knowledge Gaps
- **491 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+486 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 739 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.jsx`, `Button`, `lucide-react`, `customSupabaseClient.js`, `AdminDashboard.jsx`, `CardContent`, `cn`, `MyDocumentsPage.jsx`, `ChatInterface.jsx`, `careerMatching.js`, `button.jsx`, `SelectContent`, `AnimatedItem`, `Label`, `DialogContent`, `EnhancedFormationFilters.jsx`, `Input`, `CVTemplate.jsx`, `framer-motion`, `CVUploadSection.jsx`, `PageHelmet`, `JobExplorer.jsx`, `ScrollArea`, `PersonalizedPlanPage.jsx`, `matchingUtils.js`, `utils.js`, `react-helmet-async`, `JobDetailPage.jsx`, `ActualitesDetailPage.jsx`, `Header.jsx`, `CleoWidget.jsx`, `AnalyticsDashboard.jsx`, `PreferencesRGPDPage.jsx`, `LandingHeroPage.jsx`, `EnhancedMetierCard.jsx`, `TabsList`, `SectorFilterEnhanced.jsx`, `providerConfig.jsx`, `OffersFormationsPage.jsx`, `establishmentService.js`, `input-group.jsx`, `HowItWorksPage.jsx`, `HomePage.jsx`, `toaster.jsx`, `MetierDetailPage.jsx`, `CVBuilderPage.jsx`, `menubar.jsx`, `TestResultsPage.jsx`, `LyceeDetailPage.jsx`, `franceTravail.js`, `linkedData.js`, `CleoPage.jsx`, `DashboardOverview.jsx`, `FormationsPage.jsx`, `AdminTests.jsx`, `TestPage.jsx`, `ContentManagementPage.jsx`, `Dashboard.jsx`, `form.jsx`, `SignupFormValidation.js`, `LearningPathPage.jsx`, `PartnershipPage.jsx`, `package.json`, `FormationDetailsPanel.jsx`, `securityService.js`, `useMetierFeedback.js`, `ProfilePage.jsx`, `carousel.jsx`, `FormationDetailPage.jsx`, `chart.jsx`, `PersistenceContext.jsx`, `MarcheTravailCard.jsx`, `TestFlowDebugger.jsx`, `BlogCarousel.jsx`, `PasswordGenerator.jsx`, `RecommendedActionsSection.jsx`, `EstablishmentDashboard.jsx`, `auth/EnhancedSignupForm.jsx`, `WidgetErrorBoundary`, `MobileBottomNav.jsx`, `DynamicBackground.jsx`, `PageTransition.jsx`, `CVManagement.jsx`, `RecommendedJobs.jsx`, `useCVUpload.js`, `useEstablishmentAuth`, `realDataServices.test.js`, `LyceesPage.jsx`?**
  _High betweenness centrality (0.231) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04184198223468911 - nodes in this community are weakly interconnected._
- **Why does `Button` connect `Button` to `RecommendedJobs.jsx`, `App.jsx`, `lucide-react`, `customSupabaseClient.js`, `AdminDashboard.jsx`, `CardContent`, `cn`, `MyDocumentsPage.jsx`, `ChatInterface.jsx`, `careerMatching.js`, `button.jsx`, `SelectContent`, `AnimatedItem`, `Label`, `DialogContent`, `react`, `EnhancedFormationFilters.jsx`, `Input`, `CVTemplate.jsx`, `framer-motion`, `CVUploadSection.jsx`, `PageHelmet`, `JobExplorer.jsx`, `ScrollArea`, `PersonalizedPlanPage.jsx`, `utils.js`, `ActualitesDetailPage.jsx`, `JobDetailPage.jsx`, `Header.jsx`, `CleoWidget.jsx`, `AnalyticsDashboard.jsx`, `PreferencesRGPDPage.jsx`, `EnhancedMetierCard.jsx`, `TabsList`, `SectorFilterEnhanced.jsx`, `OffersFormationsPage.jsx`, `establishmentService.js`, `input-group.jsx`, `HowItWorksPage.jsx`, `MetierDetailPage.jsx`, `CVBuilderPage.jsx`, `TestResultsPage.jsx`, `LyceeDetailPage.jsx`, `linkedData.js`, `CleoPage.jsx`, `DashboardOverview.jsx`, `FormationsPage.jsx`, `TestPage.jsx`, `ContentManagementPage.jsx`, `Dashboard.jsx`, `LearningPathPage.jsx`, `FormationDetailsPanel.jsx`, `ProfilePage.jsx`, `carousel.jsx`, `FormationDetailPage.jsx`, `TestFlowDebugger.jsx`, `BlogCarousel.jsx`, `ErrorBoundary`, `LyceesPage.jsx`, `RecommendedActionsSection.jsx`, `EstablishmentDashboard.jsx`, `CVManagement.jsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0627748900439824 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `App.jsx`, `Button`, `customSupabaseClient.js`, `AdminDashboard.jsx`, `CardContent`, `cn`, `MyDocumentsPage.jsx`, `ChatInterface.jsx`, `careerMatching.js`, `button.jsx`, `SelectContent`, `AnimatedItem`, `Label`, `DialogContent`, `react`, `EnhancedFormationFilters.jsx`, `Input`, `CVTemplate.jsx`, `framer-motion`, `CVUploadSection.jsx`, `riasecMatchingAlgorithm.js`, `PageHelmet`, `JobExplorer.jsx`, `ScrollArea`, `PersonalizedPlanPage.jsx`, `matchingUtils.js`, `utils.js`, `ActualitesDetailPage.jsx`, `JobDetailPage.jsx`, `Header.jsx`, `CleoWidget.jsx`, `AnalyticsDashboard.jsx`, `PreferencesRGPDPage.jsx`, `LandingHeroPage.jsx`, `EnhancedMetierCard.jsx`, `TabsList`, `SectorFilterEnhanced.jsx`, `OffersFormationsPage.jsx`, `establishmentService.js`, `input-group.jsx`, `HowItWorksPage.jsx`, `HomePage.jsx`, `toaster.jsx`, `MetierDetailPage.jsx`, `CVBuilderPage.jsx`, `menubar.jsx`, `TestResultsPage.jsx`, `LyceeDetailPage.jsx`, `franceTravail.js`, `linkedData.js`, `CleoPage.jsx`, `DashboardOverview.jsx`, `FormationsPage.jsx`, `AdminTests.jsx`, `TestPage.jsx`, `ContentManagementPage.jsx`, `Dashboard.jsx`, `LearningPathPage.jsx`, `PartnershipPage.jsx`, `package.json`, `FormationDetailsPanel.jsx`, `ProfilePage.jsx`, `carousel.jsx`, `FormationDetailPage.jsx`, `MarcheTravailCard.jsx`, `TestFlowDebugger.jsx`, `BlogCarousel.jsx`, `PasswordGenerator.jsx`, `RecommendedActionsSection.jsx`, `EstablishmentDashboard.jsx`, `auth/EnhancedSignupForm.jsx`, `WidgetErrorBoundary`, `MobileBottomNav.jsx`, `CVManagement.jsx`, `RecommendedJobs.jsx`, `useEstablishmentAuth`, `LyceesPage.jsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.05378720895962275 - nodes in this community are weakly interconnected._