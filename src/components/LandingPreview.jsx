import HeroMapSection from '@/components/home/HeroMapSection';
import AudienceSection from '@/components/home/AudienceSection';
import ProblemSection from '@/components/home/ProblemSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import SolutionFeaturesSection from '@/components/home/SolutionFeaturesSection';
import BenefitsStatsSection from '@/components/home/BenefitsStatsSection';
import B2BSection from '@/components/home/B2BSection';
import FinalCTASection from '@/components/home/FinalCTASection';

/**
 * Temporary side-by-side preview route for the "Cartographie" landing
 * rebuild (feat/landing-cartographie branch). Not linked from nav.
 * Remove once the rebuilt HomePage replaces the current one.
 */
export default function LandingPreview({ onNavigate }) {
  return (
    <div>
      <HeroMapSection onNavigate={onNavigate} />
      <AudienceSection />
      <ProblemSection />
      <HowItWorksSection />
      <SolutionFeaturesSection onNavigate={onNavigate} />
      <BenefitsStatsSection />
      <B2BSection onNavigate={onNavigate} />
      <FinalCTASection onNavigate={onNavigate} />
    </div>
  );
}
