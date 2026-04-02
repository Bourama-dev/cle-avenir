// 20 Questions with 8 answers each, mapped to RIASEC
const generateAnswers = (baseId) => [
  { id: `${baseId}_1`, text: "Construire, réparer, utiliser des outils", riasecWeights: { R: 3, I: 0, A: 0, S: 0, E: 0, C: 0 } },
  { id: `${baseId}_2`, text: "Analyser des données, résoudre des énigmes", riasecWeights: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 0 } },
  { id: `${baseId}_3`, text: "Créer des œuvres d'art, écrire, designer", riasecWeights: { R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 } },
  { id: `${baseId}_4`, text: "Enseigner, soigner, conseiller les autres", riasecWeights: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 0 } },
  { id: `${baseId}_5`, text: "Diriger une équipe, vendre, convaincre", riasecWeights: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 0 } },
  { id: `${baseId}_6`, text: "Organiser, classer, gérer des budgets", riasecWeights: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 3 } },
  { id: `${baseId}_7`, text: "Combiner technique et réflexion (Ingénierie)", riasecWeights: { R: 2, I: 2, A: 0, S: 0, E: 0, C: 0 } },
  { id: `${baseId}_8`, text: "Gérer des projets humains (Management social)", riasecWeights: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 } },
];

export const expandedQuestions = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  let category = "Général";
  if (qNum <= 3) category = "Bloc 1: Intérêts spontanés";
  else if (qNum <= 8) category = "Bloc 2: Compétences perçues";
  else if (qNum <= 14) category = "Bloc 3: Valeurs et environnement";
  else category = "Bloc 4: Projection professionnelle";

  return {
    id: `q${qNum}`,
    text: `Question ${qNum}: Quelle activité vous correspond le mieux dans le contexte de : ${category} ?`,
    category,
    answers: generateAnswers(`q${qNum}`)
  };
});