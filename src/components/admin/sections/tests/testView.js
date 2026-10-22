// Reads a test_results row in either storage format: the current test flow
// (test_score + riasec_profile + top_3_careers) and the legacy results.baseResults object.
export const DIM_LABELS = {
  R: 'Réaliste', I: 'Investigateur', A: 'Artiste', S: 'Social', E: 'Entreprenant', C: 'Conventionnel',
};

export function getTestView(test) {
  const legacy = test?.results?.baseResults;
  const riasec = test?.riasec_profile && typeof test.riasec_profile === 'object' ? test.riasec_profile : null;
  const ranked = riasec
    ? Object.entries(riasec).filter(([, v]) => typeof v === 'number').sort(([, a], [, b]) => b - a)
    : [];

  const rawScore = legacy?.confidence ?? test?.test_score;
  const score = rawScore != null && Number.isFinite(Number(rawScore)) ? Math.round(Number(rawScore)) : null;

  const legacyMatches = (legacy?.matchedCareers || []).map((m) => ({
    name: m.career?.name, percentage: m.percentage, reason: m.reason,
  }));
  const storedMatches = Array.isArray(test?.top_3_careers)
    ? test.top_3_careers.map((c) => ({
        name: c.libelle || c.name,
        percentage: c.match_score ?? c.score,
        reason: c.sector ? `Secteur : ${c.sector}` : null,
      }))
    : [];
  const matches = (legacyMatches.length ? legacyMatches : storedMatches).filter((m) => m.name);

  return {
    score,
    ranked,
    riasec,
    code: ranked.slice(0, 3).map(([k]) => k).join('') || null,
    dominant: ranked[0]?.[0] ?? null,
    matches,
    topCareer: matches[0]?.name ?? null,
    completed: !!(legacy || riasec || score != null),
  };
}

export const scoreTone = (score) =>
  score > 70 ? 'bg-green-50 text-green-700 border-green-200'
    : score > 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
    : 'bg-red-50 text-red-700 border-red-200';
