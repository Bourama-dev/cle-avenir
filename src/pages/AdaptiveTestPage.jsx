import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdaptiveTestInterface from '@/components/adaptive-test/AdaptiveTestInterface';

const AdaptiveTestPage = () => {
  const navigate = useNavigate();

  const handleTestComplete = (profile) => {
    // Save profile to localStorage (same format as fixed test)
    localStorage.setItem('test_riasec_profile', JSON.stringify(profile.profile));
    localStorage.setItem('test_riasec_profile_code', profile.profileCode);

    // Save adaptive metadata
    localStorage.setItem('test_riasec_questions_asked', profile.questionsAsked);
    localStorage.setItem('test_riasec_sector_coverage', JSON.stringify(profile.coverageBySector));
    localStorage.setItem('test_is_adaptive', 'true');
    localStorage.setItem('test_completed_at', new Date().toISOString());

    // Navigate to results
    navigate('/test-results');
  };

  return (
    <>
      <Helmet>
        <title>Test RIASEC Adaptatif - CléAvenir</title>
        <meta
          name="description"
          content="Découvrez votre profil professionnel avec notre test RIASEC adaptatif. Les questions s'ajustent selon vos réponses pour une meilleure précision."
        />
      </Helmet>

      <AdaptiveTestInterface onComplete={handleTestComplete} />
    </>
  );
};

export default AdaptiveTestPage;
