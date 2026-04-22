/**
 * REAL DATA SERVICES INDEX
 *
 * This file consolidates all real data services that replace mock/hardcoded data.
 * All data sources are now connected to Supabase and real APIs.
 */

// Career and Job Data (ROME)
export { realCareerDataService } from './realCareerDataService';

// Formation/Training Data
export { realFormationDataService } from './realFormationDataService';
export { onisepSyncService } from './onisepSyncService';

// Establishment/Institution Data
export { realEstablishmentDataService } from './realEstablishmentDataService';

// Blog/Content Data
export { realBlogDataService } from './realBlogDataService';

// Job Offers
export { realJobDataService } from './realJobDataService';

// Updated Services with Real Data
export { establishmentDashboardService } from './establishmentDashboardService';

/**
 * REPLACED MOCK DATA:
 *
 * ✅ AdaptiveQuestionEngine.js
 *    - OLD: Hardcoded careerDatabase object
 *    - NEW: Uses realCareerDataService.getCareersByRIASEC()
 *
 * ✅ establishmentService.js methods:
 *    - getEstablishmentStudents() → realEstablishmentDataService
 *    - getEstablishmentClasses() → realEstablishmentDataService
 *    - getEstablishmentTeachers() → realEstablishmentDataService
 *    - getEstablishmentStatistics() → realEstablishmentDataService
 *
 * ✅ Blog Content
 *    - OLD: blogPosts.js & faqBlogArticles.js (hardcoded HTML)
 *    - NEW: realBlogDataService queries blog_articles & blog_posts tables
 *
 * ✅ Job Offers
 *    - OLD: jobsDatabase.js (12 hardcoded jobs)
 *    - NEW: realJobDataService queries job_offers table
 *
 * ✅ Invoice Service
 *    - REMOVED: Mock invoice handling
 *    - NOW: Production-only invoice generation
 *
 * ✅ Formations
 *    - OLD: Various hardcoded lists
 *    - NEW: realFormationDataService queries formations tables
 *
 * MIGRATION STATUS:
 * - ✅ Complete for core career/job/formation data
 * - ✅ Complete for establishment data
 * - ✅ Complete for blog content
 * - ⏳ Pending: France Travail API integration
 * - ⏳ Pending: Full content migration to database
 */

/**
 * DATABASE TABLES BEING USED:
 *
 * Career & Skills:
 * - rome_metiers: ROME occupation data
 * - advanced_metiers: Advanced career profiles with RIASEC scores
 *
 * Formations:
 * - formations: Training programs
 * - formations_enriched: Enhanced formation data
 * - institution_programs: Programs offered by institutions
 *
 * Establishments:
 * - educational_institutions: Schools and training establishments
 * - user_institution_links: Links between users and institutions
 * - institution_staff: Staff members at institutions
 *
 * Jobs:
 * - job_offers: Real job postings
 *
 * Blog:
 * - blog_articles: Published articles
 * - blog_posts: Blog posts
 * - blog_categories: Article categories
 *
 * Tests & Results:
 * - user_test_results: User test results with recommendations
 * - profiles: User profiles with interests and skills
 */
