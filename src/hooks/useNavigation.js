import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for handling navigation with history awareness
 * Provides goBack and goHome functionality
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback(() => {
    // Check if there is history to go back to, otherwise default to dashboard or home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Intelligent fallback: if on a detail page, go to parent, otherwise dashboard
      const path = location.pathname;
      if (path.includes('/metier/') || path.includes('/formation/') || path.includes('/job/')) {
        navigate(-1); // Try standard back first
      } else if (path === '/dashboard') {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate, location]);

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    goBack,
    goHome,
    currentPath: location.pathname
  };
};

export default useNavigation;