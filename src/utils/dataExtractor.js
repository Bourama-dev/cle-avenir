/**
 * Analyze extracted PDF text to identify structured data
 * This is a basic regex/heuristic based parser.
 */
export const extractCVData = (rawText) => {
  const data = {
    experiences: [],
    formations: [],
    skills: []
  };

  if (!rawText) return data;

  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // Very basic heuristic sections splitting
  const expMatch = normalizedText.match(/(?:exp[ée]riences?(?: professionnelles?)?|parcours)([\s\S]*?)(?:formations?|[ée]tudes|comp[ée]tences|skills|langues|int[ée]r[êe]ts|$)/i);
  const eduMatch = normalizedText.match(/(?:formations?|[ée]tudes|dipl[ôo]mes?)([\s\S]*?)(?:exp[ée]riences?|comp[ée]tences|skills|langues|int[ée]r[êe]ts|$)/i);
  const skillsMatch = normalizedText.match(/(?:comp[ée]tences|skills|expertises?)([\s\S]*?)(?:exp[ée]riences?|formations?|[ée]tudes|langues|int[ée]r[êe]ts|$)/i);

  if (expMatch && expMatch[1]) {
    const expLines = expMatch[1].split('\n').filter(l => l.trim().length > 5);
    // Group roughly by 2 lines to create mock entries
    for (let i = 0; i < expLines.length; i += 2) {
      if (expLines[i]) {
        data.experiences.push({
          role: expLines[i].substring(0, 50).trim(),
          company: expLines[i+1] ? expLines[i+1].substring(0, 50).trim() : 'Entreprise à préciser',
          duration: 'À définir',
          description: expLines.slice(i+2, i+4).join(' ').substring(0, 200)
        });
      }
    }
  }

  if (eduMatch && eduMatch[1]) {
    const eduLines = eduMatch[1].split('\n').filter(l => l.trim().length > 5);
    for (let i = 0; i < eduLines.length; i += 2) {
      if (eduLines[i]) {
        data.formations.push({
          degree: eduLines[i].substring(0, 50).trim(),
          school: eduLines[i+1] ? eduLines[i+1].substring(0, 50).trim() : 'École à préciser',
          year: 'À définir',
          description: ''
        });
      }
    }
  }

  if (skillsMatch && skillsMatch[1]) {
    const rawSkills = skillsMatch[1]
      .replace(/[-•*]/g, ',')
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 30);
    
    // Deduplicate
    data.skills = [...new Set(rawSkills)].slice(0, 15);
  }

  // Fallback if regex failed to find structured sections
  if (data.experiences.length === 0 && data.formations.length === 0 && data.skills.length === 0) {
    // Generate dummy extracted words as skills
    const words = normalizedText.split(/\s+/).filter(w => w.length > 6);
    data.skills = [...new Set(words)].slice(0, 10);
  }

  return data;
};