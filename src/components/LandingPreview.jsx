import HeroMapSection from '@/components/home/HeroMapSection';

/**
 * Temporary side-by-side preview route for the "Cartographie" landing
 * rebuild (feat/landing-cartographie branch). Not linked from nav.
 * Remove once the rebuilt HomePage replaces the current one.
 */
export default function LandingPreview() {
  return (
    <div>
      <HeroMapSection />
    </div>
  );
}
