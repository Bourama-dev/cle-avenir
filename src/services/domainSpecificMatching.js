import { DOMAIN_MAPPINGS } from '@/utils/domainMappings';

export const extractUserDomains = (answers, questions) => {
  const userDomains = new Set();
  
  answers.forEach(ans => {
    const qId = ans.questionId || ans.id;
    const q = questions.find(q => String(q.id) === String(qId));
    if (!q) return;

    const ansIds = Array.isArray(ans.answerId) ? ans.answerId : [ans.answerId];
    
    ansIds.forEach(aId => {
      const a = q.answers.find(a => String(a.id) === String(aId));
      if (a && a.domainId) {
        userDomains.add(a.domainId);
      }
    });
  });

  return Array.from(userDomains);
};

export const calculateDomainBonus = (metierCode, userDomains) => {
  let bonus = 0;
  
  userDomains.forEach(domainId => {
    const domainDef = DOMAIN_MAPPINGS[domainId];
    if (domainDef && domainDef.codes.includes(metierCode)) {
      // Significant bonus for matching explicitly selected domains
      bonus += 0.15; 
    }
  });

  // Cap the domain bonus
  return Math.min(bonus, 0.30); 
};