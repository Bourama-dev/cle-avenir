# Comprehensive Test Checklist

## 1. Metier Detail Page (`/metier/:code`)
- [ ] **Load Page**: Navigate to `/metier/L1503` (or any valid ROME code) and verify the page loads without crashing.
- [ ] **Data Fetching**: Verify the Metier details (Title, description, salary, sectors) are loaded.
- [ ] **Feedback Component**: Verify the rating component displays correctly.
- [ ] **Recent Comments**: Ensure recent comments display with user names (or 'Anonyme' if null).
- [ ] **Related Articles**: Ensure the "Articles liés" section attempts to load and displays either articles or a fallback message without crashing.
- [ ] **Error Handling**: Temporarily break network connection or block API requests, and verify the UI shows friendly error messages instead of blank screens. Verify "Réessayer" buttons function.

## 2. Supabase Query Error Handling & Retry Logic
- [ ] **Network Interruptions**: Simulate a network drop during a fetch. The system should automatically retry based on exponential backoff and eventually show a generic error message.
- [ ] **Foreign Key Consistency**: Verify that submitting new feedback correctly registers the `user_id` and does not throw foreign key constraint errors in logs.

## 3. General Services Integration
- [ ] **ROME Service**: Ensure `searchMetiers`, `getMetierDetails`, and `getCompetences` return data or fail gracefully.
- [ ] **Metier Recommendation Service**: Check that `getRecommendationsForUser` gracefully handles missing test results and returns empty arrays when data is missing instead of throwing unhandled exceptions.
- [ ] **Metier Feedback Service**: Ensure `getRecentComments` maps user profiles manually to prevent database nested-join issues.

## 4. UI/UX States
- [ ] **Loading Skeletons**: Verify skeletons appear properly for Job Offers, Formations, Comments, and Articles sections while data is fetching.
- [ ] **No Console Errors**: Perform a full page scroll and interact with tabs. Open Developer Tools > Console, and confirm there are no unhandled promise rejections, React key warnings, or Supabase fetch errors showing up as unhandled red text.