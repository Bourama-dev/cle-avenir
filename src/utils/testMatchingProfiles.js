import { calculateRiasecMatch } from './riasecMatchingAlgorithm';

export const sampleProfiles = {
  techCreative: { R: 10, I: 90, A: 80, S: 20, E: 70, C: 30 }, // High I-A-E
  socialBusiness: { R: 20, I: 40, A: 30, S: 90, E: 85, C: 60 }, // High S-E-C
  practicalOrg: { R: 95, I: 40, A: 10, S: 60, E: 30, C: 85 }, // High R-C-S
};

export const sampleMetiers = [
  { name: "Développeur", vector: { R: 20, I: 90, A: 60, S: 30, E: 50, C: 80 } },
  { name: "Commercial", vector: { R: 30, I: 40, A: 30, S: 70, E: 95, C: 50 } },
  { name: "Infirmier", vector: { R: 70, I: 60, A: 20, S: 95, E: 40, C: 60 } },
  { name: "Comptable", vector: { R: 10, I: 60, A: 10, S: 30, E: 70, C: 95 } },
  { name: "Maçon", vector: { R: 95, I: 40, A: 30, S: 30, E: 60, C: 50 } }
];

export function runAlgorithmTest() {
  console.group("=== TESTING MATCHING ALGORITHM ===");
  
  Object.entries(sampleProfiles).forEach(([profileName, userVec]) => {
    console.log(`\nTesting Profile: ${profileName}`);
    console.log("User Vector:", userVec);
    
    const results = sampleMetiers.map(m => {
      const { matchScore, userProfile, romeProfile } = calculateRiasecMatch(userVec, m.vector);
      return { metier: m.name, score: matchScore, userP: userProfile, romeP: romeProfile };
    }).sort((a, b) => b.score - a.score);
    
    results.forEach(res => {
      console.log(`- ${res.metier}: ${res.score}%`);
    });
  });
  
  console.groupEnd();
}