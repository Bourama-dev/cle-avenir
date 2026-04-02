import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileTest from '@/components/ProfileTest';

const CareerTest = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleProfileComplete = (data) => {
    // Save to local storage or context if needed
    localStorage.setItem('cleavenir_profile_test_results', JSON.stringify(data));
    navigate('/career-test-results');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="container mx-auto px-4 py-8">
        <ProfileTest onProfileComplete={handleProfileComplete} />
      </main>
    </div>
  );
};

export default CareerTest;