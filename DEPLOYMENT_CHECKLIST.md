# CléAvenir Production Deployment Checklist

## 1. Codebase & Compliance
- [ ] **Compliance Pages Verified**: `PrivacyPage.jsx`, `TermsPage.jsx`, and `LegalPage.jsx` exist and contain RGPD-compliant French text.
- [ ] **Cookie Consent Active**: `CookieConsent.jsx` renders properly on first visit, correctly saves preferences to `localStorage`, and can be dismissed.
- [ ] **Footer Links Operational**: Footer contains accurate routing to `/privacy`, `/terms`, and `/legal`.
- [ ] **Environment Variables**: `.env.production` is populated with correct, valid credentials (Supabase URLs/Keys, VAPID key, Sentry DSN, Stripe).

## 2. Security & Performance
- [ ] **Security Headers Validated**: `vercel.json` contains HSTS, CSP, X-Frame-Options, and Referrer-Policy configurations.
- [ ] **Lighthouse Performance Score**: Application achieves >80 on Performance, Accessibility, Best Practices, and SEO metrics.
- [ ] **Sentry Integration**: `@sentry/react` is initialized in `main.jsx`, properly capturing uncaught exceptions in the production environment.
- [ ] **Responsive Design Pass**: Platform is tested and functioning correctly on Mobile (320px), Tablet (768px), and Desktop (1024px+).

## 3. Database & Migrations
- [ ] **Migration 0003 Applied**: Run `0003_production_setup.sql` on the production Supabase instance to ensure logging and notification tables exist.
- [ ] **RLS Policies Tested**: Row Level Security is enabled and functioning as expected on newly created tables (`user_activity_logs`, `security_logs`, etc.).
- [ ] **Indexes Checked**: Crucial queries utilize indexes created during migrations.

## 4. Final Verification
- [ ] **Build Process**: Execute `npm run build` locally without warnings or errors.
- [ ] **Vercel Deployment**: Push to main branch and verify Vercel build completes successfully.
- [ ] **Post-Deployment Smoke Test**: Create a test user, run an orientation test, verify email delivery (if applicable), and ensure no console errors exist in production.