import { RIASEC_DESCRIPTIONS } from '@/data/riasecDescriptions';
import { getTopDimensions } from '@/utils/riasecMatchingAlgorithm';

export function generateMatchReason(userProfile, romeProfile, matchScore) {
  const userTop = getTopDimensions(userProfile, 2);
  const romeTop = getTopDimensions(romeProfile, 2);

  if (!userTop.length || !romeTop.length) return "Ce métier correspond globalement à vos intérêts.";

  const dominantUser = RIASEC_DESCRIPTIONS[userTop[0]]?.name || "inconnu";
  const secUser = userTop[1] ? `-${RIASEC_DESCRIPTIONS[userTop[1]]?.name}` : "";
  const profileName = `${dominantUser}${secUser}`;

  if (matchScore >= 90) {
    if (userTop[0] === romeTop[0]) {
      return `Excellente compatibilité ! Votre profil ${profileName} s'aligne parfaitement avec les exigences principales de ce métier.`;
    }
    return `Correspondance remarquable ! Votre dynamisme ${dominantUser} sera un atout majeur dans ce secteur.`;
  }

  if (matchScore >= 75) {
    const shared = userTop.filter(x => romeTop.includes(x));
    if (shared.length > 0) {
      const sharedTrait = RIASEC_DESCRIPTIONS[shared[0]]?.name;
      return `Très bon match. Votre côté ${sharedTrait} correspond bien aux activités quotidiennes de cette profession.`;
    }
    return `Votre profil ${profileName} offre des compétences transversales très appréciées dans ce métier.`;
  }

  if (matchScore >= 60) {
    return `Match intéressant. Ce métier sollicitera certaines de vos qualités, notamment votre profil ${dominantUser}.`;
  }

  return "Ce métier présente une correspondance partielle avec vos intérêts dominants.";
}