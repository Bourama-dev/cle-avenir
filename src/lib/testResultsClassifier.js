import { buildUserVector } from '@/services/buildUserVector';
import { scoreROME } from '@/services/scoreROME';
import { getDomainById } from '@/utils/domainMappings';

export const generateDetailedResults = async (answers) => {
  // Build standard RIASEC user vector
  const userProfile = buildUserVector(answers);
  
  // Score against ROME DB (Includes domain logic)
  const scoringData = await scoreROME(userProfile);
  
  // Generate domain-specific insights (Task 9)
  const domainInsights = (userProfile.userDomains || []).map(id => {
    const domainDef = getDomainById(id);
    return domainDef ? {
      id: domainDef.id,
      label: domainDef.label,
      icon: domainDef.icon,
      color: domainDef.color,
      bg: domainDef.bg,
      message: `Votre profil montre une forte affinité pour le secteur ${domainDef.label}. Les métiers de ce domaine sont mis en avant dans vos résultats.`
    } : null;
  }).filter(Boolean);

  return {
    userProfile,
    topCareers: scoringData.results || [],
    domainInsights,
    metadata: scoringData.metadata || {}
  };
};