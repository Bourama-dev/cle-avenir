# Matching Algorithm Documentation

## Overview
The matching algorithm connects a user's test answers to the official `rome_metiers` database. It utilizes a scoring system based on weighted answers, sector alignment, and environmental preferences.

## Data Structures
1. **Questions & Answers (`src/data/questions.js`)**: Defines the test structure.
2. **Matching Config (`src/data/matchingConfig.js`)**: Maps specific answers to vector dimensions (e.g., `tech`, `commerce`, `relationnel`).
3. **Metier Criteria**: Maps ROME codes to required dimensions and environments.

## Scoring Logic (`calculateMetierScore`)
1. **Trait Accumulation**: For each answer the user provides, the associated weights are added to their `userTraits` vector.
2. **Criteria Evaluation**: 
   - If a métier has `required` traits, the algorithm adds points proportional to the user's score in those specific traits.
   - The final score is normalized to a 0-100 percentage.
3. **Fallback**: If a métier has no specific criteria defined, a fallback calculation provides a baseline score to ensure all valid métiers are returned.

## Plan-Based Filtering (`planFilteringService.js`)
We employ a Freemium display model for the results:
- **Discovery (Free) Plan**: Users see the top 3 matches with full details. Matches 4-8 are returned as blurred cards (`BlurredMetierCard.jsx`) to drive conversions.
- **Premium Plan**: Users see up to 10 top matches with full details and no blurred cards.

## Test Utilities (`matchingTestHelper.js`)
To verify matching accuracy, the test helper provides mock profiles:
- `tech_enthusiast`: Favors tech, logic, and remote work. Should match `M1805` (Developer).
- `social_helper`: Favors human interaction and field work. Should match `J1102` (Health/Social).
- `creative_person`: Favors art, passion, and digital creation. Should match `M1504` (Design).

To test consistency, call `testMatchingConsistency(mockAnswers)` which ensures deterministic scoring.