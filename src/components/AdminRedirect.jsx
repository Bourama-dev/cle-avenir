import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, isUserAdmin } from '@/services/userProfile';

/**
 * Composant qui redirige automatiquement vers admin si l'utilisateur est admin
 */
export default function AdminRedirect({ children }) {
  const navigate = useNavigate();
  const userProfile = getUserProfile();

  useEffect(() => {
    if (userProfile && isUserAdmin(userProfile)) {
      // Rediriger vers le dashboard admin
      navigate('/admin/dashboard', { replace: true });
    }
  }, [userProfile, navigate]);

  // Si admin, ne pas afficher le contenu (redirection en cours)
  if (userProfile && isUserAdmin(userProfile)) {
    return null;
  }

  // Sinon, afficher le contenu normal
  return children;
}