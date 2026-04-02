import React, { useEffect, Suspense, lazy } from 'react';
import SEOHead from '@/components/SEOHead';
import LoadingFallback from '@/components/LoadingFallback';
import HeroSection from '@/components/howitworks/HeroSection';
import WhyChooseSection from '@/components/howitworks/WhyChooseSection';
import FiveSteps from '@/components/howitworks/FiveSteps';
import CTASection from '@/components/howitworks/CTASection';

// Lazy load heavy or below-fold components
const ComparisonSection = lazy(() => import('@/components/howitworks/ComparisonSection'));
const ResultsSection = lazy(() => import('@/components/howitworks/ResultsSection'));
const FAQ = lazy(() => import('@/components/howitworks/FAQ'));

const HowItWorksPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      <SEOHead 
        title="Comment ça marche ? - CléAvenir" 
        description="Découvrez notre méthode unique d'orientation en 5 étapes. Test adaptatif, IA et données marché pour trouver votre voie." 
      />

      <main className="overflow-x-hidden">
        {/* 1. Hero (Critical Render) */}
        <HeroSection />

        {/* 2. Why CléAvenir (High Priority) */}
        <WhyChooseSection />

        <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><LoadingFallback /></div>}>
          {/* 3. Comparison (Pain vs Gain) */}
          <ComparisonSection />

          {/* 4. The 5 Steps Timeline */}
          <FiveSteps />

          {/* 5. Stats & Social Proof */}
          <ResultsSection />

          {/* 6. FAQ */}
          <FAQ />
        </Suspense>

        {/* 7. Final Call to Action */}
        <CTASection />
      </main>
    </div>
  );
};

export default HowItWorksPage;