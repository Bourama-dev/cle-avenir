# Adaptive Reinforcement Learning Loop - Test Documentation

This document outlines the required test cases to verify the implementation of the Career Dimension Reinforcement system.

## 1. System Components
- **Supabase RPC (`reinforce_career_dimensions`)**: Handles the mathematical update logic directly in the database.
- **Service (`reinforceCareer.js`)**: Applies L2 normalization to user vectors and acts as the bridge to the RPC.
- **Scoring Engine (`scoreROME.js`)**: Incorporates the `adjusted_weights` JSONB column in cosine similarity calculations.
- **UI Trigger (`CareerResults.jsx`)**: Calls the service function upon user selection of a career path.

---

## 2. Test Scenarios

### Test 2.1: RPC Execution & Connectivity
**Description:** Verify the RPC function is successfully callable from the frontend service.
- **Action:** Select a career in the application UI (click "Voir les formations...").
- **Verification:** 
  1. Check browser network tab for successful `POST` to `/rpc/reinforce_career_dimensions`.
  2. Verify no CORS or Permission errors are thrown.
  3. Ensure the browser console logs "Career [code] dimensions reinforced successfully."

### Test 2.2: Vector L2 Normalization
**Description:** Verify that the vector is properly normalized before interacting with the database.
- **Action:** Provide a mock RIASEC vector with large values (e.g., `{ R: 10, I: 20, A: 30 }`).
- **Verification:** 
  1. Add a temporary console.log in `reinforceCareer.js`.
  2. Verify the normalized vector output has a Euclidean length (magnitude) exactly equal to `1.0`.

### Test 2.3: Increment Accuracy (2% Logic)
**Description:** Verify the mathematical precision of the `v_value * 0.02` SQL update logic.
- **Action:**
  1. Check the existing `adjusted_weights` for a specific career code (e.g., `M1805`) in Supabase (should be null or empty).
  2. Simulate a reinforcement call with a normalized vector: `{ R: 0.5, I: 0.5 }`.
- **Verification:**
  1. Query the database table `rome_metiers` for that code.
  2. Ensure `adjusted_weights` now contains `{"R": 0.01, "I": 0.01}` (since 0.5 * 0.02 = 0.01).

### Test 2.4: Multiple Reinforcements Accumulation
**Description:** Verify that consecutive reinforcements accumulate correctly without overwriting.
- **Action:** Run the reinforcement from Test 2.3 twice more with the exact same vector.
- **Verification:**
  1. Query the database.
  2. Ensure `adjusted_weights` now reads `{"R": 0.03, "I": 0.03}`.

### Test 2.5: Maximum Cap Enforcement (0.2 Limit)
**Description:** Ensure the SQL `least(current_value + increment, 0.2)` constraint works.
- **Action:** 
  1. Manually set a career's `adjusted_weights` in Supabase to `{"R": 0.195}`.
  2. Send a reinforcement where normalized R = 0.5 (which adds 0.01).
- **Verification:**
  1. The new expected value would be 0.205, but it should be capped.
  2. Query the database; the value for "R" must be exactly `0.2`.

### Test 2.6: Scoring Engine (`scoreROME.js`) Integration
**Description:** Verify that `adjusted_weights` genuinely affect career match scoring.
- **Action:**
  1. Pick a career that normally scores poorly for an "Artistic" profile (e.g., an accounting job).
  2. Manually set its `adjusted_weights` in Supabase to `{"A": 0.2, "I": 0.1}`.
  3. Run the Career Test with highly "Artistic" answers.
- **Verification:**
  1. Ensure the modified career appears higher in the recommended results than it did before the manual weight adjustment.
  2. This confirms `buildCareerVectorFromROME` correctly parses and adds the JSONB weights to the base career vector.

### Test 2.7: Cosine Similarity Norm Fix
**Description:** Ensure the modifications to the mathematical logic in `scoreROME.js` prevent skewed denominator calculations.
- **Action:** Execute the test normally and review the `zScore` calculations output in `generateDetailedResults`.
- **Verification:**
  1. Ensure no `NaN` or `Infinity` scores are returned.
  2. Ensure `cosineSimilarity` function correctly incorporates the dimensions present *only* in `adjusted_weights` when computing the magnitude (`normB`) of the career vector.