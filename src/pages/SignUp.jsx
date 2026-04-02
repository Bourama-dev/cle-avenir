import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SignupPage from '@/pages/SignupPage'; // Reusing existing signup page logic

const SignUp = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNavigate={handleNavigate} />
      <main>
        <SignupPage />
      </main>
    </div>
  );
};

export default SignUp;