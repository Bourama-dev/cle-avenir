export const extractStructuredCVData = (rawText) => {
  const data = {
    personal_info: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    experiences: [],
    education: [],
    skills: [],
    confidence_score: 0
  };

  if (!rawText) return data;

  let confidence = 100;
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // Extract Email
  const emailMatch = normalizedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) data.personal_info.email = emailMatch[0];
  else confidence -= 10;

  // Extract Phone (French format roughly)
  const phoneMatch = normalizedText.match(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);
  if (phoneMatch) data.personal_info.phone = phoneMatch[0];
  else confidence -= 10;

  // Extremely basic section extraction based on keywords
  const expMatch = normalizedText.match(/(?:exp[ée]riences?(?: professionnelles?)?|parcours)([\s\S]*?)(?:formations?|[ée]tudes|comp[ée]tences|skills|langues|int[ée]r[êe]ts|$)/i);
  const eduMatch = normalizedText.match(/(?:formations?|[ée]tudes|dipl[ôo]mes?|education)([\s\S]*?)(?:exp[ée]riences?|comp[ée]tences|skills|langues|int[ée]r[êe]ts|$)/i);
  const skillsMatch = normalizedText.match(/(?:comp[ée]tences|skills|expertises?)([\s\S]*?)(?:exp[ée]riences?|formations?|[ée]tudes|langues|int[ée]r[êe]ts|$)/i);

  if (expMatch && expMatch[1]) {
    const lines = expMatch[1].split('\n').map(l => l.trim()).filter(l => l.length > 5);
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i]) {
        data.experiences.push({
          position: lines[i].substring(0, 50).trim(),
          company: lines[i+1] ? lines[i+1].substring(0, 50).trim() : 'À préciser',
          start_date: '',
          end_date: '',
          description: lines.slice(i+2, i+4).join(' ').substring(0, 200),
          duration: ''
        });
      }
    }
  } else {
    confidence -= 20;
  }

  if (eduMatch && eduMatch[1]) {
    const lines = eduMatch[1].split('\n').map(l => l.trim()).filter(l => l.length > 5);
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i]) {
        data.education.push({
          diploma: lines[i].substring(0, 50).trim(),
          school: lines[i+1] ? lines[i+1].substring(0, 50).trim() : 'À préciser',
          year: '',
          field: '',
          description: ''
        });
      }
    }
  } else {
    confidence -= 20;
  }

  if (skillsMatch && skillsMatch[1]) {
    const rawSkills = skillsMatch[1]
      .replace(/[-•*]/g, ',')
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 30);
    
    data.skills = [...new Set(rawSkills)].slice(0, 15).map(skill => ({ skill, level: 'Intermédiaire' }));
  } else {
    confidence -= 10;
  }

  data.confidence_score = Math.max(0, confidence);
  return data;
};