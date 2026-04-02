import React from 'react';
import AdminEstablishments from './sections/AdminEstablishments';

/**
 * Wrapper component to ensure backward compatibility if AdminDashboard imports this file.
 * This ensures the new AdminEstablishments UI is rendered instead of a placeholder.
 */
const EtablissementsTab = () => {
  return <AdminEstablishments />;
};

export default EtablissementsTab;