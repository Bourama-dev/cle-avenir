/**
 * Utility for debugging the Matching Algorithm.
 * Logs detailed execution steps, weights, and final scoring parameters.
 * Uses Vite-compatible environment variables.
 */

const DEBUG = import.meta.env.VITE_DEBUG === 'true';
const IS_DEV = import.meta.env.MODE === 'development';

export function logMatchingDebug(userVector, topMetiers, metadata) {
  // Only log if explicitly in DEBUG mode or in development environment
  if (!DEBUG && !IS_DEV) {
    return;
  }

  console.groupCollapsed('🎯 [Matching Debugger] Algorithm Execution Logs');
  
  console.log('1. User Vector (22 Dimensions):', userVector?.rawVector || 'N/A (Only RIASEC provided)');
  console.log('2. User RIASEC Profile (Normalized):', userVector?.riasec || userVector);
  
  console.log('3. Top Metiers Matched:');
  
  if (topMetiers && Array.isArray(topMetiers)) {
    const tableData = topMetiers.map(m => ({
      Code: m.code,
      Title: m.libelle?.substring(0, 30) || 'N/A',
      'Raw Cosine Sim': m.similarity ? Number(m.similarity).toFixed(4) : '0',
      'Bonus Applied': m.bonus_applied || 0,
      'Score + Bonus': m.raw_score ? Number(m.raw_score).toFixed(2) : '0',
      'Z-Score': m.zScore ? Number(m.zScore).toFixed(2) : '0',
      'Z-Score Offset (0-100)': m.finalZScore ? Number(m.finalZScore).toFixed(2) : '0',
      'Boost Multiplier': m.boostMultiplier ? Number(m.boostMultiplier).toFixed(2) : '1.00',
      'Final Output Score (/10)': m.final_score ? Number(m.final_score).toFixed(2) : '0'
    }));
    
    console.table(tableData);
  } else {
    console.log('No metiers data available to display.');
  }
  
  console.log('4. Algorithm Metadata:', metadata);
  console.groupEnd();
}