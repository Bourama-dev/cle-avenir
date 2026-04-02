/**
 * Extracts and normalizes test data from available sources (localStorage, URL params)
 */
export const getTestDataFromSource = (location) => {
  let profile = null;
  let recommendedMetiers = [];
  let selectedMetiers = [];
  let hasValidData = false;

  try {
    // 1. Extract from localStorage
    const storedProfileStr = localStorage.getItem('test_riasec_profile');
    const storedResultsStr = localStorage.getItem('latest_test_results');

    if (storedProfileStr) {
      profile = JSON.parse(storedProfileStr);
      hasValidData = true;
    }

    if (storedResultsStr) {
      const results = JSON.parse(storedResultsStr);
      if (results.riasecProfile && !profile) {
        profile = results.riasecProfile;
        hasValidData = true;
      }
      if (results.topCareers && Array.isArray(results.topCareers)) {
        recommendedMetiers = results.topCareers;
      }
    }

    // 2. Extract from URL params
    const searchParams = new URLSearchParams(location.search);
    const queryMetierCode = searchParams.get('metierCode');
    const queryMetierName = searchParams.get('metierName');
    const queryScore = searchParams.get('compatibilityScore');

    if (queryMetierCode && queryMetierName) {
      selectedMetiers.push({
        code: queryMetierCode,
        metierCode: queryMetierCode,
        libelle: queryMetierName,
        name: queryMetierName,
        match_score: queryScore ? parseInt(queryScore, 10) : 0
      });
      hasValidData = true;
    }

    // Ensure profile has default 0s if missing keys
    if (profile) {
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(key => {
        if (profile[key] === undefined) profile[key] = 0;
      });
    }

    return {
      profile,
      recommendedMetiers,
      selectedMetiers,
      hasValidData
    };
  } catch (err) {
    console.error("Error extracting test data:", err);
    return {
      profile: null,
      recommendedMetiers: [],
      selectedMetiers: [],
      hasValidData: false
    };
  }
};