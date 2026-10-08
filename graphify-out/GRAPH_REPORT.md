# Graph Report - cle-avenir  (2026-10-08)

## Corpus Check
- Large corpus: 935 files · ~440,596 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 3421 nodes · 14586 edges · 186 communities (125 shown, 61 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Profile, Blog & RGPD Components
- Account & Admin Sections
- App Pages & Routing
- Adaptive Test UI
- CV Import & Establishment Login
- Admin GDPR Docs
- Test Results & Métiers Explorer
- Package Dependencies
- Radix UI Wrappers
- Admin Forms
- Orientation Test & Careers Data
- Home Sections
- Project Config
- Animation & Icon Libraries
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 142
- Community 143
- Community 145
- Community 147
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 167
- Community 168
- Community 169
- Community 170
- Community 171
- Community 172
- Community 173
- Community 174
- Community 175
- Community 176

## God Nodes (most connected - your core abstractions)
1. `react` - 624 edges
2. `Button` - 583 edges
3. `lucide-react` - 463 edges
4. `cn()` - 394 edges
5. `Card` - 373 edges
6. `CardContent` - 336 edges
7. `useToast()` - 262 edges
8. `Badge()` - 258 edges
9. `customSupabaseClient` - 221 edges
10. `CardHeader` - 209 edges

## Surprising Connections (you probably didn't know these)
- `AdaptiveOrientationTest()` --calls--> `AdaptiveQuestion()`  [EXTRACTED]
  src/components/AdaptiveOrientationTest.jsx → src/components/AdaptiveQuestion.jsx
- `AdaptiveTestPage()` --calls--> `AdaptiveTestInterface()`  [EXTRACTED]
  src/pages/AdaptiveTestPage.jsx → src/components/adaptive-test/AdaptiveTestInterface.jsx
- `ProfileSnapshot()` --calls--> `Badge()`  [EXTRACTED]
  src/components/adaptive-test/ProfileSnapshot.jsx → src/components/ui/badge.jsx
- `UserProfilePreview()` --calls--> `Card`  [EXTRACTED]
  src/components/adaptive-test/UserProfilePreview.jsx → src/components/ui/card.jsx
- `ProfileEditor()` --calls--> `Button`  [EXTRACTED]
  src/components/dashboard/ProfileEditor.jsx → src/components/ui/button.jsx

## Import Cycles
- None detected.

## Communities (186 total, 61 thin omitted)

### Community 0 - "Profile, Blog & RGPD Components"
Cohesion: 0.04
Nodes (39): ProfileTest(), questionIcons, customSupabaseClient, initialRomeMetiers, aiAssessmentService, AICoachService, CareerFamilyAnalysisService, EstablishmentActivityService (+31 more)

### Community 1 - "Account & Admin Sections"
Cohesion: 0.07
Nodes (81): recharts, EstablishmentLinkCard(), EnhancedQuestionCard(), AdminAnalytics(), AdminCompliance(), CHECKLIST, AdminLaunchControl(), AdminMonitoring() (+73 more)

### Community 2 - "App Pages & Routing"
Cohesion: 0.04
Nodes (86): AboutPage, AccountPage, ActualitesDetailPage, ActualitesPage, AdminAnalyticsDashboard, AdminDashboardPage, AdminMetiers, AdminSettingsPage (+78 more)

### Community 3 - "Adaptive Test UI"
Cohesion: 0.06
Nodes (50): AdaptiveTestInterface(), BlurredMetierCard(), CareerCard(), CareerDetails(), TestProgressBar(), CleoProfileWidget(), CookieConsent(), AICoachWidget() (+42 more)

### Community 4 - "CV Import & Establishment Login"
Cohesion: 0.05
Nodes (53): mammoth, pdfjs-dist, CVImport(), EstablishmentLoginForm(), MetierErrorState(), CVDataReview(), CVUploadSection(), SetupGuide() (+45 more)

### Community 5 - "Admin GDPR Docs"
Cohesion: 0.05
Nodes (44): AdminGdprDocs(), CATEGORY_COLORS, DocCard(), GDPR_DOCS, INTERNAL_DOCS, AdminLogs(), ContextPanel(), AIInsightsWidget() (+36 more)

### Community 6 - "Test Results & Métiers Explorer"
Cohesion: 0.06
Nodes (61): AdaptiveTestResults(), ResultsHeader(), fetchAllMetiers(), MetierCard(), MetiersExplorer(), RecommendedJobs(), quickMatchTest(), testCareerMatching() (+53 more)

### Community 7 - "Package Dependencies"
Cohesion: 0.03
Nodes (73): dependencies, @babel/generator, @babel/parser, @babel/traverse, @babel/types, bcryptjs, class-variance-authority, clsx (+65 more)

### Community 8 - "Radix UI Wrappers"
Cohesion: 0.05
Nodes (55): @radix-ui/react-context-menu, @radix-ui/react-hover-card, @radix-ui/react-menubar, react-day-picker, QuestionChoice(), EstablishmentMenu(), MenuItem(), CleoModeSelector() (+47 more)

### Community 9 - "Admin Forms"
Cohesion: 0.11
Nodes (40): ALLOWED_TYPES, BlogForm(), FormationForm(), MetierForm(), OffreForm(), EstablishmentFilters(), AdminTestsFilters(), AlternanceFilters() (+32 more)

### Community 10 - "Orientation Test & Careers Data"
Cohesion: 0.06
Nodes (35): AdaptiveOrientationTest(), CAREERS, questions, RIASEC_DESCRIPTIONS, generateDetailedResults(), buildUserVector(), calculateDomainBonus(), extractUserDomains() (+27 more)

### Community 11 - "Home Sections"
Cohesion: 0.11
Nodes (35): B2BSection(), BenefitsStatsSection(), CountUp(), STATS, FinalCTASection(), HeroMapSection(), HowItWorksSection(), WAYPOINTS (+27 more)

### Community 12 - "Project Config"
Cohesion: 0.04
Nodes (53): name, private, type, version, autoprefixer, bcryptjs, clsx, @dnd-kit/core (+45 more)

### Community 13 - "Animation & Icon Libraries"
Cohesion: 0.07
Nodes (24): framer-motion, lucide-react, BlurredMatches(), ProfileSnapshot(), UnlockCTA(), SuggestedFormations(), categories, FAQCategories() (+16 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (38): DebugResponsesSection(), DataUsageExplainer(), FAQAccordion(), FormationCard(), ParcoursupDetailsModal(), SectorFilterEnhanced(), FAQ(), AccordionContent (+30 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (40): CompanyCard(), hiringLabel(), CompanySectorFilter(), SECTORS, EmployerInfo(), EmployerLogo(), departmentOf(), EmployerTile() (+32 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (27): InterviewResults(), scoreColor(), icons, InterviewSetup(), QUESTION_COUNTS, LiveInterview(), LoadingFallback(), InterviewPage() (+19 more)

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (25): react-router-dom, Breadcrumbs(), routeNameMap, CookieConsentBanner(), Dashboard(), DashboardSidebar(), NotificationBell(), NotificationContext (+17 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (36): FormationPathSection(), Title(), ProgressionSection(), SUBTITLES, ACTION_BASE, buildSublabel(), getActionsForStatus(), RecommendedActionsSection() (+28 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (24): @radix-ui/react-checkbox, AdaptiveQuestion(), ColorSettings(), GeneralSettings(), LanguageSettings(), MaintenanceSettings(), ThemeSettings(), BugReportToggle() (+16 more)

### Community 20 - "Community 20"
Cohesion: 0.07
Nodes (31): COLORS, EstablishmentCharts(), mockActivityData, mockFormationData, mockGrowthData, CleoQuiz(), InteractiveComparison(), RecommendationCarousel() (+23 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (21): ShareResults(), EtablissementsTab(), AdminEstablishments(), AdminGdprOps(), EstablishmentModal(), UserManagement(), BugReportButton(), BugReportDialog() (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.08
Nodes (27): UserProfilePreview(), EstablishmentStats(), StatCard(), EstablishmentStats(), CleoUpgradePrompt(), CoverLettersSection(), getJobFamily(), JOB_FAMILIES (+19 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (29): ChatInterface(), MessageBubble(), Cleo(), FIELD_LABELS, InteractiveResponse(), renderSimpleMarkdown(), CleoAvatar(), ChoiceGroup() (+21 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (12): react, CoverLetterRenderer(), CoverLetterTemplate1(), CoverLetterTemplate2(), CoverLetterTemplate3(), CoverLetterTemplate4(), CoverLetterTemplate5(), CoverLetterTemplate6() (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (37): ALL_PERKS, CountUp(), FEATURES, generateRandomRiasecProfile(), HomePage(), NewsPreview, Reveal(), SectionHead() (+29 more)

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (27): EnhancedSignupForm(), ImprovedSignupProgressBar(), ParentalConsentModal(), SignupProgress(), steps, StepIndicatorCircle(), GoogleIcon(), UnifiedSignupStep1() (+19 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (30): MetierLoadingSpinner(), colorBar, colorBg, colorText, fmt(), MarcheTravailCard(), Stat(), tensionDisplay() (+22 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (23): TestGateModal(), ActivityCard(), CleoActivitySystem(), SavedItems(), FavoritesSection(), IdealJobSection(), CareerFamilyDetailModal(), UserDetailModal() (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.07
Nodes (33): class-variance-authority, @radix-ui/react-toggle, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent() (+25 more)

### Community 30 - "Community 30"
Cohesion: 0.26
Nodes (27): date-fns, AdminBlogManager(), AdminFormationManager(), AdminMetierManager(), AdminOffreManager(), AdminBlog(), AdminDataRequests(), STATUS_CONFIG (+19 more)

### Community 31 - "Community 31"
Cohesion: 0.18
Nodes (21): ActionButton(), QuickActions(), SettingsImportExport(), useSettingsNotifications(), RgpdDataExport(), AlertDialogAction, AlertDialogCancel, AlertDialogContent (+13 more)

### Community 32 - "Community 32"
Cohesion: 0.08
Nodes (28): TYPE_BADGE, TYPE_ICON, TYPE_ICON_BG, CATEGORY_STYLES, classifyFormation(), cleanFormationLabel(), detectFilieresFromText(), FORMATION_CATEGORIES (+20 more)

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (16): AboutPage(), Blog(), BlogPost(), buildShareUrls(), estimateReadTime(), stripHtml(), navItems, PageHelmet() (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.15
Nodes (22): @radix-ui/react-avatar, @radix-ui/react-dropdown-menu, AdminUsers(), AdminTestsExport(), CleoSidebar(), relativeDate(), MessagingSystem(), PersonalSection() (+14 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (20): DIMENSION_LABELS, ConfidenceIndicator(), MATCHING_CONFIG, advancedMatchingService, calculateConsistency(), calculateInterestAlignment(), calculateRiasecSimilarity(), calculateSkillCompatibility() (+12 more)

### Community 36 - "Community 36"
Cohesion: 0.16
Nodes (21): AnalyticsDashboard(), DetailedStatisticsPanel(), StatCard(), FilterBar(), SearchBar(), RecommendationList(), CareerExplorationTab(), CareerFamilyAnalysisTab() (+13 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (15): adaptiveTestQuestions, CURATED_ARTICLES, AdaptiveQuestionEngine, AdaptiveTestValidator, CacheService, realBlogDataService, realCareerDataService, realEstablishmentDataService (+7 more)

### Community 38 - "Community 38"
Cohesion: 0.10
Nodes (17): EDIT_MODE_STYLES, POPUP_STYLES, __dirname, __filename, inlineEditDevPlugin(), auditor, __dirname, DIST_DIR (+9 more)

### Community 39 - "Community 39"
Cohesion: 0.15
Nodes (11): @radix-ui/react-tooltip, ActionButton(), TestCompletionIndicator(), AdminBadge(), AdminButton(), BadgesWidget(), SocialMediaShare(), TooltipContent (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (18): CookiePreferences(), DynamicLegalContent(), LegalLayout(), RGPDPreferences(), useLegalDocument(), ConditionsGeneralesPage(), CookiePolicyPage(), PolitiqueConfidentialitePage() (+10 more)

### Community 41 - "Community 41"
Cohesion: 0.14
Nodes (24): AdminSidebar(), AdminAnalytics, AdminCompliance, AdminContent, AdminDashboard(), AdminDashboardLoader(), AdminDataRequests, AdminEstablishments (+16 more)

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (15): CVTemplate(), CVTemplateWrapper(), DEFAULT_CV_DATA, CVTemplate1(), CVTemplate2(), CVTemplate3(), CVTemplate4(), CVTemplate5() (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.15
Nodes (14): DiplomaGoals(), DiplomaSearch(), DiplomaSelector(), EstablishmentSearch(), InstitutionSearch(), InstitutionSearchSplit(), InstitutionSelector(), useDebounce() (+6 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (25): SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader (+17 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (13): EstablishmentCodeManager(), EstablishmentEmailsManager(), EstablishmentForm(), AuthModal(), ProfileEditor(), SearchBar(), EducationSection(), ExperienceSection() (+5 more)

### Community 46 - "Community 46"
Cohesion: 0.13
Nodes (19): MaintenancePage, MaintenanceCountdown(), MaintenancePage(), defaultSettings, SystemSettingsContext, SystemSettingsProvider(), useSystemSettings(), AreaChart() (+11 more)

### Community 47 - "Community 47"
Cohesion: 0.14
Nodes (8): EVENT_TYPES, METADATA_EXAMPLES, EDITABLE_FIELDS, ESTABLISHMENT_COLUMNS, EstablishmentService, normalizeEmails(), syncAuthorizedEmails(), EventLogger

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (16): cmdk, @radix-ui/react-popover, UserFilterComponent(), NotificationBell(), NotificationsSystem(), Command, CommandDialog(), CommandEmpty (+8 more)

### Community 49 - "Community 49"
Cohesion: 0.20
Nodes (21): ALLOWED_PARENT_ORIGINS, createOverlay(), createSelectedOverlay(), disableSelectionMode(), enableSelectionMode(), extractDOMContext(), getComputedStyles(), getFilePathFromNode() (+13 more)

### Community 50 - "Community 50"
Cohesion: 0.17
Nodes (17): COMPONENT_BLACKLIST, __dirname, extractCodeBlocks(), __filename, findJSXElementAtPosition(), generateCode(), generateSourceWithMap(), isBlacklistedComponent() (+9 more)

### Community 51 - "Community 51"
Cohesion: 0.23
Nodes (13): CompactPreview(), CVFormDataManager(), CVTemplateGallery(), FloatingActionBar(), FormFieldGroup(), AccordionSection(), MobileFormLayout(), PreviewToggle() (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (14): TopMatches(), EnhancedMetierCard(), formatSalaryLabel(), RomeBadge(), SalaryBadge(), SectorBadge(), getMetierIconConfig(), MetierCardIcon() (+6 more)

### Community 53 - "Community 53"
Cohesion: 0.16
Nodes (14): classics, moderns, CTASection(), FiveSteps(), steps, HeroSection(), ResultsSection(), stats (+6 more)

### Community 54 - "Community 54"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (12): @radix-ui/react-toast, Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport (+4 more)

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (12): react-helmet-async, App(), EnhancedTestPage, MetaTags(), StructuredData(), ActualitesPage(), formatDate(), NewsCard() (+4 more)

### Community 57 - "Community 57"
Cohesion: 0.21
Nodes (19): enqueue(), flushGtmQueue(), flushQueue(), getGtag(), hasAnalyticsConsent(), isBrowser(), _queue, safeNumber() (+11 more)

### Community 58 - "Community 58"
Cohesion: 0.19
Nodes (18): applyCriteriaMultiplier(), calculateAdvancedMatching(), calculateConfidence(), calculateDemandScore(), calculateGrowthScore(), calculateHybridScore(), calculateRIASECScore(), calculateStabilityScore() (+10 more)

### Community 59 - "Community 59"
Cohesion: 0.22
Nodes (17): ALLOWED_PARENT_ORIGINS, createDisabledTooltip(), disableEditMode(), enableEditMode(), findDisabledElementAtPoint(), findEditableElementAtPoint(), getParentOrigin(), handleDisabledElementHover() (+9 more)

### Community 60 - "Community 60"
Cohesion: 0.23
Nodes (13): @radix-ui/react-dialog, FilterPanel(), EnhancedFormationFilters(), EnhancedJobFilters(), SheetContent, SheetDescription, SheetFooter(), SheetHeader() (+5 more)

### Community 61 - "Community 61"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, eslint-config-react-app, eslint-import-resolver-alias, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks (+9 more)

### Community 62 - "Community 62"
Cohesion: 0.22
Nodes (8): AlternanceCard(), AlternanceFinder(), FormationFilters(), LocationFilter(), CityAutocomplete(), Slider, useGeolocation(), getCoordinatesFromLocation()

### Community 63 - "Community 63"
Cohesion: 0.17
Nodes (14): CLEO_FEATURES, CleoWidget(), INITIAL_SUGGESTIONS, TypingIndicator(), UpgradePanel(), ALL_FEATURES, FEATURES, PRICE_MODES (+6 more)

### Community 64 - "Community 64"
Cohesion: 0.23
Nodes (9): AdminEstablishmentDashboard(), ConnectionActivityChart(), DashboardStats(), StatCard(), EstablishmentInfo(), InfoRow(), InscriptionGrowthChart(), COLORS (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.22
Nodes (15): ADMIN_EMAILS, createUserProfile(), getDashboardRoute(), getPermissionsByRole(), getRoleByEmail(), getRoleFromSupabaseUser(), guardPermission(), hasPermission() (+7 more)

### Community 66 - "Community 66"
Cohesion: 0.17
Nodes (4): blogCache, BlogCacheService, CACHE_KEYS, TTL

### Community 67 - "Community 67"
Cohesion: 0.21
Nodes (11): BlogCard, getImageUrl(), ALLOWED_IMAGE_TYPES, BLOG_CATEGORIES, BlogSection(), ContentManagementPage(), EMPTY_FORM, LEGAL_DEFAULTS (+3 more)

### Community 68 - "Community 68"
Cohesion: 0.21
Nodes (10): LOCAL_ACTIVITY_CATALOG, DIMENSION_LABELS, DOMAIN_TO_SKILL_TAGS, learningPathService, RIASEC_SKILL_MAP, localActivityProgress, readAll(), storageKey() (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.25
Nodes (9): useMetierFeedback(), metierFeedbackService, METIER_FIELDS, metierRecommendationService, romeService, userProfileService, delay(), parseSupabaseError() (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.18
Nodes (8): __dirname, __filename, selectionModePlugin(), iframeRouteRestorationPlugin(), vite, @vitejs/plugin-react, addTransformIndexHtml, logger

### Community 71 - "Community 71"
Cohesion: 0.24
Nodes (11): formationDetailSEO(), FormationCertification, FormationDebouches, FormationDetailPage(), FormationOffres, FormationProgramme, FormationStatistiques, SectionSkeleton() (+3 more)

### Community 72 - "Community 72"
Cohesion: 0.27
Nodes (11): testPageSEO(), optimizedQuestions, OPTIONS, RIASEC_MAX_POSSIBLE, RIASEC_META, computeProfile(), computeProfileCode(), computeProfileMeta() (+3 more)

### Community 73 - "Community 73"
Cohesion: 0.23
Nodes (8): ANSWER_TO_METIER_MAPPING, ANSWER_WEIGHTS, METIER_CRITERIA, QUESTION_CATEGORIES, calculateMetierScore(), getMatchingExplanation(), matchMetiersToAnswers(), testMatchingConsistency()

### Community 74 - "Community 74"
Cohesion: 0.27
Nodes (9): APP_DIR, COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP, componentExists(), FILES_UPDATED_BY_SHADCN_INIT, findImportedComponentNames(), pathExists(), run(), runCommand() (+1 more)

### Community 75 - "Community 75"
Cohesion: 0.23
Nodes (10): @radix-ui/react-slot, react-hook-form, FormControl, FormDescription, FormFieldContext, FormItem, FormItemContext, FormLabel (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.29
Nodes (5): EMAIL_TYPES, EmailService, isEmail(), isUrl(), toNumber()

### Community 77 - "Community 77"
Cohesion: 0.24
Nodes (7): validateEmail(), validatePassword(), validatePhone(), validateRequired(), validateStep1(), validateStep2(), validateStep3()

### Community 78 - "Community 78"
Cohesion: 0.31
Nodes (8): html2canvas, jspdf, collectTextLines(), exportA4Pdf(), mountOffscreenCopy(), toEncodable(), exportCoverLetterPDF(), exportCVPDF()

### Community 79 - "Community 79"
Cohesion: 0.25
Nodes (7): react-dom, @sentry/react, endDrag(), findScroller(), installDragScroll(), rootElement, consentManager

### Community 80 - "Community 80"
Cohesion: 0.36
Nodes (6): AuthLayout(), AuthTabs(), LoginForm(), PasswordInput(), AuthPage(), authStyles

### Community 81 - "Community 81"
Cohesion: 0.22
Nodes (7): FINAL_CALIBRATION, INITIAL_QUESTIONS, SECTOR_SPECIFIC_QUESTIONS, calculateMatches(), matchesKeywords(), METIER_ENRICHED_DATA, ROME_DOMAINS

### Community 82 - "Community 82"
Cohesion: 0.51
Nodes (8): EstablishmentsTable(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem, PaginationLink(), PaginationNext(), PaginationPrevious()

### Community 83 - "Community 83"
Cohesion: 0.29
Nodes (8): calcCompletion(), DashboardOverview(), PROFILE_FIELDS, RIASEC_COLORS, RIASEC_LABELS, TestHistoryInline(), SubscriptionDebugPanel(), getDisplayPlanName()

### Community 84 - "Community 84"
Cohesion: 0.29
Nodes (5): COLORS, ComparisonBarChart(), SkillsRadarChart(), StudentDetailAnalysis(), TemporalComparisonTool()

### Community 85 - "Community 85"
Cohesion: 0.36
Nodes (6): Footer(), Header(), FooterBackgroundGradient(), TextHoverEffect(), useTheme(), SettingsPage()

### Community 86 - "Community 86"
Cohesion: 0.36
Nodes (9): Bar(), fmt(), FormationDetailsPanel(), keywordsOf(), norm(), pct(), Section(), StatCard() (+1 more)

### Community 87 - "Community 87"
Cohesion: 0.33
Nodes (9): COLOR_CLASSES, getSectionMeta(), isBulletLine(), isSectionHeader(), JobDetailDescription(), parsePlainText(), SECTION_META, SectionBlock() (+1 more)

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (7): JobDetailHero(), JobDetailSummary(), SummaryItem(), formatContractType(), formatPublicationDate(), formatSalary(), getContractColor()

### Community 89 - "Community 89"
Cohesion: 0.27
Nodes (7): SEOHead(), auditService, healthCheck(), initializeSecurity(), logSecurityEvent(), rateLimitStore, securityService

### Community 90 - "Community 90"
Cohesion: 0.24
Nodes (6): constellationNodes, formationLabels, formationNodes, metierNodes, jobsDatabase, TRAIT_MAPPING

### Community 91 - "Community 91"
Cohesion: 0.27
Nodes (9): CARD_COLORS, CONSTRAINTS, INTERESTS, PillToggle(), ProfilePage(), StepProgress(), STEPS, STUDY_OPTIONS (+1 more)

### Community 92 - "Community 92"
Cohesion: 0.33
Nodes (5): careerProfileEmbeddingsService, embeddingsCacheService, embeddingService, semanticMatchingService, semanticResultsAnalyzer

### Community 93 - "Community 93"
Cohesion: 0.27
Nodes (9): buildBreadcrumbSchema(), buildOrganizationSchema(), __dirname, DIST, escape(), injectMeta(), ROUTES, template (+1 more)

### Community 94 - "Community 94"
Cohesion: 0.33
Nodes (8): embla-carousel-react, Carousel, CarouselContent, CarouselContext, CarouselItem, CarouselNext, CarouselPrevious, useCarousel()

### Community 95 - "Community 95"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 96 - "Community 96"
Cohesion: 0.36
Nodes (4): uuid, cvFormDataService, cvSaveService, isValidUUID()

### Community 97 - "Community 97"
Cohesion: 0.25
Nodes (6): actionTypes, addToRemoveQueue(), generateId(), listeners, memoryState, reducer()

### Community 98 - "Community 98"
Cohesion: 0.36
Nodes (8): ChartContainer, ChartContext, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload(), THEMES, useChart()

### Community 99 - "Community 99"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 100 - "Community 100"
Cohesion: 0.39
Nodes (7): norm(), RESOURCES, ResourcesPage(), safeStr(), trackEvent(), TrackingService, trackPageView()

### Community 101 - "Community 101"
Cohesion: 0.31
Nodes (7): educationApi, err(), log(), normalizeLimitOffset(), normalizeSecteur(), toInt(), toStr()

### Community 102 - "Community 102"
Cohesion: 0.29
Nodes (4): web-vitals, MonitoringService, PerformanceMonitor, reportWebVitals()

### Community 103 - "Community 103"
Cohesion: 0.43
Nodes (4): HELP_SECTIONS, HelpButton(), HelpIcon(), HelpTooltip()

### Community 104 - "Community 104"
Cohesion: 0.43
Nodes (7): CleoPreferencesModal(), DEFAULT_PREFERENCES, loadPreferences(), OptionCard(), savePreferences(), SectionTitle(), ToggleRow()

### Community 106 - "Community 106"
Cohesion: 0.29
Nodes (5): adaptiveQuestionPool, OPTIONS, adaptiveTestEngine, CATEGORIES, TestPhases

### Community 108 - "Community 108"
Cohesion: 0.29
Nodes (7): scripts, build, dev, eslint, lint, preview, seo:audit

### Community 110 - "Community 110"
Cohesion: 0.57
Nodes (4): PasswordGenerator(), copyToClipboard(), generateSecurePassword(), validatePassword()

### Community 111 - "Community 111"
Cohesion: 0.38
Nodes (3): EventTracker, NotificationService, WeeklyReportService

### Community 112 - "Community 112"
Cohesion: 0.60
Nodes (4): AdminTests(), AdminTestsDetailModal(), AdminTestsSummaryCards(), SummaryCard()

### Community 113 - "Community 113"
Cohesion: 0.47
Nodes (3): EnhancedSignupForm(), INTERESTS_LIST, SignupForm()

### Community 114 - "Community 114"
Cohesion: 0.47
Nodes (5): getStatus(), LearningRoadmap(), RoadmapNode(), STATUS_NODE, TYPE_ICON

### Community 116 - "Community 116"
Cohesion: 0.40
Nodes (5): EXPLORE_MENU, EXPLORE_PATHS, MobileBottomNav(), PROFILE_PATHS, startsWithAny()

### Community 118 - "Community 118"
Cohesion: 0.53
Nodes (4): handleStorageError(), logStorageError(), parseStorageError(), storageService

### Community 119 - "Community 119"
Cohesion: 0.60
Nodes (5): checkValidServiceWorker(), isLocalhost, register(), registerValidSW(), unregister()

### Community 121 - "Community 121"
Cohesion: 0.53
Nodes (4): applyBonuses(), applyDominantBonus(), calculateCosineSimilarity(), calculateFinalScore()

### Community 122 - "Community 122"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, paths, include

### Community 124 - "Community 124"
Cohesion: 0.60
Nodes (3): BlogCarousel(), ImageOptimizer(), faqBlogArticles

### Community 125 - "Community 125"
Cohesion: 0.50
Nodes (4): createEmptyVector(), DIMENSION_KEYS, DIMENSIONS, normalizeVector()

### Community 129 - "Community 129"
Cohesion: 0.40
Nodes (3): ErrorTypes, SemanticMatchingError, SemanticMatchingErrorHandler

### Community 133 - "Community 133"
Cohesion: 0.50
Nodes (3): DynamicBackground(), ORBS, SCROLL_PALETTES

### Community 134 - "Community 134"
Cohesion: 0.50
Nodes (3): PageTransition(), reducedVariants, variants

### Community 139 - "Community 139"
Cohesion: 0.50
Nodes (3): competenciesService, HARD_SKILLS_DICT, SOFT_SKILLS_DICT

### Community 140 - "Community 140"
Cohesion: 0.67
Nodes (3): emailTemplates, escapeAttr(), escapeHtml()

### Community 145 - "Community 145"
Cohesion: 0.83
Nodes (3): getConsentRequirements(), isEUUser(), validateConsent()

## Knowledge Gaps
- **494 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+489 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 737 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 24` to `Profile, Blog & RGPD Components`, `Account & Admin Sections`, `App Pages & Routing`, `Adaptive Test UI`, `CV Import & Establishment Login`, `Admin GDPR Docs`, `Test Results & Métiers Explorer`, `Radix UI Wrappers`, `Admin Forms`, `Orientation Test & Careers Data`, `Home Sections`, `Project Config`, `Animation & Icon Libraries`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 51`, `Community 52`, `Community 53`, `Community 55`, `Community 56`, `Community 60`, `Community 62`, `Community 63`, `Community 64`, `Community 67`, `Community 69`, `Community 71`, `Community 72`, `Community 75`, `Community 79`, `Community 80`, `Community 82`, `Community 83`, `Community 84`, `Community 85`, `Community 86`, `Community 87`, `Community 88`, `Community 89`, `Community 91`, `Community 94`, `Community 95`, `Community 96`, `Community 97`, `Community 98`, `Community 99`, `Community 100`, `Community 103`, `Community 104`, `Community 105`, `Community 109`, `Community 110`, `Community 112`, `Community 113`, `Community 114`, `Community 115`, `Community 116`, `Community 124`, `Community 131`, `Community 132`, `Community 133`, `Community 134`, `Community 135`, `Community 136`, `Community 137`, `Community 147`, `Community 148`, `Community 149`, `Community 150`, `Community 153`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Profile, Blog & RGPD Components` be split into smaller, more focused modules?**
  _Cohesion score 0.038680659670164916 - nodes in this community are weakly interconnected._
- **Why does `Button` connect `Adaptive Test UI` to `Profile, Blog & RGPD Components`, `Account & Admin Sections`, `App Pages & Routing`, `Community 131`, `CV Import & Establishment Login`, `Admin GDPR Docs`, `Test Results & Métiers Explorer`, `Radix UI Wrappers`, `Admin Forms`, `Home Sections`, `Animation & Icon Libraries`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 149`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 36`, `Community 39`, `Community 40`, `Community 41`, `Community 43`, `Community 44`, `Community 45`, `Community 47`, `Community 48`, `Community 51`, `Community 52`, `Community 53`, `Community 56`, `Community 60`, `Community 62`, `Community 63`, `Community 64`, `Community 67`, `Community 71`, `Community 72`, `Community 80`, `Community 82`, `Community 83`, `Community 85`, `Community 88`, `Community 91`, `Community 94`, `Community 97`, `Community 99`, `Community 104`, `Community 105`, `Community 109`, `Community 114`, `Community 124`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `Account & Admin Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.06971777269260107 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Animation & Icon Libraries` to `Profile, Blog & RGPD Components`, `Account & Admin Sections`, `App Pages & Routing`, `Adaptive Test UI`, `CV Import & Establishment Login`, `Admin GDPR Docs`, `Test Results & Métiers Explorer`, `Radix UI Wrappers`, `Admin Forms`, `Orientation Test & Careers Data`, `Home Sections`, `Project Config`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 39`, `Community 40`, `Community 41`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 51`, `Community 52`, `Community 53`, `Community 55`, `Community 56`, `Community 60`, `Community 62`, `Community 63`, `Community 64`, `Community 67`, `Community 71`, `Community 72`, `Community 80`, `Community 82`, `Community 83`, `Community 85`, `Community 86`, `Community 87`, `Community 88`, `Community 91`, `Community 94`, `Community 95`, `Community 96`, `Community 97`, `Community 100`, `Community 103`, `Community 104`, `Community 105`, `Community 109`, `Community 110`, `Community 112`, `Community 113`, `Community 114`, `Community 115`, `Community 116`, `Community 124`, `Community 131`, `Community 132`, `Community 135`, `Community 148`, `Community 149`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `App Pages & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.041209406494960805 - nodes in this community are weakly interconnected._