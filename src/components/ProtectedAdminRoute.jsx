import React from 'react';
import ProtectedRoute from '@/lib/ProtectedRoute';

/**
 * Wrapper for admin-only routes
 * Uses requireAdmin flag for strict admin checking
 */
const ProtectedAdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedAdminRoute;